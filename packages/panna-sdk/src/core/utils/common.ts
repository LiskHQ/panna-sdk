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
