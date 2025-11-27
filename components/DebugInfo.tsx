import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

/**
 * Debug Information Component
 * Shows wallet state and environment info for troubleshooting
 */
export const DebugInfo: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const { wallet, userAddress, isConnected, loading, error } = useWallet();

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 px-3 py-2 bg-slate-800 text-slate-400 text-xs rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
      >
        Show Debug Info
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs font-mono shadow-xl z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold">Debug Information</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-slate-300">
        <div>
          <span className="text-slate-500">Wallet Initialized:</span>{' '}
          <span className={wallet ? 'text-green-400' : 'text-red-400'}>
            {wallet ? '✓ Yes' : '✗ No'}
          </span>
        </div>

        <div>
          <span className="text-slate-500">Connected:</span>{' '}
          <span className={isConnected ? 'text-green-400' : 'text-yellow-400'}>
            {isConnected ? '✓ Yes' : '○ No'}
          </span>
        </div>

        <div>
          <span className="text-slate-500">Loading:</span>{' '}
          <span className={loading ? 'text-yellow-400' : 'text-slate-400'}>
            {loading ? '⟳ Yes' : '○ No'}
          </span>
        </div>

        <div>
          <span className="text-slate-500">Address:</span>{' '}
          <span className="text-blue-400">
            {userAddress || 'Not connected'}
          </span>
        </div>

        {error && (
          <div>
            <span className="text-slate-500">Error:</span>{' '}
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700 mt-2">
          <div className="text-slate-500 mb-1">Environment:</div>
          <div>
            <span className="text-slate-500">Browser:</span>{' '}
            <span className="text-slate-300">
              {navigator.userAgent.split(' ').slice(-2).join(' ')}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Protocol:</span>{' '}
            <span className="text-slate-300">{window.location.protocol}</span>
          </div>
          <div>
            <span className="text-slate-500">Host:</span>{' '}
            <span className="text-slate-300">{window.location.host}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700 mt-2">
          <div className="text-slate-500 mb-1">Polyfills:</div>
          <div>
            <span className="text-slate-500">global:</span>{' '}
            <span className={typeof (window as any).global !== 'undefined' ? 'text-green-400' : 'text-red-400'}>
              {typeof (window as any).global !== 'undefined' ? '✓' : '✗'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Buffer:</span>{' '}
            <span className={typeof (window as any).Buffer !== 'undefined' ? 'text-green-400' : 'text-red-400'}>
              {typeof (window as any).Buffer !== 'undefined' ? '✓' : '✗'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">process:</span>{' '}
            <span className={typeof (window as any).process !== 'undefined' ? 'text-green-400' : 'text-red-400'}>
              {typeof (window as any).process !== 'undefined' ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
