import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { accountBalancesInFiat, isValidAddress } from 'src/core';
import { getEnvironmentChain, getSupportedTokens } from '@/utils';
import type { FiatCurrency } from '../../core/utils/types';
import { usePanna } from './use-panna';

type UseTotalFiatBalanceParams = {
  address: string;
  currency?: FiatCurrency;
};

/**
 * Hook to retrieve the total fiat balance across all supported tokens
 */
export function useTotalFiatBalance(
  { address, currency = 'USD' }: UseTotalFiatBalanceParams,
  options?: Omit<UseQueryOptions<number>, 'queryKey' | 'queryFn'>
) {
  const { client } = usePanna();
  const hasValidAddress = isValidAddress(address);

  return useQuery({
    queryKey: ['total-fiat-balance', address, currency],
    queryFn: async (): Promise<number> => {
      if (!client || !hasValidAddress) {
        throw new Error('Invalid query state');
      }

      const chain = getEnvironmentChain();
      const supportedTokens = getSupportedTokens(
        process.env.NODE_ENV === 'development'
      );

      const chainTokens = supportedTokens[chain.id] ?? [];
      const tokenAddresses = chainTokens.map((t) => t.address);

      const { totalValue } = await accountBalancesInFiat({
        address,
        client,
        chain,
        tokens: tokenAddresses,
        currency
      });

      return totalValue.amount;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: (failureCount) => {
      if (!client || !hasValidAddress) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
    ...options
  });
}
