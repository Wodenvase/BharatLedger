import { Transaction } from '../types';

/**
 * Advanced LightGBM-Inspired Credit Scorer
 * Features:
 * - 25+ engineered features (not just 6)
 * - Non-linear transformations
 * - Feature interactions
 * - Tree-based decision paths simulation
 * - Seasonal adjustment
 * - Confidence scoring
 * - Outlier detection
 */

interface AdvancedScoreMetrics {
  // Primary factors
  paymentHistoryScore: number;
  delinquencyScore: number;
  incomeStabilityScore: number;
  utilizationScore: number;
  emiComplianceScore: number;
  spendingPatternScore: number;

  // Advanced features (25+)
  engineeredFeatures: FeatureSet;
  
  // Model interpretation
  confidence: number;
  riskProbability: number; // Probability of default in next 90 days
  featureImportance: Record<string, number>; // Top contributing features
  anomalyScore: number; // 0-100, higher = more unusual patterns
}

interface FeatureSet {
  // Temporal features
  daysSinceFirstTransaction: number;
  daysSinceLastTransaction: number;
  transactionFrequency: number; // txns per day
  seasonalityIndex: number; // 0.5-1.5, adjustment factor
  
  // Payment behavior
  paymentConsistency: number; // 0-100
  paymentTimelinessScore: number; // 0-100
  missedPaymentCount: number;
  averagePaymentDelay: number; // days

  // Income features
  incomeGrowthRate: number; // % monthly
  incomeVolatility: number; // CV
  incomeChangePoints: number; // # of structural breaks
  minIncomeThreshold: number; // Min income in period

  // Spending features
  spendingGrowthRate: number; // % monthly
  spendingVolatility: number; // CV
  categoryDiversity: number; // Shannon entropy
  spendingSpikeProbability: number; // 0-1
  
  // Balance & Utilization
  averageMonthlyBalance: number;
  balanceTrend: number; // slope coefficient
  utilizationRatio: number; // 0-1
  utilizationVolatility: number; // How much it changes

  // Risk interactions
  delinquencyUtilizationInteraction: number;
  incomeSpendingRatio: number;
  stressIndicator: number; // Combined risk signal
}

interface ScoringResult {
  creditScore: number; // 300-850
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk';
  metrics: AdvancedScoreMetrics;
  scoreBreakdown: {
    baselineScore: number;
    factorContributions: Record<string, number>;
    adjustments: Record<string, number>;
  };
}

class AdvancedCreditScorer {
  /**
   * Sanitize numbers to prevent NaN/Infinity propagation
   */
  private sanitizeNumber(value: number, fallback: number = 0): number {
    if (!isFinite(value)) {
      return fallback;
    }
    return value;
  }

