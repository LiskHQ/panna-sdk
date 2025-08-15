export {
  createPannaClient as createPannaClient,
  describeChain,
  ChainMetadata,
  Chain,
  ChainOptions,
  getRpcUrlForChain as getRPCUrlForChain,
  lisk,
  liskSepolia,
  getChainInfo,
  type CreatePannaClientOptions as CreatePannaClientOptions,
  type PannaClient as PannaClient,

  // Wallet/Account functions
  login,
  createAccount,
  getLinkedAccounts,
  getEmail,
  getPhoneNumber,
  linkAccount,
  prepareLogin,
  unlinkAccount,

  // Transaction functions
  prepareTransaction,
  prepareContractCall,
  getContract,

  // Wallet/Account types and enums
  EcosystemId,
  LoginStrategy,
  type Account,
  type AccountConnectionOptions,
  type AccountAuth,
  type LinkedAccount,

  // Authentication types
  type AuthParams,
  type SingleStepAuthParams,
  type MultiStepAuthParams,
  type EmailAuthParams,
  type PhoneAuthParams,
  type EmailPrepareParams,
  type PhonePrepareParams,
  type EcosystemConfig,
  type LoginStrategyType,

  // Utils functions
  accountBalance,
  accountBalanceInFiat,
  accountBalancesInFiat,
  getActivitiesByAddress,
  getCollectiblesByAddress,
  getSocialIcon,
  getFiatPrice,
  isValidAddress,
  toWei,

  // Utils types
  type AccountBalanceParams,
  type AccountBalanceResult,
  type AccountBalanceInFiatParams,
  type AccountBalanceInFiatResult,
  type AccountBalancesInFiatParams,
  type AccountBalancesInFiatResult,
  type AccountFiatBalance,
  type SocialProvider,
  type SocialAuthType,
  type SocialAuthData,
  AccountEventType,
  type AccountEventTypeValue,
  type GetActivitiesByAddressParams,
  type GetActivitiesByAddressResult,
  type GetCollectiblesByAddressParams,
  type GetCollectiblesByAddressResult,
  type GetFiatPriceParams,
  type GetFiatPriceResult,
  type FiatCurrency,

  // Onramp functions
  onRampStatus,

  // Onramp types
  type OnrampStatus,
  type OnrampTransaction,
  type OnrampPurchaseData,
  type OnrampStatusParams,
  type OnrampStatusResult,
  type OnrampCreatedResult,
  type OnrampPendingResult,
  type OnrampCompletedResult,
  type OnRampProvider,
  type OnrampPrepareResult,
  type OnRampIntent,
  type OnrampPrepareParams,

  // Transaction types
  type PrepareTransactionParams,
  type PrepareTransactionResult,
  type PrepareContractCallParams,
  type PrepareContractCallResult,
  type GetContractParams,
  type GetContractResult,

  // Constants
  DEFAULT_CURRENCY,
  DEFAULT_CHAIN,
  NATIVE_TOKEN_ADDRESS,
  // Wallet Event types and API service
  type AccountEventPayload,
  type OnConnectActivityRequest,
  type DisconnectActivityRequest,
  type AccountUpdateActivityRequest,
  PannaApiService,
  pannaApiService,
  type PannaApiConfig
} from './core';

export * from './react';

// React Query integration
export { QueryClient } from '@tanstack/react-query';
