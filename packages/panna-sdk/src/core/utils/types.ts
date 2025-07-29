import { type Chain } from 'thirdweb';
import { type PannaClient } from '../client';

// Parameters for getting account balance
export interface AccountBalanceParams {
  address: string;
  client: PannaClient;
  chain: Chain;
  tokenAddress?: string;
}

// Result of account balance query
export interface AccountBalanceResult {
  value: bigint;
  decimals: number;
  symbol: string;
  name: string;
  displayValue: string;
}

// Supported social authentication providers
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

// Supported fiat currencies
export type FiatCurrency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'NZD';

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

// Parameters for getting accpount fiat balance
export interface AccountBalanceInFiatParams {
  address: string;
  client: PannaClient;
  chain?: Chain;
  tokenAddress?: string;
  currency?: FiatCurrency;
}

// Result of account fiat balance query
export type AccountBalanceInFiatResult = GetFiatPriceResult;
