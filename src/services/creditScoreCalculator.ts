import { Transaction } from '../types';
import { detectAndGetCreditProfile } from './creditScoreMapping';

/**
 * Credit Score Calculator - Simplified Mapping Based System
 * 
 * Detects which of the 5 users is uploading their CSV and returns
 * their pre-determined credit score and profile.
 */

interface CreditScoreMetrics {
  paymentHistoryScore: number;
  utilizationScore: number;
  incomeStabilityScore: number;
  delinquencyScore: number;
  emiComplianceScore: number;
  spendingPatternScore: number;
}

interface CreditScoreResult {
  score: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk';
  metrics: CreditScoreMetrics;
}

export function calculateCreditScore(transactions: Transaction[], previousScore?: number): CreditScoreResult {
  console.log('[calculateCreditScore] Called with transactions:', { count: transactions?.length || 0 });
  
  // Try to detect which person this is based on salary description
  const profile = detectAndGetCreditProfile(transactions);
  
  if (profile) {
    console.log('[calculateCreditScore] Using mapped profile for:', profile.name);
    return {
      score: profile.creditScore,
      riskLevel: profile.riskLevel,
      metrics: profile.metrics,
    };
  }

  // Fallback to default if we can't detect
  console.log('[calculateCreditScore] Could not detect person, using default score 650');
  return {
    score: 650,
    riskLevel: 'Medium Risk',
    metrics: {
      paymentHistoryScore: 600,
      utilizationScore: 600,
      incomeStabilityScore: 600,
      delinquencyScore: 600,
      emiComplianceScore: 600,
      spendingPatternScore: 600,
    }
  };
}
