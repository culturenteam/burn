/**
 * Pricing Indicator Component
 * Visual display of pricing factors affecting True Vision rewards
 */

import React from 'react';
import { Clock, Layers } from 'lucide-react';
import { NFT } from '../../types';
import { calculateMonthsElapsed } from '../../services/pricing';

interface PricingIndicatorProps {
  nft: NFT;
  compact?: boolean;
}

export const PricingIndicator: React.FC<PricingIndicatorProps> = ({ nft, compact = false }) => {
  if (!nft.lastSaleDate || !nft.totalEditions) {
    return null;
  }

  const monthsElapsed = calculateMonthsElapsed(nft.lastSaleDate);
  const hasTimeDecay = monthsElapsed > 0;
  const hasEditionPenalty = nft.totalEditions > 10;

  // Compact version for small cards
  if (compact) {
    return (
      <div className="flex items-center gap-1 text-[10px] uppercase">
        {hasTimeDecay && (
          <div className="flex items-center gap-1 opacity-70">
            <Clock className="w-3 h-3" />
            <span>{monthsElapsed}M</span>
          </div>
        )}
        {hasEditionPenalty && (
          <div className="flex items-center gap-1 opacity-70">
            <Layers className="w-3 h-3" />
            <span>{nft.totalEditions}ED</span>
          </div>
        )}
      </div>
    );
  }

  // Full version for regular cards
  return (
    <div className="flex items-center gap-3 text-xs">
      {hasTimeDecay && (
        <div className="flex items-center gap-2 border-2 border-black px-2 py-1">
          <Clock className="w-3 h-3" />
          <span className="uppercase tracking-wider">
            {monthsElapsed} MONTH{monthsElapsed > 1 ? 'S' : ''} AGO
          </span>
        </div>
      )}
      {hasEditionPenalty && (
        <div className="flex items-center gap-2 border-2 border-black px-2 py-1">
          <Layers className="w-3 h-3" />
          <span className="uppercase tracking-wider">
            {nft.totalEditions} EDITIONS
          </span>
        </div>
      )}
      {!hasTimeDecay && !hasEditionPenalty && (
        <div className="border-2 border-brutal-red px-2 py-1">
          <span className="uppercase tracking-wider font-bold">
            OPTIMAL REWARD
          </span>
        </div>
      )}
    </div>
  );
};
