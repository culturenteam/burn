# Kukai Wallet Approval Guide

## Issue: Transaction Stuck at "Sending transaction..."

### What's Happening

The console shows:
```
🔄 Sending transaction...
[stuck here]
```

This means the dApp is waiting for you to approve the transaction in Kukai, but the popup didn't appear.

## Solution: Manually Approve in Kukai

### Step 1: Open Kukai Extension

1. **Click the Kukai icon** in your browser toolbar (top-right)
2. **Look for a pending transaction** notification
3. You should see a transaction request waiting

### Step 2: Review the Transaction

In Kukai, you'll see:
- **Operation**: Transfer
- **Contract**: KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton (or similar)
- **Amount**: 0 XTZ (NFT transfer, not XTZ)
- **Fee**: ~0.001-0.01 XTZ

### Step 3: Approve

1. **Review the details** carefully
2. **Click "Confirm"** or "Approve"
3. **Wait** for the transaction to be sent
4. The dApp should show success immediately

## Why Popup Doesn't Appear

### Common Causes

1. **Browser Popup Blocker**
   - Browser blocked the Kukai popup
   - Transaction still sent to Kukai
   - Must approve manually in extension

2. **Kukai Already Open**
   - If Kukai is already open in another tab
   - Popup might not appear
   - Check the extension directly

3. **Multiple Tabs**
   - Multiple dApp tabs open
   - Kukai confused about which to show
   - Close other tabs

4. **Browser Focus**
   - Browser window not in focus
   - Popup appeared behind other windows
   - Check all windows

## How to Prevent This

### Before Burning

1. **Close other dApp tabs**
2. **Close Kukai if open in a tab**
3. **Allow popups** for this site:
   - Click the popup blocked icon in address bar
   - Select "Always allow popups from this site"
4. **Keep browser window focused**

### During Burning

1. **Watch for popup** immediately after clicking "Burn"
2. **If no popup**, click Kukai extension icon
3. **Approve quickly** - don't let it timeout
4. **Stay on the page** - don't switch tabs

## Alternative: Use Kukai's Built-in Browser

If popups keep getting blocked:

1. **Open Kukai extension**
2. **Look for "Browser" or "dApps" section**
3. **Navigate to the dApp from within Kukai**
4. **Transactions will appear directly in Kukai**

## Troubleshooting

### No Transaction in Kukai

**If you don't see a pending transaction:**

1. **Check Kukai is unlocked**
   - Enter password if locked
   - Try again

2. **Check network**
   - Ensure Kukai is on Mainnet
   - Not Ghostnet or other network

3. **Refresh and retry**
   - Close the modal
   - Refresh the dApp page
   - Try burning again

### Transaction Rejected

**If you accidentally rejected:**

1. **Close the modal** in the dApp
2. **Try again**
3. **This time approve** in Kukai

### Multiple Pending Transactions

**If you see multiple pending:**

1. **Approve or reject old ones first**
2. **Then approve the current one**
3. **Or reject all and start fresh**

## Expected Flow

### Normal Flow (With Popup)

```
1. Click "Burn X Editions" in dApp
   ↓
2. Kukai popup appears immediately
   ↓
3. Review and approve in popup
   ↓
4. Success message in dApp
```

### Manual Flow (No Popup)

```
1. Click "Burn X Editions" in dApp
   ↓
2. No popup appears
   ↓
3. Click Kukai extension icon
   ↓
4. See pending transaction
   ↓
5. Review and approve
   ↓
6. Success message in dApp
```

## Browser-Specific Tips

### Chrome/Edge

1. **Check popup blocker**:
   - Look for icon in address bar (right side)
   - Click it and allow popups

2. **Check extensions**:
   - Other extensions might block popups
   - Disable ad blockers temporarily

### Firefox

1. **Check popup settings**:
   - Click shield icon in address bar
   - Allow popups for this site

2. **Check Kukai permissions**:
   - Ensure Kukai can run on all sites

### Brave

1. **Disable Brave Shields**:
   - Click Brave icon in address bar
   - Turn off shields for this site

2. **Allow popups**:
   - Brave is aggressive with popup blocking
   - Must explicitly allow

## Quick Checklist

Before burning, verify:

- [ ] Kukai extension installed and unlocked
- [ ] Kukai is on Mainnet (not Ghostnet)
- [ ] Popups allowed for this site
- [ ] No other dApp tabs open
- [ ] Kukai not open in another tab
- [ ] Browser window is focused
- [ ] Good internet connection

## What the Update Does

The new code:

1. **Shows reminder** in modal: "Check your Kukai wallet!"
2. **Adds timeout** (2 minutes) for wallet approval
3. **Better error message** if timeout occurs
4. **Tells you to check extension** explicitly

## Testing the Fix

1. **Refresh the page** to load the update
2. **Try burning again**
3. **If no popup appears**:
   - Look at the modal - it now says "Check your Kukai wallet!"
   - Click Kukai extension icon
   - Approve the transaction there
4. **Should work!**

## Success Indicators

You'll know it worked when:

- ✅ Console shows: "✅ Transaction sent!"
- ✅ Console shows: "Operation hash: op..."
- ✅ Success message appears in dApp
- ✅ TzKT link shown
- ✅ Modal closes automatically
- ✅ NFTs refresh

## Still Not Working?

### Last Resort Options

1. **Try Temple Wallet**:
   - Install Temple Wallet extension
   - Import your seed phrase
   - Temple has better popup handling

2. **Use Different Browser**:
   - Try Chrome if using Firefox
   - Try Firefox if using Chrome
   - Fresh browser = fresh start

3. **Clear Browser Cache**:
   - Clear all browsing data
   - Restart browser
   - Try again

4. **Check Kukai Version**:
   - Ensure Kukai is updated
   - Old versions might have bugs
   - Update from browser extension store

---

**Key Takeaway**: If the transaction seems stuck, **click the Kukai extension icon** and approve it there. The popup might not appear, but the transaction request is waiting in Kukai!
