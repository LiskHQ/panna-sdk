import { Chain } from 'thirdweb';

// Parameters for fetching account collections
export interface GetCollectiblesByAddressParams {
  address: string;
  chain?: Chain;
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
  image_url: string;
  image_data?: string;
  name?: string;
}

export interface CollectibleMetadata {
  count: number;
  offset: number;
  limit: number;
  hasNextPage: boolean;
}
