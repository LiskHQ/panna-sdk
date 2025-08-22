import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { Chain } from 'thirdweb';
import type { FiatCurrency } from '../../core/utils/types';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  createDefaultRetryFn
} from './constants';
import { usePanna } from './use-panna';

type UseCryptoToFiatParams = {
  chain?: Chain;
  tokenAddress?: string;
  cryptoAmount: number;
  currency?: FiatCurrency;
};

type CryptoToFiatResult = {
  price: number;
  currency: FiatCurrency;
};

/**
 * Hook to convert crypto amount to fiat price
 * @param params - Parameters for crypto to fiat conversion
 * @returns React Query result with fiat price data
 */
export function useCryptoToFiat(
  {
    chain,
    tokenAddress,
    cryptoAmount,
    currency = 'USD'
  }: UseCryptoToFiatParams,
  options?: Omit<UseQueryOptions<CryptoToFiatResult>, 'queryKey' | 'queryFn'>
) {
  const { client } = usePanna();
  const hasValidAmount = cryptoAmount > 0;

  return useQuery({
    queryKey: [
      'crypto-to-fiat',
      chain?.id,
      tokenAddress,
      cryptoAmount,
      currency
    ],
    queryFn: async (): Promise<CryptoToFiatResult> => {
      if (!hasValidAmount) {
        throw new Error('Invalid query state');
      }

      // Mock implementation - replace with actual conversion when ready
      // Simulate different exchange rates for different tokens
      let mockPrice = 3000; // Default price (e.g., for ETH in USD)

      if (tokenAddress) {
        // Mock different prices for different tokens
        const addressHash = tokenAddress.slice(-4);
        const hashNum = parseInt(addressHash, 16);
        mockPrice = (hashNum % 10000) + 100; // Random price between $100 and $10,100
      }

      const fiatValue = cryptoAmount * mockPrice;

      return {
        price: fiatValue,
        currency
      };
    },
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, hasValidAmount),
    retryDelay: DEFAULT_RETRY_DELAY,
    enabled: hasValidAmount,
    ...options
  });
}
