/**
 * Address Utility Functions
 */

import { UI } from '../constants';

/**
 * Shorten a Tezos address for display
 * @param address - Full Tezos address (e.g., tz1...)
 * @param startLength - Number of characters to show at start
 * @param endLength - Number of characters to show at end
 * @returns Shortened address (e.g., tz1...5xk)
 */
export const shortenAddress = (
  address: string,
  startLength: number = UI.ADDRESS_DISPLAY_LENGTH.START,
  endLength: number = UI.ADDRESS_DISPLAY_LENGTH.END
): string => {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Validate Tezos address format
 * @param address - Address to validate
 * @returns True if valid Tezos address
 */
export const isValidTezosAddress = (address: string): boolean => {
  // Tezos addresses start with tz1, tz2, tz3, or KT1
  const tezosAddressRegex = /^(tz1|tz2|tz3|KT1)[1-9A-HJ-NP-Za-km-z]{33}$/;
  return tezosAddressRegex.test(address);
};

/**
 * Get address type
 * @param address - Tezos address
 * @returns Address type (implicit, originated, or unknown)
 */
export const getAddressType = (address: string): 'implicit' | 'originated' | 'unknown' => {
  if (address.startsWith('tz1') || address.startsWith('tz2') || address.startsWith('tz3')) {
    return 'implicit';
  }
  if (address.startsWith('KT1')) {
    return 'originated';
  }
  return 'unknown';
};

/**
 * Format address for display with type indicator
 * @param address - Tezos address
 * @returns Formatted address with type
 */
export const formatAddressWithType = (address: string): string => {
  const type = getAddressType(address);
  const shortened = shortenAddress(address);
  
  if (type === 'implicit') {
    return `${shortened} (User)`;
  }
  if (type === 'originated') {
    return `${shortened} (Contract)`;
  }
  return shortened;
};
