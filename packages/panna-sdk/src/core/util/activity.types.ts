import { type Chain } from 'thirdweb';
import { type PannaClient } from '../client';
import { LAST_PAGE_REACHED } from './activity';
import {
  type BlockscoutAddressParam,
  type BlockscoutTransaction,
  type BlockscoutTokenTransfer,
  type BlockscoutTransactionType,
  type BlockscoutNextPageParams,
  type BlockscoutInternalTransactionNextPageParams
} from './blockscout.types';
import { type FiatCurrency } from './types';

// Parameters for fetching account activities
export interface GetActivitiesByAddressParams {
  address: string;
  client: PannaClient;
  chain?: Chain;
  limit?: number;
  offset?: number;
  currency?: FiatCurrency;
}

// Result for fetched account activities
export interface GetActivitiesByAddressResult {
  activities: Activity[];
  metadata: ActivityMetadata;
}

export interface Activity {
  activityType: ActivityType;
  transactionID: string;
  amount: TransactionAmount;
  status: string;
}

export enum TransactionActivity {
  UNKNOWN = 'Unknown',
  SENT = 'Sent',
  RECEIVED = 'Received',
  MINTED = 'Minted',
  SELF_TRANSFER = 'Self transfer'
}

type TransactionActivityType = typeof TransactionActivity;
export type ActivityType =
  TransactionActivityType[keyof TransactionActivityType];

export enum TokenERC {
  ETH = 'eth',
  ERC20 = 'erc-20',
  ERC721 = 'erc-721',
  ERC1155 = 'erc-1155'
}

type TokenERCType = typeof TokenERC;
export type TokenType = TokenERCType[keyof TokenERCType];

export type TransactionAmount = { type: string } & (
  | EtherAmount
  | ERC20Amount
  | ERC721Amount
  | ERC1155Amount
);

export interface FiatValue {
  amount: number;
  currency: FiatCurrency;
}

export interface TokenPrice {
  address: string;
  symbol: string;
  prices: Record<string, number>;
}

export type TokenPriceList = TokenPrice[];

interface BaseAmount {
  value: string;
  tokenInfo: TokenInfo;
  fiatValue?: FiatValue;
}

export interface EtherAmount extends BaseAmount {
  type: TokenERC.ETH;
}

export interface ERC20Amount extends BaseAmount {
  type: TokenERC.ERC20;
}

interface BaseNFTAmount {
  tokenId: string;
  instance?: NFTInstance;
}
export interface ERC721Amount extends BaseNFTAmount {
  type: TokenERC.ERC721;
}

export interface ERC1155Amount extends BaseNFTAmount {
  type: TokenERC.ERC1155;
  value: string;
  fiatValue?: FiatValue;
}

export interface NFTInstance {
  id: string;
  isUnique: boolean;
  owner: AddressParam;
  tokenInfo: TokenInfo;
}

export interface AddressParam {
  address: string;
  isContract: boolean;
  ensName?: string;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  type: TokenType;
  icon: string | null;
}

export interface ActivityMetadata {
  count: number;
  offset: number;
  limit: number;
  hasNextPage: boolean;
}

export type PreProcessedActivity = Partial<BlockscoutTransaction> & {
  block_number: number;
  timestamp: string;
  from: BlockscoutAddressParam;
  to: BlockscoutAddressParam;
  hash: string;
  token_transfers: BlockscoutTokenTransfer[];
  transaction_types: BlockscoutTransactionType[];
  result: string;
  status: string;
  internal_tx_type?: InternalTransactionTypeType;
};

export type CachedBlockscoutNextPageParams =
  | BlockscoutNextPageParams
  | BlockscoutInternalTransactionNextPageParams
  | typeof LAST_PAGE_REACHED
  | null;

export const InternalTransactionType = {
  CALL: 'call',
  DELEGATECALL: 'delegatecall'
};

type InternalTransactionIntermediaryType = typeof InternalTransactionType;
type InternalTransactionTypeType =
  InternalTransactionIntermediaryType[keyof InternalTransactionIntermediaryType];
