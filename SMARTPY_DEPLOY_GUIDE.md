# Deploy Contract Using SmartPy Online IDE

## Step 1: Go to SmartPy IDE

Open: https://smartpy.io/ide

## Step 2: Paste Contract Code

Copy this ENTIRE code and paste into the IDE:

```python
import smartpy as sp

@sp.module
def main():
    t_transfer_params: type = sp.list[
        sp.record(
            from_=sp.address,
            txs=sp.list[
                sp.record(
                    to_=sp.address,
                    token_id=sp.nat,
                    amount=sp.nat
                )
            ]
        )
    ]
    
    class SimpleSwap(sp.Contract):
        """
        Exchange NFT for True Vision reward.
        User sends NFT to contract, gets True Vision back.
        """
        
        def __init__(self, tv_contract, tv_token_id, reward_amount):
            self.data.tv_contract = tv_contract
            self.data.tv_token_id = tv_token_id
            self.data.reward_amount = reward_amount
        
        @sp.entrypoint
        def claim_reward(self):
            """
            Send True Vision reward to caller.
            Call this after transferring NFT to contract.
            """
            tv_handle = sp.contract(
                t_transfer_params,
                self.data.tv_contract,
                entrypoint="transfer"
            ).unwrap_some(error="Invalid TV contract")
            
            tv_transfer = [
                sp.record(
                    from_=sp.self_address,
                    txs=[
                        sp.record(
                            to_=sp.sender,
                            token_id=self.data.tv_token_id,
                            amount=self.data.reward_amount
                        )
                    ]
                )
            ]
            
            sp.transfer(tv_transfer, sp.mutez(0), tv_handle)


@sp.add_test()
def test():
    scenario = sp.test_scenario("SimpleSwap", main)
    scenario.h1("Simple Swap Contract")
    
    user = sp.test_account("User")
    
    contract = main.SimpleSwap(
        tv_contract=sp.address("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"),
        tv_token_id=754916,
        reward_amount=1
    )
    
    scenario += contract
    
    scenario.h2("User claims reward")
    contract.claim_reward(_sender=user)
```

## Step 3: Compile

1. Click the **"Run"** button (top right)
2. Wait for compilation (should be fast)
3. You'll see test results below

## Step 4: Get Michelson Code

1. Look for the **"Michelson"** tab in the output
2. Click it
3. Copy the entire Michelson code

## Step 5: Deploy on Mainnet

### Option A: SmartPy IDE Deploy (Easiest)

1. In SmartPy IDE, click **"Deploy"** tab
2. Select **"Mainnet"**
3. Connect your wallet (Temple/Kukai)
4. Set initial storage:
   - tv_contract: `KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton`
   - tv_token_id: `754916`
   - reward_amount: `1`
5. Click **"Deploy"**
6. Approve in wallet
7. **COPY THE CONTRACT ADDRESS!**

### Option B: Better Call Dev

1. Go to https://better-call.dev/deploy
2. Select **"Mainnet"**
3. Paste the Michelson code from Step 4
4. Set initial storage (Michelson format):
   ```
   (Pair "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" (Pair 754916 1))
   ```
5. Connect wallet
6. Deploy
7. **COPY THE CONTRACT ADDRESS!**

## Step 6: Fund Contract

1. Go to your wallet or objkt.com
2. Transfer True Vision (token ID 754916) to the contract address
3. Send 10-20 editions to start

## Step 7: Test

1. Go to https://better-call.dev/mainnet/YOUR_CONTRACT_ADDRESS
2. Click "Interact"
3. Select `claim_reward` entrypoint
4. Click "Execute"
5. Should send you 1 True Vision

## Step 8: Update dApp

Update `constants/index.ts`:
```typescript
export const SWAP_CONTRACT = 'KT1...' // Your new contract address
```

## Troubleshooting

### SmartPy IDE won't load
- Try different browser
- Clear cache
- Use incognito mode

### Compilation error
- Check Python syntax
- Make sure all imports are correct
- Try the exact code above

### Deployment fails
- Check you have enough XTZ (~1 XTZ for deployment)
- Verify wallet is connected
- Try Better Call Dev instead

### Contract deployed but can't interact
- Wait 1-2 minutes for indexing
- Check on tzkt.io
- Verify contract address is correct

## What Error Did You Get?

Tell me the exact error message and I'll help fix it!
