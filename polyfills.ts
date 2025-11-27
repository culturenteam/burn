/**
 * Polyfills for Beacon SDK
 * Required for browser compatibility
 */

import { Buffer } from 'buffer';

// Set Buffer globally
(window as any).Buffer = Buffer;
(window as any).global = window;

// Simple process polyfill
(window as any).process = {
  env: {},
  version: '',
  nextTick: (fn: Function) => setTimeout(fn, 0),
  browser: true,
};

console.log('✅ Polyfills loaded:', {
  Buffer: typeof (window as any).Buffer !== 'undefined',
  'Buffer.from': typeof (window as any).Buffer?.from === 'function',
  global: typeof (window as any).global !== 'undefined',
  process: typeof (window as any).process !== 'undefined',
});

export {};
