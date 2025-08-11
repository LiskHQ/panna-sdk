import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createContext, useMemo } from 'react';
import { AutoConnect, ThirdwebProvider } from 'thirdweb/react';
import { ecosystemWallet } from 'thirdweb/wallets';
import { createPannaClient, EcosystemId, type PannaClient } from '../../core';
import { AccountEventProvider } from './account-event-provider';

export type PannaProviderProps = {
  children?: ReactNode;
  clientId?: string;
  partnerId?: string;
  queryClient?: QueryClient;
  /**
   * Optional timeout (ms) for Thirdweb AutoConnect
   */
  autoConnectTimeout?: number;
  /**
   * Optional authentication token for wallet event API requests
   */
  authToken?: string;
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
 *   return (
 *     <PannaProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
 *       {children}
 *     </PannaProvider>
 *   );
 * }
 *
 * // With custom QueryClient
 * const queryClient = new QueryClient();
 * <PannaProvider clientId="your-client-id" queryClient={queryClient}>
 *   <App />
 * </PannaProvider>
 * ```
 */
export function PannaProvider(props: PannaProviderProps) {
  const {
    clientId,
    partnerId,
    children,
    queryClient,
    authToken,
    autoConnectTimeout
  } = props;

  const contextValue = useMemo(() => {
    const client = clientId ? createPannaClient({ clientId }) : null;
    return {
      client,
      partnerId: partnerId ?? ''
    };
  }, [clientId, partnerId]);

  // Create a default QueryClient if none provided
  const defaultQueryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 3
          }
        }
      }),
    []
  );

  const activeQueryClient = queryClient || defaultQueryClient;

  return (
    <QueryClientProvider client={activeQueryClient}>
      <PannaClientContext value={contextValue}>
        <ThirdwebProvider>
          {contextValue.client && contextValue.partnerId ? (
            <AutoConnect
              client={contextValue.client}
              wallets={[ecosystemWallet(EcosystemId.LISK, { partnerId })]}
              timeout={autoConnectTimeout}
            />
          ) : null}
          <AccountEventProvider authToken={authToken}>
            {children}
          </AccountEventProvider>
        </ThirdwebProvider>
      </PannaClientContext>
    </QueryClientProvider>
  );
}
