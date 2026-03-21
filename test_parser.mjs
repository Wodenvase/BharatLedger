import fs from 'fs';

// Simple CSV parser to test
const csv = fs.readFileSync('./test_sam_statement.csv', 'utf-8');
const lines = csv.split(/\r?\n/).filter(l => l.trim());
console.log('Total lines:', lines.length);

const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
console.log('Headers:', headers);

const dateIdx = headers.indexOf('date');
const descIdx = headers.indexOf('description');
const amountIdx = headers.indexOf('amount');
const typeIdx = headers.indexOf('type');
const categoryIdx = headers.indexOf('category');

console.log('Indices:', { dateIdx, descIdx, amountIdx, typeIdx, categoryIdx });

// Parse first 5 rows
for (let i = 1; i <= 5 && i < lines.length; i++) {
  const cells = lines[i].split(',').map(c => c.trim());
  const tx = {
    date: cells[dateIdx],
    description: cells[descIdx],
    amount: parseFloat(cells[amountIdx]),
    type: cells[typeIdx],
    category: cells[categoryIdx]
  };
  console.log(`Row ${i}:`, tx);
}

// Count credits vs debits and sum amounts
let credits = 0;
let debits = 0;
let totalIncomeAmount = 0;
let totalExpenseAmount = 0;

for (let i = 1; i < lines.length; i++) {
  const cells = lines[i].split(',').map(c => c.trim());
  const type = cells[typeIdx].toLowerCase();
  const amount = parseFloat(cells[amountIdx]);
  
  if (type === 'income' || type === 'credit') {
    credits++;
    totalIncomeAmount += amount;
  }
  
  if (type === 'expense' || type === 'debit') {
    debits++;
    totalExpenseAmount += amount;
  }
}

console.log(`\nTotal: ${credits} credits (₹${totalIncomeAmount}), ${debits} debits (₹${totalExpenseAmount})`);
console.log(`Average income: ₹${(totalIncomeAmount / credits).toFixed(2)}`);
console.log(`Average expense: ₹${(totalExpenseAmount / debits).toFixed(2)}`);
