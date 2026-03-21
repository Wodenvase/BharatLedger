import os
import json
from typing import Dict, Any

import polars as pl
import psycopg2
import lightgbm as lgb

MODEL_PATH = os.path.join(os.getcwd(), "ml", "model.lgb")

# helper functions copied/compatible with get_score

def safe_div(a, b):
    try:
        if b == 0 or b is None:
            return 0.0
        return float(a) / float(b)
    except Exception:
        return 0.0

FOOD_KEYS = ["zomato", "swiggy", "dominos", "restaurant", "cafe", "mcdonald", "food"]
LOAN_KEYS = ["emi", "loan", "equated", "instalment", "installment"]


def compute_features_from_df(df: pl.DataFrame) -> Dict[str, Any]:
    if df.height == 0:
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

    if "amount" in df.columns:
        df = df.with_column(pl.col("amount").cast(pl.Float64).alias("amount"))
    else:
        df = df.with_column(pl.lit(0.0).alias("amount"))

    if "type" not in df.columns:
        df = df.with_column(pl.when(pl.col("amount") >= 0).then("Credit").otherwise("Debit").alias("type"))

    if "date" in df.columns:
        df = df.with_column(pl.col("date").dt.strftime("%Y-%m").alias("month"))
    else:
        df = df.with_column(pl.lit("unknown").alias("month"))

    monthly = df.groupby(["month", "type"]).agg(pl.col("amount").sum().alias("sum_amount"))

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

    desc_col = df.get_column("description") if "description" in df.columns else pl.Series([""] * df.height)
    desc_lower = desc_col.str.to_lowercase()
    num_loan_payments = sum(any(k in (d or "") for k in LOAN_KEYS) for d in desc_lower.to_list())

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
            return {"statusCode": 400, "body": json.dumps({"error": "Missing body"})}
        payload = json.loads(body)
        user_email = payload.get("userEmail")
        user_id = payload.get("userId")
        sim = payload.get("simulation") or {}

        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            return {"statusCode": 500, "body": json.dumps({"error": "DATABASE_URL not set"})}

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        if user_id is None:
            if not user_email:
                return {"statusCode": 400, "body": json.dumps({"error": "userId or userEmail required"})}
            cur.execute('SELECT id FROM "User" WHERE email = %s LIMIT 1', (user_email,))
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "body": json.dumps({"error": "User not found"})}
            user_id = row[0]

        cur.execute('SELECT date, description, amount, type FROM "Transaction" WHERE "userId" = %s ORDER BY date ASC', (user_id,))
        rows = cur.fetchall()
        conn.close()

        if not rows:
            df = pl.DataFrame([])
        else:
            df = pl.DataFrame(rows, schema=["date", "description", "amount", "type"])

        features = compute_features_from_df(df)

        # Apply simulation adjustments
        # Example simulation keys: missed_payments, income_change, spending_increase (percent)
        missed = int(sim.get("missed_payments") or sim.get("missedPayments") or 0)
        income_change = float(sim.get("income_change") or sim.get("incomeChange") or 0)
        spending_increase = float(sim.get("spending_increase") or sim.get("spendingIncrease") or 0)

        # Adjust features accordingly
        # Increase avg monthly income
        features["avg_monthly_income"] = max(0.0, features.get("avg_monthly_income", 0.0) + income_change)
        # Missed payments increases num_loan_payments or penalizes score; increment loan payments
        features["num_loan_payments"] = int(features.get("num_loan_payments", 0) + missed)
        # Spending increase: increase avg_monthly_expense by percent
        features["avg_monthly_expense"] = features.get("avg_monthly_expense", 0.0) * (1.0 + spending_increase / 100.0)

        # Recompute derived features
        avg_inc = features["avg_monthly_income"]
        avg_exp = features["avg_monthly_expense"]
        features["savings_rate"] = safe_div((avg_inc - avg_exp), avg_inc) * 100.0 if avg_inc else 0.0
        features["expense_to_income_ratio"] = safe_div(avg_exp, avg_inc) if avg_inc else 0.0

        model = load_model()
        score = None
        if model is not None:
            feat_names = ["avg_monthly_income", "avg_monthly_expense", "savings_rate", "expense_to_income_ratio", "num_loan_payments", "pct_spend_on_food", "total_transactions"]
            X = [[features.get(n, 0.0) for n in feat_names]]
            pred = model.predict(X)
            try:
                score = float(pred[0])
            except Exception:
                score = float(pred)
        else:
            # heuristic fallback
            base = 600
            base += min(200, int(features["savings_rate"] * 2))
            base += max(-100, int((1 - features["expense_to_income_ratio"]) * 50))
            base += max(-50, 50 - features["num_loan_payments"] * 10)
            score = max(300, min(850, base))

        return {"statusCode": 200, "body": json.dumps({"simulatedScore": int(round(score)), "features": features})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        ev = {"body": json.dumps({"userId": sys.argv[1], "simulation": {"missed_payments": 1}})}
        print(handler(ev))
    else:
        print("Usage: simulate.py <userId>")
