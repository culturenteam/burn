# Tezos NFT Burn dApp - AI Development Context

## Project Overview

A production-ready decentralized application for burning NFTs on the Tezos blockchain. Built with React 19, TypeScript, and Taquito with a brutalist design aesthetic and True Vision reward system.

**Tech Stack:**
- React 19.2.0 with TypeScript 5.8
- Vite 6.2.0 (build tool)
- Taquito 23.0.3 (Tezos SDK)
- Beacon Wallet 23.0.3 (wallet integration)
- Tailwind CSS (via CDN)
- TzKT API (blockchain data)
- Lucide React (icons)

**Current Status:** Phase 3 Complete - Full burn functionality with True Vision rewards

## Project Structure

```
/workspaces/burn/
├── components/              # React components
│   ├── ui/                 # Reusable UI components (Button, Card, Alert)
│   ├── BurnModal.tsx       # Burn confirmation modal
│   ├── DebugInfo.tsx       # Debug information display
│   ├── Layout.tsx          # Main layout wrapper
│   ├── NFTCard.tsx         # Individual NFT display
│   ├── NFTGrid.tsx         # NFT grid layout
│   ├── NetworkBadge.tsx    # Network status indicator
│   ├── WalletInfo.tsx      # Wallet address display
│   └── index.ts            # Component exports
├── context/
│   └── WalletContext.tsx   # Wallet state management
├── services/
│   ├── burn.ts             # Burn transaction logic
│   ├── pricing.ts          # Pricing calculations
│   └── tzkt.ts             # TzKT API integration
├── hooks/
│   └── usePricing.ts       # Pricing hook
├── types/
│   └── index.ts            # TypeScript definitions
├── utils/
│   ├── address.ts          # Address formatting
│   ├── format.ts           # Number/date formatting
│   └── index.ts            # Utility exports
├── constants/
│   └── index.ts            # Configuration constants
├── design-system/
│   ├── tokens.ts           # Design tokens
│   └── README.md           # Design system docs
├── contracts/
│   └── BurnRewarder.md     # Smart contract docs
├── src/components/         # Additional components
│   ├── InfoModal.tsx
│   ├── PricingIndicator.tsx
│   └── ViewToggle.tsx
├── scripts/
│   └── dev.sh              # Development script
├── App.tsx                 # Main application component
├── main.tsx                # React entry point
├── index.tsx               # Alternative entry point
├── index.html              # HTML template
├── polyfills.ts            # Browser polyfills
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Development script (alternative)
./scripts/dev.sh
```

## Development Server

**IMPORTANT:** Always use `exec_preview` to run the dev server:
```bash
npm run dev
```
Server runs on port 3000 and binds to 0.0.0.0 for container access.

## Code Patterns & Conventions

### TypeScript
- Use ES modules (import/export), not CommonJS
- Destructure imports: `import { useState } from 'react'`
- Target: ES2022
- JSX: react-jsx (automatic runtime)
- Path alias: `@/*` maps to project root
- Strict mode enabled
- No `any` types - use proper typing

### React Patterns
- Functional components with hooks
- Context API for global state (WalletContext)
- TypeScript interfaces for props and context types
- React.StrictMode enabled
- Component composition over inheritance
- Custom hooks for reusable logic (usePricing)

### Styling
- Tailwind CSS via CDN (configured in index.html)
- Brutalist design aesthetic
- Custom colors:
  - `tezos`: #2C7DF7 (primary brand)
  - `dark`: #0f172a (background)
  - `card`: #1e293b (card background)
  - `accent`: #10b981 (success/accent)
- Utility-first approach with responsive classes
- Lucide React for icons
- Design tokens in `/design-system/tokens.ts`

### File Organization
- Components in `/components` directory
- Services in `/services` directory
- Hooks in `/hooks` directory
- Types in `/types` directory
- Utils in `/utils` directory
- Constants in `/constants` directory
- UI components in `/components/ui`

## Tezos/Blockchain Integration

### Network Configuration
- **RPC URL:** `https://ghostnet.ecadinfra.com`
- **Network:** Ghostnet (testnet)
- **Wallet:** Beacon Wallet with BeaconWallet class
- **SDK:** TezosToolkit from @taquito/taquito
- **API:** TzKT API for blockchain data

### Key Implementation Details
- TezosToolkit instance is global and reused
- BeaconWallet initialized on mount in WalletContext
- Active account persistence checked on initialization
- User cancellation of wallet connection is not treated as an error
- Buffer polyfill required for browser compatibility
- Process polyfill for Node.js globals

### Burn Functionality
- Burn transactions via smart contract
- True Vision reward system integration
- Transaction status tracking
- Success/error feedback
- Confirmation modal before burning
- Gas estimation and fee calculation

