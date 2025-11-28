# Smart Contracts

Documentation for smart contracts used in the Tezos NFT Burn dApp.

## Overview

The dApp uses smart contracts for:
1. **NFT Burning** - Transfer NFTs to burn address
2. **True Vision Rewards** - Automated reward distribution
3. **Operator Management** - Permission handling for batch operations

## Burn Address

**Ghostnet:** `tz1burnburnburnburnburnburnburjAYjjX`
**Mainnet:** `tz1burnburnburnburnburnburnburjAYjjX`

This is a provably unspendable address (no known private key).

## True Vision Token

**Contract:** `KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton`
**Token ID:** `754916`
**Standard:** FA2 (Tezos NFT/Token Standard)

## Burn Rewarder Contract

### Purpose

Atomic transaction that:
1. Burns NFT (transfers to burn address)
2. Sends True Vision reward to burner
3. Ensures both operations succeed or both fail

### Architecture

```
User → BurnRewarder Contract → [Burn NFT + Send True Vision]
                ↓
        Burn Address (NFT destroyed)
                ↓
        User Wallet (True Vision received)
```

### Storage Structure

```typescript
{
  admin: address,                    // Contract owner
  trueVisionContract: address,       // KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton
  trueVisionTokenId: nat,           // 754916
  burnAddress: address,              // tz1burnburnburnburnburnburnburjAYjjX
  rewardPerBurn: nat                // True Vision amount per burn
}
```

### Entrypoints

#### burn_and_reward

Burns NFT and sends reward in single transaction.

**Parameters:**
```typescript
{
  nftContract: address,    // NFT contract address
  tokenId: nat,           // NFT token ID
  amount: nat             // Amount to burn (usually 1)
}
```

**Logic:**
1. Verify caller owns NFT
2. Transfer NFT from caller to burn address
3. Transfer True Vision from contract to caller
4. Emit burn event

**Example Call:**
```typescript
const contract = await tezos.wallet.at(BURN_REWARDER_ADDRESS);
const op = await contract.methods.burn_and_reward(
  nftContract,
  tokenId,
  1
).send();
await op.confirmation();
```

#### fund_rewards

Deposits True Vision tokens into contract (admin only).

**Parameters:**
```typescript
{
  amount: nat    // Amount of True Vision to deposit
}
```

#### withdraw_rewards

Withdraws True Vision tokens from contract (admin only).

**Parameters:**
```typescript
{
  amount: nat,           // Amount to withdraw
  recipient: address     // Recipient address
}
```

### Deployment

**Ghostnet Contract:** `KT1...` (to be deployed)
**Mainnet Contract:** Not deployed yet

#### Deploy with Taquito

```typescript
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
tezos.setProvider({
  signer: await InMemorySigner.fromSecretKey('edsk...')
});

const op = await tezos.contract.originate({
  code: contractCode,
  storage: {
    admin: 'tz1...',
    trueVisionContract: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
    trueVisionTokenId: 754916,
    burnAddress: 'tz1burnburnburnburnburnburnburjAYjjX',
    rewardPerBurn: 1
  }
});

await op.confirmation();
console.log('Contract deployed:', op.contractAddress);
```

## FA2 Operator Pattern

### Purpose

Allows contract to transfer NFTs on behalf of user without requiring approval for each transaction.

### Setup

**1. User approves contract as operator:**
```typescript
const nftContract = await tezos.wallet.at(NFT_CONTRACT_ADDRESS);
const op = await nftContract.methods.update_operators([
  {
    add_operator: {
      owner: userAddress,
      operator: BURN_REWARDER_ADDRESS,
      token_id: tokenId
    }
  }
]).send();
await op.confirmation();
```

**2. Contract can now transfer NFT:**
```typescript
// Contract calls transfer on NFT contract
const op = await nftContract.methods.transfer([
  {
    from_: userAddress,
    txs: [{
      to_: burnAddress,
      token_id: tokenId,
      amount: 1
    }]
  }
]).send();
```

**3. User revokes operator (optional):**
```typescript
const op = await nftContract.methods.update_operators([
  {
    remove_operator: {
      owner: userAddress,
      operator: BURN_REWARDER_ADDRESS,
      token_id: tokenId
    }
  }
]).send();
```

