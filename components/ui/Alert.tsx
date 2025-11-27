import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  className?: string;
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    icon: <CheckCircle className="w-5 h-5" />,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: <XCircle className="w-5 h-5" />,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    icon: <AlertCircle className="w-5 h-5" />,
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: <Info className="w-5 h-5" />,
  },
};

export const Alert: React.FC<AlertProps> = ({ type, message, className = '' }) => {
  const styles = alertStyles[type];
  
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 flex items-center space-x-3 ${className}`}>
      <span className={styles.text}>{styles.icon}</span>
      <p className={`text-sm ${styles.text} flex-1`}>{message}</p>
    </div>
  );
};
