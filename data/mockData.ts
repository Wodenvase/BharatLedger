import { Transaction, User, FinancialMetrics, Alert, MonthlyData, CategorySpending } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Priya Sharma',
  email: 'priya.sharma@email.com',
  phone: '+91 9876543210',
  creditScore: 720,
  riskLevel: 'Low Risk'
};

export const mockMetrics: FinancialMetrics = {
  averageIncome: 35000,
  averageExpenses: 28000,
  savingsRate: 20,
  repaymentHistory: 95
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-01-15',
    description: 'Salary Credit',
    category: 'Income',
    amount: 45000,
    type: 'credit'
  },
  {
    id: '2',
    date: '2025-01-14',
    description: 'Grocery Store Payment',
    category: 'Food & Dining',
    amount: 2500,
    type: 'debit'
  },
  {
    id: '3',
    date: '2025-01-13',
    description: 'Electricity Bill',
    category: 'Utilities',
    amount: 1800,
    type: 'debit'
  },
  {
    id: '4',
    date: '2025-01-12',
    description: 'UPI Payment - Online Shopping',
    category: 'Shopping',
    amount: 3200,
    type: 'debit'
  },
  {
    id: '5',
    date: '2025-01-11',
    description: 'Auto Rickshaw',
    category: 'Transportation',
    amount: 150,
    type: 'debit'
  },
  {
    id: '6',
    date: '2025-01-10',
    description: 'EMI Payment - Personal Loan',
    category: 'Loan Repayment',
    amount: 5000,
    type: 'debit'
  },
  {
    id: '7',
    date: '2025-01-09',
    description: 'Restaurant Payment',
    category: 'Food & Dining',
    amount: 800,
    type: 'debit'
  },
  {
    id: '8',
    date: '2025-01-08',
    description: 'Freelance Payment',
    category: 'Income',
    amount: 8000,
    type: 'credit'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    message: 'Your loan EMI of ₹5,000 is due in 5 days',
    type: 'warning',
    timestamp: '2025-01-16T10:30:00Z'
  },
  {
    id: '2',
    message: 'Credit score improved by 15 points this month!',
    type: 'success',
    timestamp: '2025-01-15T14:20:00Z'
  },
  {
    id: '3',
    message: 'Your spending on Shopping category increased by 20%',
    type: 'info',
    timestamp: '2025-01-14T09:15:00Z'
  }
];

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Mar 2024', income: 40000, expenses: 32000 },
  { month: 'Apr 2024', income: 42000, expenses: 30000 },
  { month: 'May 2024', income: 38000, expenses: 35000 },
  { month: 'Jun 2024', income: 45000, expenses: 33000 },
  { month: 'Jul 2024', income: 43000, expenses: 31000 },
  { month: 'Aug 2024', income: 41000, expenses: 29000 },
  { month: 'Sep 2024', income: 44000, expenses: 34000 },
  { month: 'Oct 2024', income: 46000, expenses: 32000 },
  { month: 'Nov 2024', income: 43000, expenses: 30000 },
  { month: 'Dec 2024', income: 47000, expenses: 33000 },
  { month: 'Jan 2025', income: 45000, expenses: 28000 }
];

export const mockCategorySpending: CategorySpending[] = [
  { category: 'Food & Dining', amount: 8500, percentage: 30.4 },
  { category: 'Transportation', amount: 4200, percentage: 15.0 },
  { category: 'Utilities', amount: 3800, percentage: 13.6 },
  { category: 'Shopping', amount: 3200, percentage: 11.4 },
  { category: 'Healthcare', amount: 2800, percentage: 10.0 },
  { category: 'Entertainment', amount: 2200, percentage: 7.9 },
  { category: 'Loan Repayment', amount: 5000, percentage: 17.9 },
  { category: 'Others', amount: 1300, percentage: 4.6 }
];

export const categories = [
  'All Categories',
  'Income',
  'Food & Dining',
  'Transportation', 
  'Utilities',
  'Shopping',
  'Healthcare',
  'Entertainment',
  'Loan Repayment',
  'Others'
];