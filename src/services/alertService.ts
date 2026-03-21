import { Transaction, Alert } from '../types';

/**
 * Dynamic alert generation based on transaction patterns
 */

interface AlertGeneratorOptions {
  maxAlerts?: number;
  loanEMIAmount?: number;
  loanEMIDueDay?: number;
}

export function generateDynamicAlerts(
  transactions: Transaction[],
  creditScore?: number,
  previousCreditScore?: number,
  options: AlertGeneratorOptions = {}
): Alert[] {
  const maxAlerts = options.maxAlerts || 15;
  const alerts: Alert[] = [];

  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Sort by date (newest first)
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 1. Recent EMI/Loan Payment Alerts
  const emiAlerts = generateEMIAlerts(sorted);
  alerts.push(...emiAlerts);

  // 2. Credit Score Change Alerts
  if (creditScore && previousCreditScore) {
    const scoreAlerts = generateCreditScoreAlerts(creditScore, previousCreditScore);
    alerts.push(...scoreAlerts);
  }

  // 3. Spending Pattern Alerts
  const spendingAlerts = generateSpendingAlerts(sorted);
  alerts.push(...spendingAlerts);

  // 4. Income & Stability Alerts
  const incomeAlerts = generateIncomeAlerts(sorted);
  alerts.push(...incomeAlerts);

  // 5. Category-specific Alerts
  const categoryAlerts = generateCategoryAlerts(sorted);
  alerts.push(...categoryAlerts);

  // 6. Financial Health Alerts
  const healthAlerts = generateFinancialHealthAlerts(sorted);
  alerts.push(...healthAlerts);

  // Sort by timestamp (newest first) and limit to maxAlerts
  return alerts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxAlerts);
}

