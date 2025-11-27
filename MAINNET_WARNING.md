# ⚠️ MAINNET MODE - IMPORTANT WARNING

## 🔴 You Are Now Using Tezos Mainnet

The application has been switched from **Ghostnet (testnet)** to **Mainnet (production network)**.

### What This Means

**Mainnet = Real Money**
- All transactions use **real XTZ** (not test tokens)
- NFTs are **real assets** with real value
- Burned NFTs are **permanently destroyed**
- Transactions **cannot be reversed**

### ⚠️ Critical Warnings

1. **Real Assets at Risk**
   - Burning an NFT on Mainnet **permanently destroys** it
   - You cannot undo a burn transaction
   - The NFT will be gone forever

2. **Transaction Costs**
   - Every transaction costs real XTZ (gas fees)
   - Typical burn transaction: ~0.001-0.01 XTZ
   - Make sure you have enough XTZ for fees

3. **Double Check Everything**
   - Verify you're burning the correct NFT
   - Check the NFT value before burning
   - Confirm you really want to destroy it

### Why Use Mainnet?

**Advantages:**
- ✅ See your real NFT collection
- ✅ Test with actual assets
- ✅ Real-world functionality

**Disadvantages:**
- ❌ Uses real money
- ❌ Mistakes are permanent
- ❌ No "undo" button

### Safety Recommendations

1. **Start Small**
   - Test with low-value NFTs first
   - Don't burn valuable NFTs immediately
   - Understand the process fully

2. **Verify Network**
   - Check wallet shows "Mainnet" (not Ghostnet)
   - Verify the green badge says "Mainnet Active"
   - Confirm in your wallet extension

3. **Backup Important NFTs**
   - Consider which NFTs you want to keep
   - Only burn NFTs you're sure about
   - Remember: burning is permanent

### Network Configuration

**Current Settings:**
- Network: **Mainnet**
- RPC: `https://mainnet.api.tez.ie`
- Explorer: `https://tzkt.io`
- TzKT API: `https://api.tzkt.io`

### Switching Back to Testnet

If you want to switch back to Ghostnet (testnet):

1. Update `constants/index.ts`:
```typescript
export const NETWORK = {
  RPC_URL: 'https://ghostnet.ecadinfra.com',
  TYPE: NetworkType.GHOSTNET,
  NAME: 'Ghostnet',
  EXPLORER_URL: 'https://ghostnet.tzkt.io',
};

export const API = {
  TZKT_BASE_URL: 'https://api.ghostnet.tzkt.io',
  TZKT_VERSION: 'v1',
};
```

2. Update `context/WalletContext.tsx`:
```typescript
const NETWORK_CONFIG: NetworkConfig = {
  rpcUrl: 'https://ghostnet.ecadinfra.com',
  networkType: NetworkType.GHOSTNET,
  appName: 'Tezos NFT Burn dApp',
};
```

3. Refresh the page

### What You'll See

**Network Badge:**
- Shows "Mainnet Active" (green badge)
- Previously showed "Ghostnet Active"

**NFTs:**
- Your real NFT collection
- Real images and metadata
- Real contract addresses

**Transactions:**
- Cost real XTZ
- Appear on Mainnet explorer
- Are permanent and irreversible

### Testing Recommendations

**For Development/Testing:**
- Use Ghostnet (testnet)
- Free test XTZ
- Safe to experiment
- No real value at risk

**For Production/Real Use:**
- Use Mainnet
- Real XTZ required
- Real assets
- Permanent actions

### Phase 3 Warning

When Phase 3 (burn functionality) is implemented:

**⚠️ EXTREME CAUTION REQUIRED**
- Burning on Mainnet destroys real NFTs
- No confirmation can prevent permanent loss
- Always verify the NFT before burning
- Consider the value before proceeding

### Liability Disclaimer

**By using this dApp on Mainnet:**
- You understand transactions use real XTZ
- You accept that burned NFTs are permanently destroyed
- You acknowledge mistakes cannot be reversed
- You take full responsibility for your actions
- The developers are not liable for any losses

### Best Practices

1. **Always Verify**
   - Check network in wallet
   - Verify NFT details
   - Confirm transaction details

2. **Start Conservatively**
   - Test with low-value items
   - Understand the process
   - Build confidence gradually

3. **Keep Records**
   - Screenshot NFTs before burning
   - Save transaction hashes
   - Document your actions

4. **Stay Informed**
   - Check gas fees
   - Monitor network status
   - Read all confirmations

### Support

**If you accidentally burn a valuable NFT:**
- Unfortunately, it cannot be recovered
- Blockchain transactions are immutable
- The NFT is permanently destroyed
- No support team can reverse it

**Prevention is key:**
- Double-check everything
- Take your time
- When in doubt, don't burn

### Current Status

- ✅ Network: **Mainnet**
- ✅ Real NFTs visible
- ✅ Real transactions
- ⚠️ Real consequences

### Remember

**"With great power comes great responsibility"**

Mainnet gives you access to real assets and real functionality, but also real risks. Always be careful, double-check everything, and never burn NFTs you want to keep.

---

**Status**: ⚠️ MAINNET MODE ACTIVE  
**Risk Level**: HIGH - Real assets at risk  
**Recommendation**: Proceed with caution
