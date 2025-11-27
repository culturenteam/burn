# Burn Transaction Troubleshooting

## Issue: Transaction Freezes on "Processing transaction..."

### What Happened

The modal showed "Processing transaction..." but never completed, and no confirmation appeared in Kukai wallet.

### Why This Happens

**Possible Causes:**
1. **Wallet popup blocked** - Browser blocked the Kukai confirmation popup
2. **Wallet not responding** - Kukai extension frozen or not loaded
3. **Network delay** - Slow connection to Tezos network
4. **Confirmation timeout** - Waiting too long for blockchain confirmation

### Immediate Fix Applied ✅

The code has been updated to:
1. **Not freeze** - Returns immediately after sending transaction
2. **Show TX hash** - Displays transaction hash right away
3. **Timeout protection** - Max 60 second wait for confirmation
4. **Better feedback** - Shows link to check status on TzKT

### How to Recover

#### If Transaction is Stuck

1. **Check Kukai Extension**
   - Click the Kukai icon in your browser
   - Look for pending transaction
   - Approve or reject it

2. **Check Browser Console**
   - Press F12
   - Look for "Operation hash: op..."
   - Copy the hash

3. **Check on TzKT**
   - Go to https://tzkt.io/
   - Paste the operation hash
   - See if transaction was sent

4. **Refresh the Page**
   - Hard refresh (Ctrl+Shift+R)
   - Reconnect wallet
   - Check if NFT balance changed

#### If No Transaction Was Sent

1. **Close the modal** (if possible)
2. **Refresh the page**
3. **Try again** with these steps:
   - Ensure Kukai is unlocked
   - Allow popups for this site
   - Watch for Kukai popup
   - Approve quickly

### New Behavior (After Fix)

**What You'll See Now:**

1. Click "Burn X Editions"
2. Kukai popup appears immediately
3. Approve in Kukai
4. Modal shows "Processing..."
5. **Success message appears quickly** (within 5-10 seconds)
6. Transaction hash shown with TzKT link
7. Modal closes automatically
8. NFTs refresh after 5 seconds

**If Confirmation Times Out:**
- Transaction was still sent
- You'll see the TX hash
- Check TzKT to verify
- NFTs will refresh anyway

### Testing the Fix

1. **Refresh the page** to load new code
2. **Try burning again**
3. **Watch for Kukai popup** - approve it
4. **Should see success quickly** now
5. **Click TzKT link** to verify transaction

### Common Issues & Solutions

#### Issue 1: No Kukai Popup

**Symptoms:**
- Click "Burn X Editions"
- Nothing happens
- Modal stays on screen

**Solutions:**
1. **Check popup blocker**
   - Look for blocked popup icon in address bar
   - Allow popups for this site
   - Try again

2. **Check Kukai extension**
   - Click Kukai icon
   - Ensure it's unlocked
   - Ensure it's on Mainnet

3. **Restart Kukai**
   - Disable extension
   - Re-enable extension
   - Try again

#### Issue 2: Transaction Rejected

**Symptoms:**
- Kukai popup appears
- You click "Reject" or close it
- Error message shown

**Solution:**
- This is normal
- Click "Cancel" in modal
- Try again if you want to burn
- Click "Approve" in Kukai this time

#### Issue 3: Insufficient Gas

**Symptoms:**
- Error: "Insufficient XTZ for transaction fees"

**Solution:**
1. Check XTZ balance in Kukai
2. Need at least 0.01 XTZ for gas
3. Add XTZ to wallet
4. Try again

#### Issue 4: Transaction Sent But NFTs Not Updating

**Symptoms:**
- Success message shown
- TX hash displayed
- But NFT still shows same balance

**Solutions:**
1. **Wait longer** - Blockchain needs time (30-60 seconds)
2. **Manual refresh** - Refresh the page
3. **Check TzKT** - Verify transaction confirmed
4. **Reconnect wallet** - Disconnect and reconnect

#### Issue 5: Modal Won't Close

**Symptoms:**
- Transaction done
- Modal still open
- Can't click anything

