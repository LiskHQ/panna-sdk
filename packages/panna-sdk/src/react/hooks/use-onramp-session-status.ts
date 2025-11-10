import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getValidSiweAuthToken } from 'src/core/auth';
import {
  getSessionStatus,
  type SessionStatusResult
} from 'src/core/onramp/onramp-money';
import {
  createDefaultRetryFn,
  DEFAULT_RETRY_DELAY,
  DEFAULT_STALE_TIME
} from './constants';
import { usePanna } from './use-panna';

/**
 * Parameters for useOnrampSessionStatus hook
 */
type UseOnrampSessionStatusParams = {
  sessionId: string;
};

/**
 * Hook to retrieve and poll onramp.money session status
 *
 * This hook automatically polls the session status every 5 seconds when the status
 * is non-terminal (created or pending). Polling stops when the session reaches a
 * terminal state (completed, failed, cancelled, or expired).
 *
 * The hook automatically retrieves and includes the JWT auth token if available.
 *
 * @param params - Parameters for retrieving session status
 * @param params.sessionId - The onramp.money session identifier
 * @param options - Optional React Query options
 * @returns React Query result with session status data
 *
 * @example
 * ```tsx
 * import { useOnrampSessionStatus } from 'panna-sdk/react';
 *
 * function OnrampStatus({ sessionId }: { sessionId: string }) {
 *   const { data, isLoading, error, refetch } = useOnrampSessionStatus({
 *     sessionId
 *   });
 *
 *   if (isLoading) return <div>Loading session status...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!data) return null;
 *
 *   return (
 *     <div>
 *       <h3>Session Status: {data.status}</h3>
 *       {data.transaction_hash && (
 *         <p>Transaction: {data.transaction_hash}</p>
 *       )}
 *       {data.error_message && (
 *         <p>Error: {data.error_message}</p>
 *       )}
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnrampSessionStatus(
  { sessionId }: UseOnrampSessionStatusParams,
  options?: Omit<UseQueryOptions<SessionStatusResult>, 'queryKey' | 'queryFn'>
) {
  const { client } = usePanna();
  const hasValidSessionId = !!sessionId;

  return useQuery({
    queryKey: ['onramp-session-status', sessionId],
    queryFn: async (): Promise<SessionStatusResult> => {
      if (!client || !hasValidSessionId) {
        throw new Error('Invalid query state');
      }

      const authToken = await getValidSiweAuthToken();

      return await getSessionStatus({
        sessionId,
        client,
        authToken: authToken || undefined
      });
    },
    staleTime: DEFAULT_STALE_TIME,
    // Poll every 5 seconds for non-terminal statuses
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling if status is terminal
      if (
        data?.status &&
        ['completed', 'failed', 'cancelled', 'expired'].includes(data.status)
      ) {
        return false;
      }
      // Poll every 5 seconds for created/pending statuses
      return 5000;
    },
    retry: createDefaultRetryFn(!!client, hasValidSessionId),
    retryDelay: DEFAULT_RETRY_DELAY,
    ...options
  });
}
