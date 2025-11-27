# Automated True Vision Reward Distribution Guide

## Overview

This guide explains how to automate True Vision token distribution when users burn NFTs. There are three main approaches, each with different complexity and security trade-offs.

## Current System

**Manual Distribution:**
- User burns NFT → Transaction logs reward amount
- Creator manually sends True Vision tokens
- Simple but requires manual intervention

**Goal:** Automate this so rewards are sent immediately when NFT is burned.

---

## Option 1: Smart Contract (Recommended)

### How It Works

Deploy a smart contract that:
1. Accepts NFT burns from users
2. Transfers NFT to burn address
3. Automatically sends True Vision tokens to user
4. All in one atomic transaction

### Architecture

```
User → BurnRewarder Contract → [Burn NFT + Send True Vision]
           ↓                              ↓
    Burn Address (NFT)              User Wallet (TV)
```

### Advantages
✅ Fully decentralized
✅ Atomic transactions (burn + reward together)
✅ No backend infrastructure needed
✅ Transparent and auditable
✅ No ongoing maintenance

### Disadvantages
❌ Requires smart contract development
❌ Contract must hold True Vision tokens
❌ Need to fund contract periodically
❌ Gas costs for contract deployment

### Implementation Steps

#### Step 1: Write Smart Contract

**Using SmartPy (Python-like):**

```python
import smartpy as sp

@sp.module
def main():
    class BurnRewarder(sp.Contract):
        def __init__(self, admin, true_vision_contract, burn_address):
            self.data.admin = admin
            self.data.true_vision_contract = true_vision_contract
            self.data.true_vision_token_id = 754916  # Your True Vision token ID
            self.data.burn_address = burn_address
            self.data.paused = False
        
        @sp.entrypoint
        def burn_and_reward(self, params):
            # Verify not paused
            assert not self.data.paused, "Contract is paused"
            
            # 1. Transfer NFT from user to burn address
            nft_transfer = sp.contract(
                sp.list(sp.record(
                    from_=sp.address,
                    txs=sp.list(sp.record(
                        to_=sp.address,
                        token_id=sp.nat,
                        amount=sp.nat
                    ))
                )),
                params.nft_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            sp.transfer(
                [sp.record(
                    from_=sp.sender,
                    txs=[sp.record(
                        to_=self.data.burn_address,
                        token_id=params.token_id,
                        amount=params.amount
                    )]
                )],
                sp.mutez(0),
                nft_transfer
            )
            
            # 2. Transfer True Vision reward from contract to user
            tv_transfer = sp.contract(
                sp.list(sp.record(
                    from_=sp.address,
                    txs=sp.list(sp.record(
                        to_=sp.address,
                        token_id=sp.nat,
                        amount=sp.nat
                    ))
                )),
                self.data.true_vision_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            sp.transfer(
                [sp.record(
                    from_=sp.self_address(),
                    txs=[sp.record(
                        to_=sp.sender,
                        token_id=self.data.true_vision_token_id,
                        amount=params.reward_amount
                    )]
                )],
                sp.mutez(0),
                tv_transfer
            )
        
        @sp.entrypoint
        def fund_contract(self, amount):
            # Only admin can fund
            assert sp.sender == self.data.admin, "Only admin"
            # Accept True Vision tokens
            pass
        
        @sp.entrypoint
        def withdraw(self, params):
            # Only admin can withdraw
            assert sp.sender == self.data.admin, "Only admin"
            
            tv_transfer = sp.contract(
                sp.list(sp.record(
                    from_=sp.address,
                    txs=sp.list(sp.record(
                        to_=sp.address,
                        token_id=sp.nat,
                        amount=sp.nat
                    ))
                )),
                self.data.true_vision_contract,
                entrypoint="transfer"
            ).unwrap_some()
            
            sp.transfer(
                [sp.record(
                    from_=sp.self_address(),
                    txs=[sp.record(
                        to_=params.recipient,
                        token_id=self.data.true_vision_token_id,
                        amount=params.amount
                    )]
                )],
                sp.mutez(0),
                tv_transfer
            )
        
        @sp.entrypoint
        def set_paused(self, paused):
            assert sp.sender == self.data.admin, "Only admin"
            self.data.paused = paused

# Test
@sp.add_test()
def test():
    scenario = sp.test_scenario("BurnRewarder", main)
    admin = sp.test_account("Admin")
    
    contract = main.BurnRewarder(
        admin=admin.address,
        true_vision_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
        burn_address=sp.address("tz1burnburnburnburnburnburnburjAYjjX")
    )
    
    scenario += contract
```

