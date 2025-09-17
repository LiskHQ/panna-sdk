import { lisk, liskSepolia } from '../chains';
import {
  CACHE_KEY_TYPE,
  CHAIN_ID_API_URL_MAP,
  getBaseApiUrl,
  getCacheKey,
  isValidAddress,
  buildQueryString
} from './common';

describe('getCacheKey', () => {
  const address = '0xUserAddress';
  for (let type of Object.keys(CACHE_KEY_TYPE)) {
    it(`should always return string keys for data type: ${type}`, () => {
      const key = getCacheKey(
        address,
        lisk.id,
        type as keyof typeof CACHE_KEY_TYPE
      );
      expect(typeof key).toBe('string');
    });

    it(`should always return non-empty keys for data type: ${type}`, () => {
      const key = getCacheKey(
        address,
        lisk.id,
        type as keyof typeof CACHE_KEY_TYPE
      );
      expect(key.length).toBeGreaterThan(0);
      expect(key.includes(address)).toBeTruthy();
    });

    it(`should always include user address for data type: ${type}`, () => {
      const key = getCacheKey(
        address,
        lisk.id,
        type as keyof typeof CACHE_KEY_TYPE
      );
      expect(key.length).toBeGreaterThan(0);
      expect(key.includes(address)).toBeTruthy();
    });

    it(`should always include the specified chain id for data type: ${type}`, () => {
      const key = getCacheKey(
        address,
        lisk.id,
        type as keyof typeof CACHE_KEY_TYPE
      );
      expect(key.length).toBeGreaterThan(0);
      expect(key.includes(lisk.id as unknown as string)).toBeTruthy();
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

describe('CHAIN_API_URL_MAP', () => {
  it('should at least contain entries for both lisk and liskSepolia', () => {
    const supportedChainIDs = Object.keys(CHAIN_ID_API_URL_MAP);
    expect(supportedChainIDs.length).toBeGreaterThanOrEqual(2);

    const baseUrlLisk = CHAIN_ID_API_URL_MAP[lisk.id];
    expect(baseUrlLisk).toBeDefined();
    expect(baseUrlLisk.startsWith('https://')).toBeTruthy();
    expect(baseUrlLisk.includes('lisk.com')).toBeTruthy();
    expect(baseUrlLisk.includes('sepolia')).toBeFalsy();

    const baseUrlLiskSepolia = CHAIN_ID_API_URL_MAP[liskSepolia.id];
    expect(baseUrlLiskSepolia).toBeDefined();
    expect(baseUrlLiskSepolia.startsWith('https://')).toBeTruthy();
    expect(baseUrlLiskSepolia.includes('lisk.com')).toBeTruthy();
    expect(baseUrlLiskSepolia.includes('sepolia')).toBeTruthy();
  });
});

describe('getBaseApiUrl', () => {
  it('should always return base API URL for lisk', () => {
    const baseUrl = getBaseApiUrl(lisk.id);
    expect(typeof baseUrl).toBe('string');
    expect(baseUrl.length).toBeGreaterThan(1);
    expect(baseUrl.startsWith('https://')).toBeTruthy();
    expect(baseUrl.includes('lisk.com')).toBeTruthy();
    expect(baseUrl.includes('sepolia')).toBeFalsy();
  });

  it('should always return base API URL for lisk sepolia', () => {
    const baseUrl = getBaseApiUrl(liskSepolia.id);
    expect(typeof baseUrl).toBe('string');
    expect(baseUrl.length).toBeGreaterThan(1);
    expect(baseUrl.startsWith('https://')).toBeTruthy();
    expect(baseUrl.includes('lisk.com')).toBeTruthy();
    expect(baseUrl.includes('sepolia')).toBeTruthy();
  });
});

describe('buildQueryString', () => {
  it('should return an empty string for null params', () => {
    const queryString = buildQueryString(null);
    expect(queryString).toBe('');
  });

  it('should return an empty string for undefined params', () => {
    const queryString = buildQueryString(undefined);
    expect(queryString).toBe('');
  });

  it('should return an empty string for empty params', () => {
    const queryString = buildQueryString({});
    expect(queryString).toBe('');
  });

  it('should return a valid query string for single param', () => {
    const queryString = buildQueryString({ page: 1 });
    expect(queryString).toBe('?page=1');
  });

  it('should return a valid query string for multiple params', () => {
    const queryString = buildQueryString({
      page: 2,
      limit: 50,
      search: 'test'
    });
    // Order of parameters in the query string may vary
    const possibleResults = [
      '?page=2&limit=50&search=test',
      '?page=2&search=test&limit=50',
      '?limit=50&page=2&search=test',
      '?limit=50&search=test&page=2',
      '?search=test&page=2&limit=50',
      '?search=test&limit=50&page=2'
    ];
    expect(possibleResults).toContain(queryString);
  });

  it('should handle boolean and numeric values correctly', () => {
    const queryString = buildQueryString({
      active: true,
      verified: false,
      count: 10
    });
    const possibleResults = [
      '?active=true&verified=false&count=10',
      '?active=true&count=10&verified=false',
      '?verified=false&active=true&count=10',
      '?verified=false&count=10&active=true',
      '?count=10&active=true&verified=false',
      '?count=10&verified=false&active=true'
    ];
    expect(possibleResults).toContain(queryString);
  });

  it('should encode special characters in parameter values', () => {
    const queryString = buildQueryString({
      search: 'test value',
      filter: 'name/age'
    });
    const possibleResults = [
      '?search=test%20value&filter=name%2Fage',
      '?filter=name%2Fage&search=test%20value'
    ];
    expect(possibleResults).toContain(queryString);
  });

  it('should skip parameters with undefined or null values', () => {
    const queryString = buildQueryString({
      page: 1,
      limit: undefined,
      search: null,
      sort: 'asc'
    });
    const possibleResults = ['?page=1&sort=asc', '?sort=asc&page=1'];
    expect(possibleResults).toContain(queryString);
  });

  it('should handle array values by repeating the key', () => {
    const queryString = buildQueryString({
      tags: ['tag1', 'tag2', 'tag3'],
      category: 'books'
    });
    const possibleResults = [
      '?tags=tag1&tags=tag2&tags=tag3&category=books',
      '?tags=tag1&tags=tag3&tags=tag2&category=books',
      '?tags=tag2&tags=tag1&tags=tag3&category=books',
      '?tags=tag2&tags=tag3&tags=tag1&category=books',
      '?tags=tag3&tags=tag1&tags=tag2&category=books',
      '?tags=tag3&tags=tag2&tags=tag1&category=books',
      '?category=books&tags=tag1&tags=tag2&tags=tag3',
      '?category=books&tags=tag1&tags=tag3&tags=tag2',
      '?category=books&tags=tag2&tags=tag1&tags=tag3',
      '?category=books&tags=tag2&tags=tag3&tags=tag1',
      '?category=books&tags=tag3&tags=tag1&tags=tag2',
      '?category=books&tags=tag3&tags=tag2&tags=tag1'
    ];
    expect(possibleResults).toContain(queryString);
  });
});