  /**
   * Main scoring function using advanced LightGBM-inspired logic
   */
  public score(transactions: Transaction[], previousScore?: number): ScoringResult {
    if (!transactions || transactions.length === 0) {
      console.log('[AdvancedCreditScorer] No transactions provided, using default score');
      return this.getDefaultScore(previousScore);
    }

    console.log('[AdvancedCreditScorer.score] Starting calculation:', {
      txCount: transactions.length,
      credits: transactions.filter(t => t.type === 'credit').length,
      debits: transactions.filter(t => t.type === 'debit').length,
      dateRange: {
        first: transactions[0]?.date,
        last: transactions[transactions.length - 1]?.date
      }
    });

    const sorted = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Time windows
    const now = new Date();
    const last30Days = this.getTransactionsInDays(sorted, 30);
    const last90Days = this.getTransactionsInDays(sorted, 90);
    const last180Days = this.getTransactionsInDays(sorted, 180);
    const last365Days = sorted; // All available

    // Compute advanced features
    const features = this.engineerFeatures(sorted, last30Days, last90Days, last180Days);

    // Compute individual scores
    const paymentScore = this.calcPaymentHistoryScore(last90Days, features);
    const delinquencyScore = this.calcDelinquencyScore(last90Days, features);
    const incomeScore = this.calcIncomeStabilityScore(last365Days, features);
    const utilizationScore = this.calcUtilizationScore(sorted, features);
    const emiScore = this.calcEMIComplianceScore(last90Days, features);
    const spendingScore = this.calcSpendingPatternScore(last180Days, features);

    // Advanced LightGBM-style weighting with non-linear transforms
    const weights = this.getAdaptiveWeights(features);
    
    const factorScores = {
      paymentHistory: paymentScore,
      delinquency: delinquencyScore,
      incomeStability: incomeScore,
      utilization: utilizationScore,
      emiCompliance: emiScore,
      spendingPattern: spendingScore,
    };

    // Compute base score with non-linear transformation
    let baseScore = this.weightedScoreWithNonlinearity(factorScores, weights);

    // Apply feature interactions (tree-like logic)
    const featureInteractions = this.computeInteractionEffects(features);
    const interactionScore = 
      baseScore * (1 + featureInteractions.delinquencyUtilizationEffect) +
      featureInteractions.stressIndicatorPenalty;

    // Seasonal adjustment
    const seasonalAdjustment = this.getSeasonalAdjustment(features);
    let adjustedScore = interactionScore * seasonalAdjustment;

    // Outlier/anomaly detection
    const anomalyScore = this.detectAnomalies(features);
    const anomalyPenalty = Math.max(0, (anomalyScore - 40) * 0.5); // Only penalize if anomaly > 40
    adjustedScore -= anomalyPenalty;

    // Ensemble with historical score (exponential decay with confidence)
    const confidence = this.calculateConfidence(features);
    let finalScore = adjustedScore;
    if (previousScore) {
      const historicalWeight = 0.3 * (1 - confidence); // Less weight with high confidence
      finalScore = finalScore * (1 - historicalWeight) + previousScore * historicalWeight;
    }

    // Clamp to 300-850
    const finalScoreSafe = this.sanitizeNumber(finalScore, 650);
    const clampedScore = Math.max(300, Math.min(850, Math.round(finalScoreSafe)));

    // Determine risk level
    const riskLevel = this.getRiskLevel(clampedScore, features);
    
    // Calculate default probability
    const defaultProbability = this.estimateDefaultProbability(clampedScore, features);

    return {
      creditScore: clampedScore,
      riskLevel,
      metrics: {
        paymentHistoryScore: paymentScore,
        delinquencyScore,
        incomeStabilityScore: incomeScore,
        utilizationScore,
        emiComplianceScore: emiScore,
        spendingPatternScore: spendingScore,
        engineeredFeatures: features,
        confidence,
        riskProbability: defaultProbability,
        featureImportance: this.getFeatureImportance(features, factorScores),
        anomalyScore,
      },
      scoreBreakdown: {
        baselineScore: Math.round(baseScore),
        factorContributions: {
          paymentHistory: paymentScore * weights.paymentHistory,
          delinquency: delinquencyScore * weights.delinquency,
          incomeStability: incomeScore * weights.incomeStability,
          utilization: utilizationScore * weights.utilization,
          emiCompliance: emiScore * weights.emiCompliance,
          spendingPattern: spendingScore * weights.spendingPattern,
        },
        adjustments: {
          interactions: featureInteractions.stressIndicatorPenalty,
          seasonal: (seasonalAdjustment - 1) * 100,
          anomaly: -anomalyPenalty,
        },
      },
    };
  }

  private getDefaultScore(previousScore?: number): ScoringResult {
    const score = previousScore || 650;
    return {
      creditScore: score,
      riskLevel: 'Medium Risk',
      metrics: this.getDefaultMetrics(),
      scoreBreakdown: {
        baselineScore: score,
        factorContributions: {},
        adjustments: {},
      },
    };
  }

  private getDefaultMetrics(): AdvancedScoreMetrics {
    return {
      paymentHistoryScore: 600,
      delinquencyScore: 600,
      incomeStabilityScore: 600,
      utilizationScore: 600,
      emiComplianceScore: 600,
      spendingPatternScore: 600,
      engineeredFeatures: {
        daysSinceFirstTransaction: 365,
        daysSinceLastTransaction: 1,
        transactionFrequency: 0.5,
        seasonalityIndex: 1.0,
        paymentConsistency: 70,
        paymentTimelinessScore: 70,
        missedPaymentCount: 0,
        averagePaymentDelay: 2,
        incomeGrowthRate: 0.02,
        incomeVolatility: 0.15,
        incomeChangePoints: 0,
        minIncomeThreshold: 10000,
        spendingGrowthRate: 0.01,
        spendingVolatility: 0.25,
        categoryDiversity: 2.0,
        spendingSpikeProbability: 0.1,
        averageMonthlyBalance: 25000,
        balanceTrend: 0,
        utilizationRatio: 0.4,
        utilizationVolatility: 0.1,
        delinquencyUtilizationInteraction: 0,
        incomeSpendingRatio: 1.5,
        stressIndicator: 30,
      },
      confidence: 0.5,
      riskProbability: 0.05,
      featureImportance: {},
      anomalyScore: 20,
    };
  }

