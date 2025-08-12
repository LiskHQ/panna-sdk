// Parameters for fetching account activities
export interface GetActivityParams {
  address: string;
  limit?: number;
  offset?: number;
}

// Result for fetched account activities
export interface GetActivityResult {
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
}

// Blockscout API response types
export interface BlockscoutTransactionsResponse {
  items: BlockscoutTransaction[];
  next_page_params: BlockscoutNextPageParams;
}

export interface BlockscoutTokenTransfersResponse {
  items: BlockscoutTokenTransfer[];
  next_page_params: BlockscoutNextPageParams;
}

export interface BlockscoutNextPageParams {
  block_number: number;
  index: number;
  items_count: number;
}

export interface BlockscoutTransaction {
  timestamp: string;
  fee: BlockscoutFee;
  gas_limit: string;
  block_number: number;
  status: BlockscoutTransactionStatus;
  method: string | null;
  confirmations: number;
  type: number;
  exchange_rate: string;
  to: BlockscoutAddressParam;
  transaction_burnt_fee: string;
  max_fee_per_gas: string;
  result: string;
  hash: string;
  gas_price: string;
  priority_fee: string;
  base_fee_per_gas: string;
  from: BlockscoutAddressParam;
  token_transfers: BlockscoutTokenTransfer[];
  transaction_types: BlockscoutTransactionType[];
  gas_used: string;
  created_contract: BlockscoutAddressParam | null;
  position: number;
  nonce: number;
  has_error_in_internal_transactions: boolean;
  actions: BlockscoutTransactionAction[];
  decoded_input: BlockscoutDecodedInput | null;
  token_transfers_overflow: boolean;
  raw_input: string;
  value: string;
  max_priority_fee_per_gas: string;
  revert_reason: string | null;
  confirmation_duration: BlockscoutTransactionConfirmationDuration;
  transaction_tag: string | null;
  l1_gas_used: string;
  l1_gas_price: string;
  l1_fee_scalar: string;
  op_withdrawals: [];
  authorization_list: [];
  l1_fee: string;
  historic_exchange_rate: string;
}

interface BlockscoutFee {
  type: string;
  value: string;
}

type BlockscoutTransactionStatus = 'ok' | 'error';

interface BlockscoutAddressParam {
  hash: string;
  implementations: BlockscoutAddressParamImplementation[];
  implementation_name?: string;
  name: string | null;
  ens_domain_name: string | null;
  metadata: BlockscoutAddressParamMetadata | null;
  is_scam: boolean;
  is_contract: boolean;
  private_tags: BlockscoutAddressTag[];
  watchlist_names: BlockscoutWatchlistName[];
  public_tags: BlockscoutAddressTag[];
  is_verified: boolean;
  proxy_type: string | null;
}

interface BlockscoutAddressParamImplementation {
  address: string;
  address_hash: string;
  name: string;
}

interface BlockscoutAddressParamMetadata {
  tags: BlockscoutAddressParamMetadataTag[];
}

interface BlockscoutAddressParamMetadataTag {
  meta: Record<string, unknown>;
  name: string;
  ordinal: number;
  slug: string;
  tagType: string;
}

interface BlockscoutAddressTag {
  address_hash: string;
  display_name: string;
  label: string;
}

interface BlockscoutWatchlistName {
  display_name: string;
  label: string;
}

export interface BlockscoutTokenTransfer {
  block_hash: string;
  block_number: number;
  from: BlockscoutAddressParam;
  log_index: number;
  method: string | null;
  timestamp: string | null;
  to: BlockscoutAddressParam;
  token: BlockscoutTokenInfo;
  total: BlockscoutTotal;
  transaction_hash: string;
  type: string;
}

interface BlockscoutTokenInfo {
  circulating_market_cap: string | null;
  icon_url: string | null;
  name: string;
  decimals: string | null;
  symbol: string;
  address: string;
  address_hash: string;
  type: string;
  holders: string;
  holders_count: string;
  exchange_rate: string | null;
  total_supply: string | null;
  volume_24h: string | null;
}

