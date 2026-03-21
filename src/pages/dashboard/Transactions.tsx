import React from 'react';
import { Trash2, Upload } from 'lucide-react';
import TransactionTable from '../../components/dashboard/TransactionTable';
import CSVImporter from '../../components/shared/CSVImporter';
import { Transaction } from '../../types';
import { useTransactions } from '../../context/TransactionContext';

const Transactions: React.FC = () => {
  const { transactions, addTransactions, setTransactions } = useTransactions();

  function handleImport(newTxs: Transaction[]) {
    if (newTxs.length === 0) {
      alert('No valid transactions found in the CSV file.');
      return;
    }
    addTransactions(newTxs);
    alert(`Successfully imported ${newTxs.length} new transaction(s)!`);
  }

  function handleDeleteTransactions() {
    if (transactions.length === 0) {
      alert('No transactions to delete.');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete all ${transactions.length} transactions? This action cannot be undone.`);
    if (confirmed) {
      setTransactions([]);
      alert('All transactions have been deleted.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Analysis</h1>
        <p className="text-gray-600 mt-2">
          Detailed view of all your transactions with advanced filtering and search capabilities.
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <button
          onClick={handleDeleteTransactions}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Trash2 className="h-4 w-4" />
          Delete All Transactions
        </button>
      </div>

      <CSVImporter onImport={handleImport} />

      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default Transactions;