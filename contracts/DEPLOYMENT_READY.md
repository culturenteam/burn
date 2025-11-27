# 🚀 Ready-to-Deploy Smart Contract

## Contract Files

✅ **burn_rewarder.tz** - Compiled Michelson contract code
✅ **burn_rewarder_storage.tz** - Initial storage configuration
✅ **This guide** - Step-by-step deployment instructions

## Quick Deploy (5 minutes)

### Option 1: Better Call Dev (Recommended)

1. **Go to Better Call Dev:**
   - Ghostnet: https://better-call.dev/ghostnet/deploy
   - Mainnet: https://better-call.dev/mainnet/deploy

2. **Paste Contract Code:**
   - Copy entire contents of `burn_rewarder.tz`
   - Paste into "Michelson" field

3. **Set Initial Storage:**
   ```
   (Pair "tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva" 
         (Pair "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" 
               (Pair 754916 
                     (Pair "tz1burnburnburnburnburnburnburjAYjjX" 
                           False))))
   ```
   
   **Replace values:**
   - `tz1ez9...` - Your admin address
   - `KT1RJ6...` - True Vision contract address
   - `754916` - True Vision token ID
   - `tz1burn...` - Burn address (keep as is)
   - `False` - Contract starts unpaused

4. **Deploy:**
   - Click "Deploy"
   - Approve in wallet
   - Wait for confirmation
   - **Copy contract address** (e.g., `KT1abc...`)

### Option 2: Temple Wallet

1. Open Temple Wallet
2. Go to "Deploy Contract"
3. Paste Michelson code from `burn_rewarder.tz`
4. Set initial storage (same as above)
5. Deploy and approve
6. Copy contract address

### Option 3: Taquito Script

```typescript
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import fs from 'fs';

const tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
tezos.setProvider({
  signer: await InMemorySigner.fromSecretKey('edsk...')
});

const code = fs.readFileSync('burn_rewarder.tz', 'utf8');
const storage = {
  admin: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  true_vision_contract: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
  true_vision_token_id: 754916,
  burn_address: 'tz1burnburnburnburnburnburnburjAYjjX',
  paused: false
};

const origination = await tezos.contract.originate({
  code: code,
  storage: storage
});

await origination.confirmation();
console.log('Contract deployed:', origination.contractAddress);
```

## After Deployment

### 1. Fund Contract with True Vision

```typescript
const tvContract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton');

await tvContract.methods.transfer([{
  from_: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  txs: [{
    to_: 'KT1abc...', // Your deployed contract
    token_id: 754916,
    amount: 10000000000  // 10,000 TV (with 6 decimals)
  }]
}]).send();
```

**Or via Temple Wallet:**
1. Go to True Vision token
2. Click "Send"
3. Send to contract address
4. Amount: 10,000

### 2. Update dApp Configuration

```typescript
// Edit constants/index.ts
export const BURN_REWARDER_CONTRACT = 'KT1abc...'; // Your contract address
```

### 3. Test the Contract

```typescript
// Burn an NFT and get reward
const contract = await tezos.wallet.at('KT1abc...');

await contract.methods.burn_and_reward({
  nft_contract: 'KT1...',  // NFT contract
  token_id: 123,            // Token ID
  amount: 1,                // Amount to burn
  reward_amount: 1000000    // 1 TV reward (with 6 decimals)
}).send();
```

## Contract Interface

### Entrypoint: burn_and_reward

**Parameters:**
```
{
  nft_contract: address,    // NFT contract address
  token_id: nat,            // Token ID to burn
  amount: nat,              // Number of editions to burn
  reward_amount: nat        // True Vision tokens to send (with decimals)
}
```

**What it does:**
1. Transfers NFT from caller to burn address
2. Transfers True Vision from contract to caller
3. All in one atomic transaction

### Storage Structure

```
{
  admin: address,                    // Can manage contract
  true_vision_contract: address,     // True Vision FA2 contract
  true_vision_token_id: nat,        // True Vision token ID
  burn_address: address,             // Where NFTs are burned
  paused: bool                       // Emergency pause
}
```

## Admin Functions

### Pause Contract

```typescript
const contract = await tezos.wallet.at('KT1abc...');
await contract.methods.set_paused(true).send();
```

### Unpause Contract

```typescript
await contract.methods.set_paused(false).send();
```

### Withdraw Tokens

```typescript
await contract.methods.withdraw({
  recipient: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  amount: 1000000000  // 1,000 TV
}).send();
```

### Update Admin

```typescript
await contract.methods.update_admin('tz1new...').send();
```

## Verification

### Check Contract Balance

```bash
# Via TzKT API
curl "https://api.tzkt.io/v1/tokens/balances?account=KT1abc...&token.contract=KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"
```

### Check Contract Storage

```bash
# Via TzKT API
curl "https://api.tzkt.io/v1/contracts/KT1abc.../storage"
```

### View on Explorer

- Ghostnet: https://ghostnet.tzkt.io/KT1abc...
- Mainnet: https://tzkt.io/KT1abc...

## Cost Estimates

- **Deployment:** ~0.5-1 XTZ
- **Funding:** Free (token transfer)
- **Per burn:** ~0.01-0.02 XTZ (paid by user)

## Troubleshooting

### "Contract is paused"
- Admin needs to unpause: `set_paused(false)`

### "Invalid True Vision contract"
- Check True Vision contract address in storage
- Verify it's an FA2 contract

### "Insufficient balance"
- Contract needs more True Vision tokens
- Fund via transfer (see step 1 above)

### "Only admin can..."
- Only admin address can call admin functions
- Check you're using correct wallet

## Security Notes

✅ **Secure:**
- Only admin can pause/withdraw
- All operations are atomic
- Transparent on-chain
- Auditable transactions

⚠️ **Important:**
- Keep admin private key secure
- Test on Ghostnet first
- Monitor contract balance
- Set up alerts for low balance

## Support

- **Full Guide:** [AUTOMATED_REWARDS_GUIDE.md](../AUTOMATED_REWARDS_GUIDE.md)
- **Quick Start:** [AUTOMATION_QUICKSTART.md](../AUTOMATION_QUICKSTART.md)
- **Contract Docs:** [BurnRewarder.md](./BurnRewarder.md)

## Next Steps

1. ✅ Deploy contract
2. ✅ Fund with True Vision
3. ✅ Update dApp config
4. ✅ Test on Ghostnet
5. ✅ Deploy to mainnet
6. ✅ Enjoy automatic rewards!

---

**Contract Status:** ✅ Ready to Deploy
**Estimated Setup Time:** 5-10 minutes
**Difficulty:** Easy (copy/paste)
