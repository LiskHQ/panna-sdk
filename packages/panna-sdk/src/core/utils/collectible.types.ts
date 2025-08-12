import {
  type BlockscoutAddressParam,
  type BlockscoutTokenInfo
} from './activity.types';

// Parameters for fetching account collections
export interface GetCollectiblesByAddressParams {
  address: string;
  limit?: number;
  offset?: number;
}

// Result for fetched account collections
export interface GetCollectiblesByAddressResult {
  collectibles: Collectible[];
  metadata: CollectibleMetadata;
}

export interface Collectible {
  token: Token;
  numInstancesOwned: number;
  instances: TokenInstance[];
}

export interface Token {
  name: string;
  symbol: string;
  type: string;
  address: string;
  icon: string | null;
}

export interface TokenInstance {
  id: string;
  image: string;
  name?: string;
}

export interface CollectibleMetadata {
  count: number;
  offset: number;
  limit: number;
  hasNextPage: boolean;
}

// Blockscout API response types
export interface BlockscoutNFTCollectionsResponse {
  items: BlockscoutAddressNFTCollection[];
  next_page_params: BlockscoutNFTNextPageParams | null;
}

export interface BlockscoutNFTNextPageParams {
  token_contract_address_hash: string;
  token_type: string;
}

export interface BlockscoutAddressNFTCollection {
  amount: string;
  token: BlockscoutTokenInfo;
  token_instances: BlockscoutAddressNFTInstanceCollection[];
}

interface BlockscoutAddressNFTInstanceCollection {
  is_unique: boolean;
  id: string;
  holder_address_hash: string;
  image_url: string;
  animation_url: string;
  external_app_url: string;
  metadata: BlockscoutAddressNFTInstanceCollectionMetadata;
  owner: BlockscoutAddressParam;
  token: string | null;
  token_type: string;
  value: string;
}

interface BlockscoutAddressNFTInstanceCollectionMetadata {
  year: number;
  tags: string[];
  name: string;
  image_url: string;
  home_url: string;
  external_url: string;
  description: string;
  attributes: BlockscoutAddressNFTInstanceCollectionMetadataAttributes[];
}

interface BlockscoutAddressNFTInstanceCollectionMetadataAttributes {
  value: string;
  trait_type: string;
}
