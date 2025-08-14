import { CACHE_KEY_TYPE, getCacheKey, isValidAddress } from './common';

describe('getCacheKey', () => {
  const address = '0xUserAddress';
  for (let type of Object.keys(CACHE_KEY_TYPE)) {
    it(`should always return string keys for data type: ${type}`, () => {
      const key = getCacheKey(address, type as keyof typeof CACHE_KEY_TYPE);
      expect(typeof key).toBe('string');
    });

    it(`should always return non-empty keys for data type: ${type}`, () => {
      const key = getCacheKey(address, type as keyof typeof CACHE_KEY_TYPE);
      expect(key.length).toBeGreaterThan(0);
      expect(key.includes(address)).toBeTruthy();
    });

    it(`should always include user address for data type: ${type}`, () => {
      const key = getCacheKey(address, type as keyof typeof CACHE_KEY_TYPE);
      expect(key.length).toBeGreaterThan(0);
      expect(key.includes(address)).toBeTruthy();
    });
  }
});

describe('isValidAddress', () => {
  it('should return true for valid checksummed addresses', () => {
    expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(
      true
    );
    expect(isValidAddress('0xAbCdEf1234567890123456789012345678901234')).toBe(
      true
    );
    expect(isValidAddress('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toBe(
      true
    );
  });

  it('should return true for valid non-checksummed addresses', () => {
    expect(isValidAddress('0xabcdef1234567890123456789012345678901234')).toBe(
      true
    );
    expect(isValidAddress('0xffffffffffffffffffffffffffffffffffffffff')).toBe(
      true
    );
  });

  it('should return true for zero address', () => {
    expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(
      true
    );
  });

  it('should return false for addresses with wrong length', () => {
    expect(isValidAddress('0x123')).toBe(false);
    expect(isValidAddress('0x12345678901234567890123456789012345678901')).toBe(
      false
    ); // 41 chars
    expect(isValidAddress('0x123456789012345678901234567890123456789')).toBe(
      false
    ); // 39 chars
  });

  it('should return false for addresses without 0x prefix', () => {
    expect(isValidAddress('1234567890123456789012345678901234567890')).toBe(
      false
    );
    expect(isValidAddress('abcdef1234567890123456789012345678901234')).toBe(
      false
    );
  });

  it('should return false for addresses with invalid characters', () => {
    expect(isValidAddress('0xGGGG567890123456789012345678901234567890')).toBe(
      false
    );
    expect(isValidAddress('0x123456789012345678901234567890123456789Z')).toBe(
      false
    );
    expect(isValidAddress('0x!@#$567890123456789012345678901234567890')).toBe(
      false
    );
  });

  it('should return false for empty or invalid inputs', () => {
    expect(isValidAddress('')).toBe(false);
    expect(isValidAddress(null as unknown as string)).toBe(false);
    expect(isValidAddress(undefined as unknown as string)).toBe(false);
    expect(isValidAddress(123 as unknown as string)).toBe(false);
    expect(isValidAddress({} as unknown as string)).toBe(false);
    expect(isValidAddress([] as unknown as string)).toBe(false);
  });

  it('should return false for addresses with spaces', () => {
    expect(isValidAddress(' 0x1234567890123456789012345678901234567890')).toBe(
      false
    );
    expect(isValidAddress('0x1234567890123456789012345678901234567890 ')).toBe(
      false
    );
    expect(isValidAddress('0x12345678 90123456789012345678901234567890')).toBe(
      false
    );
  });

  it('should handle mixed case in hex part', () => {
    expect(isValidAddress('0xaAbBcCdDeEfF1234567890123456789012345678')).toBe(
      true
    );
    expect(isValidAddress('0xAABBCCDDEEFF1234567890123456789012345678')).toBe(
      true
    );
  });
});
