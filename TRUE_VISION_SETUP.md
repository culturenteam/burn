# True Vision Reward System Setup

## Overview

The True Vision reward system calculates dynamic rewards for burning NFTs based on:
- Last sale price (80% base reward)
- Time decay (10% per month since last sale)
- Edition count penalty (5% per 10 editions above 10)
- Minimum guarantee (1 True Vision token)

## Current Implementation

### Burn Flow
1. User burns NFT → sends to burn address
2. System calculates True Vision reward
3. Transaction logs the reward amount
4. **Creator manually distributes rewards** after burn confirmation

### Why Manual Distribution?

Automatic distribution in the same transaction requires:
- Creator to pre-approve a smart contract as operator
- A custom smart contract to handle burn + reward logic
- Complex permission management

Manual distribution is simpler and more flexible for the initial implementation.

## Configuration Required

Update `/workspaces/burn/constants/index.ts` with actual True Vision NFT details:

```typescript
export const TRUE_VISION = {
  CONTRACT_ADDRESS: 'KT1...', // Replace with actual True Vision contract
  TOKEN_ID: '123',            // Replace with actual True Vision token ID
  NAME: 'True Vision',
  SYMBOL: 'TV',
} as const;
```

## Finding True Vision NFT Details

### Option 1: Via TZKT API
```bash
# Find tokens created by brutalisti
curl "https://api.tzkt.io/v1/tokens/balances?account=tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva&token.standard=fa2&limit=100" | jq '.[] | select(.token.metadata.name | contains("True Vision"))'
```

### Option 2: Via TZKT Explorer
1. Go to https://tzkt.io/tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva/tokens
2. Find "True Vision" in the list
3. Note the contract address and token ID

### Option 3: Via objkt.com
1. Go to https://objkt.com/profile/brutalisti/created
2. Find "True Vision" artwork
3. Click to view details
4. Contract and token ID are in the URL or details section

## Reward Distribution Workflow

### For the Creator (Manual Process)

1. **Monitor Burns**
   - Watch for transactions to burn address: `tz1burnburnburnburnburnburnburjAYjjX`
   - Check console logs for reward amounts
   - Or query TZKT for recent burns

2. **Calculate Rewards**
   - System already calculates and logs rewards
   - Can also query the dApp's pricing service

3. **Send True Vision Tokens**
   - Use Temple/Kukai wallet
   - Send calculated amount to burner's address
   - Include burn transaction hash in memo

### Example Query for Recent Burns
```bash
# Get recent transfers to burn address
curl "https://api.tzkt.io/v1/tokens/transfers?to=tz1burnburnburnburnburnburnburjAYjjX&sort.desc=timestamp&limit=20"
```

## Future Enhancements

### Option 1: Smart Contract Automation
Create a custom smart contract that:
- Accepts NFT burns
- Automatically transfers True Vision rewards
- Maintains reward calculation logic on-chain

### Option 2: Backend Service
Build a backend service that:
- Monitors burn transactions
- Automatically sends True Vision rewards
- Maintains burn history and analytics

### Option 3: Indexer Integration
Use a blockchain indexer to:
- Track all burns in real-time
- Trigger automatic reward distribution
- Provide burn analytics dashboard

## Testing

The pricing calculations have been tested with various scenarios:
- Recent sales with standard editions
- Old sales with time decay
- High edition counts with penalties
- Minimum reward guarantees

All calculations work correctly. The only manual step is the actual token distribution.

## Support

For questions or issues:
1. Check console logs for detailed burn information
2. Verify True Vision contract/token ID is correct
3. Ensure creator wallet has sufficient True Vision tokens
4. Monitor TZKT for transaction confirmations
