import { ConnectButton, ConnectButtonProps } from 'thirdweb/react';
import { useFlowClient } from '../hooks/use-flow-client';

export type LoginButtonProps = Omit<ConnectButtonProps, 'client'>;

/**
 * A login button component that connects users to their wallets using the Flow client from context.
 *
 * This component must be used within a FlowProvider that provides the Flow client via context.
 * It renders a Thirdweb ConnectButton with Flow-specific configuration.
 *
 * @param props - All ConnectButtonProps except 'client' (which comes from FlowProvider context)
 * @throws {Error} When used outside of FlowProvider context or when no client is available
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FlowProvider clientId="your-client-id">
 *   <LoginButton />
 * </FlowProvider>
 *
 * // With custom styling
 * <FlowProvider clientId="your-client-id">
 *   <LoginButton
 *     theme="dark"
 *     connectButton={{
 *       label: "Connect Wallet",
 *       style: { backgroundColor: "#1a1a1a" }
 *     }}
 *   />
 * </FlowProvider>
 *
 * // With custom modal configuration
 * <FlowProvider clientId="your-client-id">
 *   <LoginButton
 *     connectModal={{
 *       size: "wide",
 *       title: "Connect to App"
 *     }}
 *   />
 * </FlowProvider>
 * ```
 *
 * @see {@link FlowProvider} - Required wrapper component
 * @see {@link useFlowClient} - Hook to access the Flow client directly
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
