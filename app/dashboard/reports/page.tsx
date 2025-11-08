'use client';

import React from 'react';
import { Download, Bell, FileText, Calendar } from 'lucide-react';
import AlertCard from '@/components/dashboard/AlertCard';
import { mockAlerts } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';

const Reports= () => {
  const generateReport = () => {
    alert('PDF report generation would be implemented here. This would create a professional credit report PDF.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Alerts</h1>
        <p className="text-gray-600 mt-2">
          Generate comprehensive reports and manage your notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report Generation */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Credit Reports
            </h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive Credit Report</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Complete financial profile with credit score, transaction analysis, and recommendations
                    </p>
                  </div>
                  <button
                    onClick={generateReport}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Monthly Summary Report</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Key metrics and trends for the current month
                    </p>
                  </div>
                  <button
                    onClick={generateReport}
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Transaction History Report</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Detailed breakdown of all categorized transactions
                    </p>
                  </div>
                  <button
                    onClick={generateReport}
                    className="border border-gray-600 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Scheduled Reports
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Monthly Credit Report</h3>
                  <p className="text-gray-600 text-sm">Next report: {formatDate(new Date(Date.now() + 30*24*60*60*1000).toISOString())}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-sm font-medium">Active</span>
                  <button className="text-blue-600 text-sm hover:underline">Edit</button>
                </div>
              </div>
              
              <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                + Schedule New Report
              </button>
            </div>
          </div>
        </div>

        {/* Alerts History */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Alerts
            </h2>
            
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
            
            <button className="w-full mt-4 text-blue-600 hover:text-blue-800 transition-colors">
              View All Alerts History
            </button>
          </div>

          {/* Alert Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Alert Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Payment Reminders</h3>
                  <p className="text-gray-600 text-sm">Get notified before EMI due dates</p>
                </div>
                <button className="bg-blue-600 rounded-full w-12 h-6 flex items-center justify-end px-1 transition-colors">
                  <div className="bg-white w-4 h-4 rounded-full"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Credit Score Changes</h3>
                  <p className="text-gray-600 text-sm">Alert when your score changes</p>
                </div>
                <button className="bg-blue-600 rounded-full w-12 h-6 flex items-center justify-end px-1 transition-colors">
                  <div className="bg-white w-4 h-4 rounded-full"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Spending Alerts</h3>
                  <p className="text-gray-600 text-sm">Notify when spending exceeds budget</p>
                </div>
                <button className="bg-gray-300 rounded-full w-12 h-6 flex items-center px-1 transition-colors">
                  <div className="bg-white w-4 h-4 rounded-full"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Monthly Reports</h3>
                  <p className="text-gray-600 text-sm">Receive monthly financial summary</p>
                </div>
                <button className="bg-blue-600 rounded-full w-12 h-6 flex items-center justify-end px-1 transition-colors">
                  <div className="bg-white w-4 h-4 rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Reports;
