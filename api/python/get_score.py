import os
import json
import math
from typing import Dict, Any

import polars as pl
import psycopg2
import lightgbm as lgb

# Feature engineering mirrors notebook/processor logic
FOOD_KEYS = ["zomato", "swiggy", "dominos", "restaurant", "cafe", "mcdonald", "food"]
LOAN_KEYS = ["emi", "loan", "equated", "instalment", "installment"]

MODEL_PATH = os.path.join(os.getcwd(), "ml", "model.lgb")


def safe_div(a, b):
    try:
        if b == 0 or b is None:
            return 0.0
        return float(a) / float(b)
    except Exception:
        return 0.0


def compute_features_from_df(df: pl.DataFrame) -> Dict[str, Any]:
    # Expect columns: date (string/datetime), description, amount (float), type (Credit/Debit)
    if df.height == 0:
        # empty user: return zeros
        return {
            "avg_monthly_income": 0.0,
            "avg_monthly_expense": 0.0,
            "savings_rate": 0.0,
            "expense_to_income_ratio": 0.0,
            "num_loan_payments": 0,
            "pct_spend_on_food": 0.0,
            "total_transactions": 0,
        }

    # parse date
    if "date" in df.columns:
        try:
            df = df.with_column(pl.col("date").str.strptime(pl.Date, fmt=None).alias("date_parsed"))
            df = df.with_column(pl.col("date_parsed").cast(pl.Datetime).alias("date"))
        except Exception:
            pass

    # normalize amount and type
    if "amount" in df.columns:
        df = df.with_column(pl.col("amount").cast(pl.Float64).alias("amount"))
    else:
        df = df.with_column(pl.lit(0.0).alias("amount"))

    if "type" not in df.columns:
        # infer type by sign
        df = df.with_column(pl.when(pl.col("amount") >= 0).then("Credit").otherwise("Debit").alias("type"))

    # month key
    if "date" in df.columns:
        df = df.with_column(pl.col("date").dt.strftime("%Y-%m").alias("month"))
    else:
        df = df.with_column(pl.lit("unknown").alias("month"))

    # monthly aggregates
    monthly = df.groupby(["month", "type"]).agg(pl.col("amount").sum().alias("sum_amount"))

    # pivot to get income/expense per month
    # fallback compute manual
    income_monthly_sums = []
    expense_monthly_sums = []
    try:
        income = monthly.filter(pl.col("type") == "Credit")
        expense = monthly.filter(pl.col("type") == "Debit")
        income_monthly_sums = income.select("sum_amount").to_series().to_list()
        expense_monthly_sums = expense.select("sum_amount").to_series().to_list()
    except Exception:
        pass

    avg_monthly_income = float(sum(income_monthly_sums) / len(income_monthly_sums)) if income_monthly_sums else 0.0
    avg_monthly_expense = float(sum(expense_monthly_sums) / len(expense_monthly_sums)) if expense_monthly_sums else 0.0

    savings_rate = safe_div((avg_monthly_income - avg_monthly_expense), avg_monthly_income) * 100.0 if avg_monthly_income else 0.0
    expense_to_income_ratio = safe_div(avg_monthly_expense, avg_monthly_income) if avg_monthly_income else 0.0

    # num loan payments
    desc_col = df.get_column("description") if "description" in df.columns else pl.Series([""] * df.height)
    desc_lower = desc_col.str.to_lowercase()
    num_loan_payments = sum(any(k in (d or "") for k in LOAN_KEYS) for d in desc_lower.to_list())

    # pct spend on food (of total debit spend)
    debit_df = df.filter(pl.col("type") == "Debit")
    total_debit = float(debit_df.select(pl.col("amount").abs().sum()).to_series()[0]) if debit_df.height > 0 else 0.0
    food_mask = debit_df.filter(pl.col("description").str.to_lowercase().map(lambda s: any(k in (s or "") for k in FOOD_KEYS))) if debit_df.height > 0 else pl.DataFrame([])
    food_spend = float(food_mask.select(pl.col("amount").abs().sum()).to_series()[0]) if (debit_df.height > 0 and food_mask.height > 0) else 0.0
    pct_spend_on_food = safe_div(food_spend, total_debit) * 100.0 if total_debit else 0.0

    return {
        "avg_monthly_income": avg_monthly_income,
        "avg_monthly_expense": avg_monthly_expense,
        "savings_rate": savings_rate,
        "expense_to_income_ratio": expense_to_income_ratio,
        "num_loan_payments": int(num_loan_payments),
        "pct_spend_on_food": pct_spend_on_food,
        "total_transactions": int(df.height),
    }


def load_model():
    if os.path.exists(MODEL_PATH):
        try:
            bst = lgb.Booster(model_file=MODEL_PATH)
            return bst
        except Exception as e:
            print("Failed to load model:", e)
            return None
    return None


def handler(event, context=None):
    try:
        body = None
        if isinstance(event, dict):
            body = event.get("body")
        if not body:
            return {"statusCode": 400, "body": json.dumps({"error": "Missing request body. Provide JSON { userEmail: ... }"})}
        payload = json.loads(body)
        user_email = payload.get("userEmail")
        user_id = payload.get("userId")

        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            return {"statusCode": 500, "body": json.dumps({"error": "DATABASE_URL not set"})}

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        if user_id is None:
            if not user_email:
                return {"statusCode": 400, "body": json.dumps({"error": "userId or userEmail required"})}
            # resolve user id by email
            cur.execute('SELECT id FROM "User" WHERE email = %s LIMIT 1', (user_email,))
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "body": json.dumps({"error": "User not found"})}
            user_id = row[0]

        # fetch transactions
        cur.execute('SELECT date, description, amount, type FROM "Transaction" WHERE "userId" = %s ORDER BY date ASC', (user_id,))
        rows = cur.fetchall()
        conn.close()

        # build DataFrame
        if not rows:
            df = pl.DataFrame([])
        else:
            df = pl.DataFrame(rows, schema=["date", "description", "amount", "type"])

        features = compute_features_from_df(df)

        model = load_model()
        score = None
        if model is not None:
            # model expects 2D array
            feat_names = ["avg_monthly_income", "avg_monthly_expense", "savings_rate", "expense_to_income_ratio", "num_loan_payments", "pct_spend_on_food", "total_transactions"]
            X = [[features.get(n, 0.0) for n in feat_names]]
            pred = model.predict(X)
            try:
                score = float(pred[0])
            except Exception:
                score = float(pred)
        else:
            # Fallback heuristic scoring
            base = 600
            base += min(200, int(features["savings_rate"] * 2))
            base += max(-100, int((1 - features["expense_to_income_ratio"]) * 50))
            base += max(-50, 50 - features["num_loan_payments"] * 10)
            score = max(300, min(850, base))

        return {"statusCode": 200, "body": json.dumps({"score": int(round(score)), "features": features})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


if __name__ == "__main__":
    # quick CLI for testing
    import sys
    if len(sys.argv) > 1:
        # allow passing userId
        ev = {"body": json.dumps({"userId": sys.argv[1]})}
        print(handler(ev))
    else:
        print("Usage: get_score.py <userId>")
