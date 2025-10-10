// Core module namespace exports for clear modular separation
export * as client from './core/client';
export * as chain from './core/chain';
export * as wallet from './core/wallet';
export * as transaction from './core/transaction';
export * as util from './core/util';
export * as onramp from './core/onramp';
export * as auth from './core/auth';

// Export constants directly (not namespaced for ergonomics)
export {
  DEFAULT_CURRENCY,
  DEFAULT_CHAIN,
  DEFAULT_COUNTRY_CODE,
  NATIVE_TOKEN_ADDRESS
} from './core/defaults';

export * from './react';

// React Query integration
export { QueryClient } from '@tanstack/react-query';
