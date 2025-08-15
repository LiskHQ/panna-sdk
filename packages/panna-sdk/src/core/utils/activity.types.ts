import { type Chain } from 'thirdweb';

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
  SENT: 'sent',
  RECEIVED: 'received',
  MINTED: 'minted'
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

export interface EtherAmount {
  type: 'eth';
  value: string;
  tokenInfo: TokenInfo;
}

export type ERC20Amount = EtherAmount & { type: 'erc-20' };

export interface ERC721Amount {
  type: 'erc-721';
  tokenId: string;
  instance?: NFTInstance;
}

export interface ERC1155Amount {
  type: 'erc-1155';
  tokenId: string;
  value: string;
  instance?: NFTInstance;
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
  icon: string;
}

export interface ActivityMetadata {
  count: number;
  offset: number;
  limit: number;
  hasNextPage: boolean;
}