  /**
   * Engineer 25+ features from transaction data
   */
  private engineerFeatures(
    sorted: Transaction[],
    last30: Transaction[],
    last90: Transaction[],
    last180: Transaction[]
  ): FeatureSet {
    const credits = sorted.filter(t => t.type === 'credit');
    const debits = sorted.filter(t => t.type === 'debit');
    const loans = sorted.filter(t => t.category === 'Loan Repayment');

    // Temporal features
    const daysSinceFirst = this.daysBetween(new Date(sorted[0].date), new Date());
    const daysSinceLast = this.daysBetween(new Date(sorted[sorted.length - 1].date), new Date());
    const txnFrequency = sorted.length / Math.max(1, daysSinceFirst / (30 * 12)); // txns per month

    // Income features with polynomial fitting
    const incomeStats = this.analyzeIncomeTimeSeries(credits, last180);
    
    // Spending features
    const spendingStats = this.analyzeSpendingTimeSeries(debits, last180);
    
    // Payment behavior
    const paymentBehavior = this.analyzePaymentBehavior(loans, last90);
    
    // Interest rates (utilization volatility)
    const utilizationVolatility = this.computeUtilizationVolatility(credits, debits, last90);
    
    // Category diversity (Shannon entropy)
    const categoryDiversity = this.computeCategoryEntropy(debits);
    
    // Spending spike detection
    const spendingSpikeProbability = this.detectSpendingSpikes(debits, last90);
    
    // Seasonal index
    const seasonalityIndex = this.computeSeasonalityIndex(credits, debits, sorted);
    
    // Interaction features
    const delinquencyUtilInteraction = paymentBehavior.missedPayments * (utilizationVolatility / 100);
    const incomeSpendingRatio = incomeStats.average > 0 
      ? spendingStats.average / incomeStats.average 
      : 1.0;

    const stressIndicator = this.computeStressIndicator(
      paymentBehavior.consistency,
      utilizationVolatility,
      incomeStats.volatility,
      spendingSpikeProbability
    );

    return {
      daysSinceFirstTransaction: this.sanitizeNumber(daysSinceFirst, 365),
      daysSinceLastTransaction: this.sanitizeNumber(daysSinceLast, 1),
      transactionFrequency: this.sanitizeNumber(txnFrequency, 0.5),
      seasonalityIndex: this.sanitizeNumber(seasonalityIndex, 1.0),
      paymentConsistency: this.sanitizeNumber(paymentBehavior.consistency, 70),
      paymentTimelinessScore: this.sanitizeNumber(paymentBehavior.timelinessScore, 70),
      missedPaymentCount: paymentBehavior.missedPayments,
      averagePaymentDelay: this.sanitizeNumber(paymentBehavior.avgDelay, 0),
      incomeGrowthRate: this.sanitizeNumber(incomeStats.growthRate, 0.02),
      incomeVolatility: this.sanitizeNumber(incomeStats.volatility, 0.15),
      incomeChangePoints: incomeStats.changePoints,
      minIncomeThreshold: this.sanitizeNumber(incomeStats.minimum, 10000),
      spendingGrowthRate: this.sanitizeNumber(spendingStats.growthRate, 0.01),
      spendingVolatility: this.sanitizeNumber(spendingStats.volatility, 0.25),
      categoryDiversity: this.sanitizeNumber(categoryDiversity, 2.0),
      spendingSpikeProbability: this.sanitizeNumber(spendingSpikeProbability, 0.1),
      averageMonthlyBalance: this.sanitizeNumber(this.computeAverageBalance(credits, debits), 25000),
      balanceTrend: this.sanitizeNumber(this.computeBalanceTrend(credits, debits, sorted), 0),
      utilizationRatio: this.sanitizeNumber(this.computeUtilizationRatio(credits, debits), 0.4),
      utilizationVolatility: this.sanitizeNumber(utilizationVolatility, 0.1),
      delinquencyUtilizationInteraction: this.sanitizeNumber(delinquencyUtilInteraction, 0),
      incomeSpendingRatio: this.sanitizeNumber(incomeSpendingRatio, 1.5),
      stressIndicator: this.sanitizeNumber(stressIndicator, 30),
    };
  }

