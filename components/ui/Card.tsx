import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const hoverStyles = hover ? 'hover:border-tezos/50 hover:shadow-lg hover:shadow-tezos/10' : '';
  
  return (
    <div className={`bg-card border border-slate-700/50 rounded-2xl p-8 transition-all duration-200 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-slate-400">{subtitle}</p>}
    </div>
  );
};
