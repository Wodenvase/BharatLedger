export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'Low Risk':
      return 'text-green-600';
    case 'Medium Risk':
      return 'text-yellow-600';
    case 'High Risk':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 750) return '#10B981'; // green
  if (score >= 650) return '#F59E0B'; // yellow
  return '#EF4444'; // red
};