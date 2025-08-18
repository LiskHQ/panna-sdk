import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { isValidAddress } from 'src/core';
import { mockTokenBalances, TokenBalance } from '@/mocks/token-balances';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  createDefaultRetryFn
} from './constants';
import { usePanna } from './use-panna';

type UseTokenBalancesParams = {
  address: string;
};

/**
 * Hook to retrieve token balances
 * @param params - Parameters for retrieving token balances
 * @returns React Query result with token balance data
 */
export function useTokenBalances(
  { address }: UseTokenBalancesParams,
  options?: Omit<UseQueryOptions<TokenBalance[]>, 'queryKey' | 'queryFn'>
) {
  const { client } = usePanna();
  const hasValidAddress = isValidAddress(address);

  return useQuery({
    queryKey: ['token-balances', address],
    queryFn: async (): Promise<TokenBalance[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockTokenBalances);
        }, 3000);
      });
    },
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, hasValidAddress),
    retryDelay: DEFAULT_RETRY_DELAY,
    ...options
  });
}
