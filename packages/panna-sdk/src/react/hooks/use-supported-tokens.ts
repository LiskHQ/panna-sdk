import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getEnvironmentChain, getSupportedTokens } from '@/utils';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  createDefaultRetryFn
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
  const { client } = usePanna();

  return useQuery({
    queryKey: ['supported-tokens'],
    queryFn: async (): Promise<Token[]> => {
      if (!client) {
        throw new Error('Client not available');
      }

      try {
        const chain = getEnvironmentChain();
        const supportedTokens = getSupportedTokens(
          process.env.NODE_ENV === 'development'
        );

        const chainTokens = supportedTokens[chain.id] ?? [];

        return chainTokens.map((token) => ({
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
