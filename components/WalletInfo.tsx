import React from 'react';
import { Wallet, ShieldCheck } from 'lucide-react';
import { shortenAddress } from '../utils';

interface WalletInfoProps {
  address: string;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({ address }) => {
  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between group hover:border-tezos/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-tezos rounded-lg shadow-lg shadow-tezos/20">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Connected Address
          </p>
          <p className="text-lg font-mono text-white">
            {shortenAddress(address)}
          </p>
        </div>
      </div>
      <ShieldCheck className="w-5 h-5 text-green-500" />
    </div>
  );
};
