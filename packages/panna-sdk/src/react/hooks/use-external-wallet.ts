import { useQuery } from '@tanstack/react-query';
import { EcosystemId, getLinkedAccounts, type LinkedAccount } from '../../core';
import {
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  DEFAULT_STALE_TIME,
  createDefaultRetryFn
} from './constants';
import { useConnectedAccounts } from './index';
import { usePanna } from './use-panna';

/**
 * Hook to detect and manage external wallet connections (e.g., MetaMask, Coinbase Wallet)
 * Filters out in-app/embedded wallets to return only external wallet connections
 *
 * @returns Object containing external wallet information
 * - externalWallet: The first detected external wallet object
 * - hasExternalWallet: Boolean indicating if an external wallet is connected
 * - externalAddress: The address of the external wallet (if connected)
 *
 * @example
 * ```tsx
 * import { useExternalWallet } from 'panna-sdk';
 *
 * function TransferButton() {
 *   const { hasExternalWallet, externalAddress } = useExternalWallet();
 *
 *   if (!hasExternalWallet) {
 *     return <p>Connect an external wallet to transfer</p>;
 *   }
 *
 *   return <Button>Transfer from {externalAddress}</Button>;
 * }
 * ```
 */
export function useExternalWallet() {
  const connectedAccounts = useConnectedAccounts();
  const { client, partnerId } = usePanna();

  const {
    data: linkedAccounts = [],
    isLoading: isLinkedExternalWalletLoading
  } = useQuery({
    queryKey: ['linked-accounts', partnerId],
    queryFn: async (): Promise<LinkedAccount[]> => {
      if (!partnerId) {
        return [];
      }

      return await getLinkedAccounts({
        client,
        ecosystem: {
          id: EcosystemId.LISK,
          partnerId
        }
      });
    },
    enabled: Boolean(partnerId),
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(Boolean(client), Boolean(partnerId)),
    retryDelay: DEFAULT_RETRY_DELAY
  });

  // Filter for external wallets (non-inApp wallets)
  const externalWallet = connectedAccounts.find((wallet) => {
    const walletId = wallet.id;
    // Thirdweb inApp wallets have id format 'inApp' or 'embedded'
    // External wallets have ids like 'io.metamask', 'com.coinbase.wallet', etc.
    return walletId !== 'inApp' && walletId !== 'embedded';
  });

  const linkedExternalWallet = linkedAccounts.find(
    (account) => account.type === 'wallet' && account.details?.address
  );

  return {
    externalWallet: externalWallet ?? null,
    hasExternalWallet: Boolean(externalWallet),
    externalAddress: externalWallet?.getAccount()?.address ?? null,
    hasLinkedExternalWallet: Boolean(linkedExternalWallet),
    linkedExternalAddress: linkedExternalWallet?.details?.address ?? null,
    isLinkedExternalWalletLoading
  };
}
