import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { lisk } from 'src/core';
import type { Chain } from 'thirdweb';
import { getTokenFiatPrices } from '../../core/onramp';
import type { FiatCurrency } from '../../core/utils/types';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  createDefaultRetryFn
} from './constants';
import { usePanna } from './use-panna';

type UseFiatToCryptoParams = {
  chain?: Chain;
  tokenAddress?: string;
  fiatAmount: number;
  currency?: FiatCurrency;
};

type FiatToCryptoResult = {
  amount: number;
  currency: FiatCurrency;
};

/**
 * Hook to convert fiat amount to crypto amount
 * @param params - Parameters for fiat to crypto conversion
 * @returns React Query result with crypto amount data
 */
export function useFiatToCrypto(
  { chain, tokenAddress, fiatAmount, currency = 'USD' }: UseFiatToCryptoParams,
  options?: Omit<UseQueryOptions<FiatToCryptoResult>, 'queryKey' | 'queryFn'>
) {
  const { client } = usePanna();
  const hasValidAmount = fiatAmount > 0;

  return useQuery({
    queryKey: ['fiat-to-crypto', chain?.id, tokenAddress, fiatAmount, currency],
    queryFn: async (): Promise<FiatToCryptoResult> => {
      if (!hasValidAmount || !client || !chain || !tokenAddress) {
        throw new Error('Invalid query state');
      }

      try {
        // Get token prices from the API
        const tokenPrices = await getTokenFiatPrices({
          chainId: lisk.id,
          tokenAddress,
          client
        });

        // Find the token price data
        const tokenPrice = tokenPrices.find(
          (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
        );

        if (!tokenPrice || !tokenPrice.prices[currency]) {
          throw new Error(`Price not available for ${currency}`);
        }

        // Get the price per token in the specified currency
        const pricePerToken = tokenPrice.prices[currency];

        // Calculate how much crypto we can buy with the fiat amount
        const cryptoAmount = fiatAmount / pricePerToken;

        return {
          amount: cryptoAmount,
          currency
        };
      } catch (error) {
        console.error('Error fetching token prices:', error);
        throw error;
      }
    },
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, hasValidAmount),
    retryDelay: DEFAULT_RETRY_DELAY,
    enabled: hasValidAmount && !!client && !!chain && !!tokenAddress,
    ...options
  });
}
