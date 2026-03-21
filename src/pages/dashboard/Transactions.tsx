import React from 'react';
import TransactionTable from '../../components/dashboard/TransactionTable';
import CSVImporter from '../../components/shared/CSVImporter';
import { Transaction } from '../../types';
import { useTransactions } from '../../context/TransactionContext';

const Transactions: React.FC = () => {
  const { transactions, addTransactions } = useTransactions();

  function handleImport(newTxs: Transaction[]) {
    if (newTxs.length === 0) {
      alert('No valid transactions found in the CSV file.');
      return;
    }
    addTransactions(newTxs);
    alert(`Successfully imported ${newTxs.length} new transaction(s)!`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Analysis</h1>
        <p className="text-gray-600 mt-2">
          Detailed view of all your transactions with advanced filtering and search capabilities.
        </p>
      </div>

      <CSVImporter onImport={handleImport} />

      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default Transactions;