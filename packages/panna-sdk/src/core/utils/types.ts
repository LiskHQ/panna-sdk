import { type Chain } from 'thirdweb';
import { type FlowClient } from '../client';

// Parameters for getting account balance
export interface AccountBalanceParams {
  address: string;
  client: FlowClient;
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
