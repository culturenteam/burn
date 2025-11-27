# How to Access Your Application

## ✅ Application is Running

Your Tezos NFT Burn dApp is currently running on port 3000.

## 🌐 Access Methods

### Method 1: Gitpod Ports Panel (Recommended)

1. Look at the bottom panel in your Gitpod workspace
2. Click on the **"PORTS"** tab
3. Find port **3000** in the list
4. Click the **globe icon** (🌐) or the URL to open in browser
5. The app will open in a new tab

### Method 2: Command Palette

1. Press `F1` or `Cmd/Ctrl + Shift + P`
2. Type "Ports: Focus on Ports View"
3. Find port 3000
4. Click to open

### Method 3: Direct URL

The application is accessible at:
```
https://3000-<your-workspace-id>.gitpod.io
```

Replace `<your-workspace-id>` with your actual Gitpod workspace ID.

## 🔧 Troubleshooting

### "Blocked request" Error

If you see a "Blocked request" error, the Vite configuration has been updated to allow Gitpod hosts. The server has been restarted with the new configuration.

### Port Not Visible

If port 3000 is not visible in the Ports panel:

```bash
# Check if server is running
ps aux | grep vite

# Restart the server
npm run dev
```

### Server Not Responding

```bash
# Kill any existing processes
pkill -f vite

# Start fresh
npm run dev
```

## 📱 Testing the Application

Once you access the app:

1. **Initial Load**: You should see "Connect Wallet" button
2. **Click Connect**: Beacon popup will appear
3. **Select Wallet**: Choose Temple, Kukai, or another wallet
4. **Approve**: Approve the connection in your wallet
5. **Connected**: Your address will display (e.g., tz1...5xk)
6. **Network Badge**: "Ghostnet Active" badge appears in header
7. **Disconnect**: Click "Disconnect Wallet" to test disconnection

## 🎯 What You Should See

### Initial State
```
┌─────────────────────────────────────┐
│  Tezos NFT Burn                     │
├─────────────────────────────────────┤
│                                     │
│     Connect Wallet                  │
│                                     │
│     Interact with the Tezos         │
│     blockchain securely.            │
│                                     │
│     [Connect Beacon Wallet]         │
│                                     │
└─────────────────────────────────────┘
```

### Connected State
```
┌─────────────────────────────────────┐
│  Tezos NFT Burn  [🟢 Ghostnet]     │
├─────────────────────────────────────┤
│                                     │
│     Welcome Back                    │
│                                     │
│     You are connected to the        │
│     Tezos Ghostnet.                 │
│                                     │
│     ┌─────────────────────────┐    │
│     │ 👛 tz1VSU...cjb    ✓   │    │
│     │ Connected Address       │    │
│     └─────────────────────────┘    │
│                                     │
│     [Disconnect Wallet]             │
│                                     │
└─────────────────────────────────────┘
```

## 🔐 Security Notes

- The app only works with Tezos Ghostnet (testnet)
- No real funds are at risk
- Your private keys never leave your wallet
- All transactions are signed by your wallet

## 📊 Performance

Expected performance metrics:
- Initial load: < 2 seconds
- Wallet connection: < 3 seconds
- UI interactions: Instant
- No console errors

## 🐛 Common Issues

### Issue: Wallet Not Connecting

**Solution:**
- Ensure you have a Tezos wallet installed (Temple, Kukai)
- Make sure wallet is set to Ghostnet network
- Try refreshing the page
- Check browser console for errors

### Issue: Page Not Loading

**Solution:**
- Check that dev server is running (`npm run dev`)
- Verify port 3000 is accessible in Ports panel
- Try opening in a different browser
- Clear browser cache

### Issue: Beacon Popup Not Appearing

**Solution:**
- Check if popup was blocked by browser
- Allow popups for this site
- Try clicking connect again
- Check wallet extension is enabled

## 📝 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check TypeScript
npx tsc --noEmit
```

## 🎨 Design System

The app uses a custom design system with:
- **Tezos Blue**: #2C7DF7 (primary brand color)
- **Dark Background**: #0f172a
- **Card Background**: #1e293b
- **Success Green**: #10b981
- **Error Red**: #ef4444

## 📚 Documentation

For more information, see:
- `README.md` - Project overview
- `QUICKSTART.md` - Quick start guide
- `PHASE_1_COMPLETE.md` - Phase 1 documentation
- `ARCHITECTURE.md` - Technical architecture
- `TESTING.md` - Testing guide

## ✅ Verification Checklist

- [ ] Application loads without errors
- [ ] "Connect Wallet" button is visible
- [ ] Background animations are smooth
- [ ] Clicking connect opens Beacon popup
- [ ] Wallet connection succeeds
- [ ] Address displays correctly
- [ ] Network badge shows "Ghostnet Active"
- [ ] Disconnect button works
- [ ] No console errors

## 🚀 Next Steps

Once you've verified Phase 1 is working:

1. Test all wallet connection flows
2. Verify responsive design on mobile
3. Check browser compatibility
4. Review documentation
5. When ready, say **"Move to Phase 2"** to add NFT display

---

**Status**: ✅ Server Running on Port 3000  
**Access**: Via Gitpod Ports Panel  
**Phase**: 1 Complete - Ready for Testing
