import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorInfo, ReactNode, createContext, useMemo } from 'react';
import { AutoConnect, ThirdwebProvider } from 'thirdweb/react';
import {
  createAccount,
  createPannaClient,
  lisk,
  type PannaClient
} from '../../core';
import { AccountEventProvider } from './account-event-provider';
import { ErrorBoundary } from './error-boundary';

export type PannaProviderProps = {
  children?: ReactNode;
  clientId?: string;
  partnerId?: string;
  chainId?: string;
  queryClient?: QueryClient;
  /**
   * Optional timeout (ms) for Thirdweb AutoConnect
   */
  autoConnectTimeout?: number;
  /**
   * Optional custom error fallback UI
   */
  errorFallback?:
    | ReactNode
    | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  /**
   * Optional callback when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

export type PannaContextValue = {
  client: PannaClient;
  partnerId: string;
  chainId?: string;
};

type InternalPannaContextValue = {
  client: PannaClient | null;
  partnerId: string;
  chainId?: string;
};

export const PannaClientContext =
  createContext<InternalPannaContextValue | null>(null);

/**
 * Internal provider component with all the setup logic.
 * Separated to allow ErrorBoundary to wrap the entire provider from the outside.
 */
function PannaProviderInternal(props: PannaProviderProps) {
  const {
    clientId,
    partnerId,
    chainId,
    children,
    queryClient,
    autoConnectTimeout
  } = props;

  const contextValue = useMemo(() => {
    const client = clientId ? createPannaClient({ clientId }) : null;
    return {
      client,
      partnerId: partnerId ?? '',
      chainId: chainId ?? String(lisk.id)
    };
  }, [clientId, partnerId, chainId]);

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

  const wallets = useMemo(() => {
    if (!contextValue.partnerId) return [];
    if (typeof createAccount === 'function') {
      return [createAccount({ partnerId: contextValue.partnerId })];
    }
    return [];
  }, [contextValue.partnerId]);

  return (
    <QueryClientProvider client={activeQueryClient}>
      <PannaClientContext value={contextValue}>
        <ThirdwebProvider>
          {contextValue.client && contextValue.partnerId ? (
            <AutoConnect
              client={contextValue.client}
              wallets={wallets}
              timeout={autoConnectTimeout}
            />
          ) : null}
          <AccountEventProvider>{children}</AccountEventProvider>
        </ThirdwebProvider>
      </PannaClientContext>
    </QueryClientProvider>
  );
}

/**
 * Framework-agnostic Panna Provider that wraps Thirdweb functionality.
 *
 * This component is wrapped with an ErrorBoundary to catch all errors,
 * including those during provider setup and initialization.
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
 * // With custom QueryClient and error handling
 * const queryClient = new QueryClient();
 * <PannaProvider
 *   clientId="your-client-id"
 *   queryClient={queryClient}
 *   errorFallback={<div>Something went wrong</div>}
 *   onError={(error, errorInfo) => console.error(error)}
 * >
 *   <App />
 * </PannaProvider>
 * ```
 */
export function PannaProvider(props: PannaProviderProps) {
  const { errorFallback, onError } = props;

  return (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <PannaProviderInternal {...props} />
    </ErrorBoundary>
  );
}