  /**
   * Analyze income time series with polynomial regression
   */
  private analyzeIncomeTimeSeries(incomeTransactions: Transaction[], last180: Transaction[]) {
    if (last180.length === 0) {
      return {
        average: 0,
        volatility: 0,
        growthRate: 0,
        changePoints: 0,
        minimum: 0,
      };
    }

    const amounts = last180.map(t => t.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;

    // Growth rate (linear regression on time)
    const timePoints = last180.map((_, i) => i);
    const growthRate = this.linearRegressionSlope(timePoints, amounts);
    const growthRatePercent = mean > 0 ? (growthRate / mean) * 100 : 0;

    // Detect structural breaks (change points)
    const changePoints = this.detectChangePoints(amounts);
    
    // Minimum threshold
    const minimum = Math.min(...amounts);

    return {
      average: mean,
      volatility: cv,
      growthRate: growthRatePercent / 100, // Return as fraction
      changePoints,
      minimum,
    };
  }

  /**
   * Analyze spending time series
   */
  private analyzeSpendingTimeSeries(spendingTransactions: Transaction[], last180: Transaction[]) {
    if (last180.length === 0) {
      return {
        average: 0,
        volatility: 0,
        growthRate: 0,
        changePoints: 0,
        minimum: 0,
      };
    }

    const amounts = last180.map(t => t.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;

    const timePoints = last180.map((_, i) => i);
    const growthRate = this.linearRegressionSlope(timePoints, amounts);
    const growthRatePercent = mean > 0 ? (growthRate / mean) * 100 : 0;

    const changePoints = this.detectChangePoints(amounts);
    const minimum = Math.min(...amounts);

    return {
      average: mean,
      volatility: cv,
      growthRate: growthRatePercent / 100,
      changePoints,
      minimum,
    };
  }

  /**
   * Analyze payment behavior with EMI patterns
   */
  private analyzePaymentBehavior(loanPayments: Transaction[], last90: Transaction[]) {
    if (loanPayments.length === 0) {
      return {
        consistency: 80,
        timelinessScore: 80,
        missedPayments: 0,
        avgDelay: 0,
      };
    }

    // Payment consistency (std dev of payment dates)
    const dates = loanPayments.map(t => new Date(t.date).getDate());
    const meanDate = dates.reduce((a, b) => a + b, 0) / dates.length;
    const dateSigma = Math.sqrt(dates.reduce((sum, d) => sum + Math.pow(d - meanDate, 2), 0) / dates.length);
    const consistency = Math.max(0, 100 - dateSigma * 5); // 0-100

    // Timeliness: expected 1 payment per month
    const expectedPayments = Math.ceil(last90.length / 30);
    const actualPayments = loanPayments.filter(t => {
      const d = this.daysBetween(new Date(t.date), new Date());
      return d <= 90;
    }).length;
    const missedPayments = Math.max(0, expectedPayments - actualPayments);
    const timelinessScore = Math.max(0, 100 - missedPayments * 25);
    const avgDelay = missedPayments > 0 ? (missedPayments * 15) : 0; // days

    return {
      consistency: Math.round(consistency),
      timelinessScore: Math.round(timelinessScore),
      missedPayments,
      avgDelay,
    };
  }

  /**
   * Compute category entropy (diversity)
   */
  private computeCategoryEntropy(spendingTransactions: Transaction[]): number {
    if (spendingTransactions.length === 0) return 0;

    const categories = new Map<string, number>();
    spendingTransactions.forEach(t => {
      categories.set(t.category, (categories.get(t.category) || 0) + 1);
    });

    let entropy = 0;
    const total = spendingTransactions.length;
    categories.forEach(count => {
      const p = count / total;
      // Avoid NaN: only compute if p > 0
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    });

    // Clamp to valid range to prevent NaN propagation
    return Math.max(0, Math.min(10, isFinite(entropy) ? entropy : 0));
  }

  /**
   * Detect spending spikes
   */
  private detectSpendingSpikes(spendingTransactions: Transaction[], last90: Transaction[]): number {
    if (last90.length < 3) return 0;

    const amounts = last90.map(t => t.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(
      amounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / amounts.length
    );

    const spikeThreshold = mean + stdDev * 2; // 2-sigma
    const spikeCount = amounts.filter(a => a > spikeThreshold).length;
    const spikeProbability = spikeCount / amounts.length;

    return Math.min(1, spikeProbability);
  }

  /**
   * Compute seasonality index
   */
  private computeSeasonalityIndex(credits: Transaction[], debits: Transaction[], allTxns: Transaction[]): number {
    if (allTxns.length < 60 || debits.length === 0) return 1.0; // Need at least 60 days and some debits

    // Get current month
    const now = new Date();
    const currentMonth = now.getMonth();
    
    // Calculate average spending by month
    const monthlySpending = new Map<number, number[]>();
    debits.forEach(t => {
      const month = new Date(t.date).getMonth();
      if (!monthlySpending.has(month)) {
        monthlySpending.set(month, []);
      }
      monthlySpending.get(month)!.push(t.amount);
    });

    // Get average for current month and overall
    const currentMonthSpendings = monthlySpending.get(currentMonth) || [];
    const currentMonthAvg = currentMonthSpendings.length > 0
      ? currentMonthSpendings.reduce((a, b) => a + b, 0) / currentMonthSpendings.length
      : 5000;

    let overallAvg = 0;
    monthlySpending.forEach(spendings => {
      overallAvg += spendings.reduce((a, b) => a + b, 0);
    });
    overallAvg = debits.length > 0 ? overallAvg / debits.length : 5000;

    // Seasonality index
    const seasonality = overallAvg > 0 ? currentMonthAvg / overallAvg : 1.0;
    return this.sanitizeNumber(seasonality, 1.0);
  }

  /**
   * Compute stress indicator (0-100)
   */
  private computeStressIndicator(
    paymentConsistency: number,
    utilizationVolatility: number,
    incomeVolatility: number,
    spendingSpikeProbability: number
  ): number {
    let stress = 0;

    // Payment inconsistency = risk
    stress += (100 - paymentConsistency) * 0.3;

    // High utilization volatility = risk
    stress += utilizationVolatility * 0.25;

    // High income volatility = risk
    stress += incomeVolatility * 100 * 0.25;

    // Spending spikes = risk
    stress += spendingSpikeProbability * 100 * 0.2;

    return Math.min(100, Math.round(stress));
  }

  /**
   * Estimate default probability (logistic transformation)
   */
  private estimateDefaultProbability(creditScore: number, features: FeatureSet): number {
    // Convert score to probability using logistic function
    // 850 score -> ~1% default probability
    // 550 score -> ~50% default probability
    
    const normalizedScore = (creditScore - 300) / 550; // 0-1
    const stressAdjustment = features.stressIndicator / 100;
    
    const baseProbability = 1 / (1 + Math.exp((normalizedScore - 0.5) * 10));
    const adjustedProbability = baseProbability * (1 + stressAdjustment * 0.5);

    return Math.min(1, Math.max(0, adjustedProbability));
  }

  /**
   * Get adaptive weights based on data quality
   */
  private getAdaptiveWeights(features: FeatureSet) {
    // Adjust weights based on feature confidence
    let delinquencyWeight = 0.25;
    let paymentWeight = 0.20;
    let utilizationWeight = 0.15;
    let incomeWeight = 0.15;
    let emiWeight = 0.15;
    let spendingWeight = 0.10;

    // If income is very unstable, increase its weight
    if (features.incomeVolatility > 0.4) {
      incomeWeight = 0.20;
      paymentWeight = 0.18;
    }

    // If high delinquency marks, increase delinquency weight
    if (features.missedPaymentCount > 0) {
      delinquencyWeight = 0.35;
      emiWeight = 0.10;
    }

    // Normalize to sum to 1
    const total = delinquencyWeight + paymentWeight + utilizationWeight + incomeWeight + emiWeight + spendingWeight;
    return {
      delinquency: delinquencyWeight / total,
      paymentHistory: paymentWeight / total,
      utilization: utilizationWeight / total,
      incomeStability: incomeWeight / total,
      emiCompliance: emiWeight / total,
      spendingPattern: spendingWeight / total,
    };
  }

  /**
   * Weighted score with non-linear transformation
   */
  private weightedScoreWithNonlinearity(
    factors: Record<string, number>,
    weights: Record<string, number>
  ): number {
    let score = 0;
    
    // Apply sigmoid to scores for non-linearity
    Object.entries(factors).forEach(([key, value]) => {
      // Guard against NaN/Infinity input
      const safeValue = this.sanitizeNumber(value, 650);
      const normalized = (safeValue - 300) / 550; // 0-1
      const sigmoid = 1 / (1 + Math.exp(-(normalized * 4 - 2))); // S-curve
      const rescaled = 300 + sigmoid * 550;
      const contribution = rescaled * (weights[key] || 0.16);
      score += this.sanitizeNumber(contribution, 0);
    });

    return this.sanitizeNumber(score, 650);
  }

  /**
   * Compute interaction effects
   */
  private computeInteractionEffects(features: FeatureSet) {
    const delinquencyUtilInteraction = features.delinquencyUtilizationInteraction * 50; // Scale it
    
    const stressEffect = features.stressIndicator > 60 ? 0.15 : 0; // High stress = 15% penalty
    
    return {
      delinquencyUtilizationEffect: delinquencyUtilInteraction / 1000,
      stressIndicatorPenalty: stressEffect * 100,
    };
  }

  /**
   * Get seasonal adjustment factor
   */
  private getSeasonalAdjustment(features: FeatureSet): number {
    // Clamp between 0.9 and 1.1 (±10%)
    return Math.max(0.9, Math.min(1.1, features.seasonalityIndex));
  }

  /**
   * Detect anomalies (0-100)
   */
  private detectAnomalies(features: FeatureSet): number {
    let anomalyScore = 0;

    // Extreme payment inconsistency
    if (features.paymentConsistency < 30) anomalyScore += 30;

    // Sudden balance trend
    if (Math.abs(features.balanceTrend) > 500) anomalyScore += 20;

    // Unusual spending patterns
    if (features.categoryDiversity < 1.0) anomalyScore += 15; // Too narrow
    if (features.categoryDiversity > 4.0) anomalyScore += 10; // Too scattered

    // Income changes
    if (features.incomeChangePoints > 2) anomalyScore += 25;

    // Spending spikes
    anomalyScore += Math.round(features.spendingSpikeProbability * 20);

    return Math.min(100, anomalyScore);
  }

  /**
   * Calculate confidence in score (0-1)
   */
  private calculateConfidence(features: FeatureSet): number {
    let confidence = 0.5; // Base confidence

    // More data = higher confidence
    confidence += Math.min(0.2, features.daysSinceFirstTransaction / 1000); // Max +0.2

    // Consistent behavior = higher confidence
    confidence += (features.paymentConsistency / 100) * 0.15; // Max +0.15

    // Lower anomaly = higher confidence
    confidence += ((100 - features.anomalyScore) / 100) * 0.15; // Max +0.15

    return Math.min(1, confidence);
  }

  /**
   * Get risk level based on score and features
   */
  private getRiskLevel(score: number, features: FeatureSet): 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Very High Risk' {
    if (score >= 750 && features.stressIndicator < 40) {
      return 'Low Risk';
    }
    if (score >= 700 && features.stressIndicator < 50) {
      return 'Medium Risk';
    }
    if (score >= 600) {
      return 'High Risk';
    }
    return 'Very High Risk';
  }

  /**
   * Get feature importance
   */
  private getFeatureImportance(
    features: FeatureSet,
    factorScores: Record<string, number>
  ): Record<string, number> {
    return {
      stressIndicator: features.stressIndicator,
      incomeVolatility: features.incomeVolatility * 100,
      paymentConsistency: 100 - features.paymentConsistency,
      utilizationVolatility: features.utilizationVolatility * 100,
      spendingSpikeProbability: features.spendingSpikeProbability * 100,
      incomeChangePoints: features.incomeChangePoints * 20,
      missedPaymentCount: features.missedPaymentCount * 25,
    };
  }

  // ============ Helper Methods ============

  private getTransactionsInDays(transactions: Transaction[], days: number): Transaction[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return transactions.filter(t => new Date(t.date) >= cutoff);
  }

  private daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(Math.abs((date2.getTime() - date1.getTime()) / msPerDay));
  }

  private linearRegressionSlope(x: number[], y: number[]): number {
    const n = x.length;
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;

    const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0);
    const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private detectChangePoints(data: number[]): number {
    if (data.length < 10) return 0;

    // Simple change point detection using mean shifts
    let changePoints = 0;
    const threshold = 1.5; // 1.5x mean

    for (let i = 1; i < data.length; i++) {
      const ratio = data[i] / Math.max(1, data[i - 1]);
      if (ratio > threshold || ratio < 1 / threshold) {
        changePoints++;
      }
    }

    return Math.min(5, changePoints); // Cap at 5
  }

  private computeUtilizationVolatility(credits: Transaction[], debits: Transaction[], last90: Transaction[]): number {
    if (last90.length < 5) return 0;

    const utilizationScores = [];
    for (let i = 0; i < Math.min(last90.length, 90); i++) {
      const creditsSubset = credits.filter(t => {
        const days = this.daysBetween(new Date(t.date), new Date());
        return days <= i;
      });
      const debitsSubset = debits.filter(t => {
        const days = this.daysBetween(new Date(t.date), new Date());
        return days <= i;
      });

      const totalCredit = creditsSubset.reduce((s, t) => s + t.amount, 0);
      const totalDebit = debitsSubset.reduce((s, t) => s + t.amount, 0);

      if (totalCredit > 0) {
        utilizationScores.push(totalDebit / totalCredit);
      }
    }

    if (utilizationScores.length < 2) return 0;

    const mean = utilizationScores.reduce((a, b) => a + b, 0) / utilizationScores.length;
    const variance = utilizationScores.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / utilizationScores.length;
    return Math.sqrt(variance);
  }

  private computeAverageBalance(credits: Transaction[], debits: Transaction[]): number {
    let balance = 0;
    const transactions = [...credits, ...debits]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    transactions.forEach(t => {
      balance += t.type === 'credit' ? t.amount : -t.amount;
    });

    return Math.max(0, balance);
  }

  private computeBalanceTrend(credits: Transaction[], debits: Transaction[], sorted: Transaction[]): number {
    if (sorted.length < 10) return 0;

    let balance = 0;
    const balances = [];

    sorted.forEach(t => {
      balance += t.type === 'credit' ? t.amount : -t.amount;
      balances.push(balance);
    });

    const timePoints = balances.map((_, i) => i);
    return this.linearRegressionSlope(timePoints, balances);
  }

  private computeUtilizationRatio(credits: Transaction[], debits: Transaction[]): number {
    const totalCredit = credits.reduce((s, t) => s + t.amount, 0);
    const totalDebit = debits.reduce((s, t) => s + t.amount, 0);

    return totalCredit > 0 ? totalDebit / totalCredit : 0;
  }

  // Individual scoring functions
  private calcPaymentHistoryScore(last90: Transaction[], features: FeatureSet): number {
    const consistencyBonus = (features.paymentConsistency / 100) * 150;
    const timelinessBonus = (features.paymentTimelinessScore / 100) * 100;
    return Math.round(600 + consistencyBonus + timelinessBonus);
  }

  private calcDelinquencyScore(last90: Transaction[], features: FeatureSet): number {
    let score = 750;
    score -= features.missedPaymentCount * 75;
    score -= features.averagePaymentDelay * 2;
    score -= features.spendingSpikeProbability * 100;
    return Math.max(300, Math.round(score));
  }

  private calcIncomeStabilityScore(last365: Transaction[], features: FeatureSet): number {
    let score = 700;
    score -= features.incomeVolatility * 100;
    score -= features.incomeChangePoints * 50;
    return Math.max(300, Math.round(score));
  }

  private calcUtilizationScore(sorted: Transaction[], features: FeatureSet): number {
    const idealUtilization = 0.3;
    const deviation = Math.abs(features.utilizationRatio - idealUtilization);
    const deviationPenalty = Math.min(100, deviation * 150);
    return Math.round(700 - deviationPenalty);
  }

  private calcEMIComplianceScore(last90: Transaction[], features: FeatureSet): number {
    let score = 750;
    if (features.missedPaymentCount > 0) {
      score -= features.missedPaymentCount * 100;
    }
    if (features.paymentConsistency < 50) {
      score -= 50;
    }
    return Math.max(300, Math.round(score));
  }

  private calcSpendingPatternScore(last180: Transaction[], features: FeatureSet): number {
    let score = 700;
    score -= (features.spendingVolatility * 200); // Higher volatility = lower score
    score += Math.min(50, features.categoryDiversity * 10); // Diversity is good
    score -= features.spendingSpikeProbability * 150; // Spikes are risky
    return Math.max(300, Math.round(score));
  }
}

// Export singleton instance
export const advancedScorer = new AdvancedCreditScorer();
export type { ScoringResult, AdvancedScoreMetrics, FeatureSet };
