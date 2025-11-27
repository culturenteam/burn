/**
 * Pricing Hook
 * Manages True Vision pricing calculations and automatic refresh
 */

import { useState, useEffect, useCallback } from 'react';
import { NFT } from '../types';
import { fetchLastSaleData, fetchTokenSupply } from '../services/tzkt';
import { calculateTrueVisionReward } from '../services/pricing';

const PRICING_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Enrich NFTs with True Vision pricing data
 */
export const usePricing = (nfts: NFT[]) => {
  const [enrichedNFTs, setEnrichedNFTs] = useState<NFT[]>(nfts);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Calculate pricing for a single NFT
   */
  const calculateNFTPricing = useCallback(async (nft: NFT): Promise<NFT> => {
    try {
      // Fetch last sale data
      const saleData = await fetchLastSaleData(nft.contractAddress, nft.tokenId);
      
      if (!saleData) {
        // No sale data available, return NFT with default pricing
        return {
          ...nft,
          lastSalePrice: 5, // Default 5 tez
          lastSaleDate: new Date(),
          totalEditions: nft.balance,
          trueVisionReward: 1, // Minimum reward
          pricingLastUpdated: new Date(),
        };
      }

      // Fetch total supply if not in sale data
      const totalEditions = saleData.totalEditions || 
        await fetchTokenSupply(nft.contractAddress, nft.tokenId);

      // Calculate True Vision reward
      const pricingFactors = calculateTrueVisionReward(
        saleData.priceTez,
        saleData.saleDate,
        totalEditions
      );

      return {
        ...nft,
        lastSalePrice: saleData.priceTez,
        lastSaleDate: saleData.saleDate,
        totalEditions,
        trueVisionReward: pricingFactors.finalReward,
        pricingLastUpdated: new Date(),
      };
    } catch (error) {
      console.error(`Failed to calculate pricing for ${nft.name}:`, error);
      // Return NFT with default pricing on error
      return {
        ...nft,
        lastSalePrice: 5,
        lastSaleDate: new Date(),
        totalEditions: nft.balance,
        trueVisionReward: 1,
        pricingLastUpdated: new Date(),
      };
    }
  }, []);

  /**
   * Refresh pricing for all NFTs
   */
  const refreshPricing = useCallback(async () => {
    if (nfts.length === 0) return;

    setLoading(true);
    console.log('🔄 Refreshing True Vision pricing for', nfts.length, 'NFTs');

    try {
      // Calculate pricing for all NFTs in parallel
      const pricedNFTs = await Promise.all(
        nfts.map(nft => calculateNFTPricing(nft))
      );

      setEnrichedNFTs(pricedNFTs);
      setLastUpdate(new Date());
      console.log('✅ Pricing refresh complete');
    } catch (error) {
      console.error('❌ Failed to refresh pricing:', error);
    } finally {
      setLoading(false);
    }
  }, [nfts, calculateNFTPricing]);

  /**
   * Initial pricing calculation when NFTs change
   */
  useEffect(() => {
    refreshPricing();
  }, [nfts.length]); // Only refresh when NFT count changes

  /**
   * Set up automatic hourly refresh
   */
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ Automatic pricing refresh triggered');
      refreshPricing();
    }, PRICING_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [refreshPricing]);

  return {
    nfts: enrichedNFTs,
    loading,
    lastUpdate,
    refreshPricing,
  };
};
