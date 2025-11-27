# Operator Setup for Automatic True Vision Distribution

## Overview

To enable automatic True Vision token distribution when users burn NFTs, you need to grant the **burn dApp contract** operator permissions on your True Vision tokens. This is a one-time setup.

## What is an Operator?

In FA2 tokens, an "operator" is an address that has permission to transfer tokens on behalf of the owner. By making the dApp an operator, it can automatically send True Vision tokens from your wallet to burners.

## Setup Steps

### Option 1: Using Better Call Dev (Recommended)

1. **Go to True Vision Contract**
   - Visit: https://better-call.dev/mainnet/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/interact

2. **Connect Your Wallet**
   - Click "Connect Wallet" in top right
   - Connect with Temple/Kukai using `tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva`

3. **Call update_operators**
   - Find the `update_operators` entrypoint
   - Click to expand it

4. **Add Operator Permission**
   - Select "Add_operator" variant
   - Fill in the parameters:
     ```
     owner: tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva
     operator: [BURN_DAPP_CONTRACT_ADDRESS]
     token_id: 754916
     ```
   - Click "Execute"
   - Approve in your wallet

### Option 2: Using Temple Wallet

1. **Open Temple Wallet**
   - Go to the contract interaction feature

2. **Navigate to Contract**
   - Enter contract: `KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton`

3. **Call update_operators**
   - Select the `update_operators` entrypoint
   - Add operator with your address as owner
   - Set operator to the burn dApp contract address
   - Token ID: 754916

### Option 3: Using Taquito (Programmatic)

```typescript
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://mainnet.api.tez.ie');
// Connect your wallet here

const contract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton');

const operation = await contract.methods.update_operators([
  {
    add_operator: {
      owner: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
      operator: '[BURN_DAPP_CONTRACT_ADDRESS]',
      token_id: 754916
    }
  }
]).send();

await operation.confirmation();
console.log('Operator added!');
```

## Important Notes

### Security Considerations

✅ **Safe:**
- The operator can ONLY transfer True Vision tokens (token ID 754916)
- The operator CANNOT transfer other tokens from your wallet
- You can revoke operator permission at any time

⚠️ **Important:**
- Make sure you trust the dApp contract code
- The operator will have permission to transfer ALL your True Vision tokens
- Keep enough True Vision tokens in your wallet for rewards

### Revoking Operator Permission

If you ever need to revoke the permission:

1. Go to Better Call Dev
2. Call `update_operators` again
3. This time select "Remove_operator" variant
4. Use the same parameters as when adding

## Alternative Approach: Smart Contract

Instead of making the dApp an operator, you could deploy a dedicated smart contract that:
- Holds a supply of True Vision tokens
- Has logic to distribute rewards based on burns
- Is controlled only by you

This would be more secure but requires deploying a custom contract.

## Verification

After setting up the operator, you can verify it worked:

1. **Via TZKT API:**
   ```bash
   curl "https://api.tzkt.io/v1/tokens/balances?account=tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva&token.contract=KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton&token.tokenId=754916"
   ```

2. **Via Better Call Dev:**
   - Check the contract storage
   - Look for your address in the operators list

## Next Steps

Once operator permission is set up:
1. The dApp will automatically transfer True Vision tokens when burns happen
2. Make sure you maintain a sufficient balance of True Vision tokens
3. Monitor burns and token distribution via TZKT

## Troubleshooting

**"FA2_NOT_OPERATOR" error:**
- Operator permission not set up correctly
- Wrong operator address
- Wrong token ID

**"FA2_INSUFFICIENT_BALANCE" error:**
- Not enough True Vision tokens in your wallet
- Need to mint or acquire more True Vision tokens

**Transaction fails silently:**
- Check gas limits
- Verify contract address is correct
- Ensure wallet is connected properly
