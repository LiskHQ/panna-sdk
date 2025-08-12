export interface Collectibles {
  items: AddressNFTCollection[];
  next_page_params: {
    token_contract_address_hash: string;
    token_type: string;
  };
}

export interface AddressNFTCollection {
  token: TokenInfo;
  amount?: string;
  token_instances: AddressNFTInstanceCollection[];
}

export interface AddressNFTInstanceCollection {
  id: string;
  is_unique: boolean;
  owner: AddressParam;
  token_type: string;
  value: string;
  holder_address_hash?: string;
  image_url?: string;
  animation_url?: string;
  external_app_url?: string;
  metadata?: Record<string, unknown>;
  token?: Record<string, unknown> | null;
}

export interface TokenInfo {
  address: string;
  circulating_market_cap: string;
  icon_url: string;
  name: string;
  decimals: string;
  symbol: string;
  type: string;
  holders: string;
  exchange_rate: string;
  total_supply: string;
}

export interface AddressParam {
  hash: string;
  implementation_name: string;
  is_contract: boolean;
  is_verified: boolean;
  name: string;
  ens_domain_name?: string;
  metadata?: Record<string, unknown>;
  private_tags: AddressTag[];
  watchlist_names: WatchlistName[];
  public_tags: AddressTag[];
}

export interface AddressTag {
  address_hash: string;
  display_name: string;
  label: string;
}

export interface WatchlistName {
  display_name: string;
  label: string;
}

export interface CollectiblesResponse {
  collectibles: Collectibles;
  metadata: {
    count: number;
    offset: number;
    limit: number;
  };
}
