/**
 * Application Constants
 * Centralized configuration values
 */

import { NetworkType } from '@airgap/beacon-types';

/**
 * Network Configuration
 */
export const NETWORK = {
  RPC_URL: 'https://mainnet.api.tez.ie',
  TYPE: NetworkType.MAINNET,
  NAME: 'Mainnet',
  EXPLORER_URL: 'https://tzkt.io',
} as const;

/**
 * Application Configuration
 */
export const APP = {
  NAME: 'Tezos NFT Burn dApp',
  VERSION: '1.0.0',
  PHASE: 1,
} as const;

/**
 * Tezos Burn Address
 * Standard burn address for Tezos (Phase 3)
 */
export const BURN_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

/**
 * Creator Address
 * brutalisti creator address - only show NFTs created by this address
 */
export const CREATOR_ADDRESS = 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva';

/**
 * True Vision NFT Configuration
 * The reward token for burning brutalisti NFTs
 */
export const TRUE_VISION = {
  CONTRACT_ADDRESS: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
  TOKEN_ID: '754916',
  NAME: 'True Vision',
  SYMBOL: 'TV',
} as const;

/**
 * Burn Rewarder Contract
 * Smart contract that handles burn + automatic True Vision distribution
 * TODO: Deploy contract and update this address
 * See SIMPLE_SOLUTION.md for deployment instructions
 */
export const BURN_REWARDER_CONTRACT = null as string | null; // Set to contract address after deployment

/**
 * API Configuration (Phase 2)
 */
export const API = {
  TZKT_BASE_URL: 'https://api.tzkt.io',
  TZKT_VERSION: 'v1',
} as const;

/**
 * UI Configuration
 */
export const UI = {
  ADDRESS_DISPLAY_LENGTH: {
    START: 6,
    END: 4,
  },
  ANIMATION_DURATION: 500,
  DEBOUNCE_DELAY: 300,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_INITIALIZED: 'Wallet is not initialized',
  CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  DISCONNECTION_FAILED: 'Failed to disconnect wallet',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  WALLET_DISCONNECTED: 'Wallet disconnected',
  TRANSACTION_SENT: 'Transaction sent successfully',
  NFT_BURNED: 'NFT burned successfully',
} as const;
