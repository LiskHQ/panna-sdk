import { useQuery } from '@tanstack/react-query';
import { isValidAddress } from 'src/core';
import { mockTokenBalances, TokenBalance } from '@/mocks/token-balances';
import { usePanna } from './use-panna';

type UseTokenBalancesParams = {
  address: string;
};

/**
 * Hook to retrieve token balances
 * @param params - Parameters for retrieving token balances
 * @returns React Query result with token balance data
 */
export const useTokenBalances = ({ address }: UseTokenBalancesParams) => {
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
    staleTime: 30 * 1000, // 30 seconds (prices change frequently)
    refetchInterval: 60 * 1000, // Refetch every minute when component is focused
    retry: (failureCount) => {
      // Don't retry on client/validation errors
      if (!client || !hasValidAddress) {
        return false;
      }
      return failureCount < 2; // Retry less for price data
    },
    retryDelay: 1000 // 1 second delay between retries
  });
};
