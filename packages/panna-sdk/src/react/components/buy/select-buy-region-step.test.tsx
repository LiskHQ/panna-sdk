import { COUNTRIES_SORTED } from '../../utils';

/**
 * Tests for the country search filtering logic used in SelectBuyRegionStep.
 *
 * The component uses substring matching (`.includes()`) for country search,
 * which is consistent with the asset search behavior in SelectBuyTokenStep.
 *
 * This is a unit test for the filtering logic, not the full component,
 * because the Command component (cmdk) requires many browser APIs that
 * are not available in jsdom.
 */

// This is the same filtering logic used in SelectBuyRegionStep
const filterCountries = (query: string) => {
  if (!query) return COUNTRIES_SORTED;
  return COUNTRIES_SORTED.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );
};

describe('SelectBuyRegionStep country search filtering', () => {
  it('returns all countries when query is empty', () => {
    const result = filterCountries('');
    expect(result).toEqual(COUNTRIES_SORTED);
    expect(result.length).toBeGreaterThan(100); // Should have many countries
  });

  it('filters countries using substring matching (case-insensitive)', () => {
    const result = filterCountries('united');

    // Should find countries with "united" in the name
    expect(result.some((c) => c.name === 'United States')).toBe(true);
    expect(result.some((c) => c.name === 'United Kingdom')).toBe(true);
    expect(result.some((c) => c.name === 'United Arab Emirates')).toBe(true);

    // Should NOT find countries without "united"
    expect(result.some((c) => c.name === 'Germany')).toBe(false);
    expect(result.some((c) => c.name === 'France')).toBe(false);
  });

  it('filters countries case-insensitively', () => {
    const lowerResult = filterCountries('germany');
    const upperResult = filterCountries('GERMANY');
    const mixedResult = filterCountries('GeRmAnY');

    // All should find Germany
    expect(lowerResult.some((c) => c.name === 'Germany')).toBe(true);
    expect(upperResult.some((c) => c.name === 'Germany')).toBe(true);
    expect(mixedResult.some((c) => c.name === 'Germany')).toBe(true);
  });

  it('does NOT match non-consecutive characters (no fuzzy matching)', () => {
    // "usa" would match "United States of America" with fuzzy matching
    // but should NOT match with substring matching since "usa" is not
    // a consecutive substring of "United States"
    const result = filterCountries('usa');

    expect(result.some((c) => c.name === 'United States')).toBe(false);
    // Should be empty (no countries contain "usa" as a substring)
    expect(result.length).toBe(0);
  });

  it('matches partial strings anywhere in the country name', () => {
    // "land" appears at the end of several country names
    const result = filterCountries('land');

    expect(result.some((c) => c.name === 'Finland')).toBe(true);
    expect(result.some((c) => c.name === 'Ireland')).toBe(true);
    expect(result.some((c) => c.name === 'Netherlands')).toBe(true);
    expect(result.some((c) => c.name === 'Poland')).toBe(true);

    // Should NOT find countries without "land"
    expect(result.some((c) => c.name === 'Germany')).toBe(false);
    expect(result.some((c) => c.name === 'France')).toBe(false);
  });

  it('matches partial strings at the beginning of country names', () => {
    const result = filterCountries('ger');

    expect(result.some((c) => c.name === 'Germany')).toBe(true);
    // Should not find unrelated countries
    expect(result.some((c) => c.name === 'France')).toBe(false);
  });

  it('matches partial strings in the middle of country names', () => {
    const result = filterCountries('king');

    expect(result.some((c) => c.name === 'United Kingdom')).toBe(true);
  });
});
