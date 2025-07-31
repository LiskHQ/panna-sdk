import { NATIVE_TOKEN_ADDRESS } from 'thirdweb';
import { convertCryptoToFiat } from 'thirdweb/pay';
import { getWalletBalance } from 'thirdweb/wallets';
import { getSocialIcon as thirdwebGetSocialIcon } from 'thirdweb/wallets/in-app';
import { DEFAULT_CHAIN, DEFAULT_CURRENCY } from '../defaults';
import {
  type AccountBalanceParams,
  type AccountBalanceResult,
  type AccountBalanceInFiatParams,
  type AccountBalanceInFiatResult,
  type AccountBalancesInFiatParams,
  type AccountBalancesInFiatResult,
  type GetFiatPriceParams,
  type GetFiatPriceResult,
  type SocialProvider,
  type TokenBalanceError
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
    chain: params.chain || DEFAULT_CHAIN,
    to: params.currency || DEFAULT_CURRENCY
  });

  return {
    price: result.result,
    currency: params.currency || DEFAULT_CURRENCY
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
    chain: params.chain || DEFAULT_CHAIN,
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

/**
 * Get the total fiat value of multiple tokens and individual token balances
 * @param params - Parameters for getting multiple account balances
 * @returns Total value and individual token balances with fiat values, plus any errors
 * @throws Error if address is invalid
 * @example
 * ```ts
 * // Get portfolio value for multiple tokens
 * const result = await accountBalancesInFiat({
 *   client: pannaClient,
 *   address: '0x...',
 *   chain: lisk,
 *   tokens: [
 *     {}, // Native token
 *     { address: '0x...' }, // USDC
 *     { address: '0x...' }  // DAI
 *   ],
 *   currency: 'USD'
 * });
 * // result: {
 * //   totalValue: { amount: 5250.75, currency: 'USD' },
 * //   tokenBalances: [...],
 * //   errors: [{ token: { address: '0x...' }, error: 'Failed to get balance...' }]
 * // }
 * ```
 */
export async function accountBalancesInFiat(
  params: AccountBalancesInFiatParams
): Promise<AccountBalancesInFiatResult> {
  if (!isValidAddress(params.address)) {
    throw new Error('Invalid address format');
  }

  const currency = params.currency || DEFAULT_CURRENCY;

  // Create array of promises for parallel execution with wrapped context
  const balancePromises = params.tokens.map((tokenInfo) => {
    // Validate token address upfront
    if (tokenInfo.address && !isValidAddress(tokenInfo.address)) {
      // Return a rejected promise wrapped with context
      return Promise.resolve({
        status: 'rejected' as const,
        tokenInfo,
        error: `Invalid token address format: ${tokenInfo.address}`
      });
    }

    // Return promise that captures the token info for error context
    return accountBalanceInFiat({
      address: params.address,
      client: params.client,
      chain: params.chain,
      tokenAddress: tokenInfo.address,
      currency: currency
    }).then(
      (result) => ({ status: 'fulfilled' as const, value: result, tokenInfo }),
      (error) => ({
        status: 'rejected' as const,
        tokenInfo,
        error: `Failed to get balance for ${tokenInfo.address || 'native token'}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      })
    );
  });

  // Execute all balance fetches in parallel with allSettled
  const results = await Promise.allSettled(balancePromises);

  // Separate successful and failed results
  const successfulBalances: AccountBalanceInFiatResult[] = [];
  const errors: TokenBalanceError[] = [];

  results.forEach((result) => {
    const wrappedResult = (
      result as PromiseFulfilledResult<
        | {
            status: 'fulfilled';
            value: AccountBalanceInFiatResult;
            tokenInfo: { address?: string };
          }
        | { status: 'rejected'; tokenInfo: { address?: string }; error: string }
      >
    ).value;
    if (wrappedResult.status === 'fulfilled') {
      successfulBalances.push(wrappedResult.value);
    } else {
      // This was our pre-validation rejection or API failure
      errors.push({
        token: wrappedResult.tokenInfo,
        error: wrappedResult.error
      });
    }
  });

  // Calculate total value from successful balances only
  const totalValue = successfulBalances.reduce(
    (sum, balance) => sum + balance.fiatBalance.amount,
    0
  );

  const result: AccountBalancesInFiatResult = {
    totalValue: {
      amount: totalValue,
      currency: currency
    },
    tokenBalances: successfulBalances
  };

  // Only add errors property if there are errors
  if (errors.length > 0) {
    result.errors = errors;
  }

  return result;
}
