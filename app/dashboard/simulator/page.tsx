import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Calculator, ArrowRight } from 'lucide-react';
import CreditScoreGauge from '@/components/dashboard/CreditScoreGauge';
import { mockUser } from '@/data/mockData';

const RiskSimulator= () => {
  const { data: session } = useSession();
  const [scenarios, setScenarios] = useState({
    missedPayments: 0,
    incomeChange: 0,
    spendingIncrease: 0
  });

  const [simulatedScore, setSimulatedScore] = useState<number>(mockUser.creditScore);
  const [loadingSim, setLoadingSim] = useState(false);

  const runSimulation = async () => {
    setLoadingSim(true);
    try {
      const payload = {
        userEmail: session?.user?.email,
        simulation: {
          missed_payments: scenarios.missedPayments,
          income_change: scenarios.incomeChange,
          spending_increase: scenarios.spendingIncrease,
        }
      };

      const res = await fetch('/api/python/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn('Simulation API failed', res.status);
        // fallback to local heuristic
        // apply simple heuristic as before
        let newScore = mockUser.creditScore;
        newScore -= scenarios.missedPayments * 25;
        newScore += (scenarios.incomeChange / 1000) * 2;
        newScore -= (scenarios.spendingIncrease / 100) * 10;
        newScore = Math.max(300, Math.min(850, newScore));
        setSimulatedScore(Math.round(newScore));
      } else {
        const data = await res.json();
        const simScore = data?.simulatedScore ?? data?.score ?? null;
        if (simScore !== null) setSimulatedScore(Number(simScore));
      }
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setLoadingSim(false);
    }
  };

  const getScoreImpact = () => {
    const impact = simulatedScore - mockUser.creditScore;
    if (impact > 0) return { text: `+${impact} points`, color: 'text-green-600' };
    if (impact < 0) return { text: `${impact} points`, color: 'text-red-600' };
    return { text: 'No change', color: 'text-gray-600' };
  };

  const impact = getScoreImpact();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Risk Simulator & Forecasting</h1>
        <p className="text-gray-600 mt-2">
          Explore how different financial scenarios would impact your credit score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scenario Builder */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              What-If Scenario Builder
            </h2>
            
            <div className="space-y-6">
              {/* Missed Payments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What happens if I miss EMI payments?
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={scenarios.missedPayments}
                    onChange={(e) => setScenarios(prev => ({ ...prev, missedPayments: Number(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-lg font-medium min-w-[80px] text-center">
                    {scenarios.missedPayments} payments
                  </span>
                </div>
              </div>

              {/* Income Change */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would my score change if my monthly income changes?
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="-10000"
                    max="10000"
                    step="1000"
                    value={scenarios.incomeChange}
                    onChange={(e) => setScenarios(prev => ({ ...prev, incomeChange: Number(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className={`px-3 py-1 rounded-lg font-medium min-w-[100px] text-center ${
                    scenarios.incomeChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {scenarios.incomeChange >= 0 ? '+' : ''}₹{scenarios.incomeChange.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Spending Increase */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What if my spending increases?
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={scenarios.spendingIncrease}
                    onChange={(e) => setScenarios(prev => ({ ...prev, spendingIncrease: Number(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg font-medium min-w-[60px] text-center">
                    +{scenarios.spendingIncrease}%
                  </span>
                </div>
              </div>

              <button
                onClick={runSimulation}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold"
              >
                Run Simulation
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Current vs Simulated Score */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Score Comparison</h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600 mb-4">Current Score</h3>
                <CreditScoreGauge score={mockUser.creditScore} size="sm" />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-600 mb-4">Simulated Score</h3>
                <CreditScoreGauge score={simulatedScore} size="sm" />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-lg font-semibold text-gray-900">Score Impact</div>
              <div className={`text-2xl font-bold ${impact.color} mt-2`}>
                {impact.text}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
            <div className="space-y-4">
              {scenarios.missedPayments > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <p className="text-red-800 font-medium">Payment History Impact</p>
                  <p className="text-red-700 text-sm mt-1">
                    Missing payments significantly impacts your credit score. Consider setting up auto-payments.
                  </p>
                </div>
              )}
              
              {scenarios.incomeChange < 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-yellow-800 font-medium">Income Stability</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Reducing income affects your debt-to-income ratio. Consider additional income sources.
                  </p>
                </div>
              )}
              
              {scenarios.spendingIncrease > 20 && (
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <p className="text-orange-800 font-medium">Spending Management</p>
                  <p className="text-orange-700 text-sm mt-1">
                    High spending increases can signal financial stress. Review your budget categories.
                  </p>
                </div>
              )}
              
              {scenarios.missedPayments === 0 && scenarios.incomeChange >= 0 && scenarios.spendingIncrease <= 10 && (
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-green-800 font-medium">Great Financial Health!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Your current financial habits are supporting a strong credit profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RiskSimulator;