#### Step 2: Compile and Deploy

```bash
# Install SmartPy
pip install smartpy

# Compile contract
smartpy compile burn_rewarder.py output/

# Deploy using Better Call Dev or Temple Wallet
# Or use Taquito deployment script
```

#### Step 3: Fund Contract with True Vision

```typescript
// Transfer True Vision tokens to the contract
const tvContract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton');

await tvContract.methods.transfer([{
  from_: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva', // Your address
  txs: [{
    to_: 'KT1...', // Deployed contract address
    token_id: 754916,
    amount: 10000000000  // 10,000 True Vision (with 6 decimals)
  }]
}]).send();
```

#### Step 4: Update dApp Configuration

```typescript
// In constants/index.ts
export const BURN_REWARDER_CONTRACT = 'KT1...'; // Your deployed contract
```

#### Step 5: Update Burn Service

The burn service already supports this! Just set `BURN_REWARDER_CONTRACT` and it will use automatic distribution.

### Cost Estimate
- **Deployment:** ~0.5-1 XTZ
- **Per burn:** ~0.01-0.02 XTZ (gas)
- **Funding:** Free (just token transfer)

---

## Option 2: Backend Service with Wallet

### How It Works

Run a backend service that:
1. Monitors blockchain for burn transactions
2. Automatically sends True Vision tokens
3. Uses a wallet you control

### Architecture

```
User burns NFT → TzKT Indexer → Backend Service → Send True Vision
                                      ↓
                              Wallet with TV tokens
```

### Advantages
✅ Flexible logic (can change rules easily)
✅ Can add analytics and tracking
✅ No smart contract complexity
✅ Can batch transactions

### Disadvantages
❌ Requires server infrastructure
❌ Need to secure private keys
❌ Ongoing maintenance
❌ Single point of failure
❌ Not fully decentralized

### Implementation Steps

#### Step 1: Create Backend Service

**Using Node.js + Express:**

```typescript
// server.ts
import express from 'express';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import axios from 'axios';

const app = express();
const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

// IMPORTANT: Store this securely (use environment variables)
const PRIVATE_KEY = process.env.REWARD_WALLET_PRIVATE_KEY!;
const TRUE_VISION_CONTRACT = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
const TRUE_VISION_TOKEN_ID = 754916;
const BURN_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

// Set up signer
tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(PRIVATE_KEY) });

// Track processed burns to avoid duplicates
const processedBurns = new Set<string>();

// Monitor burns every 30 seconds
setInterval(async () => {
  try {
    // Get recent transfers to burn address
    const response = await axios.get(
      `https://api.tzkt.io/v1/tokens/transfers?to=${BURN_ADDRESS}&sort.desc=timestamp&limit=20`
    );
    
    for (const transfer of response.data) {
      const burnId = `${transfer.transactionId}-${transfer.from.address}`;
      
      // Skip if already processed
      if (processedBurns.has(burnId)) continue;
      
      // Calculate reward (use your pricing logic)
      const rewardAmount = calculateReward(transfer);
      
      if (rewardAmount > 0) {
        console.log(`Sending ${rewardAmount} TV to ${transfer.from.address}`);
        
        // Send True Vision tokens
        const tvContract = await tezos.wallet.at(TRUE_VISION_CONTRACT);
        const op = await tvContract.methods.transfer([{
          from_: await tezos.signer.publicKeyHash(),
          txs: [{
            to_: transfer.from.address,
            token_id: TRUE_VISION_TOKEN_ID,
            amount: rewardAmount
          }]
        }]).send();
        
        await op.confirmation();
        console.log(`✅ Reward sent! Hash: ${op.opHash}`);
        
        // Mark as processed
        processedBurns.add(burnId);
      }
    }
  } catch (error) {
    console.error('Error processing burns:', error);
  }
}, 30000); // Check every 30 seconds

function calculateReward(transfer: any): number {
  // Implement your pricing logic here
  // This should match the frontend calculation
  return 1000000; // Example: 1 TV (with 6 decimals)
}

app.listen(3001, () => {
  console.log('Reward service running on port 3001');
});
```

#### Step 2: Secure Deployment

```bash
# Use environment variables for secrets
export REWARD_WALLET_PRIVATE_KEY="edsk..."

