import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Alert } from '../../types';
import { formatDate } from '../../utils/formatters';

interface AlertCardProps {
  alert: Alert;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const getAlertConfig = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-l-yellow-400',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800'
        };
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-l-green-400',
          iconColor: 'text-green-600',
          textColor: 'text-green-800'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-400',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800'
        };
    }
  };

  const config = getAlertConfig(alert.type);
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-r-lg`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5`} />
        <div className="flex-1">
          <p className={`text-sm ${config.textColor} font-medium`}>
            {alert.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(alert.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;