# Tezos NFT Burn dApp

A production-ready decentralized application for burning NFTs on the Tezos blockchain with True Vision reward system.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build
```

## Features

- **Wallet Integration** - Beacon Wallet with Temple/Kukai support
- **NFT Display** - Fetch and display NFTs via TzKT API
- **Burn Functionality** - Burn NFTs with confirmation modal
- **True Vision Rewards** - Automated reward system for burns
- **Brutalist Design** - Clean, functional UI with Tailwind CSS

## Tech Stack

- React 19.2.0 + TypeScript 5.8
- Vite 6.2.0 (build tool)
- Taquito 23.0.3 (Tezos SDK)
- Beacon Wallet 23.0.3
- Tailwind CSS (via CDN)
- TzKT API (blockchain data)

## Network Configuration

**Current:** Tezos Ghostnet (testnet)
- RPC: `https://ghostnet.ecadinfra.com`
- Explorer: [ghostnet.tzkt.io](https://ghostnet.tzkt.io/)
- Faucet: [faucet.ghostnet.teztnets.com](https://faucet.ghostnet.teztnets.com/)

## Project Structure

```
/workspaces/burn/
├── components/              # React components
│   ├── ui/                 # Reusable UI (Button, Card, Alert)
│   ├── BurnModal.tsx       # Burn confirmation
│   ├── NFTCard.tsx         # NFT display
│   └── NFTGrid.tsx         # Grid layout
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
├── constants/
│   └── index.ts            # Configuration
├── App.tsx                 # Main application
└── main.tsx                # React entry point
```

## Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Architecture, workflow, testing, troubleshooting
- **[AGENTS.md](./AGENTS.md)** - AI agent guidelines and patterns
- **[CONTRACTS.md](./CONTRACTS.md)** - Smart contract documentation
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and changes

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Build

```bash
npm run build
# Deploy dist/ directory to any static host
```

## Security

- No private keys in code
- Wallet handles all signing
- Testnet only (by design)
- Input validation
- Secure Beacon protocol

## Resources

- [Taquito Docs](https://tezostaquito.io/)
- [Beacon SDK](https://docs.walletbeacon.io/)
- [TzKT API](https://api.tzkt.io/)
- [Tezos Developer Portal](https://tezos.com/developers/)

## License

MIT License

---

**Built for the Tezos ecosystem**
