import { ConnectButton, ConnectButtonProps } from 'thirdweb/react';
import { createAccount } from '../../core/wallet';
import { usePanna } from '../hooks/use-panna';
import { liskTheme } from '../theme';
import { getAAChain, getChain, getSupportedTokens } from '../utils';

export type LoginButtonProps = Omit<ConnectButtonProps, 'client'> & {
  isTesting?: boolean;
};

/**
 * A login button component that connects users to their wallets using the Flow client from context.
 *
 * This component must be used within a FlowProvider that provides the Flow client via context.
 * It automatically configures the Lisk ecosystem wallet and defaults to the Lisk chain.
 *
 * @param props - All ConnectButtonProps except 'client' (which comes from FlowProvider context)
 * @param {boolean} [props.isTesting] - Optional flag to use the testing chain (default is false)
 * @throws {Error} When used outside of FlowProvider context or when no client is available
 *
 * @example
 * ```tsx
 * <FlowProvider clientId="your-client-id" partnerId="your-partner-id">
 *   <LoginButton />
 * </FlowProvider>
 * ```
 *
 * @example Custom styling (user styles override defaults)
 * ```tsx
 * <LoginButton
 *   connectButton={{
 *     label: "Custom Label",
 *     className: "custom-styles-here", // These will be applied after defaults
 *     style: { backgroundColor: 'red' } // These will override default styles
 *   }}
 * />
 * ```
 */
export function LoginButton({ connectButton, ...props }: LoginButtonProps) {
  const { client, partnerId } = usePanna();

  const liskEcosystemWallet = createAccount({ partnerId });

  return (
    <ConnectButton
      client={client}
      connectButton={{ label: 'Sign in', ...connectButton }}
      theme={liskTheme}
      appMetadata={{
        name: 'Panna App',
        logoUrl: 'https://portal-assets.lisk.com/logo/lisk-profile-w.svg'
      }}
      connectModal={{
        showThirdwebBranding: false
      }}
      chain={getChain(props.isTesting)}
      accountAbstraction={{
        chain: getAAChain(props.isTesting),
        sponsorGas: true
      }}
      supportedTokens={getSupportedTokens(props.isTesting)}
      wallets={[liskEcosystemWallet]}
      {...props}
    />
  );
}
