# Kukai Wallet - Specific Troubleshooting

## Issue: Kukai Works with Other dApps But Not Here

If Kukai wallet works with other Tezos dApps but fails to connect to this one, follow these steps:

### Step 1: Verify Kukai Settings

1. **Open Kukai Extension**
2. **Check Network**:
   - Click on network selector (top of wallet)
   - Ensure it says **"Ghostnet"** or **"Testnet"**
   - If it says "Mainnet", switch to Ghostnet
3. **Check Connection Settings**:
   - Go to Settings (gear icon)
   - Look for "dApp Connections" or "Connected Sites"
   - If this dApp is listed with errors, remove it
   - Try connecting again

### Step 2: Clear Kukai's dApp Connections

1. Open Kukai extension
2. Go to **Settings** → **Security** or **Connected Sites**
3. Find any entries for this dApp
4. Click **"Disconnect"** or **"Remove"**
5. Close and reopen Kukai
6. Return to the dApp and try connecting again

### Step 3: Check Browser Console

1. Open the dApp
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Click **"Connect Beacon Wallet"**
5. Watch for error messages

**Look for these specific errors:**

#### Error: "Network mismatch"
```
Solution: 
- Kukai is on wrong network
- Switch Kukai to Ghostnet
- Try connecting again
```

#### Error: "Permission denied"
```
Solution:
- Kukai blocked the connection
- Check Kukai's popup blocker settings
- Allow popups from this site
```

#### Error: "Timeout"
```
Solution:
- Kukai took too long to respond
- Check internet connection
- Try again (Kukai can be slower than Temple)
```

### Step 4: Kukai-Specific Connection Process

Kukai's connection flow is slightly different:

1. **Click "Connect Beacon Wallet"** in dApp
2. **Beacon popup appears** - Select "Kukai"
3. **Kukai extension opens** - May take 2-3 seconds
4. **Review connection request** in Kukai:
   - App name: "Tezos NFT Burn dApp"
   - Network: Ghostnet
   - Permissions: View address, request signatures
5. **Click "Connect"** or "Approve" in Kukai
6. **Wait** - Kukai may take 3-5 seconds to confirm
7. **Success** - Your address should appear in dApp

### Step 5: Kukai Extension vs Web Wallet

**Are you using Kukai extension or web wallet?**

#### If Using Kukai Extension:
- ✅ Should work with Beacon
- Make sure extension is enabled
- Check extension permissions in browser

#### If Using Kukai Web Wallet:
- ⚠️ May not work with Beacon popup
- Try installing Kukai browser extension instead
- Or use Temple Wallet as alternative

### Step 6: Check Kukai Version

1. Open Kukai extension
2. Go to Settings
3. Look for "About" or "Version"
4. **Minimum version**: 1.0.0+
5. If outdated, update Kukai:
   - Go to browser extensions page
   - Find Kukai
   - Click "Update" if available

### Step 7: Kukai Permissions in Browser

#### Chrome/Edge:
1. Go to `chrome://extensions`
2. Find Kukai Wallet
3. Click "Details"
4. Ensure these are enabled:
   - ✅ "Allow in incognito" (if using incognito)
   - ✅ "Site access" → "On all sites"
5. Refresh the dApp page

#### Firefox:
1. Go to `about:addons`
2. Find Kukai Wallet
3. Click on it
4. Go to "Permissions" tab
5. Ensure all permissions are granted

### Step 8: Test with Debug Info

1. Open the dApp
2. Click **"Show Debug Info"** (bottom-right)
3. Check status before connecting:
   ```
   ✓ Wallet Initialized: Yes
   ○ Connected: No
   ○ Loading: No
   ```
4. Click **"Connect Beacon Wallet"**
5. Watch Debug Info during connection:
   ```
   ✓ Wallet Initialized: Yes
   ○ Connected: No
   ⟳ Loading: Yes  ← Should show while connecting
   ```
6. After connection:
   ```
   ✓ Wallet Initialized: Yes
   ✓ Connected: Yes
   ○ Loading: No
   Address: tz1...xxx
   ```

### Step 9: Kukai-Specific Console Commands

Open browser console (F12) and run these to diagnose:

#### Check if Kukai is detected:
```javascript
console.log('Kukai detected:', typeof window.kukai !== 'undefined');
```

#### Check Beacon client:
```javascript
// After clicking connect, check Beacon status
console.log('Beacon active:', window.beaconSdk);
```

