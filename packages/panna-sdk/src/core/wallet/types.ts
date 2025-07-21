import { type EcosystemConfig, EcosystemId, type PannaClient } from '../client';
import { type SocialProvider } from '../utils/types';

// Enum for login strategies
export const LoginStrategy = {
  EMAIL: 'email',
  PHONE: 'phone'
} as const;

export type LoginStrategyType =
  (typeof LoginStrategy)[keyof typeof LoginStrategy];

// Base authentication parameters
export interface BaseAuthParams {
  client: PannaClient;
  ecosystem: EcosystemConfig;
}

// Single-step authentication (email/phone with verification code)
export interface EmailAuthParams extends BaseAuthParams {
  strategy: typeof LoginStrategy.EMAIL;
  email: string;
  verificationCode: string;
}

export interface PhoneAuthParams extends BaseAuthParams {
  strategy: typeof LoginStrategy.PHONE;
  phoneNumber: string;
  verificationCode: string;
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

// Social login parameters for redirect flow
export interface SocialLoginParams extends BaseAuthParams {
  strategy: SocialProvider;
  mode: 'popup';
}

// Combined types for different authentication flows
export type SingleStepAuthParams = EmailAuthParams | PhoneAuthParams;

export type MultiStepAuthParams = EmailPrepareParams | PhonePrepareParams;

export type AuthParams = SingleStepAuthParams | MultiStepAuthParams;

// Re-export types with web2-friendly names
export type {
  Wallet as Account,
  InAppWalletAuth as AccountAuth,
  InAppWalletConnectionOptions as AccountConnectionOptions,
  Profile as LinkedAccount
} from 'thirdweb/wallets';
