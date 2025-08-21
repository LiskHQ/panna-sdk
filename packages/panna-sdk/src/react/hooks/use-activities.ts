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
