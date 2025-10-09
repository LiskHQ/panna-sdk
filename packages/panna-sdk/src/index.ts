// Core module namespace exports for clear modular separation
export * as client from './core/client';
export * as chains from './core/chain';
export * as wallet from './core/wallet';
export * as transaction from './core/transaction';
export * as utils from './core/utils';
export * as onramp from './core/onramp';

// Export constants directly (not namespaced for ergonomics)
export {
  DEFAULT_CURRENCY,
  DEFAULT_CHAIN,
  DEFAULT_COUNTRY_CODE,
  NATIVE_TOKEN_ADDRESS
} from './core/defaults';

// SIWE authentication exports
export {
  generateSiwePayload,
  siweLogin,
  isSiweLoggedIn,
  getSiweUser,
  siweLogout,
  siweAuth,
  type GeneratePayloadParams,
  type LoginParams as SiweLoginParams
} from './core/auth';

// SIWE types
export type {
  AuthChallengeRequest,
  AuthChallengeReply,
  AuthVerifyRequest,
  AuthVerifyReply,
  LoginPayload,
  SignedLoginPayload
} from './core/utils/types';

export * from './react';

// React Query integration
export { QueryClient } from '@tanstack/react-query';
