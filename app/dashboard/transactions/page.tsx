'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  limit: number;
  offset: number;
  totalAmount: number;
  hasMore: boolean;
}

export default function TransactionsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchTransactions();
    }
  }, [status, router]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/transactions?limit=100');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch transactions');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction Analysis</h1>
          <p className="text-gray-600 mt-2">
            Detailed view of all your transactions with advanced filtering and search capabilities.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction Analysis</h1>
          <p className="text-gray-600 mt-2">
            Detailed view of all your transactions with advanced filtering and search capabilities.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchTransactions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Analysis</h1>
        <p className="text-gray-600 mt-2">
          Detailed view of all your transactions with advanced filtering and search capabilities.
        </p>
        {data && (
          <p className="text-sm text-gray-500 mt-1">
            Showing {data.transactions.length} of {data.total} transactions
          </p>
        )}
      </div>

      {data && <TransactionTable transactions={data.transactions} />}
    </div>
  );
}
