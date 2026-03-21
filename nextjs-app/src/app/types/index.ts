export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  creditScore: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

export interface FinancialMetrics {
  averageIncome: number;
  averageExpenses: number;
  savingsRate: number;
  repaymentHistory: number;
}

export interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
}