#### Force clear Beacon storage:
```javascript
// This clears all Beacon connections
localStorage.removeItem('beacon:active-account');
localStorage.removeItem('beacon:active-peer');
// Then refresh page and try again
```

### Step 10: Compare with Working dApp

Since Kukai works with other dApps:

1. **Open a working dApp** (e.g., Better Call Dev, TzKT)
2. **Connect Kukai** there
3. **Check Kukai's connected sites** - Note the working dApp
4. **Compare with this dApp**:
   - Same network? (Ghostnet)
   - Same permissions requested?
   - Any differences?

### Step 11: Try Alternative Connection Method

If Beacon popup fails, try this:

1. **Open Kukai extension directly**
2. Look for **"Connect to dApp"** or similar option
3. **Manually enter dApp URL** if available
4. This bypasses Beacon popup

### Step 12: Kukai + Gitpod Specific

Since you're using Gitpod:

1. **Check Gitpod URL**:
   - Must be HTTPS (not HTTP)
   - Must be the full Gitpod URL
   - Example: `https://3000-xxx.gitpod.io`

2. **Kukai may block Gitpod domains**:
   - Gitpod URLs change per workspace
   - Kukai might not recognize it
   - Try adding to Kukai's trusted sites

3. **Workaround**:
   - Use Temple Wallet (better Gitpod support)
   - Or deploy to a stable domain

### Common Kukai Error Messages

#### "Failed to connect to peer"
**Cause**: Beacon communication issue  
**Solution**: 
- Refresh page
- Clear Beacon storage (see Step 9)
- Try again

#### "Network not supported"
**Cause**: Kukai doesn't recognize network  
**Solution**:
- Ensure Kukai is on Ghostnet
- Update Kukai to latest version
- Try Temple Wallet instead

#### "No response from wallet"
**Cause**: Kukai didn't respond in time  
**Solution**:
- Kukai can be slower, wait longer
- Check if Kukai is frozen/crashed
- Restart Kukai extension
- Try again

### Kukai vs Temple Comparison

| Feature | Kukai | Temple |
|---------|-------|--------|
| Speed | Slower | Faster |
| Beacon Support | Good | Excellent |
| Gitpod Support | Limited | Good |
| Popup Reliability | Medium | High |
| Recommendation | Alternative | Primary |

**Recommendation**: If Kukai continues to fail, try Temple Wallet for better compatibility with this dApp.

### Step 13: Last Resort - Switch to Temple

If Kukai still doesn't work:

1. **Install Temple Wallet**:
   - Visit [templewallet.com](https://templewallet.com/)
   - Install extension
   - Import your seed phrase (if you want same account)
   - Or create new wallet

2. **Switch to Ghostnet** in Temple

3. **Try connecting** with Temple

4. **Temple is more reliable** with Beacon SDK

### Reporting Kukai-Specific Issues

If none of the above works, report with:

**Required Information:**
- Kukai version: (from Settings → About)
- Browser: (Chrome 120, Firefox 121, etc.)
- Gitpod URL: (your workspace URL)
- Console errors: (from F12 → Console)
- Debug Info: (screenshot from app)
- Working dApp: (name of dApp where Kukai works)

**Steps Taken:**
- [ ] Verified Kukai is on Ghostnet
- [ ] Cleared dApp connections in Kukai
- [ ] Checked browser console
- [ ] Tried clearing Beacon storage
- [ ] Checked Kukai permissions
- [ ] Updated Kukai to latest version
- [ ] Tested with Debug Info
- [ ] Compared with working dApp

### Quick Checklist for Kukai

Before reporting issue:

- [ ] Kukai extension installed and enabled
- [ ] Kukai is unlocked
- [ ] Kukai is set to **Ghostnet** (not Mainnet)
- [ ] Popups allowed for this site
- [ ] Kukai has permission to run on all sites
- [ ] Tried clearing Kukai's dApp connections
- [ ] Checked browser console for errors
- [ ] Checked Debug Info in app
- [ ] Kukai works with other Tezos dApps
- [ ] Using HTTPS (not HTTP)
- [ ] Tried refreshing the page
- [ ] Tried restarting Kukai extension

### Success Indicators

Connection successful when:

✅ Beacon popup appeared  
✅ Kukai extension opened  
✅ Approved in Kukai  
✅ Address displayed in dApp (tz1...xxx)  
✅ Green "Ghostnet Active" badge  
✅ No error messages  
✅ Debug Info shows "Connected: Yes"  

---

**Still having issues?** Try Temple Wallet as it has better Beacon SDK compatibility.
