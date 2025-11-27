# Wallet Connection Guide

## Understanding the Error

The error "Failed to connect wallet. Please try again." typically occurs when:

1. **No wallet extension installed**
2. **Wallet is locked**
3. **Wrong network selected**
4. **Popup was blocked**
5. **User cancelled the connection**
6. **Network/RPC issue**

## Step-by-Step Connection Process

### Before You Start

✅ **Requirements Checklist:**
- [ ] Modern browser (Chrome, Firefox, Edge, Safari)
- [ ] Tezos wallet extension installed
- [ ] Wallet is unlocked
- [ ] Wallet is set to **Ghostnet** network
- [ ] Popups are allowed for this site
- [ ] Stable internet connection

### Step 1: Install a Tezos Wallet

If you don't have a wallet yet:

#### Option A: Temple Wallet (Recommended)

1. Visit [https://templewallet.com/](https://templewallet.com/)
2. Click "Download" or "Add to Chrome/Firefox"
3. Install the extension
4. Click the Temple icon in your browser
5. Choose "Create a new wallet"
6. **IMPORTANT**: Write down your seed phrase and store it safely
7. Set a password
8. Complete the setup

#### Option B: Kukai Wallet

1. Visit [https://wallet.kukai.app/](https://wallet.kukai.app/)
2. Click "Get Started"
3. Follow the setup instructions
4. Install browser extension if available

### Step 2: Switch to Ghostnet

This is **CRITICAL** - the dApp only works on Ghostnet testnet.

#### In Temple Wallet:

1. Click the Temple extension icon
2. Look for the network selector (usually shows "Mainnet")
3. Click on it
4. Select **"Ghostnet"** from the dropdown
5. Wait for it to switch (may take a few seconds)
6. Verify it says "Ghostnet" at the top

#### In Kukai Wallet:

1. Open Kukai
2. Go to Settings
3. Find Network settings
4. Select **"Ghostnet"**
5. Save changes

### Step 3: Get Test XTZ (Optional)

You don't need XTZ to connect, but you'll need it for Phase 3 (burning):

1. Visit [https://faucet.ghostnet.teztnets.com/](https://faucet.ghostnet.teztnets.com/)
2. Complete the captcha
3. Download the faucet JSON file
4. Import it into your wallet
5. You'll receive test XTZ

### Step 4: Connect to the dApp

Now you're ready to connect:

1. **Open the dApp** in your browser
2. **Click "Connect Beacon Wallet"** button
3. **Wait for popup** - A Beacon connection popup should appear
4. **Select your wallet** - Choose Temple, Kukai, or your wallet
5. **Review permissions** - The popup will show:
   - App name: "Tezos NFT Burn dApp"
   - Network: Ghostnet
   - Permissions requested
6. **Click "Connect" or "Approve"** in the popup
7. **Wait** - Connection may take 2-5 seconds
8. **Success!** - Your address should appear (e.g., tz1...5xk)

## What the Beacon Popup Looks Like

```
┌─────────────────────────────────────┐
│  Beacon Connection Request          │
├─────────────────────────────────────┤
│                                     │
│  Tezos NFT Burn dApp                │
│  wants to connect                   │
│                                     │
│  Network: Ghostnet                  │
│                                     │
│  This will allow the app to:        │
│  • View your address                │
│  • Request transaction signatures   │
│                                     │
│  Select wallet:                     │
│  ○ Temple Wallet                    │
│  ○ Kukai Wallet                     │
│  ○ Other...                         │
│                                     │
│  [Cancel]  [Connect]                │
│                                     │
└─────────────────────────────────────┘
```

## Troubleshooting Connection Issues

### Issue 1: No Popup Appears

**Possible Causes:**
- Popup blocker is active
- Wallet extension is not installed
- JavaScript is disabled

**Solutions:**

1. **Check for popup blocker icon** in address bar
   - Click it
   - Select "Always allow popups from this site"
   - Try again

2. **Manually open wallet**
   - Click your wallet extension icon
   - Look for pending connection requests
   - Approve from there

3. **Check browser console** (F12)
   - Look for errors
   - Share errors in Debug Info

### Issue 2: Popup Appears But Connection Fails

**Possible Causes:**
- Wrong network selected
- Wallet is locked
- Network/RPC issue

**Solutions:**

1. **Verify network**
   - Open wallet extension
   - Confirm it says "Ghostnet"
   - If not, switch to Ghostnet
   - Try connecting again

2. **Unlock wallet**
   - Enter your password
   - Try connecting again

3. **Check RPC**
   - Open browser console (F12)
   - Run: `fetch('https://ghostnet.ecadinfra.com/chains/main/blocks/head')`
   - If it fails, RPC might be down

### Issue 3: Connection Succeeds But Then Fails

**Possible Causes:**
- Session expired
- Network switched
- Wallet locked

**Solutions:**

1. **Refresh the page**
   - Session should restore automatically
   - If not, connect again

2. **Check wallet status**
   - Ensure still unlocked
   - Ensure still on Ghostnet

### Issue 4: "User Rejected" Error

**This is normal!** It means you clicked "Cancel" or "Reject" in the popup.

**Solution:**
- Click "Connect Wallet" again
- This time click "Approve" or "Connect"

## Using Debug Info

The dApp includes a Debug Info panel to help diagnose issues:

1. Click **"Show Debug Info"** (bottom-right corner)
2. Check the status indicators:

```
✓ Wallet Initialized: Yes    ← Should be green
○ Connected: No              ← Yellow until connected
○ Loading: No                ← Yellow when connecting
Address: Not connected       ← Shows address when connected

Environment:
Protocol: https:             ← Must be https
Host: [your-gitpod-url]

Polyfills:
✓ global                     ← All should be green
✓ Buffer
✓ process
```

### What to Check:

- **Wallet Initialized = No**: Refresh the page
- **Protocol = http**: Must use HTTPS
- **Polyfills = Red**: Browser compatibility issue

## Browser-Specific Notes

### Chrome/Edge
- Best compatibility
- Temple Wallet works great
- No known issues

### Firefox
- Good compatibility
- May need to allow popups manually
- Temple Wallet works well

### Safari
- Limited wallet support
- May have popup issues
- Use Chrome/Firefox if possible

### Brave
- May block Beacon by default
- Disable Brave Shields for this site
- Or use Chrome/Firefox

## Mobile Browsers

**Phase 1 Note**: Mobile wallet connection is limited.

**Recommended**:
- Use desktop browser for Phase 1
- Or use wallet's built-in browser (Temple, Kukai)
- WalletConnect support coming in future

## Security Notes

### What the dApp CAN Do:
- ✅ See your wallet address
- ✅ Request you to sign transactions
- ✅ Read public blockchain data

### What the dApp CANNOT Do:
- ❌ Access your private keys
- ❌ Sign transactions without your approval
- ❌ Transfer funds without your permission
- ❌ Access other accounts

### Your Keys, Your Crypto:
- Your private keys never leave your wallet
- All transactions require your explicit approval
- You can disconnect anytime
- This is a testnet - no real funds at risk

## Connection Flow Diagram

```
User clicks "Connect Wallet"
         ↓
dApp calls wallet.requestPermissions()
         ↓
Beacon SDK opens popup
         ↓
User selects wallet (Temple, Kukai, etc.)
         ↓
Wallet extension receives request
         ↓
User reviews and approves
         ↓
Wallet sends approval to dApp
         ↓
dApp receives user address
         ↓
Connection complete! ✅
```

## Testing Your Connection

Once connected, you should see:

1. **Your Address**: Shortened format (e.g., tz1VSU...cjb)
2. **Network Badge**: Green "Ghostnet Active" badge
3. **Disconnect Button**: Red "Disconnect Wallet" button
4. **No Errors**: No error messages displayed

### Test Disconnection:

1. Click "Disconnect Wallet"
2. Address should disappear
3. "Connect Wallet" button should reappear
4. No errors should appear

### Test Session Persistence:

1. While connected, refresh the page
2. Your address should reappear automatically
3. No need to reconnect
4. This proves session persistence works

## Common Questions

### Q: Do I need real XTZ to connect?
**A:** No! Connection is free. You only need XTZ for transactions (Phase 3).

### Q: Is my wallet safe?
**A:** Yes! Your private keys never leave your wallet. The dApp can only request actions, which you must approve.

### Q: Can I use mainnet?
**A:** No, this dApp only works on Ghostnet testnet for safety.

### Q: Why Ghostnet?
**A:** Ghostnet is a testnet where XTZ has no real value. It's safe for testing and learning.

### Q: What if I lose my seed phrase?
**A:** You'll lose access to your wallet. Always store seed phrases safely! (But it's just testnet, so no real loss)

### Q: Can I connect multiple wallets?
**A:** You can only connect one wallet at a time. Disconnect first to switch wallets.

## Still Having Issues?

If you've followed all steps and still can't connect:

1. **Check Debug Info** - Look for specific error
2. **Check Browser Console** - Press F12, look for errors
3. **Try Different Browser** - Test in Chrome if using another
4. **Try Different Wallet** - Test with Temple if using another
5. **Read TROUBLESHOOTING.md** - More detailed solutions
6. **Report Issue** - Create GitHub issue with:
   - Browser and version
   - Wallet and version
   - Error messages
   - Debug Info screenshot
   - Console errors

## Success Indicators

You'll know connection worked when you see:

✅ Your address displayed (tz1...xxx)  
✅ Green "Ghostnet Active" badge  
✅ "Disconnect Wallet" button  
✅ No error messages  
✅ Debug Info shows "Connected: Yes"  

---

**Ready to connect?** Follow the steps above and you'll be connected in minutes!
