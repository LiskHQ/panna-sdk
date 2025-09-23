import { lisk, liskSepolia } from '../chains';
import { BASE_BLOCKSCOUT_URL, BASE_SEPOLIA_BLOCKSCOUT_URL } from './constants';

export const CACHE_KEY_TYPE = {
  activities: 'act',
  activities_next_page_params: 'act_params',
  transactions: 'tx',
  transactions_next_params: 'tx_params',
  token_transfers: 'tt',
  token_transfers_next_params: 'tt_params',
  internal_transactions: 'itx',
  internal_transactions_next_params: 'itx_params',
  collectibles: 'coll',
  collectibles_next_params: 'coll_params'
};

export const CHAIN_ID_API_URL_MAP: Record<number, string> = {
  [lisk.id]: BASE_BLOCKSCOUT_URL,
  [liskSepolia.id]: BASE_SEPOLIA_BLOCKSCOUT_URL
};

/**
 * Get the cache key for the provided address and type of data.
 * @param address - The address for which to retrieve the cache key.
 * @param chainID - Chain identifier.
 * @param type - The type of cached data.
 * @returns Cache key for the provided address and data type.
 * @example
 * ```ts
 * // Get the cache key for the specified user's transactions
 * const result = await getCacheKey('0xc0ffee254729296a45a3885639AC7E10F9d54979', 'transactions');
 * // result: '0xc0ffee254729296a45a3885639AC7E10F9d54979_'
 */
export const getCacheKey = (
  address: string,
  chainID: keyof typeof CHAIN_ID_API_URL_MAP,
  type: keyof typeof CACHE_KEY_TYPE
): string => `${address}_${chainID}_${CACHE_KEY_TYPE[type]}`;

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
 * Returns the base API URL for the specified chain identifier.
 * @param chainID Chain identifier.
 * @returns Base API URL for the specified chain identifier.
 */
export const getBaseApiUrl = (
  chainID: keyof typeof CHAIN_ID_API_URL_MAP
): string => CHAIN_ID_API_URL_MAP[chainID];

/**
 * Returns a query string constructed from the provided parameters.
 * @param params
 * @returns
 */
export const buildQueryString = (params: unknown): string => {
  if (
    params === null ||
    params === undefined ||
    Object.keys(params).length === 0
  ) {
    return '';
  }

  const query = Object.entries(params as unknown as Record<string, unknown>)
    .map(([key, value]) => {
      if (value === undefined || value === null) {
        return '';
      }

      if (Array.isArray(value)) {
        return value
          .map(
            (arrayValue) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(arrayValue)}`
          )
          .join('&');
      }

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }

      // Ignore other types like objects, functions, etc.
      return '';
    })
    .filter((part) => part.length > 0)
    .join('&');

  return query ? `?${query}` : '';
};
