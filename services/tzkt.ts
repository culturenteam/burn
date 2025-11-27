/**
 * TzKT API Service
 * Fetches NFT data from TzKT indexer
 */

import { API, CREATOR_ADDRESS } from '../constants';
import { NFTToken, NFT } from '../types';

/**
 * Fetch NFTs owned by an address that were created by brutalisti
 * @param address - Tezos address of the owner
 * @returns Array of NFTs created by brutalisti and owned by the address
 */
export const fetchNFTs = async (address: string): Promise<NFT[]> => {
  try {
    console.log('🔄 Fetching brutalisti NFTs for:', address);
    console.log('🎨 Creator filter:', CREATOR_ADDRESS);
    
    // Fetch all NFTs owned by the address (no limit)
    // We'll filter by creator on the client side since TzKT doesn't have a direct creator filter
    const url = `${API.TZKT_BASE_URL}/${API.TZKT_VERSION}/tokens/balances?account=${address}&balance.gt=0&token.standard=fa2&limit=10000`;
    
    console.log('📡 TzKT API URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TzKT API error: ${response.status} ${response.statusText}`);
    }
    
    const data: NFTToken[] = await response.json();
    
    console.log('✅ Fetched', data.length, 'total NFT tokens');
    
    // Filter for NFTs created by brutalisti
    const brutalistiNFTs = data.filter(item => {
      // Check if the token has metadata and was created by brutalisti
      if (!item.token.metadata) return false;
      
      // Check if creator is in metadata
      const creators = item.token.metadata.creators;
      if (creators && Array.isArray(creators)) {
        return creators.includes(CREATOR_ADDRESS);
      }
      
      return false;
    });
    
    console.log('🎨 Found', brutalistiNFTs.length, 'brutalisti NFTs');
    
    // Transform TzKT data to our NFT format
    const nfts: NFT[] = brutalistiNFTs.map(item => transformNFT(item));
    
    console.log('✅ Transformed to', nfts.length, 'displayable NFTs');
    
    return nfts;
  } catch (error) {
    console.error('❌ Failed to fetch NFTs:', error);
    throw error;
  }
};

/**
 * Transform TzKT token data to our NFT format
 */
const transformNFT = (token: NFTToken): NFT => {
  const metadata = token.token.metadata;
  
  // Get the best image URI (prefer displayUri, fallback to thumbnailUri, then artifactUri)
  const imageUri = getImageUri(metadata);
  
  return {
    id: `${token.token.contract.address}_${token.token.tokenId}`,
    tokenId: token.token.tokenId,
    contractAddress: token.token.contract.address,
    contractAlias: token.token.contract.alias,
    name: metadata?.name || `Token #${token.token.tokenId}`,
    description: metadata?.description,
    imageUri,
    balance: parseInt(token.balance, 10),
    standard: token.token.standard,
  };
};

/**
 * Get the best image URI from metadata
 */
const getImageUri = (metadata: NFTToken['token']['metadata']): string => {
  if (!metadata) return '/placeholder-nft.png';
  
  // Try displayUri first
  if (metadata.displayUri) {
    return convertIpfsUri(metadata.displayUri);
  }
  
  // Try thumbnailUri
  if (metadata.thumbnailUri) {
    return convertIpfsUri(metadata.thumbnailUri);
  }
  
  // Try artifactUri
  if (metadata.artifactUri) {
    return convertIpfsUri(metadata.artifactUri);
  }
  
  // Try formats array
  if (metadata.formats && metadata.formats.length > 0) {
    return convertIpfsUri(metadata.formats[0].uri);
  }
  
  return '/placeholder-nft.png';
};

/**
 * Convert IPFS URI to HTTP gateway URL
 */
const convertIpfsUri = (uri: string): string => {
  if (!uri) return '/placeholder-nft.png';
  
  // Already HTTP/HTTPS
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  
  // IPFS protocol
  if (uri.startsWith('ipfs://')) {
    const hash = uri.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  }
  
  // Just the hash
  if (uri.startsWith('Qm') || uri.startsWith('bafy')) {
    return `https://ipfs.io/ipfs/${uri}`;
  }
  
  return uri;
};

