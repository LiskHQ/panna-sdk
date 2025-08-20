import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getCollectiblesByAddress, isValidAddress } from 'src/core';
import {
  GetCollectiblesByAddressParams,
  GetCollectiblesByAddressResult
} from 'src/core/utils/collectible.types';
import { generatePaginationQueryFilter } from '@/utils/query-utils';
import {
  createDefaultRetryFn,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  DEFAULT_STALE_TIME
} from './constants';
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
  const queryFilter = generatePaginationQueryFilter(limit, offset);
  const variables = { address, chain, ...queryFilter };

  return useQuery({
    queryKey: ['collectibles', JSON.stringify(variables)],
    queryFn: async (): Promise<GetCollectiblesByAddressResult> => {
      return await getCollectiblesByAddress({
        address,
        chain,
        limit,
        offset
      });
    },
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, hasValidAddress),
    retryDelay: DEFAULT_RETRY_DELAY,
    ...options
  });
}
