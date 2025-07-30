import { NATIVE_TOKEN_ADDRESS } from 'thirdweb';
import { convertCryptoToFiat } from 'thirdweb/pay';
import { getWalletBalance } from 'thirdweb/wallets';
import { getSocialIcon as thirdwebGetSocialIcon } from 'thirdweb/wallets/in-app';
import { lisk } from '../chains/chain-definitions/lisk';
import {
  type AccountBalanceParams,
  type AccountBalanceResult,
  type AccountBalanceInFiatParams,
  type AccountBalanceInFiatResult,
  type GetFiatPriceParams,
  type GetFiatPriceResult,
  type SocialProvider
} from './types';

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns true if valid, false otherwise
 * @example
 * ```ts
 * isValidAddress('0x1234567890123456789012345678901234567890'); // true
 * isValidAddress('0x123'); // false
 * isValidAddress('not an address'); // false
 * ```
 */
export const isValidAddress = function (address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Get the balance of an account
 * @param params - Parameters for getting account balance
 * @returns Account balance information
 * @throws Error if address or token address are invalid
 */
export const accountBalance = async function (
  params: AccountBalanceParams
): Promise<AccountBalanceResult> {
  if (!isValidAddress(params.address)) {
    throw new Error('Invalid address format');
  }

  if (params.tokenAddress && !isValidAddress(params.tokenAddress)) {
    throw new Error('Invalid token address format');
  }

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
};

/**
 * Get the icon URI for a social authentication provider
 * @param provider - The social provider name
 * @returns The icon URI string
 */
export const getSocialIcon = function (provider: SocialProvider): string {
  return thirdwebGetSocialIcon(provider);
};

/**
 * Get the fiat value for a specific amount of tokens
 * @param params - Parameters for getting the fiat price
 * @returns An object containing the price and currency
 * @throws Error if token address is invalid or client is not provided
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
export const getFiatPrice = async function (
  params: GetFiatPriceParams
): Promise<GetFiatPriceResult> {
  if (!params.client) {
    throw new Error('Client is required for getFiatPrice');
  }

  if (params.tokenAddress && !isValidAddress(params.tokenAddress)) {
    throw new Error('Invalid token address format');
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
};

/**
 * Get the fiat balance of an account
 * @param params - Parameters for getting account balance
 * @param params.address - The address for which to retrieve the balance.
 * @param params.client - The Panna client to use for the request.
 * @param params.chain - (Optional) The chain for which to retrieve the balance. If not provided, it will default to Lisk Mainnet.
 * @param params.tokenAddress - (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
 * @param params.currency - (Optional) The currency in which the fiat value is determined. If not provided, the fiat value will be returned in USD.
 * @returns Account balance information
 * @throws Error if address or token address are invalid
 * @example
 * ```ts
 * // Get value for the specified user's native token balance in USD
 * const result = await accountBalanceInFiat({
 *   address: userAddress,
 *   client: pannaClient,
 *   chain: customChain,
 * });
 * // result: {
 * //   token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
 * //   tokenBalance: { value: BigInt(10e11), displayValue: '0.0000001' },
 * //   fiatBalance: { amount: 0.0003, currency: 'USD' }
 * // }
 *
 * // Get value for the specified user's ERC20 token balance in EUR
 * const result = await accountBalanceInFiat({
 *   address: userAddress,
 *   client: pannaClient,
 *   chain: customChain,
 *   tokenAddress: '0x...',
 *   currency: 'EUR'
 * });
 * // result: {
 * //   token: { symbol: 'USDC.e', name: 'USD Coin', decimals: 6 },
 * //   tokenBalance: { value: BigInt('100000132'), displayValue: '100.000132' },
 * //   fiatBalance: { amount: 86.7, currency: 'EUR' }
 * // }
 * ```
 */
export const accountBalanceInFiat = async function (
  params: AccountBalanceInFiatParams
): Promise<AccountBalanceInFiatResult> {
  if (!isValidAddress(params.address)) {
    throw new Error('Invalid address format');
  }

  if (params.tokenAddress && !isValidAddress(params.tokenAddress)) {
    throw new Error('Invalid token address format');
  }

  const tokenBalance = await accountBalance({
    address: params.address,
    client: params.client,
    chain: params.chain || lisk,
    tokenAddress: params.tokenAddress
  });

  const fiatBalance = await getFiatPrice({
    client: params.client,
    chain: params.chain,
    tokenAddress: params.tokenAddress,
    amount: Number(tokenBalance.displayValue),
    currency: params.currency
  });

  const result: AccountBalanceInFiatResult = {
    token: {
      address: params.tokenAddress,
      symbol: tokenBalance.symbol,
      name: tokenBalance.name,
      decimals: tokenBalance.decimals
    },
    tokenBalance: {
      value: tokenBalance.value,
      displayValue: tokenBalance.displayValue
    },
    fiatBalance: {
      amount: fiatBalance.price,
      currency: fiatBalance.currency
    }
  };

  return result;
};