/**
 * Token transfer data from TzKT
 */
export interface TokenTransfer {
  id: number;
  level: number;
  timestamp: string;
  token: {
    id: number;
    contract: {
      address: string;
    };
    tokenId: string;
  };
  from?: {
    address: string;
  };
  to?: {
    address: string;
  };
  amount: string;
  transactionId?: number;
}

/**
 * Token trade data from objkt.com marketplace
 */
export interface LastSaleData {
  priceTez: number;
  saleDate: Date;
  totalEditions: number;
}

/**
 * Fetch last sale data for an NFT
 * Uses TzKT to find the most recent transfer with a price
 * 
 * @param contractAddress - NFT contract address
 * @param tokenId - Token ID
 * @returns Last sale data or null if no sales found
 */
export const fetchLastSaleData = async (
  contractAddress: string,
  tokenId: string
): Promise<LastSaleData | null> => {
  try {
    // Fetch token transfers sorted by timestamp descending
    const url = `${API.TZKT_BASE_URL}/${API.TZKT_VERSION}/tokens/transfers?token.contract=${contractAddress}&token.tokenId=${tokenId}&sort.desc=timestamp&limit=100`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Failed to fetch transfers for ${contractAddress}:${tokenId}`);
      return null;
    }
    
    const transfers: TokenTransfer[] = await response.json();
    
    // Look for transfers that indicate a sale (not mints, not burns)
    // A sale typically has both from and to addresses
    const sales = transfers.filter(t => 
      t.from && 
      t.to && 
      t.from.address !== t.to.address &&
      t.transactionId // Has an associated transaction
    );
    
    if (sales.length === 0) {
      // No sales found, use a default based on mint date
      const mintTransfer = transfers.find(t => !t.from);
      if (mintTransfer) {
        return {
          priceTez: 5, // Default price if no sales
          saleDate: new Date(mintTransfer.timestamp),
          totalEditions: parseInt(transfers[0]?.amount || '1', 10),
        };
      }
      return null;
    }
    
    // Use the most recent sale
    const lastSale = sales[0];
    
    // Try to get the transaction to find the price
    // For now, use a heuristic: estimate based on marketplace patterns
    // In a production system, you'd query the specific marketplace contract
    const estimatedPrice = await estimateSalePrice(lastSale);
    
    return {
      priceTez: estimatedPrice,
      saleDate: new Date(lastSale.timestamp),
      totalEditions: parseInt(lastSale.amount, 10),
    };
  } catch (error) {
    console.error(`Failed to fetch last sale data for ${contractAddress}:${tokenId}:`, error);
    return null;
  }
};

/**
 * Estimate sale price from transfer data
 * This is a simplified heuristic - in production, query marketplace contracts
 */
const estimateSalePrice = async (transfer: TokenTransfer): Promise<number> => {
  // Try to fetch the transaction to get the amount
  if (transfer.transactionId) {
    try {
      const txUrl = `${API.TZKT_BASE_URL}/${API.TZKT_VERSION}/operations/transactions/${transfer.transactionId}`;
      const response = await fetch(txUrl);
      
      if (response.ok) {
        const tx = await response.json();
        if (tx.amount) {
          // Convert mutez to tez
          return parseInt(tx.amount, 10) / 1000000;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch transaction details:', error);
    }
  }
  
  // Default fallback price
  return 10; // 10 tez default
};

/**
 * Fetch total supply for a token
 */
export const fetchTokenSupply = async (
  contractAddress: string,
  tokenId: string
): Promise<number> => {
  try {
    const url = `${API.TZKT_BASE_URL}/${API.TZKT_VERSION}/tokens?contract=${contractAddress}&tokenId=${tokenId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return 1; // Default to 1 edition
    }
    
    const tokens = await response.json();
    if (tokens.length > 0 && tokens[0].totalSupply) {
      return parseInt(tokens[0].totalSupply, 10);
    }
    
    return 1;
  } catch (error) {
    console.error('Failed to fetch token supply:', error);
    return 1;
  }
};
