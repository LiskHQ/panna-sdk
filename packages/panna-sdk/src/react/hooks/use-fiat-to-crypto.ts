import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { DEFAULT_CURRENCY, lisk, liskSepolia } from 'src/core';
import type { Chain } from 'thirdweb';
import { getTokenFiatPrices } from '../../core/onramp';
import type { FiatCurrency } from '../../core/utils/types';
import { getEnvironmentChain } from '../utils';
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
  tokenSymbol?: string;
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
  {
    chain,
    tokenAddress,
    tokenSymbol,
    fiatAmount,
    currency = DEFAULT_CURRENCY
  }: UseFiatToCryptoParams,
  options?: Omit<UseQueryOptions<FiatToCryptoResult>, 'queryKey' | 'queryFn'>
) {
  const { client } = usePanna();
  const hasValidAmount = fiatAmount > 0;

  return useQuery({
    queryKey: [
      'fiat-to-crypto',
      chain?.id,
      tokenAddress,
      tokenSymbol,
      fiatAmount,
      currency
    ],
    queryFn: async (): Promise<FiatToCryptoResult> => {
      if (!hasValidAmount || !client || !chain || !tokenAddress) {
        throw new Error('Invalid query state');
      }

      try {
        const tokenPrices = await getTokenFiatPrices({
          chainId: lisk.id,
          tokenAddress,
          client
        });

        const currentChain = getEnvironmentChain();
        const isLiskSepolia = currentChain.id === liskSepolia.id;

        const tokenPrice = tokenPrices.find((token) => {
          if (isLiskSepolia && tokenSymbol) {
            // Special case for liskSepolia: use symbol comparison
            return token.symbol === tokenSymbol;
          }
          // Default: use address comparison for security
          return token.address.toLowerCase() === tokenAddress.toLowerCase();
        });

        if (!tokenPrice || !tokenPrice.prices[currency]) {
          throw new Error(`Price not available for ${currency}`);
        }

        const pricePerToken = tokenPrice.prices[currency];

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
