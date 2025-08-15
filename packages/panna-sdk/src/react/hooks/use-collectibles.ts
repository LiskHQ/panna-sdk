import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getCollectiblesByAddress, isValidAddress } from 'src/core';
import {
  GetCollectiblesByAddressParams,
  GetCollectiblesByAddressResult
} from 'src/core/utils/collectible.types';
import { usePanna } from './use-panna';

/**
 * Hook to retrieve collectibles
 * @param params - Parameters for retrieving collectibles
 * @returns React Query result with collectible data
 */
export function useCollectibles(
  { address, chain, limit, offset }: GetCollectiblesByAddressParams,
  options?: Omit<
    UseQueryOptions<GetCollectiblesByAddressResult>,
    'queryKey' | 'queryFn'
  >
) {
  const { client } = usePanna();
  const hasValidAddress = isValidAddress(address);

  return useQuery({
    queryKey: ['collectibles', address],
    queryFn: async (): Promise<GetCollectiblesByAddressResult> => {
      return await getCollectiblesByAddress({
        address,
        chain,
        limit,
        offset
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
}
