# Burn Rewarder Smart Contract

## Purpose

A smart contract that:
1. Accepts NFT burns (transfers to burn address)
2. Automatically sends True Vision rewards to the burner
3. Is funded and controlled by the creator

## Architecture

```
User → BurnRewarder Contract → [Burn NFT + Send True Vision]
                ↓
        Burn Address (NFT)
                ↓
        User Wallet (True Vision)
```

## Contract Requirements

### Storage
```typescript
{
  admin: address,                    // Creator's address
  trueVisionContract: address,       // KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton
  trueVisionTokenId: nat,           // 754916
  burnAddress: address,              // tz1burnburnburnburnburnburnburjAYjjX
  rewardCalculator: lambda          // Pricing logic
}
```

### Entrypoints

#### 1. burn_and_reward
```typescript
parameter: {
  nftContract: address,
  tokenId: nat,
  amount: nat,
  expectedReward: nat  // Calculated by frontend
}
```

**Logic:**
1. Verify caller owns the NFT
2. Transfer NFT from caller to burn address
3. Calculate True Vision reward
4. Transfer True Vision from contract to caller
5. Emit event with burn details

#### 2. fund_rewards
```typescript
parameter: {
  amount: nat
}
```

**Logic:**
1. Accept True Vision token deposits
2. Only callable by admin
3. Updates contract's True Vision balance

#### 3. withdraw_rewards
```typescript
parameter: {
  amount: nat,
  recipient: address
}
```

**Logic:**
1. Only callable by admin
2. Withdraw True Vision tokens
3. Emergency function

## Deployment Steps

### 1. Write Contract (Michelson/SmartPy/LIGO)

Example in SmartPy:

```python
import smartpy as sp

@sp.module
def main():
    class BurnRewarder(sp.Contract):
        def __init__(self, admin, true_vision_contract, burn_address):
            self.data.admin = admin
            self.data.true_vision_contract = true_vision_contract
            self.data.true_vision_token_id = 754916
            self.data.burn_address = burn_address
        
        @sp.entrypoint
        def burn_and_reward(self, params):
            # Transfer NFT to burn address
            nft_contract = sp.contract(
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
                nft_contract
            )
            
            # Transfer True Vision reward
            tv_contract = sp.contract(
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
                        amount=params.expected_reward
                    )]
                )],
                sp.mutez(0),
                tv_contract
            )
```

### 2. Compile and Deploy

```bash
# Using SmartPy
smartpy compile burn_rewarder.py output/

# Deploy using Temple/Better Call Dev
# Or use Taquito
```

### 3. Fund Contract with True Vision

```typescript
// Transfer True Vision tokens to the contract
const tvContract = await tezos.wallet.at('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton');

await tvContract.methods.transfer([{
  from_: 'tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva',
  txs: [{
    to_: '[BURN_REWARDER_CONTRACT]',
    token_id: 754916,
    amount: 10000  // Fund with 10,000 True Vision tokens
  }]
}]).send();
```

### 4. Update dApp to Use Contract

```typescript
// In burn service
const rewarderContract = await tezos.wallet.at('[BURN_REWARDER_CONTRACT]');

await rewarderContract.methods.burn_and_reward({
  nftContract: nft.contractAddress,
  tokenId: parseInt(nft.tokenId),
  amount: amount,
  expectedReward: Math.floor(nft.trueVisionReward * amount * 1000000)
}).send();
```

## Simpler Alternative: Use Existing Tools

Instead of writing a custom contract, you could use:

### Option A: Tezos Domains + Automation
- Set up a backend service
- Monitor burns via TZKT indexer
- Automatically send True Vision tokens
- No smart contract needed

### Option B: Operator Permission (Current Approach)
- Make the dApp's deployed contract an operator
- Requires deploying the dApp as a contract
- Or use a simple forwarder contract

## Recommended Approach

For immediate implementation, I recommend:

1. **Deploy a simple forwarder contract** that:
   - You make an operator of your True Vision tokens
   - Accepts burn requests
   - Forwards NFT to burn address
   - Sends True Vision from your wallet (via operator permission)

2. **Contract code** (minimal):
```michelson
parameter (pair address nat nat);  # (nft_contract, token_id, amount)
storage unit;
code {
  # Burn NFT
  # Calculate reward
  # Transfer True Vision
  # Return
}
```

This is simpler than a full contract and achieves the same goal.

Would you like me to:
1. Write the full smart contract code?
2. Create a simpler forwarder contract?
3. Implement the operator-based approach with a deployed contract address?
