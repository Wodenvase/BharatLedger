# CSV Import Guide

## CSV Format Requirements

When uploading transactions via CSV, ensure your file follows this format:

### Required Columns
- **date**: Transaction date (ISO format: YYYY-MM-DD, e.g. 2025-01-15)
- **description**: Transaction description (e.g. "Salary Credit", "Netflix")
- **amount**: Transaction amount as a number (e.g. 5000, 250.50)

### Optional Columns
- **type**: Transaction type - "income"/"credit" or "debit" (default: debit)
- **category**: Transaction category (auto-mapped to valid categories, default: Others)

### Valid Categories
- Income
- Food & Dining
- Transportation
- Utilities
- Shopping
- Healthcare
- Entertainment
- Loan Repayment
- Others

## Example CSV

```csv
date,description,amount,type,category
2025-01-15,Salary Credit,45000,income,Income
2025-01-14,Coffee Shop,250,debit,Food & Dining
2025-01-13,Electricity Bill,1200,debit,Utilities
2025-01-12,Online Shopping,2500,debit,Shopping
```

## Validation Rules

- **Date validation**: Must be a valid date in ISO format (YYYY-MM-DD)
- **Amount validation**: Must be a valid number, currency symbols are stripped
- **Category mapping**: Categories are auto-corrected to valid categories (case-insensitive)
- **Duplicate handling**: Rows with duplicate IDs are skipped
- **Error handling**: Malformed rows are skipped with console warnings

## Tips

1. Use quotes around fields with commas: `"John Doe, Inc.",5000`
2. Dates should always be in YYYY-MM-DD format
3. Amount can include decimals: 1250.50
4. Transaction type (income/debit) is case-insensitive
5. Categories are auto-corrected to matching valid categories

See `sample_transactions.csv` in the root directory for a working example.