# Run with PM2 for auto-restart
npm install -g pm2
pm2 start server.ts --name reward-service

# Or use Docker
docker build -t reward-service .
docker run -e REWARD_WALLET_PRIVATE_KEY="edsk..." reward-service
```

#### Step 3: Monitor and Maintain

```bash
# Check logs
pm2 logs reward-service

# Monitor status
pm2 status

# Restart if needed
pm2 restart reward-service
```

### Cost Estimate
- **Server:** $5-20/month (VPS)
- **Per reward:** ~0.001-0.002 XTZ (gas)
- **Development:** 4-8 hours

---

## Option 3: Operator Permission (Simplest)

### How It Works

Give the dApp's deployed address operator permission on your True Vision tokens. The dApp can then send tokens on your behalf.

### Architecture

```
User → dApp (with operator permission) → Send True Vision from your wallet
```

### Advantages
✅ Simplest to implement
✅ No backend needed
✅ No smart contract needed
✅ Tokens stay in your wallet

### Disadvantages
❌ dApp must be deployed as a contract
❌ Less secure (dApp has full access)
❌ Requires trust in dApp code
❌ Not recommended for production

### Implementation Steps

#### Step 1: Deploy dApp as Contract

This requires converting the React app to a smart contract, which is complex and not recommended.

**Alternative:** Use a simple forwarder contract that you give operator permission to.

---

## Comparison Table

| Feature | Smart Contract | Backend Service | Operator Permission |
|---------|---------------|-----------------|---------------------|
| **Decentralized** | ✅ Yes | ❌ No | ⚠️ Partial |
| **Atomic Transactions** | ✅ Yes | ❌ No | ✅ Yes |
| **Setup Complexity** | ⚠️ Medium | ⚠️ Medium | ❌ High |
| **Ongoing Maintenance** | ✅ None | ❌ High | ✅ Low |
| **Security** | ✅ High | ⚠️ Medium | ❌ Low |
| **Cost** | ~1 XTZ + gas | $5-20/mo | ~0.5 XTZ |
| **Flexibility** | ❌ Low | ✅ High | ❌ Low |
| **Recommended** | ✅ Yes | ⚠️ Maybe | ❌ No |

---

## Recommended Approach

**For Production: Smart Contract (Option 1)**

This is the best approach because:
1. Fully decentralized and trustless
2. No ongoing maintenance
3. Transparent and auditable
4. Atomic transactions (burn + reward together)
5. Professional and secure

**Implementation Timeline:**
- Day 1: Write and test smart contract (4-6 hours)
- Day 2: Deploy and fund contract (1-2 hours)
- Day 3: Update dApp and test (2-3 hours)
- **Total: 1-2 days of development**

---

## Quick Start: Deploy Smart Contract

### 1. Install SmartPy

```bash
pip install smartpy
```

### 2. Save Contract Code

Save the SmartPy code above to `burn_rewarder.py`

### 3. Compile

```bash
smartpy compile burn_rewarder.py output/
```

### 4. Deploy

Use Better Call Dev or Temple Wallet to deploy the compiled Michelson code.

**Initial Storage:**
```json
{
  "admin": "tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva",
  "true_vision_contract": "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
  "true_vision_token_id": 754916,
  "burn_address": "tz1burnburnburnburnburnburnburjAYjjX",
  "paused": false
}
```

### 5. Fund Contract

```typescript
const tvContract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton');

await tvContract.methods.transfer([{
  from_: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  txs: [{
    to_: '[DEPLOYED_CONTRACT_ADDRESS]',
    token_id: 754916,
    amount: 10000000000  // 10,000 TV
  }]
}]).send();
```

### 6. Update dApp

```typescript
// In constants/index.ts
export const BURN_REWARDER_CONTRACT = 'KT1...'; // Your contract address
```

### 7. Test

Burn an NFT and verify True Vision tokens are sent automatically!

---

## Support

Need help implementing this?

1. **Smart Contract Development:** I can provide the complete contract code
2. **Deployment Assistance:** Step-by-step deployment guide
3. **Testing:** Test on Ghostnet before mainnet
4. **Monitoring:** Set up contract monitoring and alerts

## Next Steps

1. Choose your approach (recommend Smart Contract)
2. Set up development environment
3. Deploy and test on Ghostnet
4. Fund contract with True Vision tokens
5. Update dApp configuration
6. Test thoroughly
7. Deploy to mainnet

---

**Questions?** Check the troubleshooting section or open an issue on GitHub.
