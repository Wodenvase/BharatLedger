"""Feature engineering utilities for credit rating using pandas."""
import argparse
import numpy as np
import pandas as pd


def compute_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df['month'] = pd.to_datetime(df['month'])
    df = df.sort_values(['cust_id', 'month'])
    # basic ratios
    df['utilization'] = df['balance'] / df['credit_limit'].replace(0, np.nan)
    df['dti'] = df['balance'] / df['income'].replace(0, np.nan)

    # rolling aggregates per customer
    gb = df.groupby('cust_id')
    df['util_3m_mean'] = gb['utilization'].rolling(3, min_periods=1).mean().reset_index(0, drop=True)
    df['util_6m_std'] = gb['utilization'].rolling(6, min_periods=1).std().reset_index(0, drop=True).fillna(0)
    df['balance_3m_slope'] = gb['balance'].apply(lambda s: s.rolling(6, min_periods=2).apply(lambda y: np.polyfit(np.arange(len(y)), y, 1)[0] if len(y) >= 2 else 0)).reset_index(0, drop=True)

    # payment behavior
    df['payment_to_balance'] = df['payment'] / df['balance'].replace(0, np.nan)
    df['pay_on_time'] = (df['days_past_due'] == 0).astype(int)
    df['on_time_ratio_6m'] = gb['pay_on_time'].rolling(6, min_periods=1).mean().reset_index(0, drop=True)
    df['max_days_past_due_12m'] = gb['days_past_due'].rolling(12, min_periods=1).max().reset_index(0, drop=True).fillna(0)

    # inquiries and new accounts
    df['inquiries_3m'] = gb['inquiries'].rolling(3, min_periods=1).sum().reset_index(0, drop=True)
    df['new_accounts_6m'] = gb['open_accounts'].rolling(6, min_periods=1).apply(lambda x: max(0, x.iloc[-1] - x.iloc[0]) if len(x) > 1 else 0).reset_index(0, drop=True)

    # recency features
    # months since first activity (approximate months by dividing days)
    df['months_since_first'] = (df['month'] - gb['month'].transform('first')).dt.days / 30.44

    # months since last payment: compute per-group and fill missing with large value
    def months_since_last(g):
        last_pay = g['month'].where(g['payment'] > 0).ffill()
        res = (g['month'] - last_pay).dt.days / 30.44
        return res

    df['months_since_last_payment'] = gb.apply(months_since_last).reset_index(0, drop=True).fillna(999)

    # derived interactions
    df['util_x_delinq'] = df['utilization'] * (df['max_days_past_due_12m'] > 0).astype(int)
    df['dti_x_inquiries'] = df['dti'] * (1 + df['inquiries_3m'])

    # select a small stable feature set
    features = [
        'cust_id', 'month', 'balance', 'credit_limit', 'income', 'utilization', 'dti',
        'util_3m_mean', 'util_6m_std', 'balance_3m_slope', 'payment_to_balance',
        'on_time_ratio_6m', 'max_days_past_due_12m', 'inquiries_3m', 'new_accounts_6m',
        'months_since_first', 'months_since_last_payment', 'util_x_delinq', 'dti_x_inquiries',
        'default_next_3m'
    ]
    out = df[features].copy()
    # fill and clip
    out = out.fillna(0)
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='infile', default='ml/data.csv')
    p.add_argument('--out', dest='outfile', default='ml/features.csv')
    args = p.parse_args()
    df = pd.read_csv(args.infile)
    feat = compute_features(df)
    feat.to_csv(args.outfile, index=False)
    print('Wrote', args.outfile)


if __name__ == '__main__':
    main()
