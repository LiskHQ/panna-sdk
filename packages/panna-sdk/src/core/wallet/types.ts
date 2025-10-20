import { type Chain } from '../chain/types';
import { type EcosystemConfig, EcosystemId, type PannaClient } from '../client';
import { type SocialProvider } from '../util/types';

// Enum for login strategies
export const LoginStrategy = {
  EMAIL: 'email',
  PHONE: 'phone',
  GOOGLE: 'google',
  WALLET: 'wallet'
} as const;

export type LoginStrategyType =
  (typeof LoginStrategy)[keyof typeof LoginStrategy];

// Base authentication parameters (used for prepareLogin only)
export interface BaseAuthParams {
  client: PannaClient;
  ecosystem: EcosystemConfig;
}

// Multi-step authentication (preparation phase)
export interface EmailPrepareParams extends BaseAuthParams {
  strategy: typeof LoginStrategy.EMAIL;
  email: string;
}

export interface PhonePrepareParams extends BaseAuthParams {
  strategy: typeof LoginStrategy.PHONE;
  phoneNumber: string;
}

export type CreateAccountOptions = {
  ecosystemId?: EcosystemId | `ecosystem.${string}`;
  partnerId: string;
};

// Base connect parameters
interface BaseConnectParams {
  client: PannaClient;
  ecosystem: EcosystemConfig;
}

// Email connect params
export interface EmailConnectParams extends BaseConnectParams {
  strategy: typeof LoginStrategy.EMAIL;
  email: string;
  verificationCode: string;
}

// Phone connect params
export interface PhoneConnectParams extends BaseConnectParams {
  strategy: typeof LoginStrategy.PHONE;
  phoneNumber: string;
  verificationCode: string;
}

// Social connect params
export interface SocialConnectParams extends BaseConnectParams {
  strategy: SocialProvider;
  mode: 'redirect';
  redirectUrl: string;
}

// External wallet connect params
export interface WalletConnectParams extends BaseConnectParams {
  strategy: typeof LoginStrategy.WALLET;
  walletId: string;
  chain: Chain;
}

// Union type for all connect strategies
export type ConnectParams =
  | EmailConnectParams
  | PhoneConnectParams
  | SocialConnectParams
  | WalletConnectParams;

// Re-export types with web2-friendly names
export type {
  Wallet as Account,
  InAppWalletAuth as AccountAuth,
  InAppWalletConnectionOptions as AccountConnectionOptions,
  Profile as LinkedAccount
} from 'thirdweb/wallets';
