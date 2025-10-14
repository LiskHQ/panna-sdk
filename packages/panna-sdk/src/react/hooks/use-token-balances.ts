import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { accountBalancesInFiat, isValidAddress } from 'src/core';
import { TokenBalance } from '@/mocks/token-balances';
import { getEnvironmentChain, getSupportedTokens } from '@/utils';
import {
  createDefaultRetryFn,
  DEFAULT_REFETCH_INTERVAL,
  DEFAULT_RETRY_DELAY,
  DEFAULT_STALE_TIME
} from './constants';
import { usePanna } from './use-panna';

type UseTokenBalancesParams = {
  address: string;
};

/**
 * Hook to retrieve token balances
 * @param params - Parameters for retrieving token balances
 * @returns React Query result with token balance data
 */
export function useTokenBalances(
  { address }: UseTokenBalancesParams,
  options?: Omit<UseQueryOptions<TokenBalance[]>, 'queryKey' | 'queryFn'>
) {
  const { client, chainId } = usePanna();
  const hasValidAddress = isValidAddress(address);

  return useQuery({
    queryKey: ['token-balances', address],
    queryFn: async (): Promise<TokenBalance[]> => {
      if (!client || !hasValidAddress) {
        throw new Error('Invalid query state');
      }

      const chain = getEnvironmentChain(chainId);
      const supportedTokens = getSupportedTokens(chainId);

      try {
        const tokenAddresses = supportedTokens.map((t) => t.address);

        const { tokenBalances } = await accountBalancesInFiat({
          address,
          client,
          chain,
          tokens: tokenAddresses
        });

        const fallbackIcon = supportedTokens[0]?.icon ?? '';
        const symbolToIcon = supportedTokens.reduce<Record<string, string>>(
          (acc, t) => {
            if (t.symbol) acc[t.symbol] = t.icon ?? fallbackIcon;
            return acc;
          },
          {}
        );

        const balancesWithIcons: TokenBalance[] = tokenBalances.map((b) => ({
          ...b,
          token: {
            ...b.token,
            icon: symbolToIcon[b.token.symbol] ?? fallbackIcon
          }
        }));

        return balancesWithIcons;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: DEFAULT_REFETCH_INTERVAL,
    retry: createDefaultRetryFn(!!client, hasValidAddress),
    retryDelay: DEFAULT_RETRY_DELAY,
    ...options
  });
}
