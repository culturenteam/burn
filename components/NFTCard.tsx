import React, { useState } from 'react';
import { Image as ImageIcon, ExternalLink, Flame } from 'lucide-react';
import { NFT } from '../types';
import { NETWORK } from '../constants';
import { ViewMode } from '../src/components/ViewToggle';
import { PricingIndicator } from '../src/components/PricingIndicator';

interface NFTCardProps {
  nft: NFT;
  onBurn: (nft: NFT, amount: number) => void;
  viewMode?: ViewMode;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onBurn, viewMode = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [burnAmount, setBurnAmount] = useState(1);
  const [showBurnControls, setShowBurnControls] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const openInExplorer = () => {
    const url = `${NETWORK.EXPLORER_URL}/${nft.contractAddress}/tokens/${nft.tokenId}`;
    window.open(url, '_blank');
  };

  const handleBurnClick = () => {
    setShowBurnControls(!showBurnControls);
  };

  const handleBurnConfirm = () => {
    onBurn(nft, burnAmount);
    setShowBurnControls(false);
    setBurnAmount(1);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= nft.balance) {
      setBurnAmount(value);
    }
  };

  // Calculate total True Vision reward for burn amount
  const totalReward = nft.trueVisionReward 
    ? (nft.trueVisionReward * burnAmount).toFixed(2)
    : '0.00';

  // List view - horizontal layout
  if (viewMode === 'list') {
    return (
      <div className="border-4 border-black bg-white flex items-center">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 bg-brutal-gray border-r-4 border-black flex-shrink-0">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-8 h-8" />
            </div>
          ) : (
            <img
              src={nft.imageUri}
              alt={nft.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>

        {/* Info - horizontal layout */}
        <div className="flex-1 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <h3 className="text-base font-bold uppercase tracking-tight min-w-[200px]">
              {nft.name}
            </h3>
            <span className="text-xs uppercase tracking-wider">#{nft.tokenId}</span>
            <div className="border-2 border-black px-3 py-1 text-xs font-bold uppercase">
              {nft.balance} ED
            </div>
            {nft.trueVisionReward && (
              <div className="border-2 border-brutal-red px-3 py-1 text-xs font-bold uppercase bg-white">
                {nft.trueVisionReward.toFixed(2)} TV
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={openInExplorer}
              className="px-4 py-2 bg-white hover:bg-black hover:text-white border-2 border-black transition-colors text-xs uppercase tracking-wider font-bold"
            >
              TZKT
            </button>
            <button
              onClick={handleBurnClick}
              className="px-6 py-2 bg-brutal-red hover:bg-black text-white border-4 border-black transition-colors flex items-center gap-2 font-bold uppercase text-xs tracking-wider"
            >
              <Flame className="w-4 h-4" />
              BURN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact view - minimal card
  if (viewMode === 'compact') {
    return (
      <div className="border-4 border-black bg-white group">
        {/* Image */}
        <div className="relative aspect-square bg-brutal-gray">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-8 h-8" />
            </div>
          ) : (
            <img
              src={nft.imageUri}
              alt={nft.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
          {/* True Vision badge overlay */}
          {nft.trueVisionReward && (
            <div className="absolute top-1 right-1 bg-brutal-red text-white px-2 py-1 text-[10px] font-bold border-2 border-black">
              {nft.trueVisionReward.toFixed(1)} TV
            </div>
          )}
        </div>

        {/* Minimal info */}
        <div className="p-2 border-t-4 border-black">
          <div className="text-xs font-bold uppercase truncate" title={nft.name}>
            {nft.name}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] uppercase">#{nft.tokenId}</span>
            <span className="text-[10px] font-bold">{nft.balance} ED</span>
          </div>
        </div>
      </div>
    );
  }

  // Grid view - default full card
  return (
    <div className="border-4 border-black bg-white group">
      {/* Image */}
      <div className="relative aspect-square bg-brutal-gray border-b-4 border-black">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ImageIcon className="w-16 h-16 mb-2" />
            <span className="text-xs uppercase">NO IMAGE</span>
          </div>
        ) : (
          <img
            src={nft.imageUri}
            alt={nft.name}
            className={`w-full h-full object-cover ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      {/* Info */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold uppercase tracking-tight flex-1" title={nft.name}>
              {nft.name}
            </h3>
            <div className="flex-shrink-0 border-2 border-black px-3 py-1 text-xs font-bold uppercase">
              {nft.balance} ED
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs uppercase tracking-wider border-t-2 border-black pt-2">
            <span>#{nft.tokenId}</span>
            <button
              onClick={openInExplorer}
              className="hover:text-brutal-red transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              TZKT
            </button>
          </div>
        </div>

        {/* True Vision Reward Display */}
        {nft.trueVisionReward && (
          <div className="border-4 border-brutal-red bg-white p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold">BURN REWARD:</span>
              <span className="text-lg font-bold">{nft.trueVisionReward.toFixed(2)} TV</span>
            </div>
            <PricingIndicator nft={nft} />
            {nft.lastSalePrice && (
              <div className="text-[10px] uppercase tracking-wider opacity-70 border-t-2 border-black pt-2">
                LAST SALE: {nft.lastSalePrice.toFixed(1)} ꜩ
              </div>
            )}
          </div>
        )}

        {/* Burn Controls */}
        {!showBurnControls ? (
          <button
            onClick={handleBurnClick}
            className="w-full mt-4 py-3 px-4 bg-brutal-red hover:bg-black text-white border-4 border-black transition-colors flex items-center justify-center space-x-2 font-bold uppercase text-sm tracking-wider"
          >
            <Flame className="w-4 h-4" />
            <span>BURN</span>
          </button>
        ) : (
          <div className="mt-4 border-4 border-black p-4 bg-brutal-gray space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider font-bold">AMOUNT:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={nft.balance}
                  value={burnAmount}
                  onChange={handleAmountChange}
                  className="w-16 px-2 py-2 bg-white border-2 border-black text-center font-bold focus:outline-none focus:border-brutal-red"
                />
                <span className="text-xs font-bold">/ {nft.balance}</span>
              </div>
            </div>
            {nft.trueVisionReward && burnAmount > 1 && (
              <div className="border-2 border-brutal-red bg-white px-3 py-2 text-center">
                <div className="text-xs uppercase tracking-wider">TOTAL REWARD</div>
                <div className="text-base font-bold">{totalReward} TV</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBurnConfirm}
                className="py-2 px-3 bg-brutal-red hover:bg-black text-white border-2 border-black transition-colors font-bold text-xs uppercase tracking-wider"
              >
                CONFIRM
              </button>
              <button
                onClick={() => setShowBurnControls(false)}
                className="py-2 px-3 bg-white hover:bg-black hover:text-white border-2 border-black transition-colors font-bold text-xs uppercase tracking-wider"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
