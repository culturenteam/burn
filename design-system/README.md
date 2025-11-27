# Design System Documentation

## Overview

This design system provides a solid foundation for building consistent, accessible, and maintainable UI components for the Tezos NFT Burn dApp.

## Architecture

### Phase 1: Foundation (Current)
- **Tokens**: Core design values (colors, spacing, typography)
- **Components**: Reusable UI components (Button, Card, Alert)
- **Layout**: Application structure and navigation
- **Context**: State management for wallet connection

### Future Phases
- **Phase 2**: NFT display components, grid layouts, image handling
- **Phase 3**: Transaction components, confirmation modals, burn actions

## Design Tokens

### Colors

#### Brand Colors
- **Tezos Primary**: `#2C7DF7` - Main brand color
- **Tezos Light**: `#5B9BF8` - Hover states
- **Tezos Dark**: `#1E5FD9` - Active states

#### Background Colors
- **Dark**: `#0f172a` - Main background
- **Card**: `#1e293b` - Card backgrounds
- **Elevated**: `#334155` - Elevated surfaces

#### State Colors
- **Success**: `#10b981` - Success states (connected)
- **Error**: `#ef4444` - Error states
- **Warning**: `#f59e0b` - Warning states
- **Info**: `#3b82f6` - Informational states

### Typography

- **Font Family**: System font stack for optimal performance
- **Font Sizes**: 12px to 36px scale
- **Font Weights**: 400 (normal) to 700 (bold)

### Spacing

Consistent spacing scale from 4px to 64px using multiples of 4.

### Border Radius

- **sm**: 6px - Small elements
- **md**: 8px - Default
- **lg**: 12px - Cards
- **xl**: 16px - Large cards
- **2xl**: 24px - Hero elements

## Components

### Button

Versatile button component with multiple variants and sizes.

**Variants:**
- `primary` - Main actions (gradient background)
- `secondary` - Secondary actions (solid background)
- `danger` - Destructive actions (red accent)
- `ghost` - Minimal actions (transparent)

**Sizes:**
- `sm` - Small buttons
- `md` - Default size
- `lg` - Large buttons

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Button variant="primary" onClick={handleClick}>
  Connect Wallet
</Button>

<Button variant="danger" icon={<LogOut />} loading={isLoading}>
  Disconnect
</Button>
```

### Card

Container component for grouping related content.

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
```

**Usage:**
```tsx
<Card hover>
  <CardHeader title="Welcome" subtitle="Connect your wallet" />
  {/* Card content */}
</Card>
```

### Alert

Display contextual feedback messages.

**Types:**
- `success` - Success messages
- `error` - Error messages
- `warning` - Warning messages
- `info` - Informational messages

**Usage:**
```tsx
<Alert type="error" message="Failed to connect wallet" />
<Alert type="success" message="Wallet connected successfully" />
```

### WalletInfo

Display connected wallet address with visual feedback.

**Usage:**
```tsx
<WalletInfo address={userAddress} />
```

### NetworkBadge

Display network connection status.

**Usage:**
```tsx
<NetworkBadge isConnected={true} networkName="Ghostnet" />
```

## Layout

### Layout Component

Main application layout with header and content area.

**Features:**
- Sticky header with backdrop blur
- Responsive design
- Background decorative elements
- Network status indicator

## Best Practices

### Component Development

1. **Type Safety**: Always use TypeScript interfaces for props
2. **Composition**: Build complex components from simple ones
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Performance**: Use React.memo for expensive components
5. **Consistency**: Follow the design token system

### Styling

1. **Tailwind Classes**: Use Tailwind utility classes for styling
2. **Custom Classes**: Extract repeated patterns into components
3. **Responsive**: Mobile-first responsive design
4. **Dark Mode**: Design system is optimized for dark mode

### State Management

1. **Context**: Use React Context for global state (wallet)
2. **Local State**: Use useState for component-local state
3. **Callbacks**: Use useCallback for stable function references
4. **Effects**: Use useEffect for side effects (wallet initialization)

## File Structure

```
/workspaces/burn/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Alert.tsx
│   ├── Layout.tsx
│   ├── WalletInfo.tsx
│   └── NetworkBadge.tsx
├── context/
│   └── WalletContext.tsx
├── design-system/
│   ├── tokens.ts
│   └── README.md
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.html
```

## Phase Progression

### Phase 1: Wallet Connection ✅
- Wallet context and state management
- Connect/disconnect functionality
- Error handling
- UI components for wallet interaction

### Phase 2: NFT Display (Next)
- Fetch NFTs from TzKT API
- Display NFTs in grid layout
- NFT card component
- Image loading and error states

### Phase 3: Burn Functionality (Future)
- Burn transaction logic
- Confirmation modal
- Transaction status tracking
- Success/error feedback

## Contributing

When adding new components:

1. Create component in appropriate directory
2. Export from index file if needed
3. Add TypeScript interfaces
4. Follow existing naming conventions
5. Use design tokens for styling
6. Add documentation to this README
