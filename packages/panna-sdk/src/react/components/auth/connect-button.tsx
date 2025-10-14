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
 *
 * ## Default Usage
 * ```tsx
 * <PannaProvider clientId="your-client-id" partnerId="your-partner-id">
 *   <ConnectButton />
 * </PannaProvider>
 * ```
 *
 * ### Customizing the connect button UI
 *
 * ```tsx
 * <ConnectButton
 *    connectButton={{
 *      title: "Sign in to MyApp",
 *    }}
 * />
 * ```
 *
 * ### Customizing the dialog UI
 *
 * ```tsx
 * <ConnectButton
 *    connectDialog={{
 *      title: "Sign in to MyApp",
 *      description: "Simple and secure login for myApp",
 *      otpTitle: "Enter your OTP",
 *      otpDescription: "Please enter the OTP sent to your email."
 *    }}
 * />
 */
export type ConnectButtonProps = {
  connectButton?: {
    title?: string;
  };
  connectDialog?: {
    title?: string;
    description?: string;
    otpTitle?: string;
    otpDescription?: string;
  };
};

export function ConnectButton({
  connectButton,
  connectDialog
}: ConnectButtonProps) {
  const account = useActiveAccount();

  return (
    <>
      {account?.address ? (
        <AccountViewProvider>
          <AccountDialog address={account.address} />
        </AccountViewProvider>
      ) : (
        <LoginButton
          connectButton={connectButton}
          connectDialog={connectDialog}
        />
      )}
    </>
  );
}
