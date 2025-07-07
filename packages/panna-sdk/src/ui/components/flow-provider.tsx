import { ReactNode, createContext, useMemo } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { createFlowClient, type FlowClient } from '../../core';

export type FlowProviderProps = {
  children?: ReactNode;
  clientId?: string;
  partnerId?: string;
};

export type FlowContextValue = {
  client: FlowClient;
  partnerId: string;
};

type InternalFlowContextValue = {
  client: FlowClient | null;
  partnerId: string;
};

export const FlowClientContext = createContext<InternalFlowContextValue | null>(
  null
);

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
  const { clientId, partnerId, children } = props;

  const contextValue = useMemo(() => {
    const client = clientId ? createFlowClient({ clientId }) : null;
    return {
      client,
      partnerId: partnerId ?? ''
    };
  }, [clientId, partnerId]);

  return (
    <FlowClientContext value={contextValue}>
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </FlowClientContext>
  );
}
