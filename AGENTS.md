# AI Agent Guidelines

Optimized guide for AI agents developing the Tezos NFT Burn dApp.

## Quick Reference

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
git pull origin main # Pull latest changes
```

### Key Files
- `App.tsx` - Main UI
- `context/WalletContext.tsx` - Wallet state
- `services/burn.ts` - Burn logic
- `services/tzkt.ts` - NFT data
- `components/BurnModal.tsx` - Burn confirmation
- `constants/index.ts` - Configuration

### Key State
- `userAddress` - Connected wallet (string | null)
- `wallet` - BeaconWallet instance
- `tezos` - TezosToolkit instance
- `nfts` - User's NFTs (NFT[])

## Code Patterns

### Component
```typescript
import { FC } from 'react';

interface Props {
  title: string;
  onAction: () => void;
}

export const Component: FC<Props> = ({ title, onAction }) => {
  return <div className="p-4">{title}</div>;
};
```

### Service
```typescript
export const fetchData = async (param: string): Promise<DataType> => {
  try {
    const response = await fetch(`/api/${param}`);
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Hook
```typescript
export const useData = (param: string) => {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch logic
  }, [param]);

  return { data, loading, error };
};
```

## Rules

### TypeScript
- ✅ ES modules (import/export)
- ✅ Proper types (NO `any`)
- ✅ Strict mode enabled
- ✅ Target: ES2022, JSX: react-jsx

### React
- ✅ Functional components with hooks
- ✅ Context API for global state
- ✅ TypeScript interfaces for props
- ✅ Component composition

### Styling
- ✅ Tailwind CSS utility-first
- ✅ Brutalist design aesthetic
- ✅ Colors: tezos (#2C7DF7), dark (#0f172a), card (#1e293b)
- ✅ Responsive mobile-first

### Blockchain
- ✅ Test on Ghostnet testnet
- ❌ NEVER commit private keys
- ✅ Handle user cancellation gracefully
- ✅ Verify transaction success
- ✅ Estimate gas before transactions
- ✅ Show confirmation modal

## Workflow

### Development
1. Pull latest: `git pull origin main`
2. Install: `npm install`
3. Start: `npm run dev`
4. Make changes following patterns
5. Test thoroughly
6. Update docs if needed
7. Commit: `git commit -m "feat: Description"`

### Testing
- [ ] Wallet connects
- [ ] NFTs load
- [ ] Images display
- [ ] Burn works
- [ ] Errors handled
- [ ] Responsive

## Common Issues

### Wallet Connection
- **"Buffer is not defined"** → Buffer polyfill in index.html
- **User cancels** → Not an error, clear loading state
- **Connection fails** → Check wallet installed, verify Ghostnet

### NFT Display
- **NFTs not loading** → Check TzKT API, verify wallet has NFTs
- **Images not displaying** → Check IPFS gateway, use fallback

### Burn Functionality
- **Transaction fails** → Check gas, verify contract address
- **Modal doesn't open** → Check selectedNFT state

## Project Structure

```
/workspaces/burn/
├── components/          # React components
│   ├── ui/             # Reusable UI
│   ├── BurnModal.tsx
│   ├── NFTCard.tsx
│   └── NFTGrid.tsx
├── context/
│   └── WalletContext.tsx
├── services/
│   ├── burn.ts
│   ├── tzkt.ts
│   └── pricing.ts
├── hooks/
│   └── usePricing.ts
├── types/
│   └── index.ts
├── constants/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Configuration

### Network (constants/index.ts)
```typescript
export const NETWORK_CONFIG = {
  rpcUrl: 'https://ghostnet.ecadinfra.com',
  networkType: NetworkType.GHOSTNET,
  appName: 'Tezos NFT Burn dApp',
};
```

### Burn Address
`tz1burnburnburnburnburnburnburjAYjjX`

### True Vision Token
- Contract: `KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton`
- Token ID: `754916`

## Documentation

- **README.md** - User-facing overview
- **DEVELOPMENT.md** - Complete dev guide
- **CONTRACTS.md** - Smart contract docs
- **CHANGELOG.md** - Version history
- **AGENTS.md** - This file

## Resources

- [Taquito Docs](https://tezostaquito.io/)
- [Beacon SDK](https://docs.walletbeacon.io/)
- [TzKT API](https://api.tzkt.io/)
- [Ghostnet Explorer](https://ghostnet.tzkt.io/)
- [Ghostnet Faucet](https://faucet.ghostnet.teztnets.com/)

## Critical Reminders

- ✅ Test wallet connection after changes
- ❌ NEVER commit sensitive data
- ✅ Use TypeScript strict mode
- ❌ NEVER use `any` type
- ✅ Handle errors gracefully
- ✅ Test on Ghostnet first
- ✅ Verify transaction success
- ❌ NEVER hardcode addresses/keys

## Performance

- Lazy load NFT images
- Paginate NFT lists
- Cache TzKT responses
- Use React.memo for expensive components
- Debounce user inputs

## Security

- No private keys in code
- Wallet handles all signing
- Testnet only (by design)
- Input validation
- Secure Beacon protocol
- HTTPS required
