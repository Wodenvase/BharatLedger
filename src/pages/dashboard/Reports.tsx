import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, Trash2 } from 'lucide-react';
import { FinancialMetrics, Alert } from '../../types';
import { calculateFinancialMetrics } from '../../services/metricsService';
import { calculateCreditScore } from '../../services/creditScoreCalculator';
import { generateDynamicAlerts } from '../../services/alertService';
import { generateCreditReport, generateMonthlyReport, generateTransactionHistory } from '../../services/reportGenerator';
import { useTransactions } from '../../context/TransactionContext';

interface ScheduledReport {
  id: string;
  name: string;
  nextDate: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  active: boolean;
}

interface AlertPreferences {
  paymentReminders: boolean;
  creditScoreChanges: boolean;
  spendingAlerts: boolean;
  monthlyReports: boolean;
}

const Reports: React.FC = () => {
  // Get transactions from global context
  const { transactions } = useTransactions();
  
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    averageIncome: 35000,
    averageExpenses: 28000,
    savingsRate: 20,
    repaymentHistory: 95,
  });
  const [creditScore, setCreditScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'Low Risk' | 'Medium Risk' | 'High Risk'>('Low Risk');
  const [scoreMetrics, setScoreMetrics] = useState<any>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jsPDFInstalled, setJsPDFInstalled] = useState(true);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Monthly Credit Report',
      nextDate: '19 Apr 2026',
      frequency: 'monthly',
      active: true,
    },
  ]);
  const [preferences, setPreferences] = useState<AlertPreferences>({
    paymentReminders: true,
    creditScoreChanges: true,
    spendingAlerts: false,
    monthlyReports: true,
  });
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', frequency: 'monthly' as const, active: true });

  // Recalculate metrics when transactions change from context
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      return;
    }

    const scoreResult = calculateCreditScore(transactions, creditScore);
    setCreditScore(scoreResult.score);
    setRiskLevel(scoreResult.riskLevel);
    setScoreMetrics(scoreResult.metrics);

    const newMetrics = calculateFinancialMetrics(transactions);
    setMetrics(newMetrics);

    const dynamicAlerts = generateDynamicAlerts(transactions, scoreResult.score, scoreResult.score);
    setAlerts(dynamicAlerts);
  }, [transactions]);

  const handleGenerateCreditReport = async () => {
    setIsGenerating(true);
    try {
      await generateCreditReport(creditScore, riskLevel, metrics, transactions, scoreMetrics);
    } catch (error) {
      setJsPDFInstalled(false);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMonthlyReport = async () => {
    setIsGenerating(true);
    try {
      await generateMonthlyReport(metrics, transactions);
    } catch (error) {
      setJsPDFInstalled(false);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTransactionReport = async () => {
    setIsGenerating(true);
    try {
      await generateTransactionHistory(transactions);
    } catch (error) {
      setJsPDFInstalled(false);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleNewReport = () => {
    const newReport: ScheduledReport = {
      id: Date.now().toString(),
      name: 'New Scheduled Report',
      nextDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
      frequency: 'monthly',
      active: true,
    };
    setScheduledReports([...scheduledReports, newReport]);
    alert('New report scheduled successfully!');
  };

  const handleEditSchedule = (id: string) => {
    const report = scheduledReports.find(r => r.id === id);
    if (report) {
      setEditingReport(report);
      setEditFormData({
        name: report.name,
        frequency: report.frequency,
        active: report.active,
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingReport) {
      setScheduledReports(scheduledReports.map(report =>
        report.id === editingReport.id
          ? {
              ...report,
              name: editFormData.name,
              frequency: editFormData.frequency,
              active: editFormData.active,
            }
          : report
      ));
      setEditingReport(null);
      alert('Schedule updated successfully!');
    }
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  const handleDeleteSchedule = (id: string) => {
    setScheduledReports(scheduledReports.filter(report => report.id !== id));
    alert('Scheduled report deleted');
  };

  const handleTogglePreference = (preference: keyof AlertPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Alerts</h1>
        <p className="text-gray-600 mt-2">Generate comprehensive reports and manage your notification preferences.</p>
      </div>

      {!jsPDFInstalled && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">PDF Generation Not Available</h3>
            <p className="text-sm text-red-700 mt-1">
              To enable PDF downloads, install the required packages:
            </p>
            <code className="text-xs bg-red-100 text-red-900 px-2 py-1 rounded mt-2 block">
              npm install jspdf html2canvas
            </code>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Credit Reports */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Credit Reports</h2>
            </div>

            <div className="space-y-6">
              {/* Comprehensive Credit Report */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Credit Report</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Complete financial profile with credit score, transaction analysis, component scores, and personalized recommendations based on LightGBM analysis.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    📊 Credit Score: {creditScore} | Risk: {riskLevel}
                  </div>
                  <button
                    onClick={handleGenerateCreditReport}
                    disabled={isGenerating || !jsPDFInstalled}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>

              {/* Monthly Summary Report */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Summary Report</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Key metrics and trends for the current month. Includes income, expenses, savings rate, and category-wise spending breakdown.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    💰 Income: ₹{metrics.averageIncome.toLocaleString()} | Expenses: ₹{metrics.averageExpenses.toLocaleString()}
                  </div>
                  <button
                    onClick={handleGenerateMonthlyReport}
                    disabled={isGenerating || !jsPDFInstalled}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>

              {/* Transaction History Report */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction History Report</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Detailed breakdown of all categorized transactions. Includes transaction dates, descriptions, amounts, categories, and type classifications.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    📋 Total Transactions: {transactions.length}
                  </div>
                  <button
                    onClick={handleGenerateTransactionReport}
                    disabled={isGenerating || !jsPDFInstalled}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.slice(0, 10).length > 0 ? (
                alerts.slice(0, 10).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg text-sm ${
                      alert.type === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                        : alert.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-blue-50 border border-blue-200 text-blue-800'
                    }`}
                  >
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(alert.timestamp).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No alerts</p>
              )}
            </div>
            <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 block">
              View All Alerts History →
            </a>
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Scheduled Reports</h2>

        <div className="space-y-4 mb-8">
          {scheduledReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">Next report: {report.nextDate}</p>
                  <p className="text-gray-500 text-xs mt-1">Frequency: {report.frequency}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {report.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => handleEditSchedule(report.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit Schedule
                </button>
                <button 
                  onClick={() => handleDeleteSchedule(report.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleScheduleNewReport}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
        >
          <p className="text-gray-600 font-medium">+ Schedule New Report</p>
        </button>
      </div>

      {/* Alert Preferences */}
      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Alert Preferences</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Payment Reminders</h3>
              <p className="text-sm text-gray-600">Get notified before EMI due dates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={preferences.paymentReminders}
                onChange={() => handleTogglePreference('paymentReminders')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Credit Score Changes</h3>
              <p className="text-sm text-gray-600">Alert when your score changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={preferences.creditScoreChanges}
                onChange={() => handleTogglePreference('creditScoreChanges')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Spending Alerts</h3>
              <p className="text-sm text-gray-600">Notify when spending exceeds budget</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={preferences.spendingAlerts}
                onChange={() => handleTogglePreference('spendingAlerts')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Reports</h3>
              <p className="text-sm text-gray-600">Receive monthly financial summary</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={preferences.monthlyReports}
                onChange={() => handleTogglePreference('monthlyReports')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      {editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Report Schedule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={editFormData.frequency}
                  onChange={(e) => setEditFormData({ ...editFormData, frequency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={editFormData.active}
                  onChange={(e) => setEditFormData({ ...editFormData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;