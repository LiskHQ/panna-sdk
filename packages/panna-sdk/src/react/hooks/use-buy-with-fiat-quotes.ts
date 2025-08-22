import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getOnrampProviders, onRampPrepare } from '../../core/onramp';
import type { BuyWithFiatQuote } from '../types/buy-with-fiat-quote.types';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  createDefaultRetryFn
} from './constants';
import { usePanna } from './use-panna';

type UseBuyWithFiatQuotesParams = {
  countryCode: string;
  tokenAddress?: string;
  amount?: string;
  receiver?: string;
};

/**
 * Hook to retrieve buy with fiat quotes for a specific country with pricing information
 * @param params - Parameters for retrieving buy with fiat quotes
 * @returns React Query result with buy with fiat quotes data
 */
export function useBuyWithFiatQuotes(
  { countryCode, tokenAddress, amount, receiver }: UseBuyWithFiatQuotesParams,
  options?: Omit<UseQueryOptions<BuyWithFiatQuote[]>, 'queryKey' | 'queryFn'>
) {
  const { client } = usePanna();
  const hasValidCountryCode = Boolean(countryCode);
  const canEnrich = Boolean(client && tokenAddress && amount && receiver);

  return useQuery({
    queryKey: [
      'buy-with-fiat-quotes',
      countryCode,
      tokenAddress,
      amount,
      receiver
    ],
    queryFn: async (): Promise<BuyWithFiatQuote[]> => {
      if (!hasValidCountryCode) {
        throw new Error('Invalid country code');
      }

      try {
        const providers = getOnrampProviders(countryCode);

        // If we don't have enrichment parameters, return basic quotes
        if (!canEnrich) {
          return providers.map(
            (provider): BuyWithFiatQuote => ({
              providerId: provider.id,
              providerName: provider.displayName,
              providerDescription: provider.description,
              providerLogoUrl: provider.logoUrl,
              price: 'Loading...'
            })
          );
        }

        // Enrich each provider with pricing data from onRampPrepare
        const enrichedQuotes = await Promise.allSettled(
          providers.map(async (provider): Promise<BuyWithFiatQuote> => {
            try {
              // Convert decimal amount to smallest units (wei-like) for onRampPrepare
              // The amount comes as display units (e.g., 0.033 ETH) but onRampPrepare expects smallest units
              const decimals = 18; // Most ERC-20 tokens use 18 decimals
              const amountInSmallestUnits = Math.floor(
                parseFloat(amount!) * Math.pow(10, decimals)
              );

              const prepareResult = await onRampPrepare({
                client: client!,
                onRampProvider: provider.id,
                tokenAddress: tokenAddress!,
                receiver: receiver!,
                amount: amountInSmallestUnits.toString(), // Convert to string for BigInt conversion
                country: countryCode
              });

              return {
                providerId: provider.id,
                providerName: provider.displayName,
                providerDescription: provider.description,
                providerLogoUrl: provider.logoUrl,
                prepareResult,
                price: `$${parseFloat(prepareResult.currencyAmount).toFixed(2)}`
              };
            } catch (error) {
              console.warn(
                `Failed to get pricing for provider ${provider.id}:`,
                error
              );
              return {
                providerId: provider.id,
                providerName: provider.displayName,
                providerDescription: provider.description,
                providerLogoUrl: provider.logoUrl,
                error: error instanceof Error ? error.message : 'Unknown error',
                price: 'N/A'
              };
            }
          })
        );

        // Extract successful results and failed ones
        return enrichedQuotes.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            const provider = providers[index];
            return {
              providerId: provider.id,
              providerName: provider.displayName,
              providerDescription: provider.description,
              providerLogoUrl: provider.logoUrl,
              error: result.reason?.message || 'Failed to load pricing',
              price: 'N/A'
            };
          }
        });
      } catch (error) {
        console.error('Error fetching buy with fiat quotes:', error);
        throw error;
      }
    },
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, hasValidCountryCode),
    retryDelay: DEFAULT_RETRY_DELAY,
    enabled: hasValidCountryCode,
    ...options
  });
}
