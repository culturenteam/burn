# Atomic Burn + Reward Problem

## What We Want

**User Experience:**
1. User clicks "Burn NFT" button
2. User approves **ONE transaction** in their wallet
3. The transaction does TWO things atomically:
   - Burns the NFT (sends to burn address)
   - Sends True Vision reward to user
4. Both happen or neither happens (atomic)

## Why This Is Hard

### The Fundamental Problem

On Tezos, to transfer an NFT from Alice to Bob, you need:
- Alice's permission (signature)
- Call the NFT contract's `transfer` entrypoint

**Our scenario:**
- User wants to burn their NFT (transfer from User → Burn Address)
- User wants to receive True Vision (transfer from Contract → User)

### The Issue with Smart Contracts

When a smart contract calls another contract's `transfer` entrypoint, it can only transfer tokens that:
1. The contract owns, OR
2. The contract has operator permission for

**We cannot:**
- Have the contract transfer the user's NFT without operator permission
- Ask users to make the contract an operator (too complex, security risk)

## Current Approaches Tried

### Approach 1: Burn + Reward Contract (FAILED)
**Idea:** Contract does both operations
```
User → Contract.burn_and_reward(nft_info)
  ├─ Transfer NFT from User to Burn Address
  └─ Transfer True Vision from Contract to User
```

**Problem:** Contract cannot transfer user's NFT without being an operator

**Error:** Michelson type errors when trying to build this

### Approach 2: Two Separate Transactions (WORKS BUT NOT ATOMIC)
**Current implementation:**
```
1. User → NFT.transfer(to=burn_address)  [User approves]
2. User → RewardContract.send_reward()   [User approves]
```

**Problem:** Requires TWO wallet approvals, not atomic

### Approach 3: Batch Transaction (MIGHT WORK)
**Idea:** Use Taquito's batch feature
```javascript
const batch = tezos.wallet.batch([
  {
    kind: 'transaction',
    to: nftContract,
    entrypoint: 'transfer',
    params: { from: user, to: burnAddress, ... }
  },
  {
    kind: 'transaction', 
    to: rewardContract,
    entrypoint: 'send_reward',
    params: { recipient: user, amount: 1 }
  }
]);
await batch.send();
```

**Advantage:** ONE wallet approval, both operations in same transaction
**Question:** Is this truly atomic? Need to verify.

## The Real Solution

### Option A: Batch Transactions (Client-Side)
Use Taquito's batch feature to combine:
1. NFT burn (user signs)
2. Reward claim (user signs)

Both in ONE transaction with ONE approval.

**Pros:**
- No complex smart contract
- Works with existing contracts
- Truly atomic (both succeed or both fail)

**Cons:**
- Need to verify Taquito batch is atomic
- Slightly more complex client code

### Option B: Operator Pattern (REJECTED)
User makes contract an operator, then contract can transfer their NFTs.

**Pros:**
- Clean smart contract solution

**Cons:**
- Users must approve operator (extra step)
- Security concern (contract can transfer ANY of their NFTs)
- Bad UX

### Option C: Reward-Only Contract (CURRENT)
Keep it simple: contract only sends rewards, dApp handles burn separately.

**Pros:**
- Simple, working contract
- No operator needed

**Cons:**
- Two wallet approvals
- Not atomic

## Recommended Path Forward

### Immediate: Test Batch Transactions

1. **Verify atomicity:** Test if Taquito batch is truly atomic
2. **Implement in dApp:**
   ```javascript
   const batch = tezos.wallet.batch()
     .withTransfer(burnNFTParams)
     .withContractCall(rewardContract.methods.send_reward(user, 1));
   await batch.send();
   ```
3. **Test thoroughly:** Ensure both operations succeed/fail together

### If Batch Works:
- Update `services/burn.ts` to use batch
- Keep simple reward-only contract
- ONE approval, atomic operations
- **DONE!**

### If Batch Doesn't Work:
- Accept two-transaction approach
- Focus on UX (clear messaging)
- Consider operator pattern for v2

## Technical Notes

### Why Michelson Keeps Failing

The manual Michelson contracts fail because:
1. Stack manipulation is extremely error-prone
2. Type system is strict (address vs contract, nat vs int)
3. We're trying to do something that requires operator permission

**The error "inconsistent_type_sizes" means:**
- Two types that should match have different structures
- Usually from incorrect stack manipulation (DIG, DUP, SWAP)
- Very hard to debug without Michelson expertise

### SmartPy vs Manual Michelson

- SmartPy generates correct Michelson
- But if the logic is impossible (transfer without permission), SmartPy can't fix it
- The problem is conceptual, not syntactic

## Next Steps

1. **STOP trying to write burn_and_reward contracts**
2. **Research Taquito batch transactions:**
   - Are they atomic?
   - Do both operations succeed/fail together?
   - Test on Ghostnet
3. **If batch works:** Implement and ship
4. **If batch doesn't work:** Accept two-transaction UX

## Questions to Answer

- [ ] Is Taquito batch truly atomic?
- [ ] Can we batch a user-signed transfer + contract call?
- [ ] What happens if one operation in batch fails?
- [ ] Is there a gas limit for batched operations?

## Resources

- [Taquito Batch API](https://tezostaquito.io/docs/batch_api)
- [Tezos Operation Groups](https://tezos.gitlab.io/active/blocks_ops.html)
- [FA2 Operator Pattern](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md#operator)
