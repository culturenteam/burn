# Deploy Contract Using SmartPy (Easy!)

## Why SmartPy?

- Write in Python (much easier than Michelson)
- Compiles to correct Michelson automatically
- Has online IDE - no installation needed
- Used by many Tezos projects

## Step-by-Step Deployment

### 1. Go to SmartPy IDE

https://smartpy.io/ide

### 2. Paste the Contract Code

Copy from `contracts/reward_sender.py` and paste into the IDE.

### 3. Click "Run Code"

The IDE will:
- Compile to Michelson
- Run tests
- Show you the contract code

### 4. Click "Deploy"

- Select "Mainnet"
- Connect your wallet
- Deploy!

### 5. Get Contract Address

Copy the deployed contract address (KT1...)

### 6. Fund with True Vision

```typescript
const tvContract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton');
await tvContract.methods.transfer([{
  from_: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  txs: [{
    to_: 'KT1abc...',  // Your deployed contract
    token_id: 754916,
    amount: 10000000000  // 10,000 TV
  }]
}]).send();
```

### 7. Update dApp

```typescript
// In constants/index.ts
export const BURN_REWARDER_CONTRACT = 'KT1abc...';
```

### 8. Call from dApp

```typescript
const contract = await tezos.wallet.at('KT1abc...');
await contract.methods.send_reward(
  'tz1user...',  // recipient
  1000000        // 1 TV (with 6 decimals)
).send();
```

## That's It!

SmartPy handles all the Michelson complexity for you!

---

**Try it now:** https://smartpy.io/ide
