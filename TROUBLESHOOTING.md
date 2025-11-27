# Troubleshooting Guide

## "Failed to connect wallet. Please try again."

This error can occur for several reasons. Follow these steps to diagnose and fix the issue.

### Step 1: Check Debug Information

1. Open the application
2. Click **"Show Debug Info"** button in the bottom-right corner
3. Check the following:
   - ✓ Wallet Initialized: Should be "Yes"
   - ✓ Polyfills: All should show green checkmarks
   - Protocol: Should be "https:"

### Step 2: Verify Wallet Extension

#### Do you have a Tezos wallet installed?

**Required**: You need a Tezos wallet browser extension to connect.

**Recommended Wallets:**
- [Temple Wallet](https://templewallet.com/) - Most popular
- [Kukai Wallet](https://wallet.kukai.app/) - User-friendly
- [Umami Wallet](https://umamiwallet.com/) - Feature-rich

**Installation:**
1. Visit the wallet website
2. Click "Install" or "Add to Browser"
3. Follow the setup instructions
4. Create or import a wallet
5. **Important**: Switch to Ghostnet network

#### Is your wallet set to Ghostnet?

1. Open your wallet extension
2. Look for network selector (usually top-right)
3. Select **"Ghostnet"** or **"Testnet"**
4. Refresh the dApp page
5. Try connecting again

### Step 3: Browser Permissions

#### Check Popup Blocker

1. Look for a popup blocked icon in your browser's address bar
2. Click it and select "Always allow popups from this site"
3. Refresh the page
4. Try connecting again

#### Check Extension Permissions

1. Go to browser extensions page:
   - Chrome: `chrome://extensions`
   - Firefox: `about:addons`
   - Edge: `edge://extensions`
2. Find your Tezos wallet extension
3. Ensure it has permission to run on all sites
4. Refresh the dApp page

### Step 4: Clear Cache and Data

#### Clear Browser Cache

1. Open browser settings
2. Go to Privacy/Security
3. Clear browsing data
4. Select:
   - Cached images and files
   - Cookies and site data
5. Clear data
6. Restart browser
7. Try again

#### Clear Wallet Data (Last Resort)

⚠️ **Warning**: This will disconnect all dApps

1. Open wallet extension
2. Go to Settings
3. Find "Clear dApp connections" or similar
4. Clear connections
5. Try connecting to the dApp again

### Step 5: Check Network Connection

#### Test RPC Endpoint

Open browser console (F12) and run:

```javascript
fetch('https://ghostnet.ecadinfra.com/chains/main/blocks/head')
  .then(r => r.json())
  .then(d => console.log('✅ RPC working:', d))
  .catch(e => console.error('❌ RPC error:', e));
```

If this fails, the RPC endpoint might be down. Try:
- Waiting a few minutes
- Using a different network connection
- Checking [Tezos status page](https://status.tezos.com/)

### Step 6: Browser Console Errors

1. Open browser console (F12)
2. Go to Console tab
3. Click "Connect Wallet"
4. Look for error messages

#### Common Errors and Solutions

**Error: "Network request failed"**
- Solution: Check internet connection
- Solution: Try different RPC endpoint
- Solution: Disable VPN/proxy

**Error: "User rejected request"**
- Solution: This is normal if you clicked "Cancel"
- Solution: Try connecting again and click "Approve"

**Error: "Cannot read property 'client' of null"**
- Solution: Wallet not initialized properly
- Solution: Refresh the page
- Solution: Check Debug Info for wallet status

**Error: "Failed to fetch"**
- Solution: CORS issue or network problem
- Solution: Check if you're using HTTPS
- Solution: Try different browser

### Step 7: Try Different Browser

Test in a different browser to isolate the issue:

1. **Chrome/Edge**: Best compatibility
2. **Firefox**: Good alternative
3. **Brave**: May need to disable shields
4. **Safari**: Limited wallet support

### Step 8: Wallet-Specific Issues

#### Temple Wallet

**Issue**: Popup doesn't appear
- Solution: Click Temple extension icon manually
- Solution: Check if Temple is locked
- Solution: Update Temple to latest version

**Issue**: "Network mismatch"
- Solution: Switch Temple to Ghostnet
- Solution: Settings → Network → Ghostnet

#### Kukai Wallet

**Issue**: Connection timeout
- Solution: Kukai might be slower, wait longer
- Solution: Try refreshing the page
- Solution: Check Kukai is unlocked

#### Umami Wallet

**Issue**: Not detecting dApp
- Solution: Ensure Umami is updated
- Solution: Check Umami permissions
- Solution: Try restarting browser

### Step 9: Advanced Debugging

#### Enable Verbose Logging

Open browser console and run:

```javascript
localStorage.setItem('debug', '*');
```

Then refresh and try connecting. You'll see detailed logs.

#### Check Beacon SDK

In console, check if Beacon is loaded:

```javascript
console.log('Beacon available:', typeof window.beacon !== 'undefined');
```

#### Test Wallet Directly

Try connecting to another Tezos dApp to verify your wallet works:
- [Better Call Dev](https://better-call.dev/)
- [TzKT Explorer](https://ghostnet.tzkt.io/)

### Step 10: Still Not Working?

If none of the above works, try these:

1. **Restart Everything**
   - Close all browser tabs
   - Quit browser completely
   - Restart browser
   - Try again

2. **Use Incognito/Private Mode**
   - Open incognito window
   - Install wallet extension in incognito (if allowed)
   - Try connecting

3. **Check System Requirements**
   - Modern browser (released in last 2 years)
   - JavaScript enabled
   - Cookies enabled
   - LocalStorage enabled

4. **Report the Issue**
   - Copy error from Debug Info
   - Copy browser console errors
   - Note your browser and wallet versions
   - Create GitHub issue with details

## Common Scenarios

### Scenario 1: First Time User

**Problem**: "I don't have a wallet"

**Solution**:
1. Install Temple Wallet from [templewallet.com](https://templewallet.com/)
2. Create new wallet (save seed phrase safely!)
3. Switch to Ghostnet network
4. Get test XTZ from [faucet](https://faucet.ghostnet.teztnets.com/)
5. Return to dApp and connect

### Scenario 2: Wallet Connected But Shows Error

**Problem**: Wallet shows connected but dApp shows error

**Solution**:
1. Disconnect from wallet extension
2. Refresh dApp page
3. Try connecting again
4. If still fails, clear wallet connections

### Scenario 3: Connection Works But Then Fails

**Problem**: Connected successfully but then got disconnected

**Solution**:
1. Check if wallet is still unlocked
2. Check if network is still Ghostnet
3. Refresh the page
4. Session should restore automatically

### Scenario 4: Mobile Browser Issues

**Problem**: Can't connect on mobile

**Solution**:
1. Use wallet's built-in browser (Temple, Kukai)
2. Or use WalletConnect (not implemented yet)
3. Desktop is recommended for Phase 1

## Prevention Tips

1. **Keep Wallet Updated**: Update your wallet extension regularly
2. **Use HTTPS**: Always access dApps via HTTPS
3. **Stable Network**: Use reliable internet connection
4. **Allow Popups**: Whitelist the dApp domain
5. **Stay on Ghostnet**: Don't switch networks while connected

## Quick Checklist

Before reporting an issue, verify:

- [ ] Wallet extension installed
- [ ] Wallet set to Ghostnet
- [ ] Wallet is unlocked
- [ ] Popups allowed
- [ ] Using HTTPS
- [ ] Browser is up to date
- [ ] JavaScript enabled
- [ ] Tried refreshing page
- [ ] Checked browser console
- [ ] Checked Debug Info

## Getting Help

### Debug Info to Share

When asking for help, include:

1. **Browser**: Chrome 120, Firefox 121, etc.
2. **Wallet**: Temple 1.2.3, Kukai 2.0.1, etc.
3. **Network**: Ghostnet
4. **Error Message**: Exact error from Debug Info
5. **Console Errors**: Copy from browser console
6. **Steps Taken**: What you've already tried

### Where to Get Help

- GitHub Issues: Report bugs
- Discord: Community support
- Documentation: Check all docs first

## Technical Details

### Network Configuration

```typescript
RPC URL: https://ghostnet.ecadinfra.com
Network Type: GHOSTNET
App Name: Tezos NFT Burn dApp
```

### Required Polyfills

- `global` → `window`
- `Buffer` → Basic implementation
- `process` → Basic implementation

### Beacon SDK Version

- @taquito/beacon-wallet: ^23.0.3
- @airgap/beacon-types: ^4.6.2
- @taquito/taquito: ^23.0.3

---

**Still having issues?** Check the Debug Info component and browser console for specific error messages.