### TzKT API Integration
- Fetch user's NFTs
- Get NFT metadata
- Display NFT images
- Show creator information
- Filter by collection
- Handle pagination

## Environment Variables

No environment variables required for basic functionality. All configuration is in `/constants/index.ts`.

## Important Notes

### Browser Compatibility
- Global polyfill in index.html for wallet libraries:
  ```javascript
  if (typeof global === 'undefined') {
    window.global = window;
  }
  ```
- Buffer polyfill required: `import { Buffer } from 'buffer'`
- Process polyfill for Node.js globals

### Import Maps
- Dependencies loaded via importmap in index.html (if used)
- Vite handles module resolution in development
- All dependencies must be in package.json

### Wallet Connection Flow
1. BeaconWallet initialized with app name and preferred network
2. `requestPermissions()` triggers wallet connection UI
3. `getPKH()` retrieves user's public key hash (address)
4. Active account persists across page reloads
5. `clearActiveAccount()` disconnects wallet

### Error Handling
- User cancellation (Aborted) is not shown as error
- Technical errors display user-friendly messages
- Console logging for debugging wallet operations
- Debug info component for troubleshooting
- Comprehensive error types in TypeScript

## Testing & Verification

**Manual Testing:**
1. Run dev server: `npm run dev`
2. Click "Connect Wallet" button
3. Approve connection in wallet popup
4. Verify address displays correctly
5. Check NFTs load from TzKT API
6. Test burn functionality with confirmation
7. Verify transaction success/error handling
8. Test disconnect functionality

**No automated tests currently configured.**

## Git Workflow

**Commit Message Style:**
- Format: `feat: Description` or `fix: Description` or `docs: Description`
- Examples from history:
  - `feat: Complete brutalist redesign and True Vision reward system`
  - `feat: Initialize Tezos dApp project structure`

**Branch Strategy:**
- Main branch: `main` (default)
- Create feature branches for new work

## Known Issues & Warnings

1. **Tailwind via CDN:** Not ideal for production (consider PostCSS setup)
2. **No test suite:** Add testing framework for production readiness
3. **Testnet only:** Currently configured for Ghostnet (by design)
4. **Buffer polyfill:** Required for browser compatibility with Tezos libraries

## AI Development Guidelines

### When Adding Features
1. Check package.json for available dependencies
2. Match existing code style (functional components, hooks)
3. Use TypeScript interfaces for new types
4. Follow Tailwind utility-first styling
5. Add error handling for async operations
6. Console.log important state changes for debugging
7. Update relevant documentation files
8. Follow brutalist design aesthetic

### When Modifying Wallet Logic
- Always test on Ghostnet testnet
- Preserve active account persistence
- Handle user cancellation gracefully
- Update WalletContext types if adding new state
- Test with multiple wallet types (Temple, Kukai)

### When Modifying Burn Logic
- Test transaction building thoroughly
- Verify gas estimation
- Handle all error cases
- Update confirmation modal if needed
- Test with different NFT types
- Verify True Vision reward calculation

### When Updating Dependencies
- Update package.json
- Test wallet connection after updates
- Check for breaking changes in Taquito/Beacon releases
- Verify TzKT API compatibility
- Test all critical paths

### When Adding Components
- Place in appropriate directory (components/, components/ui/, src/components/)
- Export from index.ts
- Use TypeScript interfaces for props
- Follow existing component patterns
- Add to design system if reusable
- Document in relevant .md files

## Documentation Files

The project has extensive documentation:

### Core Documentation
- **README.md** - Project overview and quick start
- **PROJECT_SUMMARY.md** - Comprehensive project summary
- **ARCHITECTURE.md** - Technical architecture details
- **QUICKSTART.md** - 5-minute setup guide

### Phase Documentation
- **PHASE_1_COMPLETE.md** - Wallet connection phase
- **PHASE_2_COMPLETE.md** - NFT display phase
- **PHASE_3_COMPLETE.md** - Burn functionality phase
- **PHASE_1_CHECKLIST.md** - Phase 1 checklist

### Troubleshooting
- **TROUBLESHOOTING.md** - General troubleshooting
- **BURN_TROUBLESHOOTING.md** - Burn-specific issues
- **WALLET_CONNECTION_GUIDE.md** - Wallet setup guide
- **KUKAI_SPECIFIC_GUIDE.md** - Kukai wallet help
- **KUKAI_APPROVAL_GUIDE.md** - Kukai approval process
- **DIAGNOSTIC_STEPS.md** - Debug process

### Technical Guides
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **TESTING.md** - Testing guide
- **SETUP_COMPLETE.md** - Setup verification
- **OPERATOR_SETUP.md** - Operator configuration
- **TRUE_VISION_SETUP.md** - True Vision integration

