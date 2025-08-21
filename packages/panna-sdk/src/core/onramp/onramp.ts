import { getCountry } from 'iso-3166-1-alpha-2';
import { Bridge } from 'thirdweb';
import { lisk } from '../chains';
import { COUNTRY_PROVIDER_MAP, PROVIDERS } from './constants';
import type {
  GetTokenFiatPricesParams,
  OnRampIntent,
  OnrampPrepareParams,
  OnrampPrepareResult,
  OnrampProvider,
  OnrampStatusParams,
  OnrampStatusResult,
  ProviderInfo,
  TokenFiatPrice
} from './types';

/**
 * Retrieves the status of an Onramp session created via prepareOnRamp
 *
 * The status will include any on-chain transactions that have occurred as a result
 * of the onramp as well as any arbitrary purchaseData that was supplied when the
 * onramp was prepared. This function allows you to track the progress of a fiat-to-crypto
 * onramp transaction from creation through completion.
 *
 * @param params - Parameters for retrieving the onramp status
 * @param params.id - The onramp session identifier (UUID returned from prepareOnRamp)
 * @param params.client - The Panna client instance used for authentication
 * @returns Promise resolving to the onramp status with transaction details and purchase data
 * @throws Error if the session ID is invalid, client is unauthorized, or network request fails
 *
 * @example
 * ```ts
 * // Check the status of an onramp session
 * const status = await onRampStatus({
 *   id: "022218cc-96af-4291-b90c-dadcb47571ec",
 *   client: pannaClient
 * });
 *
 * // Handle different status types
 * switch (status.status) {
 *   case 'CREATED':
 *     console.log('Onramp session created, waiting for payment');
 *     // status.transactions: [] (empty)
 *     // status.purchaseData: { sessionId: "abc", metadata: {...} }
 *     break;
 *
 *   case 'PENDING':
 *     console.log('Payment received, processing onramp...');
 *     // status.transactions: [] (empty)
 *     // status.purchaseData: { sessionId: "abc", amount: 100 }
 *     break;
 *
 *   case 'COMPLETED':
 *     console.log('Onramp completed successfully!');
 *     console.log('Transactions:', status.transactions);
 *     // status.transactions: [{ chainId: 1, transactionHash: "0x..." }, ...]
 *     // status.purchaseData: { sessionId: "abc", completedAt: "2024-01-15T10:30:00Z" }
 *     break;
 * }
 * ```
 */
export async function onRampStatus(
  params: OnrampStatusParams
): Promise<OnrampStatusResult> {
  const { id, client } = params;

  try {
    const result = await Bridge.Onramp.status({
      id,
      client
    });

    return result as OnrampStatusResult;
  } catch (error) {
    // Re-throw with more context
    throw new Error(
      `Failed to get onramp status for session ${id}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Prepares an onramp session for a fiat-to-crypto transaction
 *
 * This function creates a new onramp session that can be used to track the progress
 * of a fiat-to-crypto onramp transaction from creation through completion.
 *
 * @param params - Parameters for preparing the onramp
 * @param params.client - The Panna client instance used for authentication
 * @param params.chainId - The chain ID of the token being purchased
 * @param params.tokenAddress - The address of the token being purchased
 * @param params.receiver - The address of the receiver of the token
 * @param params.amount - The amount of the token being purchased
 * @param params.purchaseData - Additional data to be stored with the onramp session
 * @param params.onramp - The onramp provider to use
 * @returns Promise resolving to the onramp session identifier
 * @throws Error if the onramp session cannot be prepared
 *
 * @example
 * ```ts
 * // Prepare an onramp session for a fiat-to-crypto transaction
 * const onramp = await onRampPrepare({
 *   client: pannaClient,
 *   chainId: 1,
 *   tokenAddress: '0x0000000000000000000000000000000000000000',
 *   receiver: '0x0000000000000000000000000000000000000000',
 *   amount: '100',
 *   purchaseData: { sessionId: '123' },
 *   onramp: 'stripe'
 * });
 * ```
 */
export async function onRampPrepare(
  params: OnrampPrepareParams
): Promise<OnrampPrepareResult> {
  const {
    client,
    chainId,
    tokenAddress,
    receiver,
    amount,
    purchaseData,
    onRampProvider
  } = params;

  try {
    // TODO: incase of providers outside thirdweb, we need to handle the result differently
    const result = await Bridge.Onramp.prepare({
      client,
      chainId: chainId || lisk.id,
      onramp: onRampProvider,
      tokenAddress,
      receiver,
      amount: BigInt(amount),
      purchaseData,
      country: 'US'
    });
    let intent: OnRampIntent | undefined = result.intent
      ? {
          amount: result.intent.amount || '0',
          chainId: result.intent.chainId,
          onRampProvider: result.intent.onramp,
          receiver: result.intent.receiver,
          tokenAddress: result.intent.tokenAddress
        }
      : undefined;

    return {
      currency: result.currency,
      currencyAmount: result.currencyAmount.toString(),
      destinationAmount: result.destinationAmount.toString(),
      expiration: result.expiration,
      id: result.id,
      link: result.link,
      timestamp: result.timestamp,
      intent
    };
  } catch (error) {
    throw new Error(
      `Failed to prepare onramp: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get available onramp providers for a given country code.
 * @param countryCode - ISO 3166-1 alpha-2 code (e.g., "US", "IN")
 * @returns List of providers available in that country
 * @throws Error when the provided country code does not match ISO 3166-1 alpha-2 standards
 * @example
 * ```
 * const germanyProviders = getOnrampProviders("DE");
 * [
 *  { id: 'transak', displayName: 'Transak', websiteUrl: 'https://www.transak.com' },
 *  { id: 'stripe', displayName: 'Stripe', websiteUrl: 'https://www.stripe.com' },
 *  { id: 'coinbase', displayName: 'Coinbase', websiteUrl: 'https://www.coinbase.com' }
 * ]
 * ```
 */
export function getOnrampProviders(countryCode: string): ProviderInfo[] {
  const normalizedCountryCode = countryCode.toUpperCase();

  // Returns undefined when country code is invalid
  if (!getCountry(normalizedCountryCode)) {
    throw new Error(`Invalid country code: ${countryCode}`);
  }

  const providers: OnrampProvider[] =
    COUNTRY_PROVIDER_MAP[normalizedCountryCode] || [];
  return providers.map((provider) => PROVIDERS[provider]);
}

/**
 * Fetches fiat prices for a specific token or all tokens on a given chain
 *
 * @param params - Parameters for fetching token fiat prices
 * @param params.chainId - The chain ID of the token
 * @param params.tokenAddress - The address of the token (optional) if not provided, fetches prices for all tokens on the chain
 * @param params.client - The Panna client instance used for authentication
 * @returns Promise resolving to the token fiat prices
 * @throws Error if the token address is invalid or network request fails
 *
 * @example
 * ```ts
 * // Get fiat prices for a specific token
 * const prices = await getTokenFiatPrices({
 *   chainId: 1,
 *   tokenAddress: '0x0000000000000000000000000000000000000000',
 *   client: pannaClient
 * });
 * // Get fiat prices for all tokens on a chain
 * const allPrices = await getTokenFiatPrices({
 *   chainId: 1,
 *   client: pannaClient
 * });
 * // Prices will be an array of objects with token details and fiat values
 * // Example structure:
 * * [
 *   {
 *     chainId: 1,
 *     address: '0x0000000000000000000000000000000000000000',
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
 *     address: '0x0000000000000000000000000000000000000001',
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
