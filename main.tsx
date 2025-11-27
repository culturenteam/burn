/**
 * Application Entry Point
 * Phase 1: Wallet Connection Foundation
 */

// Import polyfills FIRST
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './context/WalletContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Ensure index.html has a div with id="root"');
}

// Add debug helpers to window for console debugging
(window as any).debugHelpers = {
  clearBeaconStorage: () => {
    localStorage.removeItem('beacon:active-account');
    localStorage.removeItem('beacon:active-peer');
    console.log('✅ Beacon storage cleared. Please refresh the page.');
  },
  checkPolyfills: () => {
    console.log('Polyfills status:', {
      global: typeof (window as any).global !== 'undefined',
      Buffer: typeof (window as any).Buffer !== 'undefined',
      process: typeof (window as any).process !== 'undefined',
    });
  },
  testRPC: async () => {
    try {
      const response = await fetch('https://ghostnet.ecadinfra.com/chains/main/blocks/head');
      const data = await response.json();
      console.log('✅ RPC is working:', data);
    } catch (err) {
      console.error('❌ RPC test failed:', err);
    }
  },
  help: () => {
    console.log(`
Available debug commands:
- debugHelpers.clearBeaconStorage() - Clear Beacon wallet connections
- debugHelpers.checkPolyfills() - Check if polyfills are loaded
- debugHelpers.testRPC() - Test RPC endpoint connectivity
- debugHelpers.help() - Show this help message
    `);
  },
};

console.log('🔧 Debug helpers available. Type "debugHelpers.help()" for commands.');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
