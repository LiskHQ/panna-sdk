import { NATIVE_TOKEN_ADDRESS } from 'thirdweb';
import { convertCryptoToFiat } from 'thirdweb/pay';
import { getWalletBalance } from 'thirdweb/wallets';
import { getSocialIcon as thirdwebGetSocialIcon } from 'thirdweb/wallets/in-app';
import { lisk } from '../chains/chain-definitions/lisk';
import {
  type AccountBalanceParams,
  type AccountBalanceResult,
  type GetFiatPriceParams,
  type GetFiatPriceResult,
  type SocialProvider
} from './types';

/**
 * Get the balance of an account
 * @param params - Parameters for getting account balance
 * @returns Account balance information
 */
export async function accountBalance(
  params: AccountBalanceParams
): Promise<AccountBalanceResult> {
  const result = await getWalletBalance({
    address: params.address,
    client: params.client,
    chain: params.chain,
    tokenAddress: params.tokenAddress
  });

  return {
    value: result.value,
    decimals: result.decimals,
    symbol: result.symbol,
    name: result.name,
    displayValue: result.displayValue
  };
}

/**
 * Get the icon URI for a social authentication provider
 * @param provider - The social provider name
 * @returns The icon URI string
 */
export function getSocialIcon(provider: SocialProvider): string {
  return thirdwebGetSocialIcon(provider);
}

/**
 * Get the fiat value for a specific amount of tokens
 * @param params - Parameters for getting the fiat price
 * @returns An object containing the price and currency
 * @example
 * ```ts
 * // Get value of 1 ETH (defaults to USD)
 * const result = await getFiatPrice({
 *   client: pannaClient,
 *   amount: 1
 * });
 * // result: { price: 3000.50, currency: 'USD' }
 *
 * // Get value of 100 ERC20 tokens in EUR
 * const result = await getFiatPrice({
 *   client: pannaClient,
 *   chain: customChain,
 *   tokenAddress: '0x...',
 *   amount: 100,
 *   currency: 'EUR'
 * });
 * // result: { price: 105.00, currency: 'EUR' }
 * ```
 */
export async function getFiatPrice(
  params: GetFiatPriceParams
): Promise<GetFiatPriceResult> {
  if (!params.client) {
    throw new Error('Client is required for getFiatPrice');
  }

  const result = await convertCryptoToFiat({
    client: params.client,
    fromTokenAddress: params.tokenAddress || NATIVE_TOKEN_ADDRESS,
    fromAmount: params.amount,
    chain: params.chain || lisk,
    to: params.currency || 'USD'
  });

  return {
    price: result.result,
    currency: params.currency || 'USD'
  };
}
