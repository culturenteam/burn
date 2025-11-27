# Deployment Guide: Automatic True Vision Rewards

## Current Status

✅ True Vision configuration updated:
- Contract: `KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton`
- Token ID: `754916`

✅ Burn service supports both modes:
- **Manual mode** (current): Burns NFT, rewards distributed manually
- **Automatic mode** (after contract deployment): Burns NFT + automatic True Vision transfer

## To Enable Automatic Rewards

You need to deploy a simple smart contract that acts as an intermediary. This contract will:
1. Accept burn requests from users
2. Transfer their NFT to the burn address
3. Transfer True Vision from your wallet to the user (via operator permission)

### Step 1: Deploy the Burn Rewarder Contract

#### Option A: Using SmartPy IDE (Recommended - 5 minutes)

1. **Go to SmartPy IDE**
   - Visit: https://smartpy.io/ide

2. **Paste this code:**

```python
import smartpy as sp

@sp.module
def main():
    class BurnRewarder(sp.Contract):
        def __init__(self):
            self.data.dummy = sp.unit
        
        @sp.entrypoint
        def burn_and_reward(self, params):
            # Burn NFT to burn address
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
                        to_=sp.address("tz1burnburnburnburnburnburnburjAYjjX"),
                        token_id=params.token_id,
                        amount=params.amount
                    )]
                )],
                sp.mutez(0),
                nft_transfer
            )
            
            # Send True Vision reward from creator to burner
            tv_transfer = sp.contract(
                sp.list(sp.record(
                    from_=sp.address,
                    txs=sp.list(sp.record(
                        to_=sp.address,
                        token_id=sp.nat,
                        amount=sp.nat
                    ))
                )),
                sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
                entrypoint="transfer"
            ).unwrap_some()
            
            sp.transfer(
                [sp.record(
                    from_=sp.address("tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva"),
                    txs=[sp.record(
                        to_=sp.sender,
                        token_id=754916,
                        amount=params.reward
                    )]
                )],
                sp.mutez(0),
                tv_transfer
            )

@sp.add_test()
def test():
    scenario = sp.test_scenario("BurnRewarder", main)
    c = main.BurnRewarder()
    scenario += c
```

3. **Test the contract**
   - Click "Run" to test
   - Verify no errors

4. **Deploy to Mainnet**
   - Click "Deploy" button
   - Select "Mainnet"
   - Connect your wallet (`tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva`)
   - Confirm deployment (costs ~0.5 XTZ)
   - **Save the contract address** (e.g., `KT1abc...`)

### Step 2: Set Operator Permission

Now make the deployed contract an operator for your True Vision tokens:

1. **Go to Better Call Dev**
   - Visit: https://better-call.dev/mainnet/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/interact

2. **Connect your wallet**
   - Click "Connect Wallet"
   - Use `tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva`

3. **Call update_operators**
   - Find the `update_operators` entrypoint
   - Click to expand

4. **Add operator**
   - Select "Add_operator" variant
   - Fill in:
     ```json
     {
       "owner": "tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva",
       "operator": "KT1abc...",  // Your deployed contract address
       "token_id": 754916
     }
     ```
   - Click "Execute"
   - Approve in wallet

5. **Verify**
   - Transaction should succeed
   - Check on TZKT that operator was added

### Step 3: Update the dApp

Update `/workspaces/burn/constants/index.ts`:

```typescript
export const BURN_REWARDER_CONTRACT = 'KT1abc...' as string | null; // Your contract address
```

### Step 4: Rebuild and Test

```bash
npm run build
npm run dev
```

Now when users burn NFTs, they'll automatically receive True Vision tokens in the same transaction!

## Verification

After setup, test by:
1. Connecting a test wallet with a brutalisti NFT
2. Burning 1 edition
3. Checking that:
   - NFT is transferred to burn address
   - True Vision tokens appear in burner's wallet
   - Transaction succeeds without errors

## Maintenance

### Monitoring
- Watch your True Vision balance
- Ensure you have enough tokens for rewards
- Monitor burns via TZKT

### Refilling True Vision
When your balance gets low, transfer more True Vision tokens to your wallet.

### Revoking Access
If needed, you can revoke operator permission:
1. Go to Better Call Dev
2. Call `update_operators` with "Remove_operator"
3. Use same parameters as when adding

## Troubleshooting

### "FA2_NOT_OPERATOR" error
- Operator permission not set correctly
- Wrong contract address
- Wrong token ID (should be 754916)

### "FA2_INSUFFICIENT_BALANCE" error
- Not enough True Vision tokens in your wallet
- Need to acquire/mint more

### "FA2_TOKEN_UNDEFINED" error
- Wrong True Vision contract address
- Wrong token ID

### Contract deployment fails
- Insufficient XTZ for gas
- Syntax error in contract code
- Network issues

## Alternative: Keep Manual Distribution

If you prefer not to deploy a contract, the current manual distribution works fine:
1. Users burn NFTs
2. You monitor burns via TZKT
3. You manually send True Vision tokens
4. More control, but more work

The dApp supports both modes seamlessly!

## Cost Estimate

- Contract deployment: ~0.5 XTZ
- Operator permission setup: ~0.01 XTZ
- Per-burn gas cost: ~0.02-0.03 XTZ (paid by user)

Total one-time setup: **~0.51 XTZ**

## Questions?

Check the other documentation files:
- `SIMPLE_SOLUTION.md` - Detailed technical explanation
- `OPERATOR_SETUP.md` - Operator permission details
- `TRUE_VISION_SETUP.md` - Original setup guide
