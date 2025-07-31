import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getFiatPrice } from '../..';
import { lisk } from '../../core';
import type { Chain } from '../../core/chains/types';
import type { FiatCurrency } from '../../core/utils/types';
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
    staleTime: 30 * 1000, // 30 seconds (prices change frequently)
    refetchInterval: 60 * 1000, // Refetch every minute when component is focused
    retry: (failureCount) => {
      // Don't retry on client/validation errors
      if (!client || !hasValidBalance) {
        return false;
      }
      return failureCount < 2; // Retry less for price data
    },
    retryDelay: 1000 // 1 second delay between retries
  });
}
