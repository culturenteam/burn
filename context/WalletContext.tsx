import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-types';

// Configuration constants
const RPC_URL = 'https://ghostnet.ecadinfra.com';
const NETWORK_TYPE = NetworkType.GHOSTNET;
const APP_NAME = 'Tezos Phase 1 dApp';

interface WalletContextType {
  userAddress: string | null;
  wallet: BeaconWallet | null;
  tezos: TezosToolkit;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Initialize Tezos Toolkit globally to reuse the instance
const tezosToolkit = new TezosToolkit(RPC_URL);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<BeaconWallet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Beacon Wallet on mount
    const initWallet = async () => {
      try {
        // Create a new BeaconWallet instance
        const newWallet = new BeaconWallet({
          name: APP_NAME,
          preferredNetwork: NETWORK_TYPE,
        });

        tezosToolkit.setWalletProvider(newWallet);
        setWallet(newWallet);

        // Check if there is an active account already
        const activeAccount = await newWallet.client.getActiveAccount();
        if (activeAccount) {
          setUserAddress(activeAccount.address);
          console.log('Active account found:', activeAccount.address);
        }
      } catch (err) {
        console.error('Failed to initialize wallet:', err);
        setError('Failed to initialize wallet system.');
      }
    };

    initWallet();
  }, []);

  const connectWallet = async () => {
    if (!wallet) {
      setError('Wallet is not initialized.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Request permission to connect
      // We rely on the preferredNetwork set in the constructor. 
      // Explicitly passing the network object can cause type errors with some versions of types.
      await wallet.requestPermissions();

      // Get user address after permission is granted
      const address = await wallet.getPKH();
      setUserAddress(address);
      console.log('Wallet connected:', address);
    } catch (err: any) {
      console.error('Connection error:', err);
      // Handle specific user rejection vs technical errors
      if (err?.message?.includes('Aborted')) {
         setError(null); // User cancelled, not really an error
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    if (!wallet) return;

    setLoading(true);
    try {
      await wallet.clearActiveAccount();
      setUserAddress(null);
      console.log('Wallet disconnected');
    } catch (err) {
      console.error('Disconnection error:', err);
      setError('Failed to disconnect wallet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        userAddress,
        wallet,
        tezos: tezosToolkit,
        connectWallet,
        disconnectWallet,
        loading,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};