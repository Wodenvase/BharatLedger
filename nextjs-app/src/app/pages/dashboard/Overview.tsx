import React from 'react';
import { IndianRupee, TrendingUp, PiggyBank, Calendar } from 'lucide-react';
import CreditScoreGauge from '../../components/dashboard/CreditScoreGauge';
import MetricCard from '../../components/dashboard/MetricCard';
import AlertCard from '../../components/dashboard/AlertCard';
import { mockUser, mockMetrics, mockAlerts } from '../../data/mockData';
import { formatCurrency, formatPercentage, getRiskColor } from '../../utils/formatters';

const Overview: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockUser.name.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-2">Here's your financial overview for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Credit Score Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Credit Score</h2>
                <p className="text-gray-600">Based on comprehensive financial analysis</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${getRiskColor(mockUser.riskLevel)}`}>
                  {mockUser.riskLevel}
                </div>
                <div className="text-sm text-gray-500">Risk Category</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <CreditScoreGauge score={mockUser.creditScore} />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Good</div>
                <div className="text-sm text-gray-500">Payment History</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Stable</div>
                <div className="text-sm text-gray-500">Income Pattern</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Low</div>
                <div className="text-sm text-gray-500">Utilization</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {mockAlerts.slice(0, 3).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Monthly Income"
          value={formatCurrency(mockMetrics.averageIncome)}
          change="+5.2% from last month"
          changeType="positive"
          icon={IndianRupee}
        />
        <MetricCard
          title="Average Monthly Expenses"
          value={formatCurrency(mockMetrics.averageExpenses)}
          change="-2.1% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Current Savings Rate"
          value={formatPercentage(mockMetrics.savingsRate)}
          change="+3.5% improvement"
          changeType="positive"
          icon={PiggyBank}
        />
        <MetricCard
          title="Repayment History"
          value={formatPercentage(mockMetrics.repaymentHistory)}
          change="Excellent track record"
          changeType="positive"
          icon={Calendar}
        />
      </div>
    </div>
  );
};

export default Overview;