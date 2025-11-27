# Batch Transaction Test Plan

## Goal
Test if Taquito batch transactions are truly atomic and can combine:
1. User burning their NFT (transfer to burn address)
2. Contract sending True Vision reward to user

## Test Implementation

### Code to Test
```typescript
// In services/burn.ts

export async function burnWithBatch(
  tezos: TezosToolkit,
  nft: NFT,
  userAddress: string,
  rewardContractAddress: string
): Promise<string> {
  
  // Get NFT contract
  const nftContract = await tezos.wallet.at(nft.contract);
  
  // Get reward contract  
  const rewardContract = await tezos.wallet.at(rewardContractAddress);
  
  // Build batch
  const batch = tezos.wallet.batch([
    // Operation 1: Burn NFT (user transfers to burn address)
    {
      kind: OpKind.TRANSACTION,
      ...nftContract.methods.transfer([{
        from_: userAddress,
        txs: [{
          to_: 'tz1burnburnburnburnburnburnburjAYjjX',
          token_id: nft.tokenId,
          amount: 1
        }]
      }]).toTransferParams()
    },
    // Operation 2: Claim reward (contract sends True Vision to user)
    {
      kind: OpKind.TRANSACTION,
      ...rewardContract.methods.default(userAddress, 1).toTransferParams()
    }
  ]);
  
  // Send batch (ONE wallet approval)
  const op = await batch.send();
  
  // Wait for confirmation
  await op.confirmation();
  
  return op.opHash;
}
```

## Test Cases

### Test 1: Happy Path
**Setup:**
- User has NFT to burn
- Reward contract has True Vision tokens
- Both operations should succeed

**Expected:**
- ✅ ONE wallet approval
- ✅ Both operations execute
- ✅ NFT burned
- ✅ True Vision received
- ✅ Single transaction hash

### Test 2: Insufficient Reward Tokens
**Setup:**
- User has NFT to burn
- Reward contract has NO True Vision tokens
- Second operation should fail

**Expected:**
- ❌ Entire batch fails
- ❌ NFT NOT burned (rolled back)
- ❌ No True Vision received
- ✅ Atomic behavior confirmed

### Test 3: Invalid NFT
**Setup:**
- User tries to burn NFT they don't own
- First operation should fail

**Expected:**
- ❌ Entire batch fails
- ❌ No operations execute
- ✅ Atomic behavior confirmed

## How to Test

### Step 1: Update burn.ts
Add the `burnWithBatch` function above

### Step 2: Update App.tsx
Add a "Test Batch Burn" button that calls the new function

### Step 3: Test on Ghostnet
1. Connect wallet
2. Select an NFT
3. Click "Test Batch Burn"
4. Approve in wallet (should be ONE approval)
5. Check results:
   - NFT burned?
   - True Vision received?
   - Single transaction hash?

### Step 4: Test Failure Case
1. Empty the reward contract (send all True Vision out)
2. Try to burn again
3. Verify NFT is NOT burned (atomic rollback)

## Success Criteria

**Batch transactions are atomic if:**
- ✅ Only ONE wallet approval needed
- ✅ Both operations in same transaction hash
- ✅ If one fails, both fail (rollback)
- ✅ If both succeed, both are confirmed together

**If all criteria met:**
- Implement batch approach in production
- Update documentation
- Ship it!

**If criteria NOT met:**
- Fall back to two-transaction approach
- Focus on UX improvements
- Document limitations

## Alternative: Taquito Batch Builder

```typescript
// Alternative syntax
const batch = tezos.wallet
  .batch()
  .withTransfer(nftContract.methods.transfer(...).toTransferParams())
  .withTransfer(rewardContract.methods.default(...).toTransferParams());

const op = await batch.send();
```

## Resources

- Taquito Wallet API: https://tezostaquito.io/docs/wallet_api
- Tezos Operations: Operations in same group are atomic
- OpKind enum: TRANSACTION, ORIGINATION, DELEGATION

## Notes

### Tezos Operation Groups
- Multiple operations can be grouped in one transaction
- All operations in a group succeed or all fail
- This is native Tezos behavior, not Taquito-specific
- Gas limit applies to entire group

### Potential Issues
- Gas limit: Both operations must fit in gas limit
- Storage limit: Both operations must fit in storage limit
- Fees: User pays for both operations
- Contract calls: Both contracts must be callable

## Decision Tree

```
Can we batch?
├─ YES → Is it atomic?
│   ├─ YES → SHIP IT! ✅
│   └─ NO → Two transactions
└─ NO → Two transactions
```

## Current Status

- [ ] Batch code written
- [ ] Test 1 (happy path) passed
- [ ] Test 2 (failure rollback) passed  
- [ ] Test 3 (invalid input) passed
- [ ] Decision made
- [ ] Production implementation
