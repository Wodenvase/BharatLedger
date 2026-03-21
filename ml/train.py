"""Train a LightGBM model on engineered features and show feature importance."""
import argparse
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
import lightgbm as lgb


def train(features_csv: str, model_out: str = 'ml/model.txt'):
    df = pd.read_csv(features_csv)
    # latest month per customer as sample (simple approach)
    df = df.sort_values(['cust_id', 'month'])
    df = df.groupby('cust_id').tail(1).reset_index(drop=True)
    y = df['default_next_3m']
    X = df.drop(columns=['cust_id', 'month', 'default_next_3m'])

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    train_data = lgb.Dataset(X_train, label=y_train)
    val_data = lgb.Dataset(X_val, label=y_val, reference=train_data)

    params = {
        'objective': 'binary',
        'metric': 'auc',
        'boosting_type': 'gbdt',
        'learning_rate': 0.05,
        'num_leaves': 64,
        'feature_fraction': 0.8,
        'bagging_fraction': 0.8,
        'bagging_freq': 5,
        'verbosity': -1,
        'seed': 42,
    }

    bst = lgb.train(params, train_data, num_boost_round=2000, valid_sets=[val_data], early_stopping_rounds=50, verbose_eval=100)

    y_pred = bst.predict(X_val, num_iteration=bst.best_iteration)
    auc = roc_auc_score(y_val, y_pred)
    print(f'Validation AUC: {auc:.4f}')

    # feature importance
    fi = pd.DataFrame({'feature': X.columns, 'importance': bst.feature_importance(importance_type='gain')})
    fi = fi.sort_values('importance', ascending=False)
    print('\nTop features:\n', fi.head(20).to_string(index=False))

    bst.save_model(model_out)
    joblib.dump({'model_path': model_out}, model_out + '.meta')
    print('Saved model to', model_out)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--features', default='ml/features.csv')
    p.add_argument('--model', default='ml/model.txt')
    args = p.parse_args()
    train(args.features, args.model)


if __name__ == '__main__':
    main()
