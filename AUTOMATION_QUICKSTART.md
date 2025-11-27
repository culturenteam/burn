# Automated Rewards - Quick Start Guide

## TL;DR

Deploy a smart contract that automatically sends True Vision tokens when users burn NFTs. Takes ~2 hours to set up.

## Prerequisites

- Python 3.8+ (for SmartPy)
- Tezos wallet with XTZ for deployment (~1 XTZ)
- True Vision tokens to fund the contract

## Step-by-Step Setup

### 1. Install SmartPy (5 minutes)

```bash
pip install smartpy
```

### 2. Compile Contract (2 minutes)

```bash
cd /workspaces/burn/scripts
smartpy compile deploy-burn-rewarder.py output/
```

This creates:
- `output/BurnRewarder/step_000_cont_0_contract.tz` - Michelson code
- `output/BurnRewarder/step_000_cont_0_storage.tz` - Initial storage

### 3. Deploy Contract (10 minutes)

**Option A: Using Better Call Dev**

1. Go to https://better-call.dev/ghostnet/deploy
2. Paste Michelson code from `step_000_cont_0_contract.tz`
3. Set initial storage:
   ```json
   {
     "admin": "tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva",
     "true_vision_contract": "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
     "true_vision_token_id": 754916,
     "burn_address": "tz1burnburnburnburnburnburnburjAYjjX",
     "paused": false
   }
   ```
4. Click "Deploy"
5. Approve in wallet
6. Copy deployed contract address (e.g., `KT1abc...`)

**Option B: Using Temple Wallet**

1. Open Temple Wallet
2. Go to "Deploy Contract"
3. Paste Michelson code
4. Set initial storage (same as above)
5. Deploy and approve
6. Copy contract address

### 4. Fund Contract with True Vision (5 minutes)

```typescript
// In browser console or Node.js script
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
// Connect your wallet here

const tvContract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton');

await tvContract.methods.transfer([{
  from_: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva', // Your address
  txs: [{
    to_: 'KT1abc...', // Your deployed contract address
    token_id: 754916,
    amount: 10000000000  // 10,000 True Vision (with 6 decimals)
  }]
}]).send();
```

**Or use Temple Wallet UI:**
1. Go to True Vision token in wallet
2. Click "Send"
3. Send to contract address
4. Amount: 10,000 (or however many you want to fund)

### 5. Update dApp Configuration (2 minutes)

```typescript
// Edit constants/index.ts
export const BURN_REWARDER_CONTRACT = 'KT1abc...'; // Your contract address
```

### 6. Test on Ghostnet (10 minutes)

1. Start dev server: `npm run dev`
2. Connect wallet
3. Try burning an NFT
4. Verify True Vision tokens are sent automatically
5. Check transaction on TzKT

### 7. Deploy to Mainnet (30 minutes)

Once tested on Ghostnet:

1. Repeat steps 2-5 on mainnet
2. Update `constants/index.ts` with mainnet contract
3. Fund mainnet contract with True Vision
4. Test with small amount first
5. Monitor transactions

## Verification Checklist

- [ ] SmartPy installed
- [ ] Contract compiled successfully
- [ ] Contract deployed on Ghostnet
- [ ] Contract funded with True Vision tokens
- [ ] dApp configuration updated
- [ ] Test burn successful
- [ ] True Vision tokens received automatically
- [ ] Ready for mainnet deployment

## Troubleshooting

### "SmartPy not found"
```bash
pip install --upgrade smartpy
```

### "Compilation failed"
Check Python version: `python --version` (need 3.8+)

### "Deployment failed"
- Check you have enough XTZ (~1 XTZ)
- Verify Michelson code is valid
- Try Better Call Dev instead of wallet

### "Contract has no True Vision tokens"
- Verify you funded the contract
- Check contract balance on TzKT
- Ensure you sent to correct address

### "Burn transaction fails"
- Check contract is not paused
- Verify contract has enough True Vision tokens
- Check NFT contract address is correct

## Cost Breakdown

- **Contract Deployment:** ~0.5-1 XTZ (one-time)
- **Funding Contract:** Free (just token transfer)
- **Per Burn Transaction:** ~0.01-0.02 XTZ (paid by user)
- **Total Setup Cost:** ~1 XTZ + True Vision tokens

## Maintenance

### Check Contract Balance

```bash
# Via TzKT API
curl "https://api.tzkt.io/v1/tokens/balances?account=KT1abc...&token.contract=KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"
```

### Refund Contract

When balance is low, send more True Vision tokens (same as step 4).

### Pause Contract (Emergency)

```typescript
const contract = await tezos.wallet.at('KT1abc...');
await contract.methods.set_paused(true).send();
```

### Withdraw Tokens

```typescript
const contract = await tezos.wallet.at('KT1abc...');
await contract.methods.withdraw({
  recipient: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  amount: 1000000000  // 1,000 TV
}).send();
```

## Support

- **Full Guide:** [AUTOMATED_REWARDS_GUIDE.md](./AUTOMATED_REWARDS_GUIDE.md)
- **Contract Code:** [scripts/deploy-burn-rewarder.py](./scripts/deploy-burn-rewarder.py)
- **Troubleshooting:** Check console logs and TzKT explorer

## Next Steps

After automation is working:

1. Monitor contract balance
2. Set up alerts for low balance
3. Add analytics dashboard
4. Consider adding more features (batch burns, etc.)

---

**Estimated Total Time:** 1-2 hours
**Difficulty:** Medium
**Cost:** ~1 XTZ + True Vision tokens
