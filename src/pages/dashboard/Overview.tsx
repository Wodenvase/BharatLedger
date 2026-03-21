import React, { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, PiggyBank, Calendar } from 'lucide-react';
import CreditScoreGauge from '../../components/dashboard/CreditScoreGauge';
import MetricCard from '../../components/dashboard/MetricCard';
import AlertCard from '../../components/dashboard/AlertCard';
import { Transaction, FinancialMetrics, Alert } from '../../types';
import { mockUser } from '../../data/mockData';
import { formatCurrency, formatPercentage, getRiskColor } from '../../utils/formatters';
import { calculateCreditScore } from '../../services/creditScoreCalculator';
import { detectAndGetCreditProfile } from '../../services/creditScoreMapping';
import { generateDynamicAlerts } from '../../services/alertService';
import { calculateFinancialMetrics } from '../../services/metricsService';
import { useTransactions } from '../../context/TransactionContext';

const Overview: React.FC = () => {
  // Get transactions from global context
  const { transactions } = useTransactions();
  
  const [creditScore, setCreditScore] = useState(720);
  const [riskLevel, setRiskLevel] = useState<'Low Risk' | 'Medium Risk' | 'High Risk'>('Low Risk');
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    averageIncome: 35000,
    averageExpenses: 28000,
    savingsRate: 20,
    repaymentHistory: 95,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [creditScoreMetrics, setCreditScoreMetrics] = useState<any>({
    paymentHistoryScore: 0,
    utilizationScore: 0,
    incomeStabilityScore: 0,
    delinquencyScore: 0,
    emiComplianceScore: 0,
    spendingPatternScore: 0,
  });

  // Recalculate everything when transactions change (now from context)
  useEffect(() => {
    console.log('[Overview] useEffect triggered:', { transactionCount: transactions?.length || 0, hasTransactions: (transactions?.length || 0) > 0 });
    
    if (!transactions || transactions.length === 0) {
      console.log('[Overview] No transactions, skipping calculation');
      return;
    }

    console.log('[Overview] Calculating credit score:', { txCount: transactions.length, types: transactions.map(t => t.type) });
    
    // Calculate credit score using mapped profile
    const scoreResult = calculateCreditScore(transactions, creditScore);
    console.log('[Overview] Credit score calculated:', { score: scoreResult.score, riskLevel: scoreResult.riskLevel });
    
    setCreditScore(scoreResult.score);
    setRiskLevel(scoreResult.riskLevel);
    setCreditScoreMetrics(scoreResult.metrics);

    // Calculate financial metrics
    const newMetrics = calculateFinancialMetrics(transactions);
    console.log('[Overview] Financial metrics:', newMetrics);
    setMetrics(newMetrics);

    // Try to get alerts from the mapped profile first
    const profile = detectAndGetCreditProfile(transactions);
    let dynamicAlerts: Alert[];
    
    if (profile) {
      console.log('[Overview] Using profile alerts for:', profile.name);
      dynamicAlerts = profile.alerts;
    } else {
      console.log('[Overview] No profile found, using dynamic alerts');
      dynamicAlerts = generateDynamicAlerts(transactions, scoreResult.score, creditScore);
    }
    
    setAlerts(dynamicAlerts.slice(0, 15)); // Limit to 15 alerts
  }, [transactions]);

  const getMetricChange = (label: string): string => {
    if (label === 'income') {
      const avgChange = Math.round(metrics.averageIncome * 0.05);
      return `+${avgChange > 0 ? '+' : ''}${avgChange.toString()}`;
    } else if (label === 'expenses') {
      const avgChange = Math.round(-metrics.averageExpenses * 0.021);
      return `${avgChange}`;
    } else if (label === 'savings') {
      return '+3.5%';
    }
    return 'Excellent';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockUser.name.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-2">Here's your financial overview for today. Powered by LightGBM credit analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Credit Score Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Credit Score</h2>
                <p className="text-gray-600">Based on LightGBM financial analysis</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${getRiskColor(riskLevel)}`}>
                  {riskLevel}
                </div>
                <div className="text-sm text-gray-500">Risk Category</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <CreditScoreGauge score={creditScore} />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(creditScoreMetrics.paymentHistoryScore)}
                </div>
                <div className="text-sm text-gray-500">Payment History</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(creditScoreMetrics.incomeStabilityScore)}
                </div>
                <div className="text-sm text-gray-500">Income Pattern</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(creditScoreMetrics.utilizationScore)}
                </div>
                <div className="text-sm text-gray-500">Utilization</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts ({alerts.length})</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alerts.slice(0, 10).map((alert) => (
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
          value={formatCurrency(metrics.averageIncome)}
          change={`${getMetricChange('income')} from last month`}
          changeType="positive"
          icon={IndianRupee}
        />
        <MetricCard
          title="Average Monthly Expenses"
          value={formatCurrency(metrics.averageExpenses)}
          change={`${getMetricChange('expenses')} from last month`}
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Current Savings Rate"
          value={formatPercentage(metrics.savingsRate)}
          change={getMetricChange('savings')}
          changeType="positive"
          icon={PiggyBank}
        />
        <MetricCard
          title="Repayment History"
          value={formatPercentage(metrics.repaymentHistory)}
          change={getMetricChange('repayment')}
          changeType="positive"
          icon={Calendar}
        />
      </div>
    </div>
  );
};

export default Overview;