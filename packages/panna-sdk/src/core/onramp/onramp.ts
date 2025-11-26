import { getCountry } from 'iso-3166-1-alpha-2';
import { Bridge } from 'thirdweb';
import type { TokenFiatPrice } from '../util/types';
import { COUNTRY_PROVIDER_MAP, PROVIDERS } from './constants';
import type {
  GetTokenFiatPricesParams,
  ProviderId,
  ProviderInfo
} from './types';

/**
 * Get available onramp providers for a given country code.
 * @param countryCode - ISO 3166-1 alpha-2 code (e.g., "US", "IN")
 * @returns List of providers available in that country
 * @throws Error when the provided country code does not match ISO 3166-1 alpha-2 standards
 * @example
 * ```ts
 * import { onramp } from 'panna-sdk';
 *
 * const germanyProviders = onramp.getOnrampProviders("DE");
 * // Returns:
 * // [
 * //  { id: 'transak', displayName: 'Transak', websiteUrl: 'https://www.transak.com' },
 * //  { id: 'stripe', displayName: 'Stripe', websiteUrl: 'https://www.stripe.com' },
 * //  { id: 'coinbase', displayName: 'Coinbase', websiteUrl: 'https://www.coinbase.com' }
 * // ]
 * ```
 */
export function getOnrampProviders(countryCode: string): ProviderInfo[] {
  const normalizedCountryCode = countryCode.toUpperCase();

  // Returns undefined when country code is invalid
  if (!getCountry(normalizedCountryCode)) {
    throw new Error(`Invalid country code: ${countryCode}`);
  }

  const mappedProviders = COUNTRY_PROVIDER_MAP[normalizedCountryCode] || [];

  const providers = new Set<ProviderId>(mappedProviders);

  // Explicitly add Onramp.money
  // TODO: In future restrict by https://docs.onramp.money/onramp/supported-assets-and-fiat/fiat-currencies
  providers.add(PROVIDERS.onrampmoney.id);

  return Array.from(providers).map((provider) => PROVIDERS[provider]);
}

/**
 * Fetches fiat prices for a specific token or all tokens on a given chain
 *
 * @param params - Parameters for fetching token fiat prices
 * @param params.chainId - The chain ID of the token
 * @param params.tokenAddress - (Optional) The address of the token to fetch the prices for. (Default: Fetches prices for all the tokens on the chain)
 * @param params.client - The Panna client instance used for authentication
 * @returns Promise resolving to the token fiat prices
 * @throws Error if the token address is invalid or network request fails
 *
 * @example
 * ```ts
 * import { onramp, NATIVE_TOKEN_ADDRESS } from 'panna-sdk';
 *
 * // Get fiat prices for a specific token (native ETH)
 * const prices = await onramp.getTokenFiatPrices({
 *   chainId: 1,
 *   tokenAddress: NATIVE_TOKEN_ADDRESS,
 *   client: pannaClient
 * });
 * // Get fiat prices for all tokens on a chain
 * const allPrices = await onramp.getTokenFiatPrices({
 *   chainId: 1,
 *   client: pannaClient
 * });
 * // Prices will be an array of objects with token details and fiat values
 * // Example structure:
 * [
 *   {
 *     chainId: 1,
 *     address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // NATIVE_TOKEN_ADDRESS
 *     symbol: 'ETH',
 *     name: 'Ethereum',
 *     decimals: 18,
 *     iconUri: 'https://example.com/eth.png',
 *     prices: {
 *       USD: 3000,
 *       EUR: 2500
 *     }
 *   },
 *   {
 *     chainId: 1,
 *     address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT contract address
 *     symbol: 'USDT',
 *     name: 'Tether',
 *     decimals: 6,
 *     iconUri: 'https://example.com/usdt.png',
 *     prices: {
 *       USD: 1,
 *       EUR: 0.85
 *     }
 *   }
 * ]
 */
export async function getTokenFiatPrices(
  params: GetTokenFiatPricesParams
): Promise<TokenFiatPrice[]> {
  const { chainId, tokenAddress, client } = params;

  return Bridge.tokens({
    chainId,
    tokenAddress,
    client
  });
}
