# Tezos NFT Burn dApp

A decentralized application for burning NFTs on the Tezos blockchain, built with React, TypeScript, and Taquito.

## 🎯 Project Overview

This dApp allows users to connect their Tezos wallet and burn (permanently destroy) their NFTs on the Ghostnet testnet. The application is built in three distinct phases, each adding core functionality.

## 🚀 Current Status: Phase 2 Complete ✅

### Phase 1: Wallet Connection ✅
- ✅ Beacon Wallet integration
- ✅ Connect/disconnect functionality
- ✅ Session persistence
- ✅ Comprehensive error handling
- ✅ Design system foundation
- ✅ Type-safe architecture

**[View Phase 1 Documentation](./PHASE_1_COMPLETE.md)**

### Phase 2: NFT Display ✅
- ✅ TzKT API integration
- ✅ NFT fetching and display
- ✅ Responsive grid layout
- ✅ Image loading with fallbacks
- ✅ Loading and error states
- ✅ Empty state handling
- ✅ TzKT explorer links

**[View Phase 2 Documentation](./PHASE_2_COMPLETE.md)**

## 📋 Roadmap

### Phase 3: Burn Functionality (Next)
- Burn button on each NFT
- Confirmation modal
- Transaction building and signing
- Transaction status tracking
- Success/error feedback
- Transaction history

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Taquito, Beacon Wallet
- **Network**: Tezos Ghostnet (Testnet)
- **API**: TzKT API for blockchain data

## 📦 Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- A Tezos wallet (Temple, Kukai, etc.)

### Setup

```bash
# Clone the repository
git clone https://github.com/culturenteam/burn.git
cd burn

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎨 Design System

The project includes a comprehensive design system with:

- **Design Tokens**: Centralized colors, spacing, typography
- **UI Components**: Button, Card, Alert, and more
- **Layout System**: Responsive layouts and navigation
- **Type Safety**: Full TypeScript support

**[View Design System Documentation](./design-system/README.md)**

## 📁 Project Structure

```
/workspaces/burn/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Layout.tsx      # Main layout
│   ├── WalletInfo.tsx  # Wallet display
│   └── NetworkBadge.tsx # Network indicator
├── context/            # React Context providers
│   └── WalletContext.tsx
├── design-system/      # Design tokens and docs
├── types/              # TypeScript definitions
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.html          # HTML template
```

## 🔧 Configuration

### Network Configuration

The application is configured for Tezos Ghostnet:

```typescript
const NETWORK_CONFIG = {
  rpcUrl: 'https://ghostnet.ecadinfra.com',
  networkType: NetworkType.GHOSTNET,
  appName: 'Tezos NFT Burn dApp',
};
```

### Tailwind Configuration

Custom Tailwind theme with Tezos brand colors:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        tezos: '#2C7DF7',
        dark: '#0f172a',
        card: '#1e293b'
      }
    }
  }
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Application loads without errors
- [ ] Wallet connection works
- [ ] Address displays correctly
- [ ] Disconnection works
- [ ] Session persists on reload
- [ ] Error messages display
- [ ] Responsive on mobile

## 🔐 Security

- No private keys stored in application
- Wallet connection through secure Beacon protocol
- Testnet only (Ghostnet) for safe testing
- Proper error handling

## 🤝 Contributing

This is a learning project demonstrating Tezos dApp development. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Taquito Documentation](https://tezostaquito.io/)
- [Beacon SDK](https://docs.walletbeacon.io/)
- [TzKT API](https://api.tzkt.io/)
- [Tezos Developer Portal](https://tezos.com/developers/)

## 📞 Support

### ⚠️ IMPORTANT: Connection Issues Fixed!

**If you're experiencing connection errors**, critical fixes have been applied:
1. **[CRITICAL FIXES APPLIED](./CRITICAL_FIXES_APPLIED.md)** - ✅ **READ THIS FIRST!**
2. **Action Required**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

The issues were:
- ❌ Incomplete Buffer polyfill (now fixed)
- ❌ Wrong Beacon API usage (now fixed)

### Additional Resources:

If you still have issues after refreshing:
1. **[Wallet Connection Guide](./WALLET_CONNECTION_GUIDE.md)** - Complete setup guide
2. **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Detailed solutions
3. **[Kukai Specific Guide](./KUKAI_SPECIFIC_GUIDE.md)** - Kukai wallet help
4. **[Diagnostic Steps](./DIAGNOSTIC_STEPS.md)** - Debug process
5. **Debug Info** - Click "Show Debug Info" button in the app

### For Other Issues:
- Open an issue on GitHub
- Check existing documentation
- Review Phase 1 completion guide

## 🎯 Next Steps

Ready to move to Phase 2? The next phase will add NFT fetching and display functionality.

**[Start Phase 2 →](./PHASE_1_COMPLETE.md#next-steps-phase-2)**

---

**Built with ❤️ for the Tezos ecosystem**
