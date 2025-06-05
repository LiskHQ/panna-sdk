export {
  // Account & Authentication hooks
  useActiveAccount as useUserAccount,
  useActiveWallet as useUserWallet,
  useActiveWalletChain as useCurrentNetwork,
  useActiveWalletConnectionStatus as useConnectionStatus,

  // Connection Management hooks
  useConnect as useLogin,
  useDisconnect as useLogout,
  useAutoConnect as useAutoLogin,
  useConnectedWallets as useConnectedAccounts,
  useSetActiveWallet as useSetActiveAccount,

  // Network & Chain hooks
  useSwitchActiveWalletChain as useSwitchNetwork,
  useChainMetadata as useNetworkInfo,

  // Balance & Wallet Info hooks
  useWalletBalance as useAccountBalance,
  useWalletInfo as useAccountInfo,
  useWalletImage as useAccountAvatar,

  // Transaction hooks
  useSendTransaction as useTransfer,
  useSendAndConfirmTransaction as useConfirmedTransfer,
  useSendBatchTransaction as useBatchTransfer,
  useWaitForReceipt,
  useEstimateGas,
  useEstimateGasCost as useEstimateTransactionFee,

  // Contract interaction hooks
  useReadContract,
  useContractEvents,

  // Profile & Identity hooks
  useProfiles as useUserProfiles,
  useLinkProfile as useLinkAccount,
  useUnlinkProfile as useUnlinkAccount,
  useSocialProfiles as useSocialAccounts,

  // Authentication & Security hooks
  useAuthToken,

  // UI Modal hooks
  useConnectModal as useLoginModal,
  useWalletDetailsModal as useAccountDetailsModal,
  useNetworkSwitcherModal as useNetworkSwitchModal,

  // Utility hooks
  useBlockNumber,
  useIsAutoConnecting as useIsAutoLoggingIn,

  // Buy/Sell Crypto hooks (onramp/offramp)
  useBuyWithFiatQuote as useFiatToCryptoQuote,
  useBuyWithFiatStatus as useFiatToCryptoStatus,
  useBuyWithFiatHistory as useFiatToCryptoHistory,
  useBuyWithCryptoQuote as useCryptoSwapQuote,
  useBuyWithCryptoStatus as useCryptoSwapStatus,
  useBuyWithCryptoHistory as useCryptoSwapHistory,
  useBuyHistory as usePurchaseHistory,
  usePostOnRampQuote as useOnrampQuote,

  // ENS hooks (domain names)
  useEnsName as useDomainName,
  useEnsAvatar as useDomainAvatar,

  // Advanced Account Abstraction hooks (for power users)
  useAdminWallet as useAdminAccount,

  // EIP5792 hooks (wallet capabilities)
  useCapabilities as useWalletCapabilities,
  useSendCalls as useBatchOperations,
  useSendAndConfirmCalls as useConfirmedBatchOperations,
  useWaitForCallsReceipt as useBatchOperationsStatus,

  // Simulation hooks
  useSimulateTransaction as usePreviewTransaction
} from 'thirdweb/react';