## Pricing Logic

### Current Implementation

**Base Reward:** 1 True Vision per NFT burned

**Future Enhancements:**
- Dynamic pricing based on NFT rarity
- Bonus rewards for specific collections
- Time-based multipliers
- Batch burn bonuses

### Pricing Service

Located in `/services/pricing.ts`:

```typescript
export const calculateReward = (nft: NFT): number => {
  // Base reward
  let reward = 1;
  
  // Future: Add rarity multiplier
  // if (nft.rarity === 'rare') reward *= 2;
  
  // Future: Add collection bonus
  // if (nft.collection === 'special') reward += 5;
  
  return reward;
};
```

## Security Considerations

### Contract Security

- **Admin-only functions** - Only contract owner can fund/withdraw
- **Atomic operations** - Burn and reward happen together or not at all
- **Balance checks** - Verify contract has sufficient True Vision before burn
- **Operator permissions** - User explicitly grants permission

### Frontend Security

- **No private keys** - Wallet handles all signing
- **Transaction preview** - Show user what will happen before signing
- **Error handling** - Graceful failure if transaction fails
- **Gas estimation** - Calculate fees before transaction

## Testing

### Testnet Testing

1. **Get testnet tokens:**
   - XTZ: [faucet.ghostnet.teztnets.com](https://faucet.ghostnet.teztnets.com/)
   - True Vision: Mint on testnet or request from admin

2. **Test burn flow:**
   - Connect wallet
   - Approve operator
   - Burn NFT
   - Verify True Vision received

3. **Verify on TzKT:**
   - Check transaction: [ghostnet.tzkt.io](https://ghostnet.tzkt.io/)
   - Verify NFT transferred to burn address
   - Verify True Vision transferred to user

### Contract Testing

```bash
# Test with SmartPy
smartpy test burn_rewarder.py

# Test with Taquito
npm run test:contract
```

## Mainnet Migration

### Pre-Deployment Checklist

- [ ] Contract audited by security firm
- [ ] Extensive testnet testing completed
- [ ] Admin wallet secured (hardware wallet recommended)
- [ ] True Vision tokens acquired for rewards
- [ ] Gas costs calculated
- [ ] Backup/recovery plan in place

### Deployment Steps

1. **Deploy contract to mainnet**
2. **Fund contract with True Vision**
3. **Update frontend configuration**
4. **Test with small amounts first**
5. **Monitor transactions closely**
6. **Announce to users**

### Configuration Changes

Update `/constants/index.ts`:

```typescript
export const NETWORK_CONFIG = {
  rpcUrl: 'https://mainnet.ecadinfra.com',  // Change from ghostnet
  networkType: NetworkType.MAINNET,         // Change from GHOSTNET
  appName: 'Tezos NFT Burn dApp',
};

export const BURN_REWARDER_ADDRESS = 'KT1...';  // Mainnet contract address
```

## Contract Files

Located in `/contracts/` directory:

- `burn_rewarder.tz` - Michelson contract code
- `burn_receiver.py` - SmartPy implementation
- `reward_sender.py` - Reward distribution logic
- `burn_rewarder_storage.tz` - Initial storage
- `DEPLOYMENT_READY.md` - Deployment instructions

## Resources

### Tezos Standards
- [FA2 Standard](https://tzip.tezosagora.org/proposal/tzip-12/)
- [Contract Standards](https://tezos.com/developers/smart-contracts/)

### Development Tools
- [SmartPy IDE](https://smartpy.io/)
- [LIGO IDE](https://ide.ligolang.org/)
- [Better Call Dev](https://better-call.dev/) - Contract explorer

### Documentation
- [Taquito Contract API](https://tezostaquito.io/docs/contracts_library)
- [Michelson Reference](https://tezos.gitlab.io/active/michelson.html)
- [FA2 Tutorial](https://opentezos.com/tezos-basics/token-standards/)

## Support

For contract-related issues:
1. Check TzKT explorer for transaction details
2. Verify contract storage and entrypoints
3. Test on Ghostnet first
4. Review contract code in `/contracts/`
5. Check gas estimation and fees