### Fix Documentation
- **CRITICAL_FIXES_APPLIED.md** - Critical bug fixes
- **CONNECTION_FIX_SUMMARY.md** - Connection fixes
- **BUFFER_FIX_V2.md** - Buffer polyfill fix
- **CREATOR_FILTER_UPDATE.md** - Creator filter changes
- **EDITION_DISPLAY_UPDATE.md** - Edition display changes
- **SIMPLE_SOLUTION.md** - Simple solutions

### Migration & Warnings
- **MAINNET_MIGRATION.md** - Mainnet migration guide
- **MAINNET_WARNING.md** - Mainnet warnings
- **VISUAL_GUIDE.md** - Visual walkthrough
- **ACCESS_APP.md** - App access guide

### Design System
- **design-system/README.md** - Design system documentation
- **design-system/tokens.ts** - Design tokens

### Contracts
- **contracts/BurnRewarder.md** - Smart contract documentation

## Resources

- **Taquito Docs:** https://tezostaquito.io/
- **Beacon SDK:** https://docs.walletbeacon.io/
- **TzKT API:** https://api.tzkt.io/
- **Tezos Ghostnet:** https://ghostnet.tezos.com/
- **Tezos Faucet:** https://faucet.ghostnet.teztnets.com/

## Quick Reference

**Key Files to Modify:**
- `App.tsx` - Main UI and layout
- `components/NFTCard.tsx` - NFT display
- `components/BurnModal.tsx` - Burn confirmation
- `context/WalletContext.tsx` - Wallet logic and state
- `services/burn.ts` - Burn transaction logic
- `services/tzkt.ts` - TzKT API integration
- `index.html` - Tailwind config and polyfills
- `vite.config.ts` - Build configuration

**Key State:**
- `userAddress` - Connected wallet address (string | null)
- `wallet` - BeaconWallet instance
- `tezos` - TezosToolkit instance
- `loading` - Connection state (boolean)
- `error` - Error messages (string | null)
- `nfts` - User's NFTs (NFT[])
- `selectedNFT` - NFT to burn (NFT | null)

**Key Functions:**
- `connectWallet()` - Initiates wallet connection
- `disconnectWallet()` - Clears active account
- `useWallet()` - Hook to access wallet context
- `fetchUserNFTs()` - Fetches NFTs from TzKT
- `burnNFT()` - Burns an NFT
- `usePricing()` - Hook for pricing calculations

**Key Types:**
- `NFT` - NFT data structure
- `WalletState` - Wallet state interface
- `BurnResult` - Burn transaction result
- `TzKTResponse` - TzKT API response

## Development Workflow

1. **Start Development:**
   ```bash
   npm install
   npm run dev
   ```

2. **Make Changes:**
   - Edit files in appropriate directories
   - Follow TypeScript strict mode
   - Use existing patterns and conventions
   - Test changes in browser

3. **Test Changes:**
   - Connect wallet
   - Load NFTs
   - Test burn functionality
   - Check error handling
   - Verify responsive design

4. **Document Changes:**
   - Update relevant .md files
   - Add code comments for complex logic
   - Update CLAUDE.md if architecture changes

5. **Commit Changes:**
   ```bash
   git add .
   git commit -m "feat: Description of changes"
   git push origin main
   ```

## Critical Reminders

- **ALWAYS** test wallet connection after changes
- **NEVER** commit sensitive data or private keys
- **ALWAYS** use TypeScript strict mode
- **NEVER** use `any` type - use proper typing
- **ALWAYS** handle errors gracefully
- **NEVER** assume NFT metadata structure
- **ALWAYS** test on Ghostnet before mainnet
- **NEVER** skip confirmation modal for burns
- **ALWAYS** verify transaction success
- **NEVER** hardcode addresses or keys

## Performance Considerations

- Lazy load NFT images
- Paginate NFT lists
- Cache TzKT API responses
- Optimize bundle size
- Use React.memo for expensive components
- Debounce user inputs
- Minimize re-renders

## Security Considerations

- No private keys in code
- Wallet handles all signing
- Testnet only (by design)
- Input validation
- Error message sanitization
- Secure Beacon protocol
- HTTPS required

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

Requires:
- Modern browser with ES2022 support
- JavaScript enabled
- Cookies/localStorage enabled
- Tezos wallet extension

## Next Steps

When starting a new session:
1. Pull latest changes: `git pull origin main`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Review recent documentation updates
5. Check for open issues or TODOs
6. Test critical paths (wallet, NFTs, burn)

## Support

- Check documentation files first
- Review troubleshooting guides
- Use Debug Info component in app
- Check browser console for errors
- Verify network connectivity
- Test with different wallets
