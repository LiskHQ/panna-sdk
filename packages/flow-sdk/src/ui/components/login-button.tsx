import { ConnectButton, ConnectButtonProps } from 'thirdweb/react';
import { useFlowClient } from '../hooks/use-flow-client';

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
      {...props}
    />
  );
}