**Solution:**
1. **Wait 3 seconds** - Auto-closes after success
2. **Refresh page** - If stuck, hard refresh
3. **Check console** - Look for errors

### Checking Transaction Status

#### On TzKT Explorer

1. **Get TX hash** from success message or console
2. **Visit** https://tzkt.io/[hash]
3. **Check status:**
   - ✅ **Applied** - Transaction successful
   - ⏳ **Pending** - Still processing
   - ❌ **Failed** - Transaction failed

#### What to Look For

**Successful Burn:**
```
Status: Applied
Type: Transaction
From: tz1... (your address)
To: KT1... (NFT contract)
Parameter: transfer
```

**In the parameters, you should see:**
```
to_: tz1burnburnburnburnburnburnburjAYjjX
token_id: [your token ID]
amount: [amount burned]
```

### Prevention Tips

#### Before Burning

1. **Ensure Kukai is unlocked**
2. **Check XTZ balance** (need ~0.01 XTZ)
3. **Allow popups** for this site
4. **Close other tabs** to reduce browser load
5. **Good internet connection**

#### During Burning

1. **Watch for Kukai popup** - don't miss it
2. **Approve quickly** - don't let it timeout
3. **Don't close browser** during transaction
4. **Don't refresh page** until complete
5. **Wait for success message**

#### After Burning

1. **Note the TX hash** - save it somewhere
2. **Check TzKT** to verify
3. **Wait for NFT refresh** (5-10 seconds)
4. **Verify balance changed**

### Debug Information

#### Console Logs to Check

**Successful burn should show:**
```
🔥 Starting burn transaction...
NFT: [name]
Token ID: [id]
Amount: [amount]
✅ Contract loaded
📝 Transfer params: {...}
🔄 Sending transaction...
✅ Transaction sent!
Operation hash: op...
⏳ Waiting for confirmation (max 60s)...
✅ Transaction confirmed!
```

**If stuck, you'll see:**
```
🔄 Sending transaction...
[nothing else]
```

**This means:**
- Waiting for Kukai approval
- Check Kukai extension
- Look for popup

#### Network Tab

1. Press F12
2. Go to Network tab
3. Look for requests to:
   - `mainnet.api.tez.ie` (RPC)
   - `api.tzkt.io` (API)
4. Check for errors

### Emergency Recovery

#### If Everything is Frozen

1. **Don't panic** - Your NFTs are safe
2. **Close the tab** - Force close if needed
3. **Open new tab** - Go to the dApp
4. **Reconnect wallet**
5. **Check NFT balance** - See if burn happened
6. **Check Kukai history** - Look for transaction

#### If Transaction Went Through But UI Didn't Update

1. **Refresh the page**
2. **Reconnect wallet**
3. **NFTs should show updated balance**
4. **If not, check TzKT** - Verify burn happened
5. **Wait 5 minutes** - Blockchain might be slow
6. **Try again** - Refresh one more time

### Getting Help

#### Information to Provide

If you need help, provide:

1. **Transaction hash** (if you have it)
2. **Console logs** (copy from browser console)
3. **What you clicked** (step-by-step)
4. **What you saw** (exact error message)
5. **Browser and version**
6. **Kukai version**

#### Where to Check

1. **Browser Console** - Press F12, check Console tab
2. **TzKT Explorer** - https://tzkt.io/[your-address]
3. **Kukai History** - In Kukai extension
4. **Network Status** - https://status.tezos.com/

### Summary of Fix

**Before (Old Behavior):**
- Waited indefinitely for confirmation
- Could freeze forever
- No timeout
- No feedback

**After (New Behavior):**
- Returns immediately after sending
- 60 second timeout on confirmation
- Shows TX hash right away
- Link to check on TzKT
- Auto-refresh after 5 seconds

**Result:**
- ✅ No more freezing
- ✅ Better feedback
- ✅ Can verify on TzKT
- ✅ Graceful timeout handling

---

**Status**: ✅ Fix Applied  
**Action**: Refresh page and try again  
**Expected**: Should work smoothly now
