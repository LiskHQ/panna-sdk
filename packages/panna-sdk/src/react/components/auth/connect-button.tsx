import { useActiveAccount } from '@/hooks';
import { AccountDialog } from '../account/account-dialog';
import { AccountViewProvider } from '../account/account-view-provider';
import { LoginButton } from './login-button';

/**
 * A connect button component that connects users to their wallets using Thirdweb's native hooks.
 *
 * This component must be used within a PannaProvider that provides the Panna client via context.
 * It uses Thirdweb's built-in state management for wallet connections.
 *
 * @throws {Error} When used outside of PannaProvider context or when no client is available
 *
 * @example
 * ```tsx
 * <PannaProvider clientId="your-client-id" partnerId="your-partner-id">
 *   <ConnectButton />
 * </PannaProvider>
 * ```
 */
export function ConnectButton() {
  const account = useActiveAccount();

  return (
    <>
      {account?.address ? (
        <AccountViewProvider>
          <AccountDialog address={account.address} />
        </AccountViewProvider>
      ) : (
        <LoginButton />
      )}
    </>
  );
}
