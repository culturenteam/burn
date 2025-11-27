# Diagnostic Steps for Kukai Connection Issue

## Quick Diagnosis

Please follow these steps and share the results:

### Step 1: Open Browser Console

1. Open the dApp in your browser
2. Press **F12** to open Developer Tools
3. Click on the **Console** tab
4. Keep it open for the next steps

### Step 2: Check Debug Helpers

In the console, type:

```javascript
debugHelpers.help()
```

You should see a list of available commands.

### Step 3: Check Polyfills

In the console, type:

```javascript
debugHelpers.checkPolyfills()
```

**Expected output:**
```javascript
Polyfills status: {
  global: true,
  Buffer: true,
  process: true
}
```

**If any are `false`**, there's a polyfill issue.

### Step 4: Test RPC Connection

In the console, type:

```javascript
debugHelpers.testRPC()
```

**Expected output:**
```javascript
✅ RPC is working: { ... block data ... }
```

**If you see an error**, there's a network connectivity issue.

### Step 5: Check Kukai Detection

In the console, type:

```javascript
console.log('Kukai detected:', typeof window.kukai !== 'undefined');
console.log('Beacon SDK:', typeof window.beaconSdk !== 'undefined');
```

### Step 6: Try Connecting

1. Click **"Connect Beacon Wallet"** in the dApp
2. Watch the console for messages
3. **Copy all console output** (right-click → Save as...)

**Expected console output:**
```
🔄 Initializing Beacon Wallet...
✅ BeaconWallet instance created
✅ Wallet provider set on Tezos Toolkit
ℹ️ No active session found
🔄 Requesting wallet permissions...
Network config: { type: "ghostnet", rpcUrl: "https://ghostnet.ecadinfra.com" }
```

### Step 7: Check Debug Info Panel

1. Click **"Show Debug Info"** button (bottom-right of dApp)
2. Take a **screenshot** of the debug panel
3. Share the screenshot

### Step 8: Check Kukai Settings

In Kukai extension:

1. What network is selected? (Mainnet/Ghostnet)
2. Is the wallet unlocked?
3. Go to Settings → Connected Sites
4. Is this dApp listed? If yes, what's the status?

### Step 9: Clear Beacon Storage (If Needed)

If connection keeps failing, try:

```javascript
debugHelpers.clearBeaconStorage()
```

Then **refresh the page** and try connecting again.

### Step 10: Try Simplified Test

In the console, paste this code:

```javascript
(async () => {
  try {
    console.log('Testing Beacon connection...');
    const { BeaconWallet } = await import('@taquito/beacon-wallet');
    const { NetworkType } = await import('@airgap/beacon-types');
    
    const wallet = new BeaconWallet({
      name: 'Test Connection',
      preferredNetwork: NetworkType.GHOSTNET,
    });
    
    console.log('Wallet created:', wallet);
    
    await wallet.requestPermissions({
      network: { type: NetworkType.GHOSTNET }
    });
    
    const address = await wallet.getPKH();
    console.log('✅ SUCCESS! Connected:', address);
  } catch (err) {
    console.error('❌ FAILED:', err);
    console.error('Error details:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
  }
})();
```

This tests Beacon connection directly, bypassing the app's context.

## Information to Share

Please share the following:

### 1. Console Output
Copy everything from the console, especially:
- Initialization messages
- Connection attempt messages
- Any error messages (in red)

### 2. Debug Info Screenshot
Screenshot of the "Debug Info" panel showing:
- Wallet Initialized status
- Connected status
- Error message (if any)
- Environment info
- Polyfills status

### 3. Kukai Info
- Kukai version (from Settings → About)
- Network selected (Mainnet/Ghostnet)
- Browser and version
- Any connected sites listed for this dApp

### 4. Test Results
Results from:
- `debugHelpers.checkPolyfills()`
- `debugHelpers.testRPC()`
- Simplified test (Step 10)

### 5. Exact Error Message
The exact error message shown in the dApp (if any)

## Quick Fixes to Try

### Fix 1: Clear Everything
```javascript
// In console
debugHelpers.clearBeaconStorage();
// Then refresh page
```

### Fix 2: Check Network
- Open Kukai
- Verify it says "Ghostnet" (not "Mainnet")
- If wrong, switch to Ghostnet
- Try connecting again

### Fix 3: Disconnect from Kukai
- Open Kukai extension
- Go to Settings → Connected Sites
- Remove this dApp if listed
- Try connecting again

### Fix 4: Allow Popups
- Look for popup blocked icon in address bar
- Click it and allow popups
- Try connecting again

### Fix 5: Restart Kukai
- Close Kukai extension
- Disable and re-enable it in browser extensions
- Try connecting again

## Expected vs Actual

### Expected Behavior:
1. Click "Connect Beacon Wallet"
2. Beacon popup appears
3. Select Kukai
4. Kukai extension opens
5. Approve in Kukai
6. Address appears in dApp
7. Success!

### What's Actually Happening?
Please describe:
- Which step fails?
- What error do you see?
- Does Beacon popup appear?
- Does Kukai extension open?
- What happens in Kukai?

## Comparison Test

Since Kukai works with other dApps:

1. **Open a working dApp** (e.g., Better Call Dev)
2. **Open browser console** (F12)
3. **Connect Kukai** to that dApp
4. **Copy console output** from the working connection
5. **Compare** with console output from this dApp

This will help identify what's different.

## Format for Sharing

Please share in this format:

```
## My Diagnostic Results

### Console Output:
[Paste console output here]

### Debug Info:
- Wallet Initialized: [Yes/No]
- Connected: [Yes/No]
- Error: [Error message if any]
- Polyfills: [All green/Some red]

### Kukai Info:
- Version: [x.x.x]
- Network: [Ghostnet/Mainnet]
- Browser: [Chrome 120 / Firefox 121 / etc]

### Test Results:
- checkPolyfills(): [Result]
- testRPC(): [Result]
- Simplified test: [Success/Failed with error]

### What Happens:
[Describe step-by-step what happens when you try to connect]

### Comparison:
[If you tested with another dApp, what was different?]
```

---

**Once you share this information, I can provide a specific fix for your Kukai issue.**
