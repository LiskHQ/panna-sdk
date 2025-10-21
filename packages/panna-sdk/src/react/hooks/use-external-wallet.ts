import { useConnectedAccounts } from './index';

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

  // Filter for external wallets (non-inApp wallets)
  const externalWallet = connectedAccounts.find((wallet) => {
    const walletId = wallet.id;
    // Thirdweb inApp wallets have id format 'inApp' or 'embedded'
    // External wallets have ids like 'io.metamask', 'com.coinbase.wallet', etc.
    return walletId !== 'inApp' && walletId !== 'embedded';
  });

  return {
    externalWallet: externalWallet ?? null,
    hasExternalWallet: !!externalWallet,
    externalAddress: externalWallet?.getAccount()?.address ?? null
  };
}
