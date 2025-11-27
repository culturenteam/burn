# Architecture Documentation

## System Overview

The Tezos NFT Burn dApp is built with a modular, type-safe architecture that separates concerns and promotes maintainability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React Application                   │  │
│  │                                                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   App.tsx   │  │   Layout     │  │  Components  │ │  │
│  │  │  (Main UI)  │  │  (Structure) │  │  (UI Parts)  │ │  │
│  │  └──────┬──────┘  └──────────────┘  └──────────────┘ │  │
│  │         │                                              │  │
│  │         ▼                                              │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         WalletContext (State Management)        │  │  │
│  │  │  - userAddress                                  │  │  │
│  │  │  - wallet (BeaconWallet)                       │  │  │
│  │  │  - tezos (TezosToolkit)                        │  │  │
│  │  │  - connectWallet()                             │  │  │
│  │  │  - disconnectWallet()                          │  │  │
│  │  └──────────────────┬──────────────────────────────┘  │  │
│  │                     │                                  │  │
│  └─────────────────────┼──────────────────────────────────┘  │
│                        │                                     │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Beacon Wallet SDK                       │   │
│  │  - Wallet pairing                                    │   │
│  │  - Permission requests                               │   │
│  │  - Transaction signing                               │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │      Tezos Ghostnet Network        │
         │  - RPC: ghostnet.ecadinfra.com     │
         │  - Smart Contracts                 │
         │  - NFT Storage                     │
         └────────────────────────────────────┘
```

## Layer Architecture

### 1. Presentation Layer

**Components** (`/components/`)
- Responsible for UI rendering
- Consume context via hooks
- Pure, functional components
- Type-safe props

**Design System** (`/design-system/`)
- Centralized design tokens
- Reusable UI components
- Consistent styling
- Accessibility standards

### 2. State Management Layer

**WalletContext** (`/context/WalletContext.tsx`)
- Global wallet state
- Connection lifecycle management
- Error handling
- Session persistence

**React Context Pattern**
```typescript
Provider (WalletProvider)
    ↓
Context (WalletContext)
    ↓
Consumer (useWallet hook)
    ↓
Components
```

### 3. Integration Layer

**Taquito** (`@taquito/taquito`)
- Blockchain interaction
- Contract calls
- Transaction building

**Beacon Wallet** (`@taquito/beacon-wallet`)
- Wallet connection
- Permission management
- Transaction signing

### 4. Network Layer

**Tezos Ghostnet**
- Testnet blockchain
- RPC endpoint
- Smart contracts

**TzKT API** (Phase 2)
- Indexed blockchain data
- NFT metadata
- Account information

## Data Flow

### Wallet Connection Flow

```
User Action (Click Connect)
    ↓
App.tsx calls connectWallet()
    ↓
WalletContext.connectWallet()
    ↓
BeaconWallet.requestPermissions()
    ↓
Beacon Popup Opens
    ↓
User Approves in Wallet
    ↓
BeaconWallet.getPKH()
    ↓
Update Context State (userAddress)
    ↓
Re-render Components
    ↓
Display Connected UI
```

### State Update Flow

```
Context State Change
    ↓
React Context Update
    ↓
useWallet Hook Notifies Subscribers
    ↓
Components Re-render
    ↓
