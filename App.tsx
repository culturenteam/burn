import React, { useEffect, useState } from 'react';
import { useWallet } from './context/WalletContext';
import { Wallet, LogOut } from 'lucide-react';
import { Layout } from './components/Layout';
import { Card, CardHeader } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Alert } from './components/ui/Alert';
import { WalletInfo } from './components/WalletInfo';
import { DebugInfo } from './components/DebugInfo';
import { NFTGrid } from './components/NFTGrid';
import { BurnModal } from './components/BurnModal';
import { fetchNFTs } from './services/tzkt';
import { burnNFT } from './services/burn';
import { NFT } from './types';
import { usePricing } from './hooks/usePricing';

/**
 * Main Application Component
 * Phase 1: Wallet Connection ✅
 * Phase 2: NFT Display ✅
 * 
 * This component demonstrates:
 * - Wallet connection using Beacon
 * - NFT fetching from TzKT API
 * - Type-safe state management
 * - Design system implementation
 * - Error handling
 */
const App: React.FC = () => {
  const { 
    userAddress, 
    isConnected,
    connectWallet, 
    disconnectWallet, 
    loading: walletLoading, 
    error: walletError,
    tezos 
  } = useWallet();

  // NFT state
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftLoading, setNftLoading] = useState(false);
  const [nftError, setNftError] = useState<string | null>(null);

  // Pricing hook - enriches NFTs with True Vision rewards
  const { nfts: pricedNFTs, loading: pricingLoading, lastUpdate } = usePricing(nfts);

  // Burn state
  const [burnModalOpen, setBurnModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [burnAmount, setBurnAmount] = useState(1);
  const [burning, setBurning] = useState(false);
  const [burnSuccess, setBurnSuccess] = useState<string | null>(null);
  const [burnError, setBurnError] = useState<string | null>(null);

  // Fetch NFTs when wallet connects
  useEffect(() => {
    if (userAddress) {
      loadNFTs(userAddress);
    } else {
      // Clear NFTs when disconnected
      setNfts([]);
      setNftError(null);
    }
  }, [userAddress]);

  const loadNFTs = async (address: string) => {
    setNftLoading(true);
    setNftError(null);
    
    try {
      const fetchedNFTs = await fetchNFTs(address);
      setNfts(fetchedNFTs);
    } catch (err: any) {
      console.error('Failed to load NFTs:', err);
      setNftError(err.message || 'Failed to load NFTs. Please try again.');
    } finally {
      setNftLoading(false);
    }
  };

  const handleBurnRequest = (nft: NFT, amount: number) => {
    setSelectedNFT(nft);
    setBurnAmount(amount);
    setBurnModalOpen(true);
    setBurnSuccess(null);
    setBurnError(null);
  };

  const handleBurnConfirm = async () => {
    if (!selectedNFT || !userAddress) return;

    setBurning(true);
    setBurnError(null);

    try {
      const txHash = await burnNFT(tezos, userAddress, selectedNFT, burnAmount);
      
      console.log('✅ Burn transaction sent! TX:', txHash);
      setBurnSuccess(
        `Burn transaction sent! Check status: https://tzkt.io/${txHash}`
      );
      
      // Close modal and refresh after showing success
      setTimeout(() => {
        setBurnModalOpen(false);
        // Reload NFTs after a delay to allow blockchain to update
        setTimeout(() => {
          loadNFTs(userAddress);
        }, 5000); // Wait 5 seconds before refreshing
      }, 3000);
      
    } catch (err: any) {
      console.error('❌ Burn failed:', err);
      setBurnError(err.message || 'Failed to burn NFT. Please try again.');
      setBurning(false);
    }
  };

  const handleBurnCancel = () => {
    setBurnModalOpen(false);
    setSelectedNFT(null);
    setBurnAmount(1);
    setBurnError(null);
  };

  return (
    <>
      <Layout isConnected={isConnected}>
        {!isConnected ? (
          // Connection screen
          <div className="min-h-[60vh] flex items-center justify-center px-8">
            <div className="max-w-2xl w-full border-4 border-black p-12 bg-white space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold uppercase tracking-tight">CONNECT</h2>
                <p className="text-sm uppercase tracking-wider">
                  TEZOS MAINNET / BEACON PROTOCOL
                </p>
              </div>

              {walletError && (
                <div className="border-4 border-brutal-red bg-white p-4">
                  <p className="font-bold uppercase text-sm">{walletError}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={connectWallet}
                  disabled={walletLoading}
                  className="w-full py-4 px-6 bg-black hover:bg-brutal-red text-white border-4 border-black font-bold uppercase text-lg tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center space-x-3"
                >
                  {walletLoading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white border-t-transparent animate-spin"></div>
                      <span>CONNECTING...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-6 h-6" />
                      <span>CONNECT WALLET</span>
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center uppercase tracking-wider">
                  MAINNET ONLY / REAL ASSETS / PERMANENT ACTIONS
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Connected - show NFTs
          <div className="w-full">
            {/* Wallet info bar */}
            <div className="border-b-4 border-black px-8 py-4 bg-brutal-gray">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider font-bold">CONNECTED</div>
                  <div className="font-mono text-sm">{userAddress}</div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-white hover:bg-black hover:text-white border-2 border-black font-bold uppercase text-xs tracking-wider transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-3 h-3" />
                  <span>DISCONNECT</span>
                </button>
              </div>
            </div>

            {/* Success/Error Messages */}
            {burnSuccess && (
              <div className="px-8 py-4 border-b-4 border-black bg-white">
                <div className="border-4 border-black p-4 space-y-2">
                  <p className="font-bold uppercase text-sm">
                    TRANSACTION SENT
                  </p>
                  <p className="text-xs uppercase tracking-wider">
                    REFRESHING IN 5 SECONDS / BLOCKCHAIN CONFIRMATION PENDING
                  </p>
                  {burnSuccess.includes('tzkt.io') && (
                    <a
                      href={burnSuccess.split('Check status: ')[1]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wider underline hover:text-brutal-red inline-block mt-2"
                    >
                      VIEW ON TZKT →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* NFT Grid */}
            <NFTGrid 
              nfts={pricedNFTs} 
              loading={nftLoading || pricingLoading} 
              error={nftError} 
              onBurn={handleBurnRequest} 
            />
          </div>
        )}
      </Layout>
      
      {/* Debug Info Component */}
      <DebugInfo />

      {/* Burn Modal */}
      {burnModalOpen && selectedNFT && (
        <>
          <BurnModal
            nft={selectedNFT}
            amount={burnAmount}
            onConfirm={handleBurnConfirm}
            onCancel={handleBurnCancel}
            isProcessing={burning}
          />
          {burnError && (
            <div className="fixed bottom-4 right-4 z-[60] max-w-md animate-in slide-in-from-bottom-4">
              <Alert type="error" message={burnError} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default App;