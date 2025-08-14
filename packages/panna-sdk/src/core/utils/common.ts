export const CACHE_KEY_TYPE = {
  transactions: '',
  transactions_next_params: 'params',
  token_transfers: 'tt',
  token_transfers_next_params: 'tt_params',
  collectibles: 'coll',
  collectibles_next_params: 'coll_params'
};

/**
 * Get the cache key for the provided address and type of data.
 * @param address The address for which to retrieve the cache key.
 * @param type The type of cached data.
 * @returns Cache key for the provided address and data type.
 * @example
 * ```ts
 * // Get the cache key for the specified user's transactions
 * const result = await getCacheKey('0xc0ffee254729296a45a3885639AC7E10F9d54979', 'transactions');
 * // result: '0xc0ffee254729296a45a3885639AC7E10F9d54979_'
 */
export const getCacheKey = (
  address: string,
  type: keyof typeof CACHE_KEY_TYPE
): string => `${address}_${CACHE_KEY_TYPE[type]}`;

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
