import { AccountDialog } from '../account/account-dialog';
import { AuthProvider, useAuth } from './auth-provider';
import { LoginButton } from './login-button';

/**
 * A connect button component that connects users to their wallets using the Panna client from context.
 *
 * This component must be used within a PannaProvider that provides the Panna client via context.
 * It automatically configures the Lisk ecosystem wallet and defaults to the Lisk chain.
 *
 * @param props - All ConnectButtonProps except 'client' (which comes from PannaProvider context)
 * @param {boolean} [props.isTesting] - Optional flag to use the testing chain (default is false)
 * @throws {Error} When used outside of PannaProvider context or when no client is available
 *
 * @example
 * ```tsx
 * <PannaProvider clientId="your-client-id" partnerId="your-partner-id">
 *   <ConnectButton />
 * </PannaProvider>
 * ```
 *
 * @example Custom styling (user styles override defaults)
 * ```tsx
 * <ConnectButton
 *   connectButton={{
 *     label: "Custom Label",
 *     className: "custom-styles-here", // These will be applied after defaults
 *     style: { backgroundColor: 'red' } // These will override default styles
 *   }}
 * />
 * ```
 */
export function ConnectButton() {
  return (
    <AuthProvider>
      <ConnectButtonInner />
    </AuthProvider>
  );
}

function ConnectButtonInner() {
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
