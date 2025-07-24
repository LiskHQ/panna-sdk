import { ReactNode, createContext, useMemo } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { createPannaClient, type PannaClient } from '../../core';

export type PannaProviderProps = {
  children?: ReactNode;
  clientId?: string;
  partnerId?: string;
};

export type PannaContextValue = {
  client: PannaClient;
  partnerId: string;
};

type InternalPannaContextValue = {
  client: PannaClient | null;
  partnerId: string;
};

export const PannaClientContext =
  createContext<InternalPannaContextValue | null>(null);

/**
 * Framework-agnostic Panna Provider that wraps Thirdweb functionality.
 *
 * For SSR frameworks (like Next.js), wrap this component in a client-only boundary
 * at the application level to prevent hydration mismatches.
 *
 * @example
 * ```tsx
 * // Framework agnostic usage
 * <PannaProvider clientId="your-client-id">
 *   <App />
 * </PannaProvider>
 *
 * // Next.js App Router - wrap in 'use client' component
 * 'use client';
 * export function ClientProviders({ children }) {
 *   return <PannaProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>{children}</PannaProvider>;
 * }
 * ```
 */
export function PannaProvider(props: PannaProviderProps) {
  const { clientId, partnerId, children } = props;

  const contextValue = useMemo(() => {
    const client = clientId ? createPannaClient({ clientId }) : null;
    return {
      client,
      partnerId: partnerId ?? ''
    };
  }, [clientId, partnerId]);

  return (
    <PannaClientContext value={contextValue}>
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </PannaClientContext>
  );
}
