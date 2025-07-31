import { AccountDialog } from '../account/account-dialog';
import { useAuth } from './auth-provider';
import { LoginButton } from './login-button';

/**
 * A connect button component that connects users to their wallets using the Panna client from context.
 *
 * This component must be used within a PannaProvider that provides the Panna client via context.
 * It automatically configures the Lisk ecosystem wallet and defaults to the Lisk chain.
 * The PannaProvider automatically includes the AuthProvider, so this component can directly use useAuth().
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
  const { userAddress, isHydrated } = useAuth();

  if (!isHydrated) {
    return <LoginButton />;
  }

  return (
    <>
      {userAddress ? <AccountDialog address={userAddress} /> : <LoginButton />}
    </>
  );
}
