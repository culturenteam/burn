/**
 * Core Type Definitions for Tezos dApp
 * Phase 1: Wallet Connection Types
 */

import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-types';

/**
 * Wallet connection state interface
 */
export interface WalletState {
  userAddress: string | null;
  wallet: BeaconWallet | null;
  tezos: TezosToolkit;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Wallet context methods interface
 */
export interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  rpcUrl: string;
  networkType: NetworkType;
  appName: string;
}

/**
 * Connection status enum
 */
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

/**
 * Wallet error types
 */
export enum WalletErrorType {
  INITIALIZATION_FAILED = 'initialization_failed',
  CONNECTION_FAILED = 'connection_failed',
  DISCONNECTION_FAILED = 'disconnection_failed',
  USER_REJECTED = 'user_rejected',
  NETWORK_ERROR = 'network_error',
}

/**
 * Custom wallet error class
 */
export class WalletError extends Error {
  constructor(
    public type: WalletErrorType,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'WalletError';
  }
}

/**
 * Phase 2: NFT Types
 */

/**
 * NFT Token metadata from TzKT API
 */
export interface NFTToken {
  id: number;
  account: {
    address: string;
  };
  token: {
    id: number;
    contract: {
      address: string;
      alias?: string;
    };
    tokenId: string;
    standard: string;
    metadata?: {
      name?: string;
      description?: string;
      symbol?: string;
      decimals?: string;
      displayUri?: string;
      thumbnailUri?: string;
      artifactUri?: string;
      formats?: Array<{
        uri: string;
        mimeType: string;
      }>;
      creators?: string[];
      tags?: string[];
    };
  };
  balance: string;
  transfersCount: number;
  firstLevel: number;
  firstTime: string;
  lastLevel: number;
  lastTime: string;
}

/**
 * Simplified NFT for display
 */
export interface NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  contractAlias?: string;
  name: string;
  description?: string;
  imageUri: string;
  balance: number;
  standard: string;
  // True Vision pricing data
  lastSalePrice?: number; // Last sale price in tez
  lastSaleDate?: Date; // Date of last sale
  totalEditions?: number; // Total supply of this token
  trueVisionReward?: number; // Calculated True Vision reward
  pricingLastUpdated?: Date; // When pricing was last calculated
}

/**
 * NFT fetch state
 */
export interface NFTState {
  nfts: NFT[];
  loading: boolean;
  error: string | null;
}
