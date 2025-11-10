import os
import json
import io
from typing import List, Dict, Any

# External libs: polars, psycopg2
import polars as pl
import psycopg2
from psycopg2.extras import execute_values

# Minimal rule-based categorizer
CATEGORY_RULES = [
    ("Food & Dining", ["zomato", "swiggy", "dominos", "restaurant", "cafe", "mcdonald"]),
    ("Groceries", ["bigbasket", "grocery", "dmart", "groceries", "supermarket"]),
    ("Travel", ["uber", "ola", "flight", "indigo", "airasia", "train"]),
    ("Utilities", ["electricity", "water", "gas", "internet", "mobile"]),
    ("Salary", ["salary", "payroll", "salarycredit"]),
]

# Column mapping and cleaning helper

def standardize_type(val: str) -> str:
    if not val:
        return "Debit"
    v = val.strip().lower()
    if v in ("credit", "cr", "deposit", "in"): return "Credit"
    if v in ("debit", "dr", "withdrawal", "out"): return "Debit"
    # fallback heuristics
    if v.isdigit():
        return "Debit"
    return val.title()


def categorize(description: str) -> str:
    if not description:
        return "Uncategorized"
    d = description.lower()
    for cat, keys in CATEGORY_RULES:
        for k in keys:
            if k in d:
                return cat
    return "Other"


def clean_dataframe(df: pl.DataFrame) -> pl.DataFrame:
    # Normalize common column names
    cols = [c.lower() for c in df.columns]
    mapping = {}
    # heuristics to find columns
    for c in df.columns:
        lc = c.lower()
        if "date" in lc:
            mapping[c] = "date"
        elif "desc" in lc or "narration" in lc or "particulars" in lc or "description" in lc:
            mapping[c] = "description"
        elif "amount" in lc and "bal" not in lc:
            mapping[c] = "amount"
        elif lc in ("type", "tran_type", "transactiontype"):
            mapping[c] = "type"
        elif "balance" in lc or "bal" == lc:
            mapping[c] = "balance"
        elif "reference" in lc or "ref" in lc:
            mapping[c] = "reference"
    # rename
    if mapping:
        df = df.rename(mapping)

    # Parse dates: try multiple formats
    if "date" in df.columns:
        try:
            df = df.with_columns(pl.col("date").str.strptime(pl.Date, fmt="%d-%m-%Y").alias("date_parsed"))
            df = df.with_column(pl.col("date_parsed").cast(pl.Datetime).alias("date"))
        except Exception:
            try:
                df = df.with_columns(pl.col("date").str.strptime(pl.Datetime, fmt="%Y-%m-%d").alias("date"))
            except Exception:
                # last resort: let polars infer
                df = df.with_columns(pl.col("date").str.strptime(pl.Date, fmt=None).alias("date"))

    # Handle nulls
    if "description" in df.columns:
        df = df.with_column(pl.col("description").fill_null(""))
    if "amount" in df.columns:
        df = df.with_column(pl.col("amount").cast(pl.Float64).fill_null(0.0))

    # Standardize type
    if "type" in df.columns:
        df = df.with_column(pl.col("type").apply(standardize_type).alias("type"))
    else:
        df = df.with_column(pl.lit("Debit").alias("type"))

    # Category
    if "description" in df.columns:
        df = df.with_column(pl.col("description").apply(categorize).alias("category"))
    else:
        df = df.with_column(pl.lit("Uncategorized").alias("category"))

    # Ensure consistent columns for DB
    # desired: user_id, account_id, date, description, amount, type, category, reference
    return df


def bulk_insert_transactions(conn, rows: List[Dict[str, Any]]):
    if not rows:
        return
    # Map rows to tuple order
    columns = ["user_id", "account_id", "date", "description", "amount", "type", "category", "reference"]
    values = [tuple(row.get(col) for col in columns) for row in rows]

    insert_sql = f"""
    INSERT INTO "Transaction" (userId, accountId, date, description, amount, type, category, reference)
    VALUES %s
    RETURNING id;
    """
    with conn.cursor() as cur:
        execute_values(cur, insert_sql, values)
    conn.commit()


# Simple WSGI-like handler for Vercel serverless function
from http.server import BaseHTTPRequestHandler

# Vercel directly runs Python files as handlers when placed under /api; implement a small handler using environment provided input.
# But for compatibility, implement a simple Flask-like minimal handling by reading stdin/body when executed as a function.


def handler(event, context=None):
    # event: dict with keys method and body (string) - Vercel may call with different signature; keep defensive
    try:
        body = event.get("body") if isinstance(event, dict) else None
        if not body:
            return {"statusCode": 400, "body": json.dumps({"error": "Missing body"})}
        payload = json.loads(body)
        path = payload.get("path")
        user_id = payload.get("userId")
        account_id = payload.get("accountId")
        if not path or not user_id:
            return {"statusCode": 400, "body": json.dumps({"error": "path and userId required"})}

        # Read CSV using Polars
        if not os.path.exists(path):
            return {"statusCode": 400, "body": json.dumps({"error": f"file not found: {path}"})}

        # Polars can read from path
        df = pl.read_csv(path)
        df = clean_dataframe(df)

        # Build rows
        rows = []
        for rec in df.iter_rows(named=True):
            # rec is dict-like
            date_val = rec.get("date")
            # Coerce date to ISO string
            if isinstance(date_val, (pl.Date, pl.Datetime)):
                date_iso = str(date_val)
            else:
                date_iso = str(rec.get("date")) if rec.get("date") is not None else None

            rows.append({
                "user_id": user_id,
                "account_id": account_id,
                "date": date_iso,
                "description": rec.get("description") or "",
                "amount": rec.get("amount") or 0.0,
                "type": rec.get("type") or "Debit",
                "category": rec.get("category") or "Uncategorized",
                "reference": rec.get("reference") or None,
            })

        # Connect to DB
        db_url = os.environ.get("DATABASE_URL") or os.environ.get("DATABASE_URL_DATABASE") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"statusCode": 500, "body": json.dumps({"error": "DATABASE_URL not set in environment"})}

        conn = psycopg2.connect(db_url)
        bulk_insert_transactions(conn, rows)
        conn.close()

        return {"statusCode": 200, "body": json.dumps({"inserted": len(rows)})}
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


# If run directly (for local testing)
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        # Accept a path arg
        p = sys.argv[1]
        ev = {"body": json.dumps({"path": p, "userId": os.environ.get("TEST_USER_ID", "local-user"), "accountId": os.environ.get("TEST_ACCOUNT_ID", None)})}
        r = handler(ev)
        print(r)
    else:
        print("Usage: process_csv.py <path-to-csv>")
