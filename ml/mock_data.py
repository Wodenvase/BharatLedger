"""Generate synthetic monthly customer account data for feature engineering demos."""
import argparse
import numpy as np
import pandas as pd
from datetime import datetime


def generate(n_customers=1000, months=24, seed=42):
    rng = np.random.default_rng(seed)
    rows = []
    for cid in range(1, n_customers + 1):
        income = max(1000, int(rng.normal(5000, 1500)))
        credit_limit = max(500, int(rng.normal(10000, 3000)))
        last_balance = rng.integers(0, credit_limit)
        for m in range(months):
            month = pd.Timestamp('2020-01-01') + pd.DateOffset(months=m)
            # simulate balance and payments
            utilization_noise = rng.normal(0, 0.05)
            balance = int(np.clip(last_balance * (1 + rng.normal(0.0, 0.15)) + rng.integers(-500, 500), 0, credit_limit))
            payment = int(max(0, balance - rng.integers(0, int(balance * 0.5) + 1)))
            days_past_due = int(abs(rng.normal(0, 5))) if rng.random() < 0.05 else 0
            inquiries = int(rng.poisson(0.05))
            open_accounts = int(1 + rng.poisson(1.0))
            rows.append({
                'cust_id': cid,
                'month': month.to_period('M').to_timestamp(),
                'balance': balance,
                'credit_limit': credit_limit,
                'payment': payment,
                'days_past_due': days_past_due,
                'inquiries': inquiries,
                'open_accounts': open_accounts,
                'income': income,
            })
            last_balance = balance
    df = pd.DataFrame(rows)
    # create a target: default in next 3 months if days_past_due large or sudden rise
    df = df.sort_values(['cust_id', 'month'])
    df['balance_prev'] = df.groupby('cust_id')['balance'].shift(1).fillna(0)
    df['pct_change'] = (df['balance'] - df['balance_prev']) / (df['balance_prev'].replace(0, 1))
    # label at row-level: default next 3 months
    df['default_next_3m'] = 0
    for cid, g in df.groupby('cust_id'):
        idx = g.index
        for i in range(len(g)):
            window = g.iloc[i+1:i+4]
            if window.empty:
                continue
            if (window['days_past_due'] > 30).any() or (window['pct_change'] > 0.5).any():
                df.at[idx[i], 'default_next_3m'] = 1
    return df


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--out', default='ml/data.csv')
    p.add_argument('--n_customers', type=int, default=1000)
    p.add_argument('--months', type=int, default=24)
    args = p.parse_args()
    df = generate(n_customers=args.n_customers, months=args.months)
    df.to_csv(args.out, index=False)
    print('Wrote', args.out)


if __name__ == '__main__':
    main()
