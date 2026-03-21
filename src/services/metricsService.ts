import { Transaction, FinancialMetrics, MonthlyData, CategorySpending } from '../types';

/**
 * Calculate financial metrics from transaction data
 */

export function calculateFinancialMetrics(transactions: Transaction[]): FinancialMetrics {
  if (!transactions || transactions.length === 0) {
    return {
      averageIncome: 0,
      averageExpenses: 0,
      savingsRate: 0,
      repaymentHistory: 0,
    };
  }

  // Get last 3 months of data
  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

  const recent = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);

  // Separate credits and debits
  const credits = recent.filter(t => t.type === 'credit');
  const debits = recent.filter(t => t.type === 'debit');

  // Calculate totals
  const totalIncome = credits.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = debits.reduce((sum, t) => sum + t.amount, 0);

  // Average per month (approximate)
  const months = Math.max(1, Math.ceil((today.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24 * 30)));

  const averageIncome = Math.round(totalIncome / months);
  const averageExpenses = Math.round(totalExpenses / months);

  // Savings rate
  const savingsRate = averageIncome > 0
    ? Math.round(((averageIncome - averageExpenses) / averageIncome) * 100)
    : 0;

  // Repayment history (calculate from EMI payments)
  const emiPayments = debits.filter(t => t.category === 'Loan Repayment');
  let repaymentHistory = 80; // Default score

  if (emiPayments.length > 0) {
    // Check consistency of EMI payments
    const emiDates = emiPayments.map(t => new Date(t.date));
    emiDates.sort((a, b) => b.getTime() - a.getTime());

    const recentEMIs = emiDates.slice(0, Math.min(6, emiDates.length)); // Last 6 EMI payments
    
    // Check if EMIs are regular (should be monthly)
    if (recentEMIs.length >= 3) {
      const intervals = [];
      for (let i = 1; i < recentEMIs.length; i++) {
        const days = (recentEMIs[i - 1].getTime() - recentEMIs[i].getTime()) / (1000 * 60 * 60 * 24);
        intervals.push(days);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const consistency = 1 - Math.min(1, Math.abs(avgInterval - 30) / 30); // 30 days expected
      
      repaymentHistory = Math.round(70 + consistency * 25); // 70-95 range
    } else {
      repaymentHistory = 85; // Some EMI payments = good
    }
  }

  return {
    averageIncome,
    averageExpenses,
    savingsRate,
    repaymentHistory,
  };
}

export function calculateMonthlyData(transactions: Transaction[]): MonthlyData[] {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Group transactions by month
  const monthMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { income: 0, expenses: 0 });
    }

    const month = monthMap.get(monthKey)!;
    if (t.type === 'credit') {
      month.income += t.amount;
    } else {
      month.expenses += t.amount;
    }
  });

  // Convert to array and sort
  const monthlyData = Array.from(monthMap.entries())
    .map(([monthKey, data]) => ({
      month: formatMonthKey(monthKey),
      income: data.income,
      expenses: data.expenses,
    }))
    .sort((a, b) => {
      const [aYear, aMonth] = a.month.split('-').map(Number);
      const [bYear, bMonth] = b.month.split('-').map(Number);
      return aYear === bYear ? aMonth - bMonth : aYear - bYear;
    });

  return monthlyData.slice(-12); // Return last 12 months
}

export function calculateCategorySpending(transactions: Transaction[]): CategorySpending[] {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Get last 3 months
  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

  const recent = transactions.filter(
    t => t.type === 'debit' && new Date(t.date) >= threeMonthsAgo
  );

  // Group by category
  const categoryMap = new Map<string, number>();

  recent.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  // Calculate total and percentages
  const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

  const categorySpending = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return categorySpending;
}

export function calculateMetricsChange(
  currentMetrics: FinancialMetrics,
  previousMetrics?: FinancialMetrics
): {
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
  repaymentChange: number;
} {
  if (!previousMetrics) {
    return {
      incomeChange: 0,
      expensesChange: 0,
      savingsChange: 0,
      repaymentChange: 0,
    };
  }

  return {
    incomeChange: currentMetrics.averageIncome - previousMetrics.averageIncome,
    expensesChange: currentMetrics.averageExpenses - previousMetrics.averageExpenses,
    savingsChange: currentMetrics.savingsRate - previousMetrics.savingsRate,
    repaymentChange: currentMetrics.repaymentHistory - previousMetrics.repaymentHistory,
  };
}

function formatMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${year}-${monthNames[parseInt(month) - 1]}`;
}
