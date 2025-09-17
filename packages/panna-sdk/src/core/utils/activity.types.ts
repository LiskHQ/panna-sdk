import { type Chain } from 'thirdweb';
import { LAST_PAGE_REACHED } from './activity';
import {
  type BlockscoutAddressParam,
  type BlockscoutTransaction,
  type BlockscoutTokenTransfer,
  type BlockscoutTransactionType,
  type BlockscoutNextPageParams
} from './blockscout.types';

// Parameters for fetching account activities
export interface GetActivitiesByAddressParams {
  address: string;
  chain?: Chain;
  limit?: number;
  offset?: number;
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

export const TransactionActivity = {
  UNKNOWN: 'unknown',
  SENT: 'Sent',
  RECEIVED: 'Received',
  MINTED: 'Minted'
};

type TransactionActivityType = typeof TransactionActivity;
export type ActivityType =
  TransactionActivityType[keyof TransactionActivityType];

export const TokenERC = {
  ETH: 'eth',
  ERC20: 'erc-20',
  ERC721: 'erc-721',
  ERC1155: 'erc-1155'
} as const;

type TokenERCType = typeof TokenERC;
export type TokenType = TokenERCType[keyof TokenERCType];

export type TransactionAmount = { type: string } & (
  | EtherAmount
  | ERC20Amount
  | ERC721Amount
  | ERC1155Amount
);

interface BaseAmount {
  value: string;
  tokenInfo: TokenInfo;
}

export interface EtherAmount extends BaseAmount {
  type: 'eth';
}

export interface ERC20Amount extends BaseAmount {
  type: 'erc-20';
}

interface BaseNFTAmount {
  tokenId: string;
  instance?: NFTInstance;
}
export interface ERC721Amount extends BaseNFTAmount {
  type: 'erc-721';
}

export interface ERC1155Amount extends BaseNFTAmount {
  type: 'erc-1155';
  value: string;
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
};

export type CachedBlockscoutNextPageParams =
  | BlockscoutNextPageParams
  | typeof LAST_PAGE_REACHED
  | null;
