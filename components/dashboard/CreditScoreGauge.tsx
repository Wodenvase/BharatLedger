import React from 'react';
import { getScoreColor } from '../../utils/formatters';

interface CreditScoreGaugeProps {
  score: number;
  size?: 'sm' | 'lg';
}

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score, size = 'lg' }) => {
  const radius = size === 'lg' ? 80 : 50;
  const strokeWidth = size === 'lg' ? 12 : 8;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 850) * circumference;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke={getScoreColor(score)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`font-bold ${size === 'lg' ? 'text-4xl' : 'text-2xl'}`} style={{ color: getScoreColor(score) }}>
            {score}
          </div>
          {size === 'lg' && (
            <div className="text-gray-500 text-sm mt-1">out of 850</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditScoreGauge;