import { newLruMemCache } from './cache';

describe('newLruMemCache', () => {
  const testCache = newLruMemCache();
  afterAll(() => {
    testCache.clear();
  });

  const supportedDataTypes: Record<string, unknown> = {
    string: 'test string',
    number: Math.random(),
    boolean: true,
    object: {
      key1: 'value1',
      key2: Math.random(),
      key3: false,
      key4: { k: 'someVal' }
    },
    null: null,
    symbol: Symbol('symbol'),
    bigint: BigInt('100')
  };

  Object.entries(supportedDataTypes).forEach(([dataType, value]) => {
    it(`should return false when key '${dataType}' does not exist`, () => {
      expect(testCache.has(dataType)).toBeFalsy();
    });

    it(`should persist '${dataType}' data type without any error`, () => {
      testCache.set(dataType, value);
    });

    it(`should return true when key '${dataType}' exists`, () => {
      expect(testCache.has(dataType)).toBeTruthy();
    });

    it(`should retrieve '${dataType}' data type in correct format`, () => {
      const got = testCache.get(dataType);
      if (dataType == 'null') {
        expect(typeof got).toBe('object');
      } else {
        expect(typeof got).toBe(dataType);
      }
      expect(got).toEqual(value);
    });

    it(`should fetch '${dataType}' data type without any error`, () => {
      expect(testCache.get(dataType)).toEqual(value);
    });

    it(`should successfully delete entry for '${dataType}' key without any error`, () => {
      expect(testCache.delete(dataType)).toBeTruthy();
      expect(testCache.delete(dataType)).toBeFalsy();
    });
  });

  it('should return undefined for non-existent key', () => {
    expect(testCache.get('nonexistentKey')).toBeUndefined();
  });

  it('should clear cache successfully', () => {
    Object.entries(supportedDataTypes).forEach(([k, v]) => {
      testCache.set(k, v);
      expect(testCache.has(k)).toBeTruthy();
    });

    expect(testCache.clear()).toBeUndefined();

    Object.keys(supportedDataTypes).forEach((k) => {
      expect(testCache.has(k)).toBeFalsy();
    });
  });
});
