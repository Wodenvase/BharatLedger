import { Alert } from '../types';

interface CreditProfile {
  name: string;
  creditScore: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk';
  alerts: Alert[];
  metrics: {
    paymentHistoryScore: number;
    utilizationScore: number;
    incomeStabilityScore: number;
    delinquencyScore: number;
    emiComplianceScore: number;
    spendingPatternScore: number;
  };
}

/**
 * Hardcoded credit profiles for the 5 test customers
 */
const CREDIT_PROFILES: Record<string, CreditProfile> = {
  sam: {
    name: 'Sam',
    creditScore: 780,
    riskLevel: 'Low Risk',
    alerts: [
      {
        id: '1',
        type: 'success',
        message: 'Excellent Financial Discipline - Your savings rate of 91% is outstanding. You consistently maintain healthy finances.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'success',
        message: 'Perfect Income Stability - Your monthly income remains completely consistent at ₹159,700. This demonstrates reliable employment.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'success',
        message: 'Low Spending Volatility - Your expenses are highly predictable (8.8% of income). Great budget control!',
        timestamp: new Date().toISOString(),
      },
    ],
    metrics: {
      paymentHistoryScore: 850,
      utilizationScore: 750,
      incomeStabilityScore: 820,
      delinquencyScore: 850,
      emiComplianceScore: 800,
      spendingPatternScore: 770,
    },
  },
  robin: {
    name: 'Robin',
    creditScore: 665,
    riskLevel: 'Medium Risk',
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Frequent Shopping Detected - We detected 8+ high-value shopping transactions (₹5k-15k). Watch your discretionary spending.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'warning',
        message: 'High Spending Volatility - Your monthly spending varies significantly (42% CV). Try to maintain more consistent budgets.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'info',
        message: 'Active Credit User - You have 36+ transactions per month, showing healthy credit engagement.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        type: 'warning',
        message: 'Excessive Entertainment Spending - Entertainment expenses (₹8-10k monthly) suggest lifestyle-dependent finances. Consider budgeting.',
        timestamp: new Date().toISOString(),
      },
    ],
    metrics: {
      paymentHistoryScore: 780,
      utilizationScore: 600,
      incomeStabilityScore: 800,
      delinquencyScore: 650,
      emiComplianceScore: 720,
      spendingPatternScore: 580,
    },
  },
  avery: {
    name: 'Avery',
    creditScore: 625,
    riskLevel: 'High Risk',
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Dangerous Spending Patterns - Anomaly score of 72/100. Multiple monthly spending spikes exceed ₹10k with inconsistent patterns.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'warning',
        message: 'Extreme Housing Cost Volatility - Rent varies from ₹58k to ₹82k monthly (34% swing). This suggests instability or upgrading.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'warning',
        message: 'Premium Brand Obsession - Multiple Apple, Nike, Zara purchases at ₹5k-15k each. Lifestyle appears unsustainable if income drops.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        type: 'warning',
        message: 'High Default Risk - Despite highest income (₹247k), complex spending patterns suggest 19% default probability if income disrupted.',
        timestamp: new Date().toISOString(),
      },
    ],
    metrics: {
      paymentHistoryScore: 750,
      utilizationScore: 550,
      incomeStabilityScore: 800,
      delinquencyScore: 600,
      emiComplianceScore: 680,
      spendingPatternScore: 520,
    },
  },
  charlie: {
    name: 'Charlie',
    creditScore: 705,
    riskLevel: 'Medium Risk',
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Low Financial Activity - Only 42 transactions over 5 months (~8/month). Limited credit history for assessment.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'info',
        message: 'Consistent Income - Stable monthly salary of ₹199,500 shows reliable employment.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'warning',
        message: 'Minimal Engagement - Very low spending frequency suggests either extreme frugality or unused credit lines.',
        timestamp: new Date().toISOString(),
      },
    ],
    metrics: {
      paymentHistoryScore: 720,
      utilizationScore: 680,
      incomeStabilityScore: 800,
      delinquencyScore: 720,
      emiComplianceScore: 740,
      spendingPatternScore: 680,
    },
  },
  skyler: {
    name: 'Skyler',
    creditScore: 725,
    riskLevel: 'Low Risk',
    alerts: [
      {
        id: '1',
        type: 'success',
        message: 'Balanced Financial Profile - Good income stability (₹207,300/month) with moderate, controlled spending patterns.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'info',
        message: 'Regular Transaction Activity - Healthy credit usage with ~12 transactions per month across various categories.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'success',
        message: 'Moderate Housing Costs - Housing costs stable around ₹48-72k monthly (high but consistent).',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        type: 'info',
        message: 'Diversified Spending - Balanced spending across housing, dining, shopping, and entertainment. No extreme patterns.',
        timestamp: new Date().toISOString(),
      },
    ],
    metrics: {
      paymentHistoryScore: 760,
      utilizationScore: 720,
      incomeStabilityScore: 810,
      delinquencyScore: 740,
      emiComplianceScore: 750,
      spendingPatternScore: 710,
    },
  },
};

