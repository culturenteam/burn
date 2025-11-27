# Quick Start Guide

Get up and running with the Tezos NFT Burn dApp in 5 minutes.

## Prerequisites

- ✅ Node.js 20.x (already installed)
- ✅ npm (already installed)
- ✅ A Tezos wallet extension (Temple, Kukai, etc.)

## Step 1: Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
```

The app will be available at: [https://3000--019aab64-9a3e-72fb-9d59-2d410988c948.eu-central-1-01.gitpod.dev](https://3000--019aab64-9a3e-72fb-9d59-2d410988c948.eu-central-1-01.gitpod.dev)

## Step 3: Connect Your Wallet

1. Open the application in your browser
2. Click **"Connect Beacon Wallet"**
3. A Beacon popup will appear
4. Select your wallet (Temple, Kukai, etc.)
5. Approve the connection request
6. Your wallet address will appear on screen

## Step 4: Verify Connection

You should see:
- Your shortened wallet address (e.g., `tz1...5xk`)
- A green "Ghostnet Active" badge in the header
- A "Disconnect Wallet" button

## Step 5: Test Disconnection

Click **"Disconnect Wallet"** to test the disconnection flow.

## Common Issues

### Wallet Not Connecting?

**Solution**: 
- Ensure your wallet extension is installed
- Make sure it's set to Ghostnet network
- Try refreshing the page

### Page Not Loading?

**Solution**:
- Check that the dev server is running
- Verify port 3000 is not in use
- Check browser console for errors

### Session Not Persisting?

**Solution**:
- Enable cookies in your browser
- Check local storage permissions
- Try in incognito mode to rule out extensions

## What's Next?

### Phase 2: NFT Display

When you're ready to add NFT fetching and display:

```
Say: "Move to Phase 2"
```

This will add:
- NFT fetching from TzKT API
- Grid layout for NFT display
- NFT card components
- Loading and error states

### Phase 3: Burn Functionality

After Phase 2, you can add burning:

```
Say: "Move to Phase 3"
```

This will add:
- Burn transaction logic
- Confirmation modals
- Transaction tracking
- Success/error feedback

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Locations

- **Main App**: `App.tsx`
- **Wallet Context**: `context/WalletContext.tsx`
- **Components**: `components/`
- **Design System**: `design-system/`
- **Types**: `types/index.ts`

## Key Features

### ✅ Implemented (Phase 1)
- Wallet connection via Beacon
- Session persistence
- Error handling
- Loading states
- Responsive design
- Design system foundation

### 🔜 Coming Soon (Phase 2)
- NFT fetching
- NFT display grid
- Image loading
- Metadata display

### 🔮 Future (Phase 3)
- Burn transactions
- Confirmation modals
- Transaction status
- Success feedback

## Testing Your Changes

1. Make changes to any file
2. Vite will hot-reload automatically
3. Check the browser for updates
4. Test wallet connection still works

## Design System

Access reusable components:

```tsx
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Alert } from './components/ui/Alert';

// Use in your components
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

## Wallet Context

Access wallet state anywhere:

```tsx
import { useWallet } from './context/WalletContext';

function MyComponent() {
  const { userAddress, isConnected, connectWallet } = useWallet();
  
  return (
    <div>
      {isConnected ? (
        <p>Connected: {userAddress}</p>
      ) : (
        <button onClick={connectWallet}>Connect</button>
      )}
    </div>
  );
}
```

## Network Configuration

Currently configured for Ghostnet:

```typescript
// context/WalletContext.tsx
const NETWORK_CONFIG = {
  rpcUrl: 'https://ghostnet.ecadinfra.com',
  networkType: NetworkType.GHOSTNET,
  appName: 'Tezos NFT Burn dApp',
};
```

## Browser DevTools

### React DevTools
Install React DevTools extension to inspect component tree and state.

### Network Tab
Monitor API calls and wallet connections in the Network tab.

### Console
Check console for wallet connection logs:
- `✅ Session restored: tz1...`
- `✅ Wallet connected: tz1...`
- `✅ Wallet disconnected`

## Performance Tips

- Components use `useCallback` for stable references
- Context prevents unnecessary re-renders
- Tailwind CSS is optimized via CDN
- Vite provides fast HMR

## Security Notes

- Never commit private keys
- Only use testnet (Ghostnet)
- Wallet handles all signing
- No sensitive data in localStorage

## Getting Help

1. Check [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md) for detailed docs
2. Review [design-system/README.md](./design-system/README.md) for components
3. Check browser console for errors
4. Review TypeScript types in `types/index.ts`

## Ready to Build?

You now have a solid foundation with:
- ✅ Wallet connection working
- ✅ Design system in place
- ✅ Type-safe architecture
- ✅ Error handling
- ✅ Responsive UI

**Start building Phase 2 when ready!**

---

**Happy Building! 🚀**
