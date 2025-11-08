'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Upload, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Account {
  id: string;
  sourceName: string;
  connected: boolean;
  lastUploaded: string | null;
  createdAt: string;
}

export default function DataSourcesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAccountId, setUploadingAccountId] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/accounts');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAccounts();
    }
  }, [status, fetchAccounts]);

  const handleFileSelect = async (accountId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setUploadMessage({ type: 'error', text: 'Please select a CSV file' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage({ type: 'error', text: 'File size must be less than 10MB' });
      return;
    }

    setUploadingAccountId(accountId);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountId', accountId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadMessage({ 
        type: 'success', 
        text: `Successfully uploaded ${file.name}` 
      });

      // Refresh accounts to show updated status
      await fetchAccounts();
    } catch (err) {
      setUploadMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Upload failed' 
      });
      console.error('Upload error:', err);
    } finally {
      setUploadingAccountId(null);
      // Reset file input
      event.target.value = '';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <XCircle className="text-red-600" size={24} />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Data Sources</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Sources</h1>
          <p className="text-gray-600">
            Upload your bank statement CSVs to analyze your financial data
          </p>
        </div>

        {/* Upload Message */}
        {uploadMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            uploadMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {uploadMessage.type === 'success' ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <p className={uploadMessage.type === 'success' ? 'text-green-900' : 'text-red-900'}>
              {uploadMessage.text}
            </p>
          </div>
        )}

        {/* Accounts List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-xl font-semibold text-white">Your Accounts</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {accounts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
                <p className="text-gray-600">
                  Please contact support to set up your accounts
                </p>
              </div>
            ) : (
              accounts.map((account) => (
                <div key={account.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {account.sourceName}
                        </h3>
                        <div className="flex items-center gap-1">
                          {account.connected ? (
                            <>
                              <CheckCircle2 className="text-green-600" size={16} />
                              <span className="text-sm text-green-600 font-medium">Connected</span>
                            </>
                          ) : (
                            <>
                              <Clock className="text-gray-400" size={16} />
                              <span className="text-sm text-gray-500">Not connected</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Last uploaded:</span>{' '}
                          {formatDate(account.lastUploaded)}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {formatDate(account.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <label
                        htmlFor={`file-upload-${account.id}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                          uploadingAccountId === account.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                        }`}
                      >
                        {uploadingAccountId === account.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            Upload CSV
                          </>
                        )}
                      </label>
                      <input
                        id={`file-upload-${account.id}`}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFileSelect(account.id, e)}
                        disabled={uploadingAccountId !== null}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>File must be in CSV format (.csv extension)</li>
                <li>Maximum file size: 10MB</li>
                <li>Ensure your bank statement includes transaction details</li>
                <li>Your data is encrypted and stored securely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