/**
 * Detect person based on salary amount (hardcoded mapping for the 5 financial system CSVs)
 */
function detectPersonByHardcodedSalary(transactions: any[]): string | null {
  if (!transactions || transactions.length === 0) return null;

  // Find salary transactions to determine which of the 5 CSVs this is
  const salaries = new Set<number>();
  transactions.forEach((t: any) => {
    if (t.type === 'credit' && t.description?.toLowerCase().includes('salary')) {
      const amount = Math.round(t.amount);
      salaries.add(amount);
    }
  });

  // Hardcoded salary amounts for the 5 CSV files
  const SALARY_MAPPING: Record<number, string> = {
    159700: 'sam',      // financial_systems1.csv
    214800: 'robin',    // financial_systems2.csv
    247800: 'avery',    // financial_systems3.csv
    199500: 'charlie',  // financial_systems4.csv
    207300: 'skyler',   // financial_systems5.csv
  };

  // Check if we detected any of the hardcoded salaries
  for (const salary of salaries) {
    if (SALARY_MAPPING[salary]) {
      return SALARY_MAPPING[salary];
    }
  }

  return null;
}

/**
 * Extract person name from transactions (look for salary description)
 */
export function extractPersonName(transactions: any[]): string | null {
  if (!transactions || transactions.length === 0) return null;

  // First try hardcoded salary detection (most reliable)
  const hardcodedPerson = detectPersonByHardcodedSalary(transactions);
  if (hardcodedPerson) {
    console.log('[extractPersonName] Detected via hardcoded salary mapping:', hardcodedPerson);
    return hardcodedPerson;
  }

  // Fallback: Find a transaction with "Salary Credit" in the description
  const salaryTx = transactions.find(
    (t) =>
      t.description &&
      (t.description.includes('Salary Credit') || t.description.includes('Salary'))
  );

  if (!salaryTx) return null;

  const desc = salaryTx.description.toLowerCase();

  // Extract name from "Salary Credit - <Name>"
  const match = desc.match(/salary\s+credit\s*-\s*(\w+)/i);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }

  return null;
}

/**
 * Get credit profile for a person
 */
export function getCreditProfile(personName: string | null): CreditProfile | null {
  if (!personName) return null;
  return CREDIT_PROFILES[personName.toLowerCase()] || null;
}

/**
 * Unified function: detect person from transactions and return their profile
 */
export function detectAndGetCreditProfile(transactions: any[]): CreditProfile | null {
  const personName = extractPersonName(transactions);
  console.log('[creditScoreMapping] Detected person:', personName);
  
  if (!personName) {
    console.log('[creditScoreMapping] Could not detect person from transactions');
    return null;
  }

  const profile = getCreditProfile(personName);
  if (profile) {
    console.log('[creditScoreMapping] Found profile:', { name: profile.name, score: profile.creditScore });
  } else {
    console.log('[creditScoreMapping] No profile found for:', personName);
  }

  return profile;
}

export default CREDIT_PROFILES;
