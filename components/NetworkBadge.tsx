import React from 'react';

interface NetworkBadgeProps {
  isConnected: boolean;
  networkName?: string;
}

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({ 
  isConnected, 
  networkName = 'Mainnet' 
}) => {
  if (!isConnected) return null;

  return (
    <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-xs font-medium text-green-500">
        {networkName} Active
      </span>
    </div>
  );
};
