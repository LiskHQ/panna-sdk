import { type Chain } from 'thirdweb';
import { SmartWalletOptions } from 'thirdweb/wallets';
import { type PannaClient } from '../client';

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
// Account event types for Panna dashboard API
export type AccountEventPayload = {
  eventType: 'onConnect' | 'disconnect' | 'accountUpdate';
  timestamp: string;
  ecosystemId: string;
  partnerId: string;
  chainId: string;
  eventData: OnConnectEventData | DisconnectEventData | AccountUpdateEventData;
};

export type OnConnectEventData = {
  smartAccount: SmartWalletOptions;
  social?: {
    type: 'email' | 'phone' | 'google';
    data: string;
  };
};

export type DisconnectEventData = Record<string, never>;

export type AccountUpdateEventData = {
  updatedFields?: Record<string, unknown>;
};
