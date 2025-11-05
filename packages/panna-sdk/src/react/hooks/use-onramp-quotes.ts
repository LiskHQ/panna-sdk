import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
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

export function useOnrampQuotes(
  params: UseOnrampQuotesParams
): UseQueryResult<QuoteData, Error> {
  const { tokenSymbol, network, fiatAmount, fiatCurrency } = params;

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
    enabled: hasValidParams,
    staleTime: FIFTEEN_MINUTES_MS,
    gcTime: FIFTEEN_MINUTES_MS,
    retry: 3
  });
}
