import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '../types';
import { mockTransactions } from '../data/mockData';

interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransactions: (newTransactions: Transaction[]) => void;
  clearTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const STORAGE_KEY = 'app_transactions';

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or use mock data
  const [transactions, setTransactionsState] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('[TransactionContext] INIT - Loaded from localStorage:', { count: parsed.length, firstTx: parsed?.[0] });
        return parsed;
      } catch (e) {
        console.error('[TransactionContext] Failed to parse stored transactions:', e);
        return mockTransactions;
      }
    }
    console.log('[TransactionContext] INIT - Using mock transactions:', { count: mockTransactions.length });
    return mockTransactions;
  });

  // Persist to localStorage AND dispatch event whenever transactions change
  useEffect(() => {
    console.log('[TransactionContext] UPDATE - Saving to localStorage:', { count: transactions.length, hasCredits: transactions.some(t => t.type === 'credit'), hasDebits: transactions.some(t => t.type === 'debit') });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    
    // Dispatch event for any component that wants to listen
    const event = new CustomEvent('transactionsUpdated', { detail: transactions });
    window.dispatchEvent(event);
  }, [transactions]);

  const setTransactions = (newTransactions: Transaction[]) => {
    setTransactionsState(newTransactions);
  };

  const addTransactions = (newTransactions: Transaction[]) => {
    console.log('[TransactionContext] ADD - Adding new transactions:', { newCount: newTransactions.length });
    setTransactionsState(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const filtered = newTransactions.filter(n => !existingIds.has(n.id));
      const merged = [...filtered, ...prev];
      console.log('[TransactionContext] ADD - Merged result:', { totalCount: merged.length, newAdded: filtered.length });
      return merged;
    });
  };

  const clearTransactions = () => {
    setTransactionsState(mockTransactions);
  };

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions, addTransactions, clearTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

/**
 * Hook to use transaction context
 */
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
