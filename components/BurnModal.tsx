import React from 'react';
import { X, AlertTriangle, Flame } from 'lucide-react';
import { NFT } from '../types';
import { BURN_REWARDER_CONTRACT } from '../constants';

interface BurnModalProps {
  nft: NFT;
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const BurnModal: React.FC<BurnModalProps> = ({
  nft,
  amount,
  onConfirm,
  onCancel,
  isProcessing,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-white/95">
      <div className="border-4 border-black max-w-2xl w-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-brutal-red">
          <div className="flex items-center space-x-3">
            <Flame className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">CONFIRM BURN</h2>
          </div>
          {!isProcessing && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-black transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Warning */}
          <div className="border-4 border-black bg-brutal-gray p-6 space-y-2">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div className="text-sm uppercase tracking-wider">
                <p className="font-bold mb-2">PERMANENT ACTION</p>
                <p>
                  DESTROYING {amount} {amount === 1 ? 'EDITION' : 'EDITIONS'} / IRREVERSIBLE / NO RECOVERY
                </p>
              </div>
            </div>
          </div>

          {/* NFT Info */}
          <div className="border-4 border-black p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold mb-1">WORK</div>
                <div className="font-bold">{nft.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold mb-1">TOKEN ID</div>
                <div className="font-mono">#{nft.tokenId}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold mb-1">TO BURN</div>
                <div className="font-bold text-brutal-red">
                  {amount} {amount === 1 ? 'ED' : 'ED'}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold mb-1">REMAINING</div>
                <div className="font-bold">
                  {nft.balance - amount} {nft.balance - amount === 1 ? 'ED' : 'ED'}
                </div>
              </div>
            </div>
          </div>

          {/* True Vision Reward */}
          {nft.trueVisionReward && (
            <div className="border-4 border-brutal-red bg-white p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold mb-1">
                    YOU WILL RECEIVE
                  </div>
                  <div className="text-3xl font-bold">
                    {(nft.trueVisionReward * amount).toFixed(2)} TV
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1 opacity-70">
                    TRUE VISION TOKENS
                  </div>
                </div>
                <div className="text-right text-xs uppercase tracking-wider opacity-70">
                  {nft.trueVisionReward.toFixed(2)} TV<br />PER EDITION
                </div>
              </div>
              <div className="border-t-2 border-black pt-3 text-xs uppercase tracking-wider opacity-70">
                {BURN_REWARDER_CONTRACT 
                  ? '✅ REWARDS TRANSFERRED AUTOMATICALLY IN THIS TRANSACTION'
                  : '⚠️ REWARDS DISTRIBUTED MANUALLY BY CREATOR AFTER BURN CONFIRMATION'
                }
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="space-y-4">
              <div className="border-4 border-black p-4 flex items-center space-x-3">
                <div className="w-6 h-6 border-4 border-black border-t-transparent animate-spin"></div>
                <span className="text-sm uppercase tracking-wider font-bold">PROCESSING...</span>
              </div>
              <div className="border-4 border-black bg-brutal-gray p-4 space-y-2">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <div className="text-xs uppercase tracking-wider">
                    <p className="font-bold mb-1">CHECK KUKAI EXTENSION</p>
                    <p>
                      CLICK KUKAI ICON / APPROVE TRANSACTION / IF NO POPUP CHECK EXTENSION DIRECTLY
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 border-t-4 border-black">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="py-4 px-6 bg-white hover:bg-black hover:text-white border-r-4 border-black transition-colors font-bold uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="py-4 px-6 bg-brutal-red hover:bg-black text-white transition-colors font-bold uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-4 border-white border-t-transparent animate-spin"></div>
                <span>BURNING...</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5" />
                <span>BURN {amount} ED</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
