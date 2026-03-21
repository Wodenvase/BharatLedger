import { Transaction } from '../types';

const VALID_CATEGORIES = [
  'Income', 'Food & Dining', 'Transportation', 'Utilities', 'Shopping',
  'Healthcare', 'Entertainment', 'Loan Repayment', 'Others', 'Salary', 'General', 'Groceries'
];

function safeTrim(s?: string) {
  return (s ?? '').trim();
}

function parseLine(line: string) {
  // Simple CSV field parser that handles quoted fields
  const fields: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      fields.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  fields.push(cur);
  return fields;
}

function parseFlexibleDate(dateStr: string): string {
  const trimmed = safeTrim(dateStr);
  
  // Try DD/MM/YY or DD/MM/YYYY format
  const dmyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (dmyMatch) {
    let day = parseInt(dmyMatch[1]);
    let month = parseInt(dmyMatch[2]);
    let year = parseInt(dmyMatch[3]);
    
    // Handle 2-digit years
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }
    
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  }
  
  // Try YYYY-MM-DD format
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const date = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`);
    if (!isNaN(date.getTime())) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }
  }
  
  return '';
}

function isValidDate(dateStr: string): boolean {
  return dateStr !== '' && !isNaN(new Date(dateStr).getTime());
}

function normalizeCategory(cat: string): string {
  const trimmed = safeTrim(cat);
  const match = VALID_CATEGORIES.find(c => c.toLowerCase() === trimmed.toLowerCase());
  return match || 'Others';
}

function normalizeType(typeStr: string): 'credit' | 'debit' {
  const lowerType = safeTrim(typeStr).toLowerCase();
  
  // Map common terms
  if (lowerType === 'income' || lowerType === 'credit' || lowerType === 'salary' || lowerType === 'transfer') {
    return 'credit';
  }
  if (lowerType === 'expense' || lowerType === 'debit' || lowerType === 'outflow') {
    return 'debit';
  }
  
  return 'debit'; // Default to debit if unclear
}

function findColumnIndex(headers: string[], ...aliases: string[]): number {
  return headers.findIndex(h => 
    aliases.some(alias => safeTrim(h).toLowerCase() === alias.toLowerCase())
  );
}

export function parseBankCSV(text: string): Transaction[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const headerLine = parseLine(lines[0]).map(h => safeTrim(h).toLowerCase());
  
  // Flexible column detection
  const dateIdx = findColumnIndex(headerLine, 'date', 'transaction date', 'date of transaction');
  const descIdx = findColumnIndex(headerLine, 'description', 'desc', 'transaction description', 'narration');
  const amountIdx = findColumnIndex(headerLine, 'amount', 'value', 'transaction amount', 'debit', 'credit');
  const typeIdx = findColumnIndex(headerLine, 'type', 'transaction type', 'category', 'transaction category');
  const categoryIdx = findColumnIndex(headerLine, 'category', 'category type', 'merchant category');

  // Validate required columns
  if (dateIdx === -1 || descIdx === -1 || amountIdx === -1) {
    console.warn('CSV missing required columns: date, description, amount');
    return [];
  }

  const out: Transaction[] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const cells = parseLine(lines[i]);
      
      let date = safeTrim(cells[dateIdx] ?? '');
      date = parseFlexibleDate(date); // Parse flexible date format
      
      const description = safeTrim(cells[descIdx] ?? '');
      const amountRaw = safeTrim(cells[amountIdx] ?? '0').replace(/[^0-9.\-]/g, '');

      // Validate required fields
      if (!date || !description) {
        console.warn('Skipping CSV line: missing required fields', i);
        continue;
      }

      if (!isValidDate(date)) {
        console.warn('Skipping CSV line: invalid date format', i, date);
        continue;
      }

      const amount = amountRaw === '' ? 0 : Number(amountRaw);
      if (isNaN(amount) || amount === 0) {
        console.warn('Skipping CSV line: invalid amount', i, amountRaw);
        continue;
      }

      const typeRaw = typeIdx !== -1 ? safeTrim(cells[typeIdx] ?? '') : '';
      const categoryRaw = categoryIdx !== -1 ? safeTrim(cells[categoryIdx] ?? 'Others') : 'Others';

      const tx: Transaction = {
        id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : `${Date.now()}-${i}`,
        date,
        description,
        category: normalizeCategory(categoryRaw),
        amount: Math.abs(amount), // Ensure positive amount
        type: normalizeType(typeRaw)
      };

      out.push(tx);
    } catch (e) {
      // skip malformed lines
      // eslint-disable-next-line no-console
      console.warn('Skipping CSV line due to parse error', i, e);
    }
  }

  return out;
}

export default parseBankCSV;
