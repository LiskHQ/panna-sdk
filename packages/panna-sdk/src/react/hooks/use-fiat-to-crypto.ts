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
      if (!hasValidAmount) {
        throw new Error('Invalid query state');
      }

      // Mock implementation - replace with actual conversion when ready
      // Simulate different exchange rates for different tokens
      let mockRate = 0.00033; // Default rate (e.g., for ETH)

      if (tokenAddress) {
        // Mock different rates for different tokens
        const addressHash = tokenAddress.slice(-4);
        const hashNum = parseInt(addressHash, 16);
        mockRate = (hashNum % 1000) / 1000000; // Random rate between 0.000001 and 0.001
      }

      const cryptoAmount = fiatAmount * mockRate;

      return {
        amount: cryptoAmount, // Return as display units (e.g., 0.033 ETH)
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
