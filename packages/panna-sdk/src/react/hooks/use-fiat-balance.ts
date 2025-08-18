import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getFiatPrice } from '../..';
import { lisk } from '../../core';
import type { Chain } from '../../core/chains/types';
import type { FiatCurrency } from '../../core/utils/types';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  createDefaultRetryFn
} from './constants';
import { usePanna } from './use-panna';

type UseFiatBalanceParams = {
  balance?: string; // The display value from account balance
  chain?: Chain;
  currency?: FiatCurrency;
};

/**
 * Hook to convert crypto balance to fiat currency
 * @param params - Parameters for fiat conversion
 * @returns React Query result with fiat balance data
 */
export function useFiatBalance({
  balance,
  chain = lisk,
  currency = 'USD'
}: UseFiatBalanceParams): UseQueryResult<number, Error> {
  const { client } = usePanna();

  const numericBalance = balance ? parseFloat(balance) : 0;
  const hasValidBalance = numericBalance > 0 && !isNaN(numericBalance);

  return useQuery({
    queryKey: ['fiat-balance', balance, chain.id, currency],
    queryFn: async (): Promise<number> => {
      if (!client || !balance || !hasValidBalance) {
        return 0;
      }

      const fiatValue = await getFiatPrice({
        client,
        chain,
        amount: numericBalance,
        currency
      });

      return fiatValue.price;
    },
    enabled: !!(client && balance && hasValidBalance),
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, hasValidBalance),
    retryDelay: DEFAULT_RETRY_DELAY
  });
}
