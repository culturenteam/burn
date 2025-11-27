import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-types';
import { WalletContextType, NetworkConfig, WalletError, WalletErrorType } from '../types';

/**
 * Network Configuration for Mainnet
 */
const NETWORK_CONFIG: NetworkConfig = {
  rpcUrl: 'https://mainnet.api.tez.ie',
  networkType: NetworkType.MAINNET,
  appName: 'Tezos NFT Burn dApp',
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

/**
 * Initialize Tezos Toolkit globally to reuse the instance
 * This prevents multiple instances and ensures consistent state
 */
const tezosToolkit = new TezosToolkit(NETWORK_CONFIG.rpcUrl);

/**
 * WalletProvider Component
 * Manages wallet state and provides connection methods to the app
 */
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<BeaconWallet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize Beacon Wallet on component mount
   * Checks for existing active account to restore session
   */
  useEffect(() => {
    const initWallet = async () => {
      try {
        console.log('🔄 Initializing Beacon Wallet...');
        
        // Network must be configured during initialization, not in requestPermissions
        const newWallet = new BeaconWallet({
          name: NETWORK_CONFIG.appName,
          preferredNetwork: NETWORK_CONFIG.networkType,
        });

        console.log('✅ BeaconWallet instance created');
        
        tezosToolkit.setWalletProvider(newWallet);
        setWallet(newWallet);

        console.log('✅ Wallet provider set on Tezos Toolkit');

        // Restore previous session if exists
        const activeAccount = await newWallet.client.getActiveAccount();
        if (activeAccount) {
          setUserAddress(activeAccount.address);
          console.log('✅ Session restored:', activeAccount.address);
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (err) {
        console.error('❌ Wallet initialization failed:', err);
        const walletError = new WalletError(
          WalletErrorType.INITIALIZATION_FAILED,
          'Failed to initialize wallet system',
          err
        );
        setError(walletError.message);
      }
    };

    initWallet();
  }, []);

  /**
   * Connect wallet using Beacon
   * Requests permissions and retrieves user address
   * 
   * Note: Network is configured during BeaconWallet initialization,
   * NOT in requestPermissions (API changed in newer Beacon versions)
   */
  const connectWallet = useCallback(async () => {
    if (!wallet) {
      const walletError = new WalletError(
        WalletErrorType.INITIALIZATION_FAILED,
        'Wallet is not initialized'
      );
      setError(walletError.message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Requesting wallet permissions...');
      console.log('Network is pre-configured: MAINNET');
      
      // Network is already configured in BeaconWallet constructor
      // Do NOT pass network parameter here (API changed)
      await wallet.requestPermissions();

      console.log('✅ Permissions granted, getting address...');
      
      const address = await wallet.getPKH();
      setUserAddress(address);
      console.log('✅ Wallet connected:', address);
      
      // Verify the connection
      const activeAccount = await wallet.client.getActiveAccount();
      console.log('✅ Active account verified:', activeAccount?.address);
      
    } catch (err: any) {
      console.error('❌ Connection error:', err);
      console.error('Error details:', {
        message: err?.message,
        name: err?.name,
        type: err?.constructor?.name,
        stack: err?.stack,
      });
      
      // Handle user rejection gracefully
      if (
        err?.message?.includes('Aborted') || 
        err?.message?.includes('rejected') ||
        err?.message?.includes('cancelled') ||
        err?.message?.includes('denied') ||
        err?.name === 'AbortedBeaconError' ||
        err?.constructor?.name === 'AbortedBeaconError'
      ) {
        console.log('ℹ️ User cancelled connection');
        setError(null);
      } else {
        // Provide more specific error message
        let errorMessage = 'Failed to connect wallet. Please try again.';
        
        if (err?.message?.includes('network')) {
          errorMessage = 'Network error. Please check your wallet is set to Ghostnet.';
        } else if (err?.message?.includes('timeout')) {
          errorMessage = 'Connection timeout. Please try again.';
        } else if (err?.message) {
          errorMessage = `Connection failed: ${err.message}`;
        }
        
        const walletError = new WalletError(
          WalletErrorType.CONNECTION_FAILED,
          errorMessage,
          err
        );
        setError(walletError.message);
      }
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  /**
   * Disconnect wallet and clear active account
   */
  const disconnectWallet = useCallback(async () => {
    if (!wallet) return;

    setLoading(true);
    setError(null);

    try {
      await wallet.clearActiveAccount();
      setUserAddress(null);
      console.log('✅ Wallet disconnected');
    } catch (err) {
      console.error('❌ Disconnection error:', err);
      const walletError = new WalletError(
        WalletErrorType.DISCONNECTION_FAILED,
        'Failed to disconnect wallet',
        err
      );
      setError(walletError.message);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  const contextValue: WalletContextType = {
    userAddress,
    wallet,
    tezos: tezosToolkit,
    isConnected: !!userAddress,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

/**
 * Custom hook to access wallet context
 * Must be used within WalletProvider
 */
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};