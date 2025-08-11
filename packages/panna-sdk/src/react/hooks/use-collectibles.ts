import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { isValidAddress } from 'src/core';
import { mockCollectibles } from '@/mocks/collectibles';
import { CollectiblesResponse } from '@/types/collectibles.types';
import { usePanna } from './use-panna';

type UseCollectiblesParams = {
  address: string;
};

/**
 * Hook to retrieve collectibles
 * @param params - Parameters for retrieving collectibles
 * @returns React Query result with collectible data
 */
export const useCollectibles = (
  { address }: UseCollectiblesParams,
  options?: Omit<UseQueryOptions<CollectiblesResponse>, 'queryKey' | 'queryFn'>
) => {
  const { client } = usePanna();
  const hasValidAddress = isValidAddress(address);

  return useQuery({
    queryKey: ['collectibles', address],
    queryFn: async (): Promise<CollectiblesResponse> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockCollectibles);
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
    retryDelay: 1000, // 1 second delay between retries
    ...options
  });
};
