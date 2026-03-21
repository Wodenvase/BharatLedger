import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockMonthlyData, mockCategorySpending } from '../../data/mockData';
import { MonthlyData, CategorySpending } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { calculateMonthlyData, calculateCategorySpending } from '../../services/metricsService';
import { useTransactions } from '../../context/TransactionContext';

const FinancialHealth: React.FC = () => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];
  
  // Get transactions from global context
  const { transactions } = useTransactions();
  
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(mockMonthlyData);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(mockCategorySpending);

  // Recalculate when transactions change (from context)
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      return;
    }
    
    // Recalculate metrics
    const newMonthlyData = calculateMonthlyData(transactions);
    const newCategorySpending = calculateCategorySpending(transactions);
    
    setMonthlyData(newMonthlyData.length > 0 ? newMonthlyData : mockMonthlyData);
    setCategorySpending(newCategorySpending.length > 0 ? newCategorySpending : mockCategorySpending);
  }, [transactions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Health Deep Dive</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive analysis of your financial patterns and spending behavior powered by LightGBM insights.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Income vs Expenses Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Income vs Expenses Trend</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Category Spending Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending by Category</h2>
          {categorySpending.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Category Breakdown</h2>
        {categorySpending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Total Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {categorySpending.map((cat) => (
                  <tr key={cat.category} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900 font-medium">{cat.category}</td>
                    <td className="text-right py-4 px-4 text-gray-900">{formatCurrency(cat.amount)}</td>
                    <td className="text-right py-4 px-4 text-gray-900">{cat.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No transaction data available
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialHealth;