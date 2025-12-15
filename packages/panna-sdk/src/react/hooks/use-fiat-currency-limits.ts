import { useQuery } from '@tanstack/react-query';
import { FiatLimitsData, FiatLimitsEnum, FiatLimitsParams } from 'src/core';
import { DEFAULT_STALE_TIME } from './constants';
import { usePanna } from './use-panna';

export function useFiatCurrencyLimits(params: FiatLimitsParams) {
  const { pannaApiService, siweAuth } = usePanna();

  const hasValidParams =
    params === FiatLimitsEnum.ONRAMP ||
    params === FiatLimitsEnum.OFFRAMP ||
    params === FiatLimitsEnum.BOTH;

  return useQuery<FiatLimitsData, Error>({
    queryKey: ['fiat-limits', params],
    queryFn: async () => {
      const authToken = await siweAuth.getValidAuthToken();

      if (!authToken) {
        throw new Error('Missing authentication token for onramp quotes.');
      }

      return pannaApiService.getFiatCurrencyLimits(params, authToken);
    },
    enabled: hasValidParams,
    staleTime: DEFAULT_STALE_TIME,
    retry: (failureCount, error) => {
      // Don't retry if it's an authentication error to avoid multiple retry attempts
      if (error.message.includes('authentication token')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}
