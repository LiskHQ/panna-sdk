import { Bridge } from 'thirdweb';
import { convertCryptoToFiat } from 'thirdweb/pay';
import { toWei as thirdwebToWei } from 'thirdweb/utils';
import { getWalletBalance } from 'thirdweb/wallets';
import { getSocialIcon as thirdwebGetSocialIcon } from 'thirdweb/wallets/in-app';
import { lisk, liskSepolia } from '../chain';
import {
  DEFAULT_CHAIN,
  DEFAULT_CURRENCY,
  NATIVE_TOKEN_ADDRESS
} from '../defaults';
import { isValidAddress } from './common';
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
 * Converts the specified number of tokens to Wei (assumes 18 decimals like ETH).
 * This function works with any token that uses 18 decimal places (ETH standard).
 * @param tokens The number of tokens to convert (as string, e.g., "1.5").
 * @returns The converted value in Wei.
 * @example
 * ```ts
 * import { utils } from 'panna-sdk';
 *
 * const value = utils.toWei('1.5'); // 1500000000000000000n (1.5 ETH in wei)
 * const usdcValue = utils.toWei('100'); // Note: Only use for 18-decimal tokens!
 * ```
 */
export const toWei = function (tokens: string): bigint {
  return thirdwebToWei(tokens);
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
 * import { utils } from 'panna-sdk';
 *
 * // Get value of 1 ETH (defaults to USD)
 * const result = await utils.getFiatPrice({
 *   client: pannaClient,
 *   amount: 1
 * });
 * // result: { price: 3000.50, currency: 'USD' }
 *
 * // Get value of 100 ERC20 tokens in EUR
 * const result = await utils.getFiatPrice({
 *   client: pannaClient,
 *   chain: customChain,
 *   tokenAddress: '0x...',
 *   amount: 100,
 *   currency: utils.FiatCurrency.EUR
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
 * @returns Account fiat balance information
 * @throws Error if address or token address are invalid
 * @example
 * ```ts
 * import { utils } from 'panna-sdk';
 *
 * // Get value for the specified user's native token balance in USD
 * const result = await utils.accountBalanceInFiat({
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
 * const result = await utils.accountBalanceInFiat({
 *   address: userAddress,
 *   client: pannaClient,
 *   chain: customChain,
 *   tokenAddress: '0x...',
 *   currency: utils.FiatCurrency.EUR
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
 * import { utils, NATIVE_TOKEN_ADDRESS } from 'panna-sdk';
 *
 * // Get portfolio value for multiple tokens
 * const result = await utils.accountBalancesInFiat({
 *   client: pannaClient,
 *   address: '0x...',
 *   chain: lisk,
 *   tokens: [
 *     NATIVE_TOKEN_ADDRESS, // Native token
 *     '0x...', // USDC
 *     '0x...'  // DAI
 *   ],
 *   currency: utils.FiatCurrency.USD
 * });
 * // result: {
 * //   totalValue: { amount: 5250.75, currency: 'USD' },
 * //   tokenBalances: [
 * //     {
 * //       token: {
 * //         address: undefined, // Native token
 * //         symbol: 'ETH',
 * //         name: 'Ethereum',
 * //         decimals: 18
 * //       },
 * //       tokenBalance: {
 * //         value: 2000000000000000000n, // 2 ETH in wei
 * //         displayValue: '2.0'
 * //       },
 * //       fiatBalance: { amount: 3000.0, currency: 'USD' }
 * //     },
 * //     {
 * //       token: {
 * //         address: '0xA0b86a33E6417a8fdf77C4d0e6B9d6a66B5B8f78',
 * //         symbol: 'USDC',
 * //         name: 'USD Coin',
 * //         decimals: 6
 * //       },
 * //       tokenBalance: {
 * //         value: 2250750000n, // 2250.75 USDC
 * //         displayValue: '2250.75'
 * //       },
 * //       fiatBalance: { amount: 2250.75, currency: 'USD' }
 * //     }
 * //   ],
 * //   errors: [
 * //     {
 * //       token: { address: '0xInvalidToken123' },
 * //       error: 'Failed to get balance: Invalid token contract'
 * //     }
 * //   ]
 * // }
 * ```
 */
export const accountBalancesInFiat = async function (
  params: AccountBalancesInFiatParams
): Promise<AccountBalancesInFiatResult> {
  if (!isValidAddress(params.address)) {
    throw new Error('Invalid address format');
  }

  const currency = params.currency || DEFAULT_CURRENCY;
  const chain = params.chain || DEFAULT_CHAIN;

  // Create array of promises for parallel execution with wrapped context
  const balancePromises = params.tokens.map((tokenAddress) => {
    // Validate token address upfront (skip validation for native token address)
    if (
      tokenAddress !== NATIVE_TOKEN_ADDRESS &&
      !isValidAddress(tokenAddress)
    ) {
      // Return a rejected promise wrapped with context
      return Promise.resolve({
        status: 'rejected' as const,
        tokenAddress,
        error: `Invalid token address format: ${tokenAddress}`
      });
    }

    // Convert native token address to undefined for the API call
    const apiTokenAddress =
      tokenAddress === NATIVE_TOKEN_ADDRESS ? undefined : tokenAddress;

    // Return promise that captures the token address for error context
    return accountBalance({
      address: params.address,
      client: params.client,
      chain: chain,
      tokenAddress: apiTokenAddress
    }).then(
      (result) => ({
        status: 'fulfilled' as const,
        value: result,
        tokenAddress
      }),
      (error) => ({
        status: 'rejected' as const,
        tokenAddress,
        error: `Failed to get balance for ${tokenAddress === NATIVE_TOKEN_ADDRESS ? 'native token' : tokenAddress}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      })
    );
  });

  // Execute all balance fetches in parallel with allSettled
  const results = await Promise.allSettled(balancePromises);

  // Separate successful and failed results
  const successfulBalances: AccountBalanceResult[] = [];
  const errors: TokenBalanceError[] = [];

  results.forEach((result) => {
    const wrappedResult = (
      result as PromiseFulfilledResult<
        | {
            status: 'fulfilled';
            value: AccountBalanceResult;
            tokenAddress: string;
          }
        | { status: 'rejected'; tokenAddress: string; error: string }
      >
    ).value;
    if (wrappedResult.status === 'fulfilled') {
      successfulBalances.push(wrappedResult.value);
    } else {
      // This was our pre-validation rejection or API failure
      errors.push({
        token: { address: wrappedResult.tokenAddress },
        error: wrappedResult.error
      });
    }
  });

  // Get all token prices for lisk chain
  const allTokensPrices = await Bridge.tokens({
    chainId: chain.id === liskSepolia.id ? lisk.id : chain.id,
    client: params.client
  });

  // Calculate fiat values for successful balances
  if (successfulBalances.length === 0) {
    let result: AccountBalancesInFiatResult = {
      totalValue: { amount: 0, currency: currency },
      tokenBalances: []
    };
    // Only add errors property if there are errors
    if (errors.length > 0) {
      result.errors = errors;
    }
    return result;
  }
  let balances: AccountBalanceInFiatResult[] = [];

  successfulBalances.forEach((balance) => {
    const tokenPrice = allTokensPrices.find((token) => {
      if (balance.symbol === 'USDC.e' && token.symbol === 'USDC') {
        // Special case for mapping Lisk Bridged USDC.e mapping to USDC
        return true;
      }
      return token.symbol === balance.symbol;
    });
    let balanceWithFiat = {
      token: {
        symbol: balance.symbol,
        name: balance.name,
        decimals: balance.decimals
      },
      tokenBalance: {
        value: balance.value,
        displayValue: balance.displayValue
      },
      fiatBalance: {
        amount: 0, // Will be calculated below
        currency
      }
    };
    if (tokenPrice) {
      balanceWithFiat.fiatBalance.amount =
        (Number(balanceWithFiat.tokenBalance.value) *
          tokenPrice.prices[currency]) /
        10 ** balanceWithFiat.token.decimals;
      balances.push(balanceWithFiat);
    }
  });

  // Calculate total value from successful balances only
  const totalValue = balances.reduce(
    (sum, balance) => sum + balance.fiatBalance.amount,
    0
  );

  const result: AccountBalancesInFiatResult = {
    totalValue: {
      amount: totalValue,
      currency: currency
    },
    tokenBalances: balances
  };

  // Only add errors property if there are errors
  if (errors.length > 0) {
    result.errors = errors;
  }

  return result;
};

/**
 * Regex to extract numeric price from formatted currency strings
 *
 * Matches digits, decimal points, and minus signs while removing:
 * - Currency symbols ($, €, £, etc.)
 * - Thousands separators (commas, spaces)
 * - Any other non-numeric characters
 *
 * Examples:
 * - "$123.45" → "123.45"
 * - "€1,234.56" → "1234.56"
 * - "£-10.00" → "-10.00"
 * - "Loading..." → "" (empty, will become NaN)
 * - "N/A" → "" (empty, will become NaN)
 */
export const REGEX_EXTRACT_NUMERIC_PRICE = /[^\d.-]/g;

/**
 * Extract numeric value from a formatted price string
 * @param priceString - Formatted price string (e.g., "$123.45", "€1,234.56")
 * @returns Numeric value or Infinity if parsing fails
 */
export function extractNumericPrice(priceString: string): number {
  if (!priceString) return Infinity;

  const numericString = priceString.replace(REGEX_EXTRACT_NUMERIC_PRICE, '');
  const parsed = parseFloat(numericString);

  return isNaN(parsed) ? Infinity : parsed;
}

/**
 * Mapping of testnet token addresses to their mainnet equivalents, organized by chain ID.
 * This is used to resolve testnet addresses to mainnet addresses for price lookups,
 * since price data is only available on mainnet.
 *
 * The structure is: Record<testnetChainId, Record<testnetAddress, mainnetAddress>>
 * The same contract address can exist on multiple chains, so we nest by chainID first.
 *
 * Native ETH uses the same address (NATIVE_TOKEN_ADDRESS) across all chains and doesn't need mapping.
 *
 * Source: packages/panna-sdk/src/react/consts/token-config.ts
 */
export const TESTNET_TO_MAINNET_ADDRESS_MAP: Record<
  number,
  Record<string, string>
> = {
  [liskSepolia.id]: {
    // LSK token
    '0x8a21cf9ba08ae709d64cb25afaa951183ec9ff6d':
      '0xac485391eb2d7d88253a7f1ef18c37f4242d1a24',

    // USDT token
    '0xd26be7331edd458c7afa6d8b7fcb7a9e1bb68909':
      '0x05d032ac25d322df992303dca074ee7392c117b9',

    // USDC.e token (Bridged USDC)
    '0x0e82fddad51cc3ac12b69761c45bbcb9a2bf3c83':
      '0xf242275d3a6527d877f2c927a82d9b057609cc71'
  }
};

/**
 * Resolves a contract address to its mainnet equivalent for price lookups.
 * When on testnet (e.g., Lisk Sepolia), maps testnet addresses to mainnet addresses.
 * Native token addresses (0xeeee...) are already chain-agnostic and don't need mapping.
 *
 * @param address - The contract address to resolve
 * @param chainId - The chain ID where the address exists
 * @returns The resolved address (mainnet equivalent if testnet, original otherwise)
 */
export const resolveContractAddress = (
  address: string,
  chainId: number
): string => {
  // Return normalized address (lowercase)
  const normalizedAddress = address.toLowerCase();

  // Check if we have a mapping for this chain
  const chainMapping = TESTNET_TO_MAINNET_ADDRESS_MAP[chainId];
  if (chainMapping) {
    const mainnetAddress = chainMapping[normalizedAddress];
    return mainnetAddress || normalizedAddress;
  }

  return normalizedAddress;
};
