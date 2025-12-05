import type { Country } from '../../types/country.types';
import { COUNTRIES_SORTED, getCountryByCode } from '../../utils';

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

/**
 * The cookie logic used in SelectBuyRegionStep for storing/retrieving
 * the user's country selection.
 */
const COOKIE_NAME = 'panna_user_country';

type CookieData = {
  [COOKIE_NAME]?: Country;
};

// Logic for determining whether to set/update the cookie
const shouldSetCookie = (
  cookieData: CookieData,
  selectedCountry: Country | undefined
): boolean => {
  if (!selectedCountry) return false;
  if (!cookieData[COOKIE_NAME]?.code) return true;
  return cookieData[COOKIE_NAME].code !== selectedCountry.code;
};

// Logic for getting initial country from cookie or defaults
const getInitialCountry = (
  cookieData: CookieData,
  detectedCountryCode: string | null,
  defaultCountryCode: string
): Country | undefined => {
  // Priority: cookie > detected > default > first available
  if (cookieData[COOKIE_NAME]?.code) {
    return getCountryByCode(cookieData[COOKIE_NAME].code) ?? undefined;
  }
  if (detectedCountryCode) {
    const detected = getCountryByCode(detectedCountryCode);
    if (detected) return detected;
  }
  return getCountryByCode(defaultCountryCode) ?? COUNTRIES_SORTED[0];
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

describe('SelectBuyRegionStep cookie logic', () => {
  const germany = getCountryByCode('DE')!;
  const france = getCountryByCode('FR')!;
  const usa = getCountryByCode('US')!;

  describe('shouldSetCookie', () => {
    it('returns false when selectedCountry is undefined', () => {
      const cookieData: CookieData = {};
      expect(shouldSetCookie(cookieData, undefined)).toBe(false);
    });

    it('returns true when cookie is empty and country is selected', () => {
      const cookieData: CookieData = {};
      expect(shouldSetCookie(cookieData, germany)).toBe(true);
    });

    it('returns true when selected country differs from cookie', () => {
      const cookieData: CookieData = { panna_user_country: germany };
      expect(shouldSetCookie(cookieData, france)).toBe(true);
    });

    it('returns false when selected country matches cookie', () => {
      const cookieData: CookieData = { panna_user_country: germany };
      expect(shouldSetCookie(cookieData, germany)).toBe(false);
    });
  });

  describe('getInitialCountry', () => {
    it('returns country from cookie when available', () => {
      const cookieData: CookieData = { panna_user_country: germany };
      const result = getInitialCountry(cookieData, 'FR', 'US');
      expect(result?.code).toBe('DE');
    });

    it('returns detected country when cookie is empty', () => {
      const cookieData: CookieData = {};
      const result = getInitialCountry(cookieData, 'FR', 'US');
      expect(result?.code).toBe('FR');
    });

    it('returns default country when cookie and detected are empty', () => {
      const cookieData: CookieData = {};
      const result = getInitialCountry(cookieData, null, 'US');
      expect(result?.code).toBe('US');
    });

    it('returns first available country when all else fails', () => {
      const cookieData: CookieData = {};
      // Use invalid codes that won't match any country
      const result = getInitialCountry(cookieData, null, 'INVALID');
      expect(result).toBe(COUNTRIES_SORTED[0]);
    });

    it('prioritizes cookie over detected country', () => {
      const cookieData: CookieData = { panna_user_country: usa };
      const result = getInitialCountry(cookieData, 'DE', 'FR');
      expect(result?.code).toBe('US');
    });

    it('prioritizes detected country over default', () => {
      const cookieData: CookieData = {};
      const result = getInitialCountry(cookieData, 'DE', 'US');
      expect(result?.code).toBe('DE');
    });
  });
});
