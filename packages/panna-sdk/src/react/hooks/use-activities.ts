import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  getActivitiesByAddress,
  GetActivitiesByAddressParams,
  GetActivitiesByAddressResult,
  isValidAddress
} from 'src/core';
import { generatePaginationQueryFilter } from '@/utils/query-utils';
import {
  createDefaultRetryFn,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  DEFAULT_STALE_TIME
} from './constants';
import { usePanna } from './use-panna';

/**
 * Hook to retrieve activities
 * @param params - Parameters for retrieving activities
 * @param params.address - The account address for which to retrieve the collectibles.
 * @param params.chain - (Optional) Chain object type. (Default: lisk)
 * @param params.limit - (Optional) The number of items to be returned from the matching result. (Default: 10)
 * @param params.offset - (Optional) The number of items to be skipped from the matching result. (Default: 0)
 * @returns React Query result with activity data
 */
export function useActivities(
  { address, chain, limit, offset }: GetActivitiesByAddressParams,
  options?: Omit<
    UseQueryOptions<GetActivitiesByAddressResult>,
    'queryKey' | 'queryFn'
  >
) {
  const { client } = usePanna();
  const hasValidAddress = isValidAddress(address);
  const queryFilter = generatePaginationQueryFilter(limit, offset);
  const variables = { address, chain, ...queryFilter };

  return useQuery({
    queryKey: ['activities', JSON.stringify(variables)],
    queryFn: async (): Promise<GetActivitiesByAddressResult> => {
      return await getActivitiesByAddress({
        address,
        client,
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