UI Updates
```

## Component Hierarchy

```
App.tsx
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   └── NetworkBadge
│   └── Main Content Area
│       └── Card
│           ├── CardHeader
│           ├── Alert (conditional)
│           └── Content
│               ├── WalletInfo (if connected)
│               │   └── Button (Disconnect)
│               └── Button (Connect, if not connected)
```

## Type System

### Core Types

```typescript
// Wallet State
interface WalletState {
  userAddress: string | null;
  wallet: BeaconWallet | null;
  tezos: TezosToolkit;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

// Context Type
interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

// Network Config
interface NetworkConfig {
  rpcUrl: string;
  networkType: NetworkType;
  appName: string;
}
```

### Type Safety Benefits

1. **Compile-time Errors**: Catch bugs before runtime
2. **IntelliSense**: Better developer experience
3. **Refactoring**: Safe code changes
4. **Documentation**: Types serve as documentation

## State Management Strategy

### Why React Context?

**Pros:**
- Built into React
- No external dependencies
- Type-safe with TypeScript
- Simple API
- Good for global state

**Cons:**
- Can cause unnecessary re-renders (mitigated with useCallback)
- Not ideal for very large apps (fine for this use case)

### Context Optimization

```typescript
// Memoized callbacks prevent re-renders
const connectWallet = useCallback(async () => {
  // Implementation
}, [wallet]);

// Context value is stable
const contextValue: WalletContextType = {
  userAddress,
  wallet,
  tezos: tezosToolkit,
  isConnected: !!userAddress,
  loading,
  error,
  connectWallet,
  disconnectWallet,
};
```

## Error Handling Strategy

### Error Types

```typescript
enum WalletErrorType {
  INITIALIZATION_FAILED = 'initialization_failed',
  CONNECTION_FAILED = 'connection_failed',
  DISCONNECTION_FAILED = 'disconnection_failed',
  USER_REJECTED = 'user_rejected',
  NETWORK_ERROR = 'network_error',
}
```

### Error Flow

```
Error Occurs
    ↓
Catch in try/catch
    ↓
Create WalletError instance
    ↓
Set error state
    ↓
Display Alert component
    ↓
User sees friendly message
```

### Error Handling Principles

1. **User-Friendly Messages**: No technical jargon
2. **Specific Error Types**: Different handling for different errors
3. **Logging**: Console logs for debugging
4. **Recovery**: Clear error state on retry

## Design System Architecture

### Token-Based Design

```typescript
// Design Tokens
colors → Components
spacing → Components
typography → Components
shadows → Components
```

### Component Composition

```typescript
// Atomic Design Principles
Tokens (colors, spacing)
    ↓
Atoms (Button, Alert)
    ↓
Molecules (WalletInfo, NetworkBadge)
    ↓
Organisms (Card with content)
    ↓
Templates (Layout)
    ↓
Pages (App)
```

## Performance Considerations

### Optimization Techniques

1. **useCallback**: Stable function references
2. **React.memo**: Prevent unnecessary re-renders (future)
3. **Code Splitting**: Lazy loading (future phases)
4. **CDN Assets**: Tailwind CSS via CDN

### Bundle Size

- React 19: ~140KB
- Taquito: ~200KB
- Beacon Wallet: ~150KB
- Application Code: ~50KB
- **Total**: ~540KB (acceptable for dApp)

## Security Architecture

### Security Layers

1. **No Private Keys**: Never stored in application
2. **Wallet Signing**: All transactions signed by wallet
3. **Testnet Only**: No real funds at risk
4. **Input Validation**: Type checking prevents invalid data
5. **Error Handling**: No sensitive data in error messages

### Threat Model

**Threats Mitigated:**
- ✅ Private key exposure (wallet handles keys)
- ✅ Man-in-the-middle (HTTPS + Beacon protocol)
- ✅ XSS attacks (React escapes by default)
- ✅ Invalid transactions (type checking)

**Threats Not Applicable:**
- N/A Real funds (testnet only)
- N/A Backend attacks (no backend)

## Scalability Considerations

### Current Architecture

- **Users**: Suitable for 1-10,000 concurrent users
- **State**: Minimal global state (wallet only)
- **API Calls**: None yet (Phase 2 will add TzKT)

### Future Scaling (Phase 2+)

- **Caching**: Cache NFT data
- **Pagination**: Load NFTs in batches
- **Lazy Loading**: Load images on demand
- **Service Workers**: Offline support (future)

## Testing Strategy

### Current Testing

- Manual testing checklist
- Browser console logging
- TypeScript compile-time checks

### Future Testing (Recommended)

```typescript
// Unit Tests
- Component rendering
- Hook behavior
- Utility functions

// Integration Tests
- Wallet connection flow
- Error handling
- State updates

// E2E Tests
- Full user journey
- Wallet interaction
- Transaction flow
```

## Deployment Architecture

### Development

```
Local Machine
    ↓
Vite Dev Server (HMR)
    ↓
Browser (localhost:3000)
```

### Production (Future)

```
Git Repository
    ↓
CI/CD Pipeline
    ↓
Build (npm run build)
    ↓
Static Files
    ↓
CDN/Hosting (Vercel, Netlify, IPFS)
    ↓
Users
```

## Phase Progression Architecture

### Phase 1: Foundation ✅
- Wallet connection
- State management
- Design system
- Type safety

### Phase 2: Data Layer (Next)
```
Add:
- TzKT API integration
- NFT data fetching
- Display components
- Loading states
```

### Phase 3: Transaction Layer (Future)
```
Add:
- Transaction building
- Confirmation flow
- Status tracking
- Success/error handling
```

## Technology Decisions

### Why React 19?

- **Concurrent Features**: Better performance
- **Automatic Batching**: Fewer re-renders
- **Improved TypeScript**: Better type inference
- **Modern Hooks**: useCallback, useMemo optimizations

### Why Vite?

- **Fast HMR**: Instant updates
- **ESM Native**: Modern module system
- **TypeScript**: First-class support
- **Build Speed**: Faster than Webpack

### Why Taquito?

- **Standard**: De facto Tezos library
- **Well Maintained**: Active development
- **Good Docs**: Comprehensive documentation
- **TypeScript**: Full type support

### Why Beacon?

- **Standard**: Tezos wallet standard
- **Multi-Wallet**: Supports all major wallets
- **Secure**: Proven security model
- **Active**: Regular updates

## Monitoring & Debugging

### Development Tools

1. **React DevTools**: Component inspection
2. **Browser Console**: Logging and errors
3. **Network Tab**: API calls (Phase 2+)
4. **TypeScript**: Compile-time checks

### Logging Strategy

```typescript
// Success logs
console.log('✅ Wallet connected:', address);

// Error logs
console.error('❌ Connection error:', err);

// Info logs
console.log('ℹ️ User cancelled connection');
```

## Future Architecture Enhancements

### Phase 2 Additions

- API service layer
- Data caching
- Image optimization
- Error boundaries

### Phase 3 Additions

- Transaction queue
- Status polling
- Notification system
- Analytics

### Long-term Enhancements

- State management library (Redux, Zustand)
- GraphQL for data fetching
- Service workers for offline
- Progressive Web App features

---

**Architecture Status**: Solid foundation for Phase 1, ready for Phase 2 expansion
