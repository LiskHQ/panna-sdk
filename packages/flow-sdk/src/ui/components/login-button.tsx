import {
  ConnectButton,
  ConnectButtonProps,
  getDefaultToken,
  useActiveWalletChain
} from 'thirdweb/react';
import { lisk, liskSepolia } from '../../core';
import { useFlowClient } from '../hooks/use-flow-client';
import { liskTheme } from '../theme';

export type LoginButtonProps = Omit<ConnectButtonProps, 'client'>;

/**
 * A login button component that connects users to their wallets using the Flow client from context.
 *
 * This component must be used within a FlowProvider that provides the Flow client via context.
 *
 * @param props - All ConnectButtonProps except 'client' (which comes from FlowProvider context)
 * @throws {Error} When used outside of FlowProvider context or when no client is available
 *
 * @example
 * ```tsx
 * <FlowProvider clientId="your-client-id">
 *   <LoginButton />
 * </FlowProvider>
 * ```
 */
export function LoginButton(props: LoginButtonProps) {
  const client = useFlowClient();
  const currentChain = useActiveWalletChain();

  if (!client) {
    throw new Error(
      'LoginButton requires a Flow client from FlowProvider context. ' +
        'Make sure to wrap your app with <FlowProvider clientId="your-client-id">.'
    );
  }

  return (
    <ConnectButton
      client={client}
      connectButton={{ label: 'Sign in' }}
      theme={liskTheme}
      appMetadata={{
        name: 'Lisk Flow App',
        logoUrl: 'https://portal-assets.lisk.com/logo/lisk-profile-w.svg'
      }}
      connectModal={{
        showThirdwebBranding: false
      }}
      accountAbstraction={{
        chain: currentChain?.id === lisk.id ? lisk : liskSepolia,
        sponsorGas: true
      }}
      supportedTokens={
        currentChain?.id === lisk.id
          ? {
              '1135': [
                {
                  address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                  name: 'Lisk',
                  symbol: 'LSK',
                  icon: 'ipfs://QmRBakJ259a4RPFkMayjmeG7oL6f1hWqYg4CUDFUSbttNx'
                }
              ]
            }
          : {
              '4202': [
                {
                  address: '0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D',
                  name: 'Lisk',
                  symbol: 'LSK',
                  icon: 'ipfs://QmRBakJ259a4RPFkMayjmeG7oL6f1hWqYg4CUDFUSbttNx'
                },
                {
                  address: '0xed875CABEE46D734F38B5ED453ED1569347c0da8',
                  name: 'USDC',
                  symbol: 'usdc',
                  icon: getDefaultToken(
                    {
                      id: 1,
                      rpc: 'https://cloudflare-eth.com'
                    },
                    'USDC'
                  )!.icon
                }
              ]
            }
      }
      {...props}
    />
  );
}