type BlockscoutTotal =
  | BlockscoutTotalERC20
  | BlockscoutTotalERC721
  | BlockscoutTotalERC1155;

export interface BlockscoutTotalERC20 {
  decimals: string;
  value: string;
}

export interface BlockscoutTotalERC721 {
  token_id: string;
  token_instance: BlockscoutNFTInstance;
}

export interface BlockscoutTotalERC1155 {
  token_id: string;
  decimals: string | null;
  value: string;
  token_instance: BlockscoutNFTInstance;
}

interface BlockscoutNFTInstance {
  is_unique: boolean | null;
  id: string;
  holder_address_hash?: string;
  image_url: string;
  animation_url: string | null;
  external_app_url: string;
  metadata: BlockscoutNFTInstanceMetadata;
  owner: BlockscoutAddressParam | null;
  token: BlockscoutTokenInfo;
  media_type: string | null;
  media_url: string | null;
  thumbnails: string | null;
}

interface BlockscoutNFTInstanceMetadata {
  attributes: BlockscoutNFTInstanceMetadataAttribute[];
  description: string;
  external_url: string;
  image: string;
  name: string;
}

interface BlockscoutNFTInstanceMetadataAttribute {
  value: string | number;
  trait_type: string;
  display_type?: string;
}

export type BlockscoutTransactionType =
  | 'token_transfer'
  | 'contract_creation'
  | 'contract_call'
  | 'token_creation'
  | 'coin_transfer';

type BlockscoutTransactionAction =
  | BlockscoutTransactionActionAaveV3LiquidationCall
  | BlockscoutTransactionActionAaveV3BSWRF
  | BlockscoutTransactionActionAaveV3EnableDisableCollateral
  | BlockscoutTransactionActionUniswapV3MintNFT
  | BlockscoutTransactionActionUniswapV3BCS;

interface BlockscoutTransactionActionAaveV3LiquidationCall {
  data: BlockscoutTransactionActionAaveV3LiquidationCallData;
  protocol: string;
  type: string;
}

interface BlockscoutTransactionActionAaveV3LiquidationCallData {
  debt_amount: string;
  debt_symbol: string;
  debt_address: string;
  collateral_amount: string;
  collateral_symbol: string;
  collateral_address: string;
  block_number: number;
}

interface BlockscoutTransactionActionAaveV3BSWRF {
  data: BlockscoutTransactionActionAaveV3BSWRFData;
  protocol: string;
  type: string;
}

interface BlockscoutTransactionActionAaveV3BSWRFData {
  amount: string;
  symbol: string;
  address: string;
  block_number: number;
}

interface BlockscoutTransactionActionAaveV3EnableDisableCollateral {
  data: BlockscoutTransactionActionAaveV3EnableDisableCollateralData;
  protocol: string;
  type: string;
}

interface BlockscoutTransactionActionAaveV3EnableDisableCollateralData {
  symbol: string;
  address: string;
  block_number: number;
}

interface BlockscoutTransactionActionUniswapV3MintNFT {
  data: BlockscoutTransactionActionUniswapV3MintNFTData;
  protocol: string;
  type: string;
}

interface BlockscoutTransactionActionUniswapV3MintNFTData {
  name: string;
  symbol: string;
  address: string;
  to: string;
  ids: string[];
  block_number: number;
}

interface BlockscoutTransactionActionUniswapV3BCS {
  data: BlockscoutTransactionActionUniswapV3BCSData;
  protocol: string;
  type: string;
}

interface BlockscoutTransactionActionUniswapV3BCSData {
  address0: string;
  address1: string;
  amount0: string;
  amount1: string;
  symbol0: string;
  symbol1: string;
}

interface BlockscoutDecodedInput {
  method_call: string;
  method_id: string;
  parameters: BlockscoutDecodedInputParameter[];
}

interface BlockscoutDecodedInputParameter {
  name: string;
  type: string;
  value:
    | BlockscoutDecodedInputParameterValue
    | BlockscoutDecodedInputParameterValue[];
}

type BlockscoutDecodedInputParameterValue = string | string[] | string[][];

type BlockscoutTransactionConfirmationDuration = number[];
