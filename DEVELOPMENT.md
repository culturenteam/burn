# Development Guide

Complete guide for developing the Tezos NFT Burn dApp.

## Table of Contents

- [Architecture](#architecture)
- [Setup](#setup)
- [Development Workflow](#development-workflow)
- [Code Patterns](#code-patterns)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   App.tsx    │  │  Components  │  │   Services   │      │
│  │  (Main UI)   │  │  (UI Parts)  │  │  (Logic)     │      │
│  └──────┬───────┘  └──────────────┘  └──────────────┘      │
│         │                                                     │
│         ▼                                                     │
│  ┌─────────────────────────────────────────────────┐        │
│  │    WalletContext (State Management)             │        │
│  │    - userAddress, wallet, tezos                 │        │
│  │    - connectWallet(), disconnectWallet()        │        │
│  └──────────────────┬──────────────────────────────┘        │
│                     │                                        │
└─────────────────────┼────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────────────────┐
         │   Tezos Ghostnet Network           │
         │   - RPC: ghostnet.ecadinfra.com    │
         │   - TzKT API for NFT data          │
         └────────────────────────────────────┘
```

### Layer Architecture

**1. Presentation Layer** (`/components/`)
- UI rendering with React components
- Functional components with hooks
- TypeScript interfaces for props
- Tailwind CSS for styling

**2. State Management** (`/context/`)
- WalletContext for global wallet state
- React Context API pattern
- Session persistence

**3. Business Logic** (`/services/`)
- `burn.ts` - Burn transaction logic
- `tzkt.ts` - TzKT API integration
- `pricing.ts` - Pricing calculations

**4. Integration Layer**
- Taquito for blockchain interaction
- Beacon Wallet for wallet connection
- TzKT API for NFT data

### Key Technologies

- **React 19.2.0** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2.0** - Build tool
- **Taquito 23.0.3** - Tezos SDK
- **Beacon Wallet 23.0.3** - Wallet integration
- **Tailwind CSS** - Styling (via CDN)

## Setup

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Tezos wallet (Temple, Kukai, etc.)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/culturenteam/burn.git
cd burn

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on port 3000 at `http://localhost:3000`

### Environment Configuration

No environment variables required. Configuration is in `/constants/index.ts`:

```typescript
export const NETWORK_CONFIG = {
  rpcUrl: 'https://ghostnet.ecadinfra.com',
  networkType: NetworkType.GHOSTNET,
  appName: 'Tezos NFT Burn dApp',
};
```

## Development Workflow

### Starting Development

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Making Changes

1. **Read files first** - Understand context before editing
2. **Follow existing patterns** - Match code style and structure
3. **Use TypeScript strict mode** - No `any` types
4. **Test thoroughly** - Wallet, NFTs, burn functionality
5. **Update documentation** - Keep docs in sync with code

### Code Style

**TypeScript**
- ES modules (import/export)
- Destructured imports: `import { useState } from 'react'`
- Target: ES2022, JSX: react-jsx
- Strict mode enabled
- Proper typing (no `any`)

**React**
- Functional components with hooks
- Context API for global state
- TypeScript interfaces for props
- Component composition

**Styling**
- Tailwind CSS utility-first
- Brutalist design aesthetic
- Custom colors: tezos (#2C7DF7), dark (#0f172a), card (#1e293b)
- Responsive mobile-first

### File Organization

```
/workspaces/burn/
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── BurnModal.tsx       # Burn confirmation modal
│   ├── NFTCard.tsx         # Individual NFT display
│   ├── NFTGrid.tsx         # Grid layout
│   └── index.ts            # Component exports
├── context/
│   └── WalletContext.tsx   # Wallet state management
├── services/
│   ├── burn.ts             # Burn transaction logic
│   ├── tzkt.ts             # TzKT API integration
│   └── pricing.ts          # Pricing calculations
├── hooks/
│   └── usePricing.ts       # Pricing hook
├── types/
│   └── index.ts            # TypeScript definitions
├── utils/
│   ├── address.ts          # Address formatting
│   └── format.ts           # Number/date formatting
├── constants/
│   └── index.ts            # Configuration
├── App.tsx                 # Main application
├── main.tsx                # React entry point
└── index.html              # HTML template
```

## Code Patterns

### Component Pattern

```typescript
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-card">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### Context Pattern

```typescript
import { createContext, useContext, useState, FC, ReactNode } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [value, setValue] = useState('');
  
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be used within MyProvider');
  return context;
};
```

### Service Pattern

```typescript
// services/myService.ts
export const fetchData = async (param: string): Promise<DataType> => {
  try {
    const response = await fetch(`/api/${param}`);
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
```

### Hook Pattern

```typescript
import { useState, useEffect } from 'react';

export const useMyHook = (param: string) => {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await myService(param);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [param]);

  return { data, loading, error };
};
```

## Testing

### Manual Testing Checklist

**Wallet Connection**
- [ ] Connect wallet successfully
- [ ] Address displays correctly
- [ ] Disconnect works
- [ ] Session persists on reload
- [ ] Error handling works
- [ ] User cancellation handled gracefully

**NFT Display**
- [ ] NFTs load from TzKT API
- [ ] Images display correctly
- [ ] Loading states work
- [ ] Empty state shows when no NFTs
- [ ] Error states display properly

**Burn Functionality**
- [ ] Burn modal opens
- [ ] Confirmation required
- [ ] Transaction succeeds
- [ ] Success message displays
- [ ] Error handling works
- [ ] Transaction tracked on TzKT

**Responsive Design**
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch interactions work

### Testing Commands

```bash
# Build for production (checks for errors)
npm run build

# Preview production build
npm run preview
```

### Browser Testing

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Troubleshooting

### Common Issues

#### Wallet Connection

**Issue:** "Buffer is not defined"
- **Cause:** Missing Buffer polyfill
- **Solution:** Buffer polyfill is in `index.html` and `polyfills.ts`

**Issue:** User cancels connection
- **Cause:** User declined wallet connection
- **Solution:** Not treated as error, just clears loading state

**Issue:** Connection fails
- **Cause:** Wallet not installed or network mismatch
- **Solution:** Check wallet installation, verify network is Ghostnet

#### NFT Display

**Issue:** NFTs not loading
- **Cause:** TzKT API error or no NFTs in wallet
- **Solution:** Check TzKT API response, verify wallet has NFTs on Ghostnet

**Issue:** Images not displaying
- **Cause:** IPFS gateway issues or invalid metadata
- **Solution:** Check IPFS gateway, use fallback image

#### Burn Functionality

**Issue:** Transaction fails
- **Cause:** Insufficient gas, invalid contract, or network error
- **Solution:** Check gas estimation, verify contract address, check network

**Issue:** Confirmation modal doesn't open
- **Cause:** State management issue
- **Solution:** Check `selectedNFT` state, verify modal component

### Debug Tools

**Debug Info Component**
- Click "Show Debug Info" in app
- Shows wallet state, network info, errors

**Browser Console**
- Check for JavaScript errors
- Verify network requests
- Check wallet connection logs

**TzKT Explorer**
- Verify transactions: [ghostnet.tzkt.io](https://ghostnet.tzkt.io/)
- Check NFT metadata
- View contract calls

### Getting Help

1. Check browser console for errors
2. Use Debug Info component in app
3. Verify network connectivity
4. Test with different wallets
5. Check TzKT API responses
6. Review this documentation

## Deployment

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Output in dist/ directory
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist/` directory to static host
3. Configure for SPA (redirect all routes to index.html)

### Environment-Specific Configuration

**Testnet (Current)**
- Network: Ghostnet
- RPC: `https://ghostnet.ecadinfra.com`
- TzKT: `https://api.ghostnet.tzkt.io`

**Mainnet (Future)**
- Network: Mainnet
- RPC: `https://mainnet.ecadinfra.com`
- TzKT: `https://api.tzkt.io`
- Update `constants/index.ts` before deploying

### Post-Deployment Checklist

- [ ] Wallet connection works
- [ ] NFTs load correctly
- [ ] Burn functionality works
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Analytics configured (if applicable)
- [ ] Error tracking configured (if applicable)

## Performance Optimization

### Current Optimizations

- Lazy load NFT images
- React.memo for expensive components
- Debounced user inputs
- Efficient re-renders with proper dependencies

### Future Optimizations

- Paginate NFT lists
- Cache TzKT API responses
- Code splitting with React.lazy
- Service worker for offline support
- Image optimization

## Security Considerations

- **No private keys in code** - Wallet handles all signing
- **Testnet only** - Safe testing environment
- **Input validation** - All user inputs validated
- **Error sanitization** - No sensitive data in error messages
- **Secure Beacon protocol** - Industry-standard wallet connection
- **HTTPS required** - Secure communication

## Contributing

### Development Process

1. Fork repository
2. Create feature branch
3. Make changes following patterns
4. Test thoroughly
5. Update documentation
6. Submit pull request

### Commit Message Format

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Code Review Checklist

- [ ] Follows existing patterns
- [ ] TypeScript strict mode
- [ ] No `any` types
- [ ] Error handling included
- [ ] Documentation updated
- [ ] Tested manually
- [ ] No console errors

## Resources

### Documentation
- [Taquito Docs](https://tezostaquito.io/)
- [Beacon SDK](https://docs.walletbeacon.io/)
- [TzKT API](https://api.tzkt.io/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)

### Tools
- [Tezos Faucet](https://faucet.ghostnet.teztnets.com/)
- [TzKT Explorer](https://ghostnet.tzkt.io/)
- [Temple Wallet](https://templewallet.com/)
- [Kukai Wallet](https://wallet.kukai.app/)

### Community
- [Tezos Developer Portal](https://tezos.com/developers/)
- [Tezos Stack Exchange](https://tezos.stackexchange.com/)
- [Tezos Discord](https://discord.gg/tezos)
