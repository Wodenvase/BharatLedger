# ML scaffolding for credit rating improvements

Files:
- `mock_data.py` — generates a small synthetic dataset for development.
- `features.py` — computes rolling and aggregate features for LightGBM.
- `train.py` — simple LightGBM training and evaluation script.
- `requirements.txt` — Python packages used.

Quickstart:

1. Create a virtualenv and install:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r ml/requirements.txt
```

2. Generate mock data and compute features:

```bash
python ml/mock_data.py --out ml/data.csv
python ml/features.py --in ml/data.csv --out ml/features.csv
```

3. Train a baseline LightGBM model:

```bash
python ml/train.py --features ml/features.csv --model ml/model.txt
```

If you want, provide your dataset path and I can run experiments and tune hyperparameters.

LightGBM training logic
-----------------------

This project uses LightGBM as the primary gradient-boosted tree learner for predicting near-term default risk. The following is a concise, actionable training logic you can follow and implement in `ml/train.py` or a notebook.

1) Data preparation
   - Aggregate rows to the modeling sample you need (e.g., latest month per `cust_id` or rolling-window examples).
   - Use a temporal split for validation to avoid leakage (train on older months, validate on later months).
   - Handle missingness with indicators; LightGBM accepts NaNs but explicit flags help diagnostics.
   - Identify categorical features and either pass them to LightGBM with `categorical_feature` or apply target/leave-one-out encoding for high-cardinality fields.

2) Feature engineering
   - Use rolling windows (means, std, max), slopes/trends, recency features, counts, and interaction terms (e.g., utilization × recent delinquencies).
   - Build both short-term (3 months) and longer-term (6–12 months) aggregates.
   - Normalize or clip extreme values if needed, and include missingness flags.

3) Modeling setup
   - Objective: `binary` (default/no-default) and metrics like `auc` and `average_precision`.
   - For imbalanced classes, use `scale_pos_weight` or sample weights.
   - Example baseline params:

```python
params = {
    'objective': 'binary',
    'metric': 'auc',
    'boosting_type': 'gbdt',
    'learning_rate': 0.03,
    'num_leaves': 64,
    'feature_fraction': 0.8,
    'bagging_fraction': 0.8,
    'bagging_freq': 5,
    'lambda_l1': 0.0,
    'lambda_l2': 1.0,
    'verbosity': -1,
    'seed': 42,
}
```

4) Training procedure
   - Train with early stopping (`early_stopping_rounds=50`) on a temporally-held validation set.
   - Use time-series aware cross-validation (purging overlaps) to avoid optimistic bias.
   - Optionally tune hyperparameters with `Optuna` or randomized search across folds.

5) Evaluate & explain
   - Report AUC, precision/recall at business thresholds, and calibration curves.
   - Compute SHAP values to rank features and detect interactions or leakage.
   - Inspect stability of top features across folds/time windows.

6) Calibration & thresholding
   - Calibrate predicted probabilities (Platt scaling or isotonic) if decision thresholds require well-calibrated probabilities.
   - Choose thresholds by optimizing a business metric (expected loss, precision@k, etc.).

7) Production & monitoring
   - Save model artifacts (`bst.save_model()`), and persist preprocessing (encoders, imputation) using `joblib`.
   - Consider monotonic constraints for features with clear directional effects (e.g., higher delinquency → higher risk).
   - Monitor prediction distributions and feature drift; re-train periodically with new labeled data.

Minimal inference snippet

```python
# load model
bst = lgb.Booster(model_file='ml/model.txt')

# apply same feature pipeline to new raw inputs to produce X_new
probs = bst.predict(X_new, num_iteration=bst.best_iteration)
```

Next steps
----------
- I can add Optuna hyperparameter tuning to `ml/train.py`.
- I can add time-series cross-validation utilities and a SHAP report.
- I can run the pipeline on mock data now to validate end-to-end.

Tell me which you'd like and I'll implement it.
# ML scaffolding for credit rating improvements

Files:
- `mock_data.py` — generates a small synthetic dataset for development.
- `features.py` — computes rolling and aggregate features for LightGBM.
- `train.py` — simple LightGBM training and evaluation script.
- `requirements.txt` — Python packages used.

Quickstart:

1. Create a virtualenv and install:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r ml/requirements.txt
```

2. Generate mock data and compute features:

```bash
python ml/mock_data.py --out ml/data.csv
python ml/features.py --in ml/data.csv --out ml/features.csv
```

3. Train a baseline LightGBM model:

```bash
python ml/train.py --features ml/features.csv --model ml/model.txt
```

If you want, provide your dataset path and I can run experiments and tune hyperparameters.
