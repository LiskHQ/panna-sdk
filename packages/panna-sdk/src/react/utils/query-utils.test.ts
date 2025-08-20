import { generatePaginationQueryFilter } from './query-utils';

describe('generatePaginationQueryFilter', () => {
  it('returns filter object for valid limit and offset', () => {
    expect(generatePaginationQueryFilter(10, 5)).toEqual({
      limit: 10,
      offset: 5
    });
  });

  it('returns undefined if limit is less than 1', () => {
    expect(generatePaginationQueryFilter(0, 5)).toBeUndefined();
    expect(generatePaginationQueryFilter(-5, 5)).toBeUndefined();
  });

  it('returns undefined if limit is greater than MAX_LIMIT', () => {
    expect(generatePaginationQueryFilter(101, 5)).toBeUndefined();
    expect(generatePaginationQueryFilter(1000, 5)).toBeUndefined();
  });

  it('returns undefined if offset is negative', () => {
    expect(generatePaginationQueryFilter(10, -1)).toBeUndefined();
    expect(generatePaginationQueryFilter(10, -100)).toBeUndefined();
  });

  it('returns undefined if limit is undefined', () => {
    expect(generatePaginationQueryFilter(undefined, 5)).toBeUndefined();
  });

  it('returns undefined if offset is undefined', () => {
    expect(generatePaginationQueryFilter(10, undefined)).toBeUndefined();
  });

  it('returns undefined if both limit and offset are undefined', () => {
    expect(generatePaginationQueryFilter(undefined, undefined)).toBeUndefined();
  });

  it('returns filter object for edge values', () => {
    expect(generatePaginationQueryFilter(1, 0)).toEqual({
      limit: 1,
      offset: 0
    });
    expect(generatePaginationQueryFilter(100, 0)).toEqual({
      limit: 100,
      offset: 0
    });
  });
});
