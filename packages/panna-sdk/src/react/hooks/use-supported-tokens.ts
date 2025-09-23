import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getSupportedTokens } from '@/utils';
import {
  createDefaultRetryFn,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  DEFAULT_STALE_TIME
} from './constants';
import { usePanna } from './use-panna';

type Token = {
  address: string;
  symbol: string;
  name: string;
  icon?: string;
};

/**
 * Hook to retrieve supported tokens for the current environment
 * @returns React Query result with supported tokens data
 */
export function useSupportedTokens(
  options?: Omit<UseQueryOptions<Token[]>, 'queryKey' | 'queryFn'>
) {
  const { client, chainId } = usePanna();

  return useQuery({
    queryKey: ['supported-tokens'],
    queryFn: async (): Promise<Token[]> => {
      if (!client) {
        throw new Error('Client not available');
      }

      try {
        const supportedTokens = getSupportedTokens(chainId);

        return supportedTokens.map((token) => ({
          address: token.address,
          symbol: token.symbol || '',
          name: token.name || '',
          icon: token.icon
        }));
      } catch (error) {
        console.error('Error fetching supported tokens:', error);
        throw error;
      }
    },
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, true),
    retryDelay: DEFAULT_RETRY_DELAY,
    ...options
  });
}
