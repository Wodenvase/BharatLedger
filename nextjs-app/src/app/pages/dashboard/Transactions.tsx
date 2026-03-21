import React from 'react';
import TransactionTable from '../../components/dashboard/TransactionTable';
import { mockTransactions } from '../../data/mockData';

const Transactions: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Analysis</h1>
        <p className="text-gray-600 mt-2">
          Detailed view of all your transactions with advanced filtering and search capabilities.
        </p>
      </div>

      <TransactionTable transactions={mockTransactions} />
    </div>
  );
};

export default Transactions;