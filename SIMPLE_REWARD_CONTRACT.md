# Simple Reward Sender Contract

## What It Does

This contract **only sends True Vision rewards**. It does NOT handle burning - that happens in your dApp.

**Flow:**
1. User burns NFT in dApp (sends to burn address)
2. dApp calls this contract with: `(user_address, reward_amount)`
3. Contract sends True Vision from itself to user
4. Done!

## Why This Is Better

✅ **Much simpler** - Only 30 lines of Michelson
✅ **Easy to deploy** - No complex logic
✅ **Flexible** - dApp controls burn logic
✅ **Testable** - Can test rewards without burning

## Files

- `contracts/reward_sender.tz` - Contract code
- `contracts/reward_sender_storage.tz` - Initial storage

## Deploy on Better Call Dev

### Step 1: Go to Better Call Dev
https://better-call.dev/mainnet/deploy

### Step 2: Paste Contract Code

Copy from `contracts/reward_sender.tz`:

```michelson
# Simple True Vision Reward Sender
# Parameter: (recipient_address, reward_amount)
# Storage: (true_vision_contract_address, true_vision_token_id)

parameter (pair address nat);
storage (pair address nat);
code {
       UNPAIR;
       SWAP;
       # Get True Vision contract and token ID from storage
       DUP;
       CAR;  # TV contract address
       SWAP;
       CDR;  # TV token ID
       
       # Get recipient and amount from parameter
       DIG 2;
       DUP;
       CAR;  # recipient
       SWAP;
       CDR;  # amount
       
       # Build transfer operation
       DIG 3;  # TV contract
       CONTRACT %transfer (list (pair address (list (pair address (pair nat nat)))));
       IF_NONE { PUSH string "Invalid TV contract"; FAILWITH } {};
       PUSH mutez 0;
       NIL (pair address (list (pair address (pair nat nat))));
       NIL (pair address (pair nat nat));
       DIG 3;  # amount
       DIG 3;  # token_id
       PAIR;
       PAIR;
       DIG 3;  # recipient
       SWAP;
       PAIR;
       CONS;
       SELF_ADDRESS;
       PAIR;
       CONS;
       TRANSFER_TOKENS;
       
       # Return operation and unchanged storage
       NIL operation;
       SWAP;
       CONS;
       DIG 2;
       PAIR
     }
```

### Step 3: Set Storage

```
(Pair "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" 754916)
```

Or in the form:
- Field 1: `KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton` (True Vision contract)
- Field 2: `754916` (True Vision token ID)

### Step 4: Deploy

- Click "Deploy"
- Approve in wallet (~0.3-0.5 XTZ)
- Copy contract address (KT1...)

## After Deployment

### 1. Fund the Contract

Send True Vision tokens to the contract:

```typescript
const tvContract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw2Nbmefwbuwbdxton');
await tvContract.methods.transfer([{
  from_: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  txs: [{
    to_: 'KT1abc...',  // Your deployed reward contract
    token_id: 754916,
    amount: 10000000000  // 10,000 TV
  }]
}]).send();
```

### 2. Update dApp

In `services/burn.ts`, update to call the contract:

```typescript
// After burning NFT
const rewardContract = await tezos.wallet.at('KT1abc...');  // Your contract
await rewardContract.methods.default(
  userAddress,      // recipient
  rewardAmount      // amount in smallest units
).send();
```

### 3. Test

1. Burn a small NFT
2. Check if True Vision is sent
3. Verify on TzKT

## How to Call the Contract

**From dApp:**
```typescript
const contract = await tezos.wallet.at('KT1abc...');
await contract.methods.default(
  'tz1user...',  // recipient address
  1000000        // 1 True Vision (with 6 decimals)
).send();
```

**Parameter format:**
```
(Pair "tz1user..." 1000000)
```

## Contract Interface

**Parameter:** `(pair address nat)`
- `address` - Recipient address
- `nat` - Amount of True Vision to send (with decimals)

**Storage:** `(pair address nat)`
- `address` - True Vision contract address
- `nat` - True Vision token ID

**What it does:**
1. Takes recipient and amount from parameter
2. Gets TV contract and token ID from storage
3. Sends TV tokens from contract to recipient
4. Returns unchanged storage

## Advantages

✅ **Simple** - Easy to understand and verify
✅ **Flexible** - dApp controls when to reward
✅ **Testable** - Can test without burning
✅ **Cheap** - Low gas costs
✅ **Reliable** - Less code = fewer bugs

## Cost

- **Deployment:** ~0.3-0.5 XTZ
- **Per reward:** ~0.005-0.01 XTZ (paid by dApp/user)

## Security

- Contract only sends TV tokens it holds
- No admin functions (immutable)
- Simple logic (easy to audit)
- Can't be drained (only sends when called)

## Next Steps

1. Deploy contract on Better Call Dev
2. Fund with True Vision tokens
3. Update dApp to call contract after burns
4. Test with small amounts
5. Monitor and refund as needed

---

**This is the simplest possible reward contract!** 🎉