function generateEMIAlerts(transactions: Transaction[]): Alert[] {
  const alerts: Alert[] = [];
  const emiPayments = transactions.filter(t => t.category === 'Loan Repayment');

  if (emiPayments.length === 0) return alerts;

  // Get most recent EMI and upcoming EMI
  const sortedEMI = [...emiPayments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const mostRecentEMI = sortedEMI[0];
  const avgEMIAmount = emiPayments.reduce((sum, t) => sum + t.amount, 0) / emiPayments.length;

  // Alert 1: Recent EMI payment
  if (mostRecentEMI) {
    alerts.push({
      id: `emi-recent-${mostRecentEMI.id}`,
      message: `EMI of ₹${mostRecentEMI.amount} successfully paid on ${formatDateForAlert(mostRecentEMI.date)}`,
      type: 'success',
      timestamp: new Date(mostRecentEMI.date).toISOString()
    });
  }

  // Alert 2: Upcoming EMI (simulate based on pattern)
  const daysUntilNextEMI = calculateDaysUntilNextEMI(sortedEMI);
  if (daysUntilNextEMI > 0 && daysUntilNextEMI <= 10) {
    alerts.push({
      id: `emi-upcoming-${Date.now()}`,
      message: `Your loan EMI of ₹${Math.round(avgEMIAmount)} is due in ${daysUntilNextEMI} days`,
      type: daysUntilNextEMI <= 3 ? 'warning' : 'info',
      timestamp: new Date().toISOString()
    });
  }

  // Alert 3: EMI Consistency Check
  if (emiPayments.length >= 3) {
    const amounts = sortedEMI.slice(0, 3).map(t => t.amount);
    const isConsistent = amounts.every(amt => Math.abs(amt - amounts[0]) < amounts[0] * 0.1);

    if (!isConsistent) {
      alerts.push({
        id: `emi-inconsistent-${Date.now()}`,
        message: 'Your EMI payments are inconsistent. Ensure timely fixed payments.',
        type: 'warning',
        timestamp: new Date().toISOString()
      });
    } else {
      alerts.push({
        id: `emi-consistent-${Date.now()}`,
        message: 'Great! Your EMI payments are consistent and timely.',
        type: 'success',
        timestamp: new Date().toISOString()
      });
    }
  }

  return alerts;
}

function generateCreditScoreAlerts(
  creditScore: number,
  previousScore: number | undefined
): Alert[] {
  const alerts: Alert[] = [];

  if (!previousScore) return alerts;

  const scoreDifference = creditScore - previousScore;

  if (scoreDifference > 0) {
    alerts.push({
      id: `credit-score-improved-${Date.now()}`,
      message: `Credit score improved by ${scoreDifference} points this month!`,
      type: 'success',
      timestamp: new Date().toISOString()
    });
  } else if (scoreDifference < -10) {
    alerts.push({
      id: `credit-score-declined-${Date.now()}`,
      message: `Credit score declined by ${Math.abs(scoreDifference)} points. Review your transactions.`,
      type: 'warning',
      timestamp: new Date().toISOString()
    });
  }

  // Score level alerts
  if (creditScore >= 750) {
    alerts.push({
      id: `credit-score-excellent-${Date.now()}`,
      message: 'Excellent credit score! You qualify for premium loan offers.',
      type: 'success',
      timestamp: new Date().toISOString()
    });
  } else if (creditScore < 600) {
    alerts.push({
      id: `credit-score-low-${Date.now()}`,
      message: 'Your credit score is below average. Improve payment history to increase it.',
      type: 'warning',
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}

function generateSpendingAlerts(transactions: Transaction[]): Alert[] {
  const alerts: Alert[] = [];
  const debits = transactions.filter(t => t.type === 'debit');

  if (debits.length === 0) return alerts;

  // Alert: High spending detection
  const last30Days = debits.filter(t => {
    const days = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 30;
  });

  if (last30Days.length > 0) {
    const total30Days = last30Days.reduce((sum, t) => sum + t.amount, 0);
    const avg30Days = total30Days / last30Days.length;

    // Check for spike
    const maxAmount = Math.max(...last30Days.map(t => t.amount));
    if (maxAmount > avg30Days * 3) {
      alerts.push({
        id: `spending-spike-${Date.now()}`,
        message: `High spending detected (₹${maxAmount}). Review your recent transactions.`,
        type: 'warning',
        timestamp: new Date().toISOString()
      });
    }

    // Check monthly budget
    const last3Months = debits.filter(t => {
      const days = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 90;
    });

    if (last3Months.length > 0) {
      const avg3Months = last3Months.reduce((sum, t) => sum + t.amount, 0) / 3;
      if (total30Days > avg3Months * 1.3) {
        alerts.push({
          id: `spending-above-budget-${Date.now()}`,
          message: `This month's spending (₹${Math.round(total30Days)}) is 30% above your average. Consider cutting back.`,
          type: 'warning',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  return alerts;
}

function generateIncomeAlerts(transactions: Transaction[]): Alert[] {
  const alerts: Alert[] = [];
  const credits = transactions.filter(t => t.type === 'credit');

  if (credits.length === 0) return alerts;

  // Alert: Regular salary received
  const salaryTransactions = credits.filter(t => t.description.toLowerCase().includes('salary'));
  if (salaryTransactions.length > 0 && salaryTransactions.length <= 2) {
    const mostRecent = salaryTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    const daysSince = Math.floor(
      (Date.now() - new Date(mostRecent.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince <= 7) {
      alerts.push({
        id: `income-received-${mostRecent.id}`,
        message: `Salary of ₹${mostRecent.amount} received on ${formatDateForAlert(mostRecent.date)}. Great!`,
        type: 'success',
        timestamp: new Date(mostRecent.date).toISOString()
      });
    }
  }

  // Alert: Income stability
  if (credits.length >= 3) {
    const amounts = credits.map(t => t.amount);
    const avgIncome = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const maxVariation = Math.max(
      ...amounts.map(amt => Math.abs(amt - avgIncome) / avgIncome)
    );

    if (maxVariation < 0.2) {
      alerts.push({
        id: `income-stable-${Date.now()}`,
        message: 'Excellent! Your income is stable and consistent.',
        type: 'success',
        timestamp: new Date().toISOString()
      });
    } else if (maxVariation > 0.5) {
      alerts.push({
        id: `income-unstable-${Date.now()}`,
        message: 'Your income shows high variability. This may affect your credit score.',
        type: 'warning',
        timestamp: new Date().toISOString()
      });
    }
  }

  return alerts;
}

function generateCategoryAlerts(transactions: Transaction[]): Alert[] {
  const alerts: Alert[] = [];

  // Alert: Highest spending category this month
  const last30Days = transactions.filter(t => {
    const days = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 30 && t.type === 'debit';
  });

  if (last30Days.length > 0) {
    const categoryMap = new Map<string, number>();
    last30Days.forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    const topCategory = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      alerts.push({
        id: `top-category-${topCategory[0]}`,
        message: `Your highest spending this month is on ${topCategory[0]}: ₹${Math.round(topCategory[1])}`,
        type: 'info',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Alert: Unusual shopping activity
  const shoppingTransactions = transactions.filter(
    t => t.category === 'Shopping' && t.type === 'debit'
  );

  if (shoppingTransactions.length > 5) {
    const lastWeek = shoppingTransactions.filter(t => {
      const days = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    });

    if (lastWeek.length >= 3) {
      alerts.push({
        id: `shopping-frequent-${Date.now()}`,
        message: `Frequent shopping detected (${lastWeek.length} transactions). Watch your spending!`,
        type: 'info',
        timestamp: new Date().toISOString()
      });
    }
  }

  return alerts;
}

function generateFinancialHealthAlerts(transactions: Transaction[]): Alert[] {
  const alerts: Alert[] = [];

  // Alert: Savings rate analysis
  const credits = transactions.filter(t => t.type === 'credit');
  const debits = transactions.filter(t => t.type === 'debit');

  if (credits.length > 0 && debits.length > 0) {
    const totalIncome = credits.reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = debits.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = ((totalIncome - totalSpent) / totalIncome) * 100;

    if (savingsRate >= 30) {
      alerts.push({
        id: `savings-excellent-${Date.now()}`,
        message: `Excellent savings rate of ${savingsRate.toFixed(1)}%! Keep it up!`,
        type: 'success',
        timestamp: new Date().toISOString()
      });
    } else if (savingsRate < 5) {
      alerts.push({
        id: `savings-low-${Date.now()}`,
        message: `Low savings rate detected. Try to save at least 10-15% of your income.`,
        type: 'warning',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Alert: Transaction frequency
  if (transactions.length >= 20) {
    alerts.push({
      id: `transaction-active-${Date.now()}`,
      message: 'Active financial activity detected. Ensure all transactions are authorized.',
      type: 'info',
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}

function calculateDaysUntilNextEMI(emiTransactions: Transaction[]): number {
  if (emiTransactions.length < 2) return -1;

  const dates = emiTransactions.map(t => new Date(t.date).getTime());
  const intervals = [];

  for (let i = 1; i < dates.length; i++) {
    intervals.push((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24));
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const lastEMIDate = new Date(emiTransactions[0].date);
  const nextEMIDate = new Date(lastEMIDate.getTime() + avgInterval * 24 * 60 * 60 * 1000);
  const daysUntil = Math.ceil((nextEMIDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return Math.max(0, daysUntil);
}

function formatDateForAlert(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
