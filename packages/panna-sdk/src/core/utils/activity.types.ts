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

export interface BlockscoutNextPageParams {
  block_number: number;
  index: number;
  items_count: number;
}

export interface BlockscoutTransaction {
  timestamp: string;
  fee: BlockscoutFee;
  gas_limit: number;
  block_number: number;
  status: BlockscoutTransactionStatus;
  method: string;
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
  created_contract: BlockscoutAddressParam;
  position: number;
  nonce: number;
  has_error_in_internal_transactions: boolean;
  actions: BlockscoutTransactionAction[];
  decoded_input: BlockscoutDecodedInput;
  token_transfers_overflow: boolean;
  raw_input: string;
  value: string;
  max_priority_fee_per_gas: string;
  rever_reason: string;
  confirmation_duration: BlockscoutTransactionConfirmationDuration;
  transaction_tag: string;
}

interface BlockscoutFee {
  type: string;
  value: string;
}

type BlockscoutTransactionStatus = 'ok' | 'error';

interface BlockscoutAddressParam {
  hash: string;
  implementation_name: string;
  name: string;
  ens_domain_name: string;
  metadata: BlockscoutAddressParamMetadata;
  is_contract: boolean;
  private_tags: BlockscoutAddressTag[];
  watchlist_names: BlockscoutWatchlistName[];
  public_tags: BlockscoutAddressTag[];
  is_verified: boolean;
}

interface BlockscoutAddressParamMetadata {
  slug: string;
  name: string;
  tagType: string;
  ordinal: number;
  meta: Record<string, unknown>;
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

interface BlockscoutTokenTransfer {
  block_hash: string;
  from: BlockscoutAddressParam;
  log_index: number;
  method: string;
  timestamp: string;
  to: BlockscoutAddressParam;
  token: BlockscoutTokenInfo;
  total: BlockscoutTotal;
  transaction_hash: string;
  type: string;
}

interface BlockscoutTokenInfo {
  circulating_market_cap: string;
  icon_url: string;
  name: string;
  decimals: string;
  symbol: string;
  address: string;
  type: string;
  holders: string;
  exchange_rate: string;
  total_supply: string;
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
  decimals: string;
  value: string;
  token_instance: BlockscoutNFTInstance;
}

interface BlockscoutNFTInstance {
  is_unique: boolean;
  id: string;
  holder_address_hash: string;
  image_url: string;
  animation_url: string;
  external_app_url: string;
  metadata: BlockscoutNFTInstanceMetadata;
  owner: BlockscoutAddressParam;
  token: BlockscoutTokenInfo;
}

interface BlockscoutNFTInstanceMetadata {
  year: number;
  tags: string[];
  name: string;
  image_url: string;
  home_url: string;
  external_url: string;
  description: string;
  attributes: BlockscoutNFTInstanceMetadataAttribute[];
}

interface BlockscoutNFTInstanceMetadataAttribute {
  value: string;
  trait_type: string;
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
  value: string;
}

type BlockscoutTransactionConfirmationDuration = number[];
