# Tezos NFT Burn dApp - Agent Guidelines

## Common Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server on port 3000
npm run build           # Build for production
npm run preview         # Preview production build
./scripts/dev.sh        # Alternative dev script

# Git workflow
git status              # Check current changes
git pull origin main    # Pull latest changes
git add .               # Stage all changes
git commit -m "feat: Description"  # Commit with message
git push origin main    # Push to GitHub
```

## Key Files

### Core Application
- `App.tsx` - Main application component with NFT grid and burn UI
- `main.tsx` - React entry point with providers
- `index.html` - HTML template with Tailwind CDN and polyfills

### Components
- `components/NFTCard.tsx` - Individual NFT display with burn button
- `components/NFTGrid.tsx` - Grid layout for NFTs
- `components/BurnModal.tsx` - Burn confirmation modal
- `components/WalletInfo.tsx` - Wallet address display
- `components/NetworkBadge.tsx` - Network status indicator
- `components/DebugInfo.tsx` - Debug information panel
- `components/ui/` - Reusable UI components (Button, Card, Alert)

### State & Logic
- `context/WalletContext.tsx` - Wallet state management and Tezos integration
- `services/burn.ts` - Burn transaction logic
- `services/tzkt.ts` - TzKT API integration for NFT data
- `services/pricing.ts` - Pricing calculations
- `hooks/usePricing.ts` - Pricing hook

### Configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `constants/index.ts` - Network and app configuration
- `design-system/tokens.ts` - Design tokens

### Types & Utils
- `types/index.ts` - TypeScript type definitions
- `utils/address.ts` - Address formatting utilities
- `utils/format.ts` - Number and date formatting

## Code Style

### TypeScript
- Use ES modules (import/export), not CommonJS
- Destructure imports: `import { useState } from 'react'`
- **ALWAYS** use proper types - NO `any` types
- Target: ES2022, JSX: react-jsx
- Strict mode enabled

### React
- Functional components with hooks
- Context API for global state
- TypeScript interfaces for all props
- Component composition over inheritance
- Custom hooks for reusable logic

### Styling
- Tailwind CSS utility-first approach
- Brutalist design aesthetic
- Custom colors: tezos (#2C7DF7), dark (#0f172a), card (#1e293b)
- Responsive design with mobile-first approach
- Lucide React for icons

## Workflow

### Feature Development
1. **ALWAYS** pull latest changes first: `git pull origin main`
2. **ALWAYS** install dependencies: `npm install`
3. **ALWAYS** start dev server: `npm run dev`
4. Make changes following existing patterns
5. Test thoroughly (wallet, NFTs, burn)
6. Update relevant documentation
7. Commit with descriptive message
8. Push to GitHub

### Testing Checklist
- [ ] Wallet connects successfully
- [ ] NFTs load from TzKT API
- [ ] NFT images display correctly
- [ ] Burn modal opens and confirms
- [ ] Burn transaction succeeds
- [ ] Error handling works
- [ ] Responsive on mobile
- [ ] No console errors

### Documentation Updates
When making changes, update:
- CLAUDE.md (if architecture changes)
- AGENTS.md (if workflow changes)
- Relevant phase documentation
- Troubleshooting guides (if fixing bugs)
- README.md (if user-facing changes)

## Important Rules

### Blockchain Integration
- **ALWAYS** test on Ghostnet testnet
- **NEVER** commit private keys or sensitive data
- **ALWAYS** handle user cancellation gracefully
- **ALWAYS** verify transaction success before showing success message
- **ALWAYS** estimate gas before transactions
- **ALWAYS** show confirmation modal before burning

### Code Quality
- **ALWAYS** use TypeScript strict mode
- **NEVER** use `any` type - use proper typing
- **ALWAYS** handle errors with try/catch
- **ALWAYS** provide user-friendly error messages
- **ALWAYS** log errors to console for debugging
- **ALWAYS** validate user inputs

### Component Development
- **ALWAYS** place components in appropriate directory
- **ALWAYS** export from index.ts
- **ALWAYS** use TypeScript interfaces for props
- **ALWAYS** follow existing component patterns
- **ALWAYS** make components responsive

### State Management
- **ALWAYS** use WalletContext for wallet state
- **NEVER** duplicate state across components
- **ALWAYS** use hooks for reusable logic
- **ALWAYS** memoize expensive computations
- **ALWAYS** clean up effects and subscriptions

## Project Context

### Current Status
- **Phase 3 Complete** - Full burn functionality with True Vision rewards
- **Network:** Tezos Ghostnet (testnet)
- **Wallet:** Beacon Wallet integration
- **API:** TzKT for blockchain data
- **Design:** Brutalist aesthetic

### Architecture
- React 19 with TypeScript 5.8
- Vite 6 for build tooling
- Taquito 23 for Tezos integration
- Tailwind CSS for styling
- Context API for state management

### Key Features
- Wallet connection/disconnection
- NFT fetching and display
- NFT burning with confirmation
- True Vision reward system
- Transaction status tracking
- Error handling and debugging

## Common Issues

### Wallet Connection
- **Issue:** "Buffer is not defined"
  - **Solution:** Buffer polyfill is in index.html and polyfills.ts
- **Issue:** User cancels connection
  - **Solution:** Not treated as error, just clears loading state

### NFT Display
- **Issue:** NFTs not loading
  - **Solution:** Check TzKT API response, verify wallet address
- **Issue:** Images not displaying
  - **Solution:** Check IPFS gateway, use fallback image

### Burn Functionality
- **Issue:** Transaction fails
  - **Solution:** Check gas estimation, verify contract address
- **Issue:** Confirmation modal doesn't open
  - **Solution:** Check selectedNFT state, verify modal component

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

### Project Documentation
See the 29 .md files in the repository for comprehensive documentation:
- README.md - Project overview
- PROJECT_SUMMARY.md - Detailed summary
- ARCHITECTURE.md - Technical architecture
- PHASE_*_COMPLETE.md - Phase documentation
- TROUBLESHOOTING.md - Issue resolution
- And many more...

## Development Tips

### Performance
- Lazy load NFT images
- Paginate NFT lists
- Cache TzKT responses
- Use React.memo for expensive components
- Debounce user inputs

### Debugging
- Use DebugInfo component in app
- Check browser console for errors
- Verify network requests in DevTools
- Test with different wallets
- Check TzKT API responses

### Best Practices
- Write self-documenting code
- Add comments for complex logic only
- Keep components small and focused
- Extract reusable logic to hooks
- Test edge cases
- Handle loading and error states
- Provide user feedback

## Next Steps

When starting a new session:
1. `git pull origin main` - Get latest changes
2. `npm install` - Install dependencies
3. `npm run dev` - Start development
4. Review recent commits
5. Check open issues
6. Test critical paths

When adding features:
1. Review existing patterns
2. Check documentation
3. Follow code style
4. Test thoroughly
5. Update docs
6. Commit and push
