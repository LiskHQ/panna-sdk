import { removeUndefined } from './object';

describe('removeUndefined', () => {
  it('should remove undefined values from an object', () => {
    const input = {
      a: 1,
      b: undefined,
      c: 'hello',
      d: undefined
    };

    const result = removeUndefined(input);

    expect(result).toEqual({
      a: 1,
      c: 'hello'
    });
    expect(Object.prototype.hasOwnProperty.call(result, 'b')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result, 'd')).toBe(false);
  });

  it('should keep null values', () => {
    const input = {
      a: 1,
      b: null,
      c: undefined,
      d: 'test'
    };

    const result = removeUndefined(input);

    expect(result).toEqual({
      a: 1,
      b: null,
      d: 'test'
    });
    expect(Object.prototype.hasOwnProperty.call(result, 'c')).toBe(false);
  });

  it('should keep falsy values except undefined', () => {
    const input = {
      zero: 0,
      emptyString: '',
      falseValue: false,
      undefinedValue: undefined,
      nullValue: null
    };

    const result = removeUndefined(input);

    expect(result).toEqual({
      zero: 0,
      emptyString: '',
      falseValue: false,
      nullValue: null
    });
    expect(Object.prototype.hasOwnProperty.call(result, 'undefinedValue')).toBe(
      false
    );
  });

  it('should return empty object when all values are undefined', () => {
    const input = {
      a: undefined,
      b: undefined,
      c: undefined
    };

    const result = removeUndefined(input);

    expect(result).toEqual({});
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should return the same object when no undefined values', () => {
    const input = {
      a: 1,
      b: 'test',
      c: null,
      d: false,
      e: 0
    };

    const result = removeUndefined(input);

    expect(result).toEqual(input);
  });

  it('should handle empty object', () => {
    const input = {};
    const result = removeUndefined(input);

    expect(result).toEqual({});
  });

  it('should handle objects with nested objects', () => {
    const input = {
      a: 1,
      b: undefined,
      c: { nested: 'value' },
      d: undefined
    };

    const result = removeUndefined(input);

    expect(result).toEqual({
      a: 1,
      c: { nested: 'value' }
    });
  });

  it('should handle objects with arrays', () => {
    const input = {
      a: [1, 2, 3],
      b: undefined,
      c: [],
      d: undefined
    };

    const result = removeUndefined(input);

    expect(result).toEqual({
      a: [1, 2, 3],
      c: []
    });
  });

  it('should maintain type safety', () => {
    const input = {
      required: 'test',
      optional: undefined as number | undefined
    };

    const result = removeUndefined(input);

    // TypeScript should infer the result as Partial<typeof input>
    expect(result).toEqual({
      required: 'test'
    });
    expect(typeof result.required).toBe('string');
  });
});
