import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { getValidSiweAuthToken } from '../../core/auth';
import { pannaApiService } from '../../core/util/api-service';
import type { QuoteData } from '../types/onramp-quote.types';

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

type UseOnrampQuotesParams = {
  tokenSymbol: string;
  network: string;
  fiatAmount: number;
  fiatCurrency: string;
};

/**
 * Hook to fetch onramp quotes for fiat-to-crypto purchases.
 *
 * This hook retrieves quote data from the Panna API backend including exchange rates,
 * fees, and the estimated crypto quantity the user will receive.
 *
 * @param params - Quote request parameters
 * @param params.tokenSymbol - The cryptocurrency symbol (e.g., 'USDC', 'ETH')
 * @param params.network - The blockchain network name (e.g., 'lisk', 'ethereum')
 * @param params.fiatAmount - The fiat amount to purchase (must be positive)
 * @param params.fiatCurrency - The fiat currency code (e.g., 'USD', 'EUR')
 *
 * @returns React Query result containing quote data, loading state, and error information
 *
 * @example
 * ```tsx
 * const { data: quote, isLoading, error } = useOnrampQuotes({
 *   tokenSymbol: 'USDC',
 *   network: 'lisk',
 *   fiatAmount: 100,
 *   fiatCurrency: 'USD'
 * });
 * ```
 */
export function useOnrampQuotes(
  params: UseOnrampQuotesParams
): UseQueryResult<QuoteData, Error> {
  const { tokenSymbol, network, fiatAmount, fiatCurrency } = params;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status before enabling the query
  useEffect(() => {
    let mounted = true;

    getValidSiweAuthToken().then((token) => {
      if (mounted) {
        setIsAuthenticated(Boolean(token));
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const hasValidParams = useMemo(() => {
    return (
      Boolean(tokenSymbol) &&
      Boolean(network) &&
      typeof fiatAmount === 'number' &&
      !Number.isNaN(fiatAmount) &&
      fiatAmount > 0 &&
      Boolean(fiatCurrency)
    );
  }, [tokenSymbol, network, fiatAmount, fiatCurrency]);

  return useQuery<QuoteData, Error>({
    queryKey: ['onramp-quote', tokenSymbol, network, fiatAmount, fiatCurrency],
    queryFn: async () => {
      const authToken = await getValidSiweAuthToken();

      if (!authToken) {
        throw new Error('Missing authentication token for onramp quotes.');
      }

      return pannaApiService.getOnrampQuote(
        {
          tokenSymbol,
          network,
          fiatAmount,
          fiatCurrency
        },
        authToken
      );
    },
    enabled: hasValidParams && isAuthenticated,
    staleTime: FIFTEEN_MINUTES_MS,
    gcTime: FIFTEEN_MINUTES_MS,
    retry: (failureCount, error) => {
      // Don't retry if it's an authentication error
      if (error.message.includes('authentication token')) {
        return false;
      }
      return failureCount < 3;
    }
  });
}
