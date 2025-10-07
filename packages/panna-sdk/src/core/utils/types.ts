import { Chain } from '../chain';
import { type PannaClient } from '../client';

// Utility type to extract string values from an object
export type StringValues<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
}[keyof T];

// Parameters for getting account balance
export interface AccountBalanceParams {
  address: string;
  client: PannaClient;
  chain: Chain;
  tokenAddress?: string;
}

interface MinimalTokenBalance {
  value: bigint;
  displayValue: string;
}

// Result of account balance query
export interface AccountBalanceResult extends MinimalTokenBalance {
  decimals: number;
  symbol: string;
  name: string;
}

// All supported social authentication providers (for login, icons, etc.)
export type SocialProvider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'discord'
  | 'line'
  | 'x'
  | 'coinbase'
  | 'farcaster'
  | 'telegram'
  | 'github'
  | 'twitch'
  | 'steam'
  | 'guest'
  | 'backend'
  | 'email'
  | 'phone'
  | 'passkey'
  | 'wallet';

// Social providers that we currently support for capturing authentication data
// These are checked in both account-event-provider and account-settings-view
export type SocialAuthType =
  | 'email'
  | 'phone'
  | 'google'
  | 'discord'
  | 'apple'
  | 'facebook';

// Social authentication data structure
export type SocialAuthData = {
  type: SocialAuthType;
  data: string;
};

// Account event type constants
export const AccountEventType = {
  ON_CONNECT: 'onConnect',
  DISCONNECT: 'disconnect',
  ACCOUNT_UPDATE: 'accountUpdate'
} as const;

export type AccountEventTypeValue =
  (typeof AccountEventType)[keyof typeof AccountEventType];

// Supported fiat currencies
export enum FiatCurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  NZD = 'NZD'
}

// Parameters for getting fiat price
export interface GetFiatPriceParams {
  client: PannaClient;
  chain?: Chain;
  tokenAddress?: string;
  amount: number;
  currency?: FiatCurrency;
}

// Result of fiat price query
export interface GetFiatPriceResult {
  price: number;
  currency: FiatCurrency;
}

// Base parameters shared by account balance in fiat operations
interface BaseAccountBalanceInFiatParams {
  address: string;
  client: PannaClient;
  chain?: Chain;
  currency?: FiatCurrency;
}

// Parameters for getting single account fiat balance
export interface AccountBalanceInFiatParams
  extends BaseAccountBalanceInFiatParams {
  tokenAddress?: string;
}

interface Token {
  address?: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface AccountFiatBalance {
  amount: number;
  currency: FiatCurrency;
}

export interface TokenFiatPrice {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  iconUri?: string;
  prices: Record<string, number>;
}

// Result of account fiat balance query
export interface AccountBalanceInFiatResult {
  token: Token;
  tokenBalance: MinimalTokenBalance;
  fiatBalance: AccountFiatBalance;
}

// Parameters for getting multiple account balances in fiat
export interface AccountBalancesInFiatParams
  extends BaseAccountBalanceInFiatParams {
  tokens: string[];
}

// Error result for failed token balance fetch
export interface TokenBalanceError {
  token: { address: string };
  error: string;
}

// Result of multiple account balances calculation
export interface AccountBalancesInFiatResult {
  totalValue: AccountFiatBalance;
  tokenBalances: AccountBalanceInFiatResult[];
  errors?: TokenBalanceError[];
}
// Account event types for Panna API
export type AccountEventPayload =
  | OnConnectActivityRequest
  | DisconnectActivityRequest
  | AccountUpdateActivityRequest;

// Base schema for all activity requests
type BaseActivityRequest = {
  eventType: AccountEventTypeValue;
  timestamp: string;
  ecosystemId: string;
  partnerId: string;
  chainId: number;
};

// OnConnect event schema - matches API discriminated union
export type OnConnectActivityRequest = BaseActivityRequest & {
  eventType: typeof AccountEventType.ON_CONNECT;
  smartAccount: {
    chain: string;
    factoryAddress: string;
    entrypointAddress: string;
    sponsorGas: boolean;
  };
  social: SocialAuthData;
};

// Disconnect event schema
export type DisconnectActivityRequest = BaseActivityRequest & {
  eventType: typeof AccountEventType.DISCONNECT;
  reason?: string;
};

// Account update event schema
export type AccountUpdateActivityRequest = BaseActivityRequest & {
  eventType: typeof AccountEventType.ACCOUNT_UPDATE;
  updateType?: string;
};

// Helper type for transforming SmartWalletOptions to API format
export type SmartAccountTransform = {
  chain: string;
  factoryAddress: string;
  entrypointAddress: string;
  sponsorGas: boolean;
};
