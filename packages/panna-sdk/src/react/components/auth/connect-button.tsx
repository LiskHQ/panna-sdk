import { useActiveAccount } from 'thirdweb/react';
import { AccountDialog } from '../account/account-dialog';
import { LoginButton } from './login-button';

/**
 * A connect button component that connects users to their wallets using thirdweb's native hooks.
 *
 * This component must be used within a PannaProvider that provides the Panna client via context.
 * It uses thirdweb's built-in state management for wallet connections.
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
        <AccountDialog address={account.address} />
      ) : (
        <LoginButton />
      )}
    </>
  );
}
