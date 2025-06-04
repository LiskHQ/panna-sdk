import { ReactNode, createContext, useMemo } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { createFlowClient, type FlowClient } from '../../core';

export type FlowProviderProps = {
  children?: ReactNode;
  clientId?: string;
};

// Create context for the Flow client
export const FlowClientContext = createContext<FlowClient | null>(null);

/**
 * Framework-agnostic Flow Provider that wraps Thirdweb functionality.
 *
 * For SSR frameworks (like Next.js), wrap this component in a client-only boundary
 * at the application level to prevent hydration mismatches.
 *
 * @example
 * ```tsx
 * // Framework agnostic usage
 * <FlowProvider clientId="your-client-id">
 *   <App />
 * </FlowProvider>
 *
 * // Next.js App Router - wrap in 'use client' component
 * 'use client';
 * export function ClientProviders({ children }) {
 *   return <FlowProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>{children}</FlowProvider>;
 * }
 * ```
 */
export function FlowProvider(props: FlowProviderProps) {
  const { clientId, children } = props;

  const client = useMemo(() => {
    if (clientId) {
      return createFlowClient({ clientId });
    }
    return null;
  }, [clientId]);

  return (
    <FlowClientContext.Provider value={client}>
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </FlowClientContext.Provider>
  );
}
