# Admin Panel Guide

## Overview

The dApp now includes an **Admin Panel** that allows you to deploy the Burn Rewarder smart contract directly from the browser - no command line needed!

## How It Works

### 1. Admin Detection

The admin panel automatically appears when you connect with the creator wallet address:
- **Admin Address:** `tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva`
- **Other users:** Won't see the admin panel at all

### 2. One-Click Deployment

When you're logged in as admin:
1. ✅ Admin panel appears at the top of the page
2. ✅ Shows contract configuration
3. ✅ Click "Deploy Contract" button
4. ✅ Approve in wallet (~1 XTZ fee)
5. ✅ Wait 1-2 minutes for confirmation
6. ✅ Get contract address instantly

## Step-by-Step Usage

### Step 1: Connect Your Wallet

1. Open the dApp
2. Click "Connect Wallet"
3. Approve connection in Temple/Kukai
4. **Admin panel will appear automatically**

### Step 2: Deploy Contract

1. Review the configuration shown:
   - Admin: Your address
   - True Vision Contract: KT1RJ6...
   - True Vision Token ID: 754916
   - Burn Address: tz1burn...

2. Click **"Deploy Contract (~1 XTZ)"**

3. Approve the transaction in your wallet

4. Wait for deployment (1-2 minutes)
   - You'll see a loading indicator
   - Operation hash will be displayed

### Step 3: Get Contract Address

Once deployed:
- ✅ Contract address is displayed
- ✅ Click copy button to copy address
- ✅ Click "View on TzKT Explorer" to see on blockchain
- ✅ Address is saved to localStorage

### Step 4: Next Steps

After deployment, you need to:

1. **Fund the contract** with True Vision tokens
   ```
   Send 10,000+ True Vision to the contract address
   ```

2. **Update dApp configuration**
   ```typescript
   // In constants/index.ts
   export const BURN_REWARDER_CONTRACT = 'KT1abc...';
   ```

3. **Rebuild and redeploy** the dApp
   ```bash
   npm run build
   ```

4. **Test** with a small burn first!

## Features

### Visual Feedback

- 🟣 **Purple/Blue gradient** - Admin panel styling
- 🔵 **Blue loading** - Deployment in progress
- 🟢 **Green success** - Contract deployed
- 🔴 **Red error** - Deployment failed

### Information Display

- Shows all contract parameters
- Displays operation hash during deployment
- Shows final contract address
- Links to TzKT explorer
- Provides next steps checklist

### Error Handling

If deployment fails:
- Error message is displayed
- "Try Again" button appears
- Common issues are explained

## Security

### Admin-Only Access

- Panel only visible to creator address
- Other users see nothing
- No admin routes or URLs to guess

### Safe Deployment

- Uses your connected wallet
- You approve every transaction
- No private keys stored
- All operations on-chain

## Troubleshooting

### "Admin panel doesn't appear"

- Check you're connected with: `tz1ez9EzqaaZWWTuYiRsPKKm3UrDQP3owYva`
- Disconnect and reconnect wallet
- Refresh the page

### "Deployment fails"

- Check you have at least 1 XTZ
- Try again in a few seconds
- Check wallet is unlocked
- Verify network is mainnet

### "Transaction pending forever"

- Wait up to 2 minutes
- Check TzKT with operation hash
- Transaction may have succeeded even if UI doesn't update

## Technical Details

### Contract Configuration

```typescript
{
  admin: userAddress,                    // Your wallet
  true_vision_contract: 'KT1RJ6...',    // True Vision FA2
  true_vision_token_id: 754916,         // Token ID
  burn_address: 'tz1burn...',           // Burn address
  paused: false                          // Start active
}
```

### Deployment Process

1. Wallet signs origination operation
2. Contract code + storage sent to network
3. Miners include in block
4. Contract gets KT1... address
5. Address returned to dApp
6. Saved to localStorage

### Gas Costs

- **Deployment:** ~0.5-1 XTZ
- **Storage:** Included in deployment
- **Per burn:** ~0.01-0.02 XTZ (paid by users)

## Advantages Over Command Line

✅ **No terminal needed** - Everything in browser
✅ **Visual feedback** - See progress in real-time
✅ **Instant results** - Get address immediately
✅ **Mobile friendly** - Works on phone/tablet
✅ **No setup** - Just connect wallet
✅ **Error handling** - Clear error messages
✅ **One click** - Deploy in seconds

## After Deployment

### Verify Contract

1. Click "View on TzKT Explorer"
2. Check contract code matches
3. Verify storage values
4. Confirm admin address

### Fund Contract

```typescript
// Send True Vision tokens
const tvContract = await tezos.wallet.at('KT1RJ6...');
await tvContract.methods.transfer([{
  from_: 'tz1ez9...',
  txs: [{
    to_: 'KT1abc...',  // Your deployed contract
    token_id: 754916,
    amount: 10000000000  // 10,000 TV
  }]
}]).send();
```

### Update dApp

```typescript
// constants/index.ts
export const BURN_REWARDER_CONTRACT = 'KT1abc...';
```

### Test

1. Connect with a test wallet
2. Burn a small NFT
3. Verify True Vision is sent automatically
4. Check transaction on TzKT

## Support

### Common Questions

**Q: Can I deploy multiple times?**
A: Yes, but you'll get different contract addresses each time.

**Q: Can I update the contract after deployment?**
A: No, contracts are immutable. Deploy a new one if needed.

**Q: What if I lose the contract address?**
A: Check your wallet's transaction history or TzKT.

**Q: Can other admins deploy?**
A: Only the creator address can access the admin panel.

### Need Help?

1. Check browser console for errors
2. Verify wallet connection
3. Check TzKT with operation hash
4. Try deployment script as backup

---

**The admin panel makes contract deployment as easy as clicking a button!** 🚀
