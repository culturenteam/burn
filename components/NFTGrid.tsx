import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { NFT } from '../types';
import { NFTCard } from './NFTCard';
import { Alert } from './ui/Alert';
import { ViewToggle, ViewMode } from '../src/components/ViewToggle';

interface NFTGridProps {
  nfts: NFT[];
  loading: boolean;
  error: string | null;
  onBurn: (nft: NFT, amount: number) => void;
}

export const NFTGrid: React.FC<NFTGridProps> = ({ nfts, loading, error, onBurn }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  // Loading state
  if (loading) {
    return (
      <div className="px-8 py-8 space-y-8">
        <div className="border-b-4 border-black pb-4">
          <h2 className="text-3xl font-bold uppercase tracking-tight">COLLECTION</h2>
          <p className="text-xs uppercase tracking-wider mt-2">LOADING BRUTALISTI WORKS...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border-4 border-black animate-pulse"
            >
              <div className="aspect-square bg-brutal-gray"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-black w-3/4"></div>
                <div className="h-4 bg-black w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-8 py-8 space-y-8">
        <div className="border-b-4 border-black pb-4">
          <h2 className="text-3xl font-bold uppercase tracking-tight">COLLECTION</h2>
          <p className="text-xs uppercase tracking-wider mt-2">ERROR LOADING</p>
        </div>
        <div className="border-4 border-brutal-red bg-white p-6">
          <p className="font-bold uppercase text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (nfts.length === 0) {
    return (
      <div className="px-8 py-8 space-y-8">
        <div className="border-b-4 border-black pb-4">
          <h2 className="text-3xl font-bold uppercase tracking-tight">COLLECTION</h2>
          <p className="text-xs uppercase tracking-wider mt-2">NO WORKS FOUND</p>
        </div>
        <div className="border-4 border-black p-12 text-center space-y-6">
          <Package className="w-16 h-16 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold uppercase">EMPTY</h3>
            <p className="text-sm uppercase tracking-wider max-w-md mx-auto">
              NO BRUTALISTI WORKS IN THIS WALLET
            </p>
          </div>
          <a
            href="https://objkt.com/profile/brutalisti/created"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-black hover:bg-brutal-red text-white border-4 border-black font-bold uppercase text-sm tracking-wider transition-colors"
          >
            VIEW ON OBJKT
          </a>
        </div>
      </div>
    );
  }

  // NFT grid
  // Calculate total editions
  const totalEditions = nfts.reduce((sum, nft) => sum + nft.balance, 0);
  
  // Grid class based on view mode
  const getGridClass = () => {
    switch (viewMode) {
      case 'list':
        return 'space-y-4';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
      case 'compact':
        return 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
    }
  };
  
  return (
    <div className="px-8 py-8 space-y-8">
      <div className="border-b-4 border-black pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-tight">COLLECTION</h2>
            <p className="text-xs uppercase tracking-wider mt-2">
              BRUTALISTI WORKS / OWNED
            </p>
          </div>
          <div className="flex items-center gap-6">
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <div className="text-right border-2 border-black px-4 py-2">
              <div className="text-2xl font-bold">
                {nfts.length}
              </div>
              <div className="text-xs uppercase tracking-wider">
                WORKS
              </div>
              <div className="text-xs uppercase tracking-wider mt-1 border-t-2 border-black pt-1">
                {totalEditions} ED
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={getGridClass()}>
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} onBurn={onBurn} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};
