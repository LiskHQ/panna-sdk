import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getOnrampProviders, onRampPrepare } from '../../core/onramp';
import type {
  ProviderInfo,
  OnrampPrepareResult
} from '../../core/onramp/types';
import {
  DEFAULT_STALE_TIME,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  createDefaultRetryFn
} from './constants';
import { usePanna } from './use-panna';

type UseOnrampProvidersParams = {
  countryCode: string;
  tokenAddress?: string;
  amount?: string;
  receiver?: string;
};

type EnrichedProviderInfo = ProviderInfo & {
  prepareResult?: OnrampPrepareResult;
  price?: string;
  isLoading?: boolean;
  error?: string;
};

/**
 * Hook to retrieve onramp providers for a specific country with pricing information
 * @param params - Parameters for retrieving onramp providers
 * @returns React Query result with enriched onramp providers data
 */
export function useOnrampProviders(
  { countryCode, tokenAddress, amount, receiver }: UseOnrampProvidersParams,
  options?: Omit<
    UseQueryOptions<EnrichedProviderInfo[]>,
    'queryKey' | 'queryFn'
  >
) {
  const { client } = usePanna();
  const hasValidCountryCode = Boolean(countryCode);
  const canEnrich = Boolean(client && tokenAddress && amount && receiver);

  return useQuery({
    queryKey: ['onramp-providers', countryCode, tokenAddress, amount, receiver],
    queryFn: async (): Promise<EnrichedProviderInfo[]> => {
      if (!hasValidCountryCode) {
        throw new Error('Invalid country code');
      }

      try {
        const providers = getOnrampProviders(countryCode);

        // If we don't have enrichment parameters, return basic provider info
        if (!canEnrich) {
          return providers.map((provider) => ({ ...provider }));
        }

        // Enrich each provider with pricing data from onRampPrepare
        const enrichedProviders = await Promise.allSettled(
          providers.map(async (provider): Promise<EnrichedProviderInfo> => {
            try {
              const prepareResult = await onRampPrepare({
                client: client!,
                onRampProvider: provider.id,
                tokenAddress: tokenAddress!,
                receiver: receiver!,
                amount: amount!,
                country: countryCode
              });

              return {
                ...provider,
                prepareResult,
                price: `$${parseFloat(prepareResult.currencyAmount).toFixed(2)}`
              };
            } catch (error) {
              console.warn(
                `Failed to get pricing for provider ${provider.id}:`,
                error
              );
              return {
                ...provider,
                error: error instanceof Error ? error.message : 'Unknown error',
                price: 'N/A'
              };
            }
          })
        );

        // Extract successful results and failed ones
        return enrichedProviders.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            return {
              ...providers[index],
              error: result.reason?.message || 'Failed to load pricing',
              price: 'N/A'
            };
          }
        });
      } catch (error) {
        console.error('Error fetching onramp providers:', error);
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
