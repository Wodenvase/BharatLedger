'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Upload, ArrowRight, CheckCircle2, TrendingUp, PieChart, AlertTriangle } from 'lucide-react';
import CreditScoreGauge from '@/components/dashboard/CreditScoreGauge';
import MetricCard from '@/components/dashboard/MetricCard';
import TransactionTable from '@/components/dashboard/TransactionTable';

interface DashboardData {
  creditScore: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  connectedAccounts: number;
  recentTransactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
    category: string;
  }>;
  hasTransactions: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/overview');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900">Error Loading Dashboard</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show onboarding if no transactions
  if (dashboardData && !dashboardData.hasTransactions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to BharatLedger! 👋
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let's get started by uploading your bank transaction CSV to unlock powerful financial insights
            </p>
          </div>

          {/* Onboarding Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Get Started in 3 Easy Steps</h2>
            </div>

            <div className="p-8">
              {/* Steps */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Download Your Bank Statement</h3>
                    <p className="text-gray-600">
                      Log into your bank's website and download your transaction history as a CSV file
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Upload Your CSV</h3>
                    <p className="text-gray-600">
                      Click the button below to upload your bank statement CSV file
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Get Instant Insights</h3>
                    <p className="text-gray-600">
                      View your credit score, spending patterns, and personalized financial recommendations
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">What You'll Get:</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Credit Score</p>
                      <p className="text-sm text-gray-600">Track your financial health</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PieChart className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Spending Analysis</p>
                      <p className="text-sm text-gray-600">Understand your patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Smart Alerts</p>
                      <p className="text-sm text-gray-600">Stay on top of finances</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => router.push('/dashboard/data-sources')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3 group"
              >
                Upload Your First CSV
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Security Note */}
              <div className="mt-6 flex items-start gap-3 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-gray-900">Your data is secure.</span> We use bank-level encryption and never share your information with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Support Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">View our guide</a> or <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">contact support</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show regular dashboard if user has transactions
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-gray-600 mt-2">
            Your complete financial health dashboard
          </p>
        </div>

        {dashboardData && (
          <>
            {/* Credit Score */}
            <div className="mb-8">
              <CreditScoreGauge score={dashboardData.creditScore} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Monthly Income"
                value={`₹${dashboardData.monthlyIncome.toLocaleString('en-IN')}`}
                trend="up"
                trendValue="12%"
                icon="trending-up"
              />
              <MetricCard
                title="Monthly Expenses"
                value={`₹${dashboardData.monthlyExpenses.toLocaleString('en-IN')}`}
                trend="down"
                trendValue="5%"
                icon="trending-down"
              />
              <MetricCard
                title="Savings Rate"
                value={`${dashboardData.savingsRate.toFixed(1)}%`}
                trend="up"
                trendValue="3%"
                icon="piggy-bank"
              />
              <MetricCard
                title="Connected Accounts"
                value={dashboardData.connectedAccounts.toString()}
                icon="link"
              />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
              </div>
              <div className="p-6">
                {dashboardData.recentTransactions.length > 0 ? (
                  <TransactionTable transactions={dashboardData.recentTransactions} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
