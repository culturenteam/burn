# Testing Guide

Comprehensive testing guide for the Tezos NFT Burn dApp.

## Manual Testing Checklist

### Phase 1: Wallet Connection

#### Initial Load
- [ ] Application loads without errors
- [ ] No console errors
- [ ] UI renders correctly
- [ ] "Connect Wallet" button is visible
- [ ] Background animations work
- [ ] Responsive on mobile devices

#### Wallet Connection
- [ ] Click "Connect Wallet" button
- [ ] Beacon popup appears
- [ ] Can select wallet (Temple, Kukai, etc.)
- [ ] Connection request shows correct network (Ghostnet)
- [ ] Approve connection in wallet
- [ ] Address displays correctly (shortened format)
- [ ] Network badge shows "Ghostnet Active"
- [ ] "Disconnect Wallet" button appears
- [ ] No console errors during connection

#### Session Persistence
- [ ] Refresh page while connected
- [ ] Address still displays
- [ ] No need to reconnect
- [ ] Session persists across tabs
- [ ] Session clears after disconnect

#### Disconnection
- [ ] Click "Disconnect Wallet"
- [ ] Address disappears
- [ ] "Connect Wallet" button reappears
- [ ] Network badge disappears
- [ ] No console errors during disconnection

#### Error Handling
- [ ] Cancel connection in wallet popup
- [ ] No error message displays (user cancelled)
- [ ] Can retry connection
- [ ] Network error displays properly
- [ ] Error messages are user-friendly

#### UI/UX
- [ ] Buttons have hover effects
- [ ] Loading states show during connection
- [ ] Animations are smooth
- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing is consistent

#### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Network badge hides on small screens
- [ ] Buttons are touch-friendly

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Performance
- [ ] Initial load < 2 seconds
- [ ] Connection < 3 seconds
- [ ] No layout shifts
- [ ] Smooth animations
- [ ] No memory leaks (check DevTools)

## Automated Testing (Future)

### Unit Tests

```typescript
// Example unit tests to implement

describe('shortenAddress', () => {
  it('should shorten a valid address', () => {
    const address = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';
    expect(shortenAddress(address)).toBe('tz1VSU...cjb');
  });

  it('should return empty string for empty input', () => {
    expect(shortenAddress('')).toBe('');
  });
});

describe('isValidTezosAddress', () => {
  it('should validate tz1 addresses', () => {
    expect(isValidTezosAddress('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb')).toBe(true);
  });

  it('should reject invalid addresses', () => {
    expect(isValidTezosAddress('invalid')).toBe(false);
  });
});

describe('WalletContext', () => {
  it('should initialize with null address', () => {
    const { result } = renderHook(() => useWallet(), {
      wrapper: WalletProvider,
    });
    expect(result.current.userAddress).toBeNull();
  });

  it('should connect wallet', async () => {
    const { result } = renderHook(() => useWallet(), {
      wrapper: WalletProvider,
    });
    await act(async () => {
      await result.current.connectWallet();
    });
    expect(result.current.userAddress).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
// Example integration tests to implement

describe('Wallet Connection Flow', () => {
  it('should complete full connection flow', async () => {
    render(<App />);
    
    // Click connect button
    const connectButton = screen.getByText('Connect Beacon Wallet');
    fireEvent.click(connectButton);
    
    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText(/tz1.../)).toBeInTheDocument();
    });
    
    // Verify UI updates
    expect(screen.getByText('Ghostnet Active')).toBeInTheDocument();
    expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument();
  });

  it('should handle disconnection', async () => {
    render(<App />);
    
    // Connect first
    const connectButton = screen.getByText('Connect Beacon Wallet');
    fireEvent.click(connectButton);
    await waitFor(() => screen.getByText(/tz1.../));
    
    // Disconnect
    const disconnectButton = screen.getByText('Disconnect Wallet');
    fireEvent.click(disconnectButton);
    
    // Verify UI updates
    await waitFor(() => {
      expect(screen.getByText('Connect Beacon Wallet')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

```typescript
// Example E2E tests with Playwright

test('complete wallet connection flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Click connect button
  await page.click('text=Connect Beacon Wallet');
  
  // Handle Beacon popup (mock or real wallet)
  // This would require wallet extension automation
  
  // Verify connection
  await expect(page.locator('text=/tz1.../')).toBeVisible();
  await expect(page.locator('text=Ghostnet Active')).toBeVisible();
  
  // Disconnect
  await page.click('text=Disconnect Wallet');
  
  // Verify disconnection
  await expect(page.locator('text=Connect Beacon Wallet')).toBeVisible();
});
```

## Testing Tools Setup

### Install Testing Dependencies

```bash
# Unit testing
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest

# E2E testing
npm install --save-dev @playwright/test

# Coverage
npm install --save-dev @vitest/coverage-v8
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

## Performance Testing

### Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Target scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 80

### Bundle Size Analysis

```bash
# Build and analyze
npm run build
npx vite-bundle-visualizer
```

Target bundle sizes:
- Main bundle: < 200KB
- Vendor bundle: < 400KB
- Total: < 600KB

## Security Testing

### Manual Security Checks

- [ ] No private keys in code
- [ ] No API keys in frontend
- [ ] HTTPS only
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] Proper error handling (no sensitive data leaks)

### Automated Security Scanning

```bash
# Dependency audit
npm audit

# Fix vulnerabilities
npm audit fix
```

## Accessibility Testing

### Manual A11y Checks

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Semantic HTML used

### Automated A11y Testing

```bash
# Install axe
npm install --save-dev @axe-core/react

# Use in tests
import { axe } from 'jest-axe';

test('should have no accessibility violations', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Load Testing (Future)

### Concurrent Users

```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:3000');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

## Regression Testing

### Before Each Release

1. Run full manual testing checklist
2. Run automated test suite
3. Check bundle size
4. Run Lighthouse audit
5. Test on all supported browsers
6. Test on mobile devices
7. Verify no console errors
8. Check network requests

## Bug Reporting Template

```markdown
## Bug Report

**Title**: [Brief description]

**Environment**:
- Browser: [Chrome 120]
- OS: [macOS 14]
- Device: [Desktop/Mobile]

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[If applicable]

**Console Errors**:
```
[Paste console errors]
```

**Additional Context**:
[Any other relevant information]
```

## Test Coverage Goals

### Phase 1
- Unit tests: 80%+
- Integration tests: Key flows
- E2E tests: Happy path

### Phase 2
- Unit tests: 80%+
- Integration tests: All flows
- E2E tests: Happy + error paths

### Phase 3
- Unit tests: 90%+
- Integration tests: All flows
- E2E tests: Complete coverage

## Continuous Testing

### Pre-commit Hooks

```bash
# Install husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm test"
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## Testing Best Practices

1. **Test Early**: Write tests as you develop
2. **Test Often**: Run tests before commits
3. **Test Real Scenarios**: Use realistic data
4. **Test Edge Cases**: Don't just test happy paths
5. **Keep Tests Fast**: Unit tests should be < 1s
6. **Keep Tests Isolated**: No dependencies between tests
7. **Keep Tests Readable**: Clear test names and structure
8. **Mock External Dependencies**: Don't rely on external services
9. **Test User Behavior**: Test what users actually do
10. **Maintain Tests**: Update tests when code changes

## Resources

- [Testing Library Docs](https://testing-library.com/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Testing Status**: Manual testing complete for Phase 1, automated tests recommended for Phase 2+
