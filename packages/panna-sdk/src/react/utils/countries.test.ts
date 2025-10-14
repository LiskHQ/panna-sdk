import { FiatCurrency } from '../../core/util/types';
import {
  getCountryByCode,
  getCurrencyForCountry,
  getCurrencySymbol,
  getCurrencySymbolForCountry,
  COUNTRIES_SORTED
} from './countries';

// Mock the external packages
jest.mock('country-to-currency', () => ({
  __esModule: true,
  default: {
    US: 'USD',
    GB: 'GBP',
    DE: 'EUR',
    FR: 'EUR',
    CA: 'CAD',
    AU: 'AUD',
    JP: 'JPY',
    XX: undefined // Invalid country
  }
}));

jest.mock('currency-symbol-map', () => ({
  __esModule: true,
  default: jest.fn((currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      GBP: '£',
      EUR: '€',
      CAD: '$',
      AUD: '$',
      JPY: '¥'
    };
    return symbols[currency];
  })
}));

jest.mock('i18n-iso-countries', () => ({
  registerLocale: jest.fn(),
  isValid: jest.fn((code: string) => {
    // Mock valid ISO codes
    const validAlpha2 = ['US', 'GB', 'DE', 'FR', 'CA', 'AU', 'JP'];
    const validAlpha3 = ['USA', 'GBR', 'DEU', 'FRA', 'CAN', 'AUS', 'JPN'];
    return validAlpha2.includes(code) || validAlpha3.includes(code);
  }),
  alpha3ToAlpha2: jest.fn((code: string) => {
    const mapping: Record<string, string> = {
      USA: 'US',
      GBR: 'GB',
      DEU: 'DE',
      FRA: 'FR',
      CAN: 'CA',
      AUS: 'AU',
      JPN: 'JP'
    };
    return mapping[code];
  })
}));

// Mock the COUNTRIES array (sorted alphabetically by name to match the real implementation)
jest.mock('../consts', () => ({
  COUNTRIES: [
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'US', name: 'United States', flag: '🇺🇸' }
  ]
}));

// Mock DEFAULT_CURRENCY
jest.mock('src/core', () => ({
  DEFAULT_CURRENCY: 'USD'
}));

describe('Countries Utility Functions', () => {
  describe('getCountryByCode', () => {
    describe('2-letter country codes (ISO 3166-1 alpha-2)', () => {
      it('should return country for valid 2-letter codes', () => {
        const testCases = [
          {
            code: 'US',
            expected: { code: 'US', name: 'United States', flag: '🇺🇸' }
          },
          {
            code: 'GB',
            expected: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' }
          },
          { code: 'DE', expected: { code: 'DE', name: 'Germany', flag: '🇩🇪' } }
        ];

        testCases.forEach(({ code, expected }) => {
          const result = getCountryByCode(code);
          expect(result).toEqual(expected);
        });
      });

      it('should handle case insensitive input', () => {
        const result = getCountryByCode('us');
        expect(result).toEqual({
          code: 'US',
          name: 'United States',
          flag: '🇺🇸'
        });
      });

      it('should return undefined for invalid 2-letter codes', () => {
        const invalidCodes = ['XX', 'YY', 'ZZ'];

        invalidCodes.forEach((code) => {
          const result = getCountryByCode(code);
          expect(result).toBeUndefined();
        });
      });

      it('should return undefined for unsupported but valid ISO codes', () => {
        // Mock a valid ISO code that's not in our COUNTRIES array
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mockIsValid = jest.mocked(require('i18n-iso-countries').isValid);
        mockIsValid.mockReturnValueOnce(true);

        const result = getCountryByCode('ZW'); // Valid ISO but not in our mock array
        expect(result).toBeUndefined();
      });
    });

    describe('3-letter country codes (ISO 3166-1 alpha-3)', () => {
      it('should return country for valid 3-letter codes', () => {
        const testCases = [
          {
            code: 'USA',
            expected: { code: 'US', name: 'United States', flag: '🇺🇸' }
          },
          {
            code: 'GBR',
            expected: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' }
          },
          { code: 'DEU', expected: { code: 'DE', name: 'Germany', flag: '🇩🇪' } }
        ];

        testCases.forEach(({ code, expected }) => {
          const result = getCountryByCode(code);
          expect(result).toEqual(expected);
        });
      });

      it('should handle case insensitive 3-letter input', () => {
        const result = getCountryByCode('usa');
        expect(result).toEqual({
          code: 'US',
          name: 'United States',
          flag: '🇺🇸'
        });
      });

      it('should return undefined for invalid 3-letter codes', () => {
        const invalidCodes = ['XXX', 'YYY', 'ZZZ'];

        invalidCodes.forEach((code) => {
          const result = getCountryByCode(code);
          expect(result).toBeUndefined();
        });
      });
    });

    describe('Edge cases', () => {
      it('should return undefined for empty string', () => {
        const result = getCountryByCode('');
        expect(result).toBeUndefined();
      });

      it('should return undefined for null/undefined input', () => {
        expect(getCountryByCode(null as unknown as string)).toBeUndefined();
        expect(
          getCountryByCode(undefined as unknown as string)
        ).toBeUndefined();
      });

      it('should return undefined for invalid length codes', () => {
        const invalidLengths = ['U', 'USAA', 'TOOLONG'];

        invalidLengths.forEach((code) => {
          const result = getCountryByCode(code);
          expect(result).toBeUndefined();
        });
      });

      it('should return undefined when alpha3ToAlpha2 conversion fails', () => {
        const mockAlpha3ToAlpha2 = jest.mocked(
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('i18n-iso-countries').alpha3ToAlpha2
        );
        mockAlpha3ToAlpha2.mockReturnValueOnce(undefined);

        const result = getCountryByCode('XXX');
        expect(result).toBeUndefined();
      });
    });
  });

  describe('getCurrencyForCountry', () => {
    describe('2-letter country codes', () => {
      it('should return correct currency for valid 2-letter codes', () => {
        const testCases = [
          { code: 'US', expected: FiatCurrency.USD },
          { code: 'GB', expected: FiatCurrency.GBP },
          { code: 'DE', expected: FiatCurrency.EUR },
          { code: 'CA', expected: FiatCurrency.CAD }
        ];

        testCases.forEach(({ code, expected }) => {
          const result = getCurrencyForCountry(code);
          expect(result).toBe(expected);
        });
      });

      it('should handle case insensitive input', () => {
        const result = getCurrencyForCountry('us');
        expect(result).toBe(FiatCurrency.USD);
      });
    });

    describe('3-letter country codes', () => {
      it('should return correct currency for valid 3-letter codes', () => {
        const testCases = [
          { code: 'USA', expected: FiatCurrency.USD },
          { code: 'GBR', expected: FiatCurrency.GBP },
          { code: 'DEU', expected: FiatCurrency.EUR },
          { code: 'CAN', expected: FiatCurrency.CAD }
        ];

        testCases.forEach(({ code, expected }) => {
          const result = getCurrencyForCountry(code);
          expect(result).toBe(expected);
        });
      });

      it('should handle case insensitive 3-letter input', () => {
        const result = getCurrencyForCountry('usa');
        expect(result).toBe(FiatCurrency.USD);
      });
    });

    describe('Fallback behavior', () => {
      it('should return default currency for invalid codes', () => {
        const invalidCodes = ['XX', 'XXX', 'INVALID', ''];

        invalidCodes.forEach((code) => {
          const result = getCurrencyForCountry(code);
          expect(result).toBe(FiatCurrency.USD); // DEFAULT_CURRENCY
        });
      });

      it('should return default currency for empty/null input', () => {
        expect(getCurrencyForCountry('')).toBe(FiatCurrency.USD);
        expect(getCurrencyForCountry(null as unknown as string)).toBe(
          FiatCurrency.USD
        );
        expect(getCurrencyForCountry(undefined as unknown as string)).toBe(
          FiatCurrency.USD
        );
      });

      it('should return default currency when conversion fails', () => {
        const mockAlpha3ToAlpha2 = jest.mocked(
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('i18n-iso-countries').alpha3ToAlpha2
        );
        mockAlpha3ToAlpha2.mockReturnValueOnce(undefined);

        const result = getCurrencyForCountry('XXX');
        expect(result).toBe(FiatCurrency.USD);
      });

      it('should return default currency for invalid length codes', () => {
        const invalidLengths = ['U', 'USAA', 'TOOLONG'];

        invalidLengths.forEach((code) => {
          const result = getCurrencyForCountry(code);
          expect(result).toBe(FiatCurrency.USD);
        });
      });
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return correct symbols for valid currencies', () => {
      const testCases = [
        { currency: FiatCurrency.USD, expected: '$' },
        { currency: FiatCurrency.GBP, expected: '£' },
        { currency: FiatCurrency.EUR, expected: '€' },
        { currency: FiatCurrency.JPY, expected: '¥' }
      ];

      testCases.forEach(({ currency, expected }) => {
        const result = getCurrencySymbol(currency);
        expect(result).toBe(expected);
      });
    });

    it('should return default symbol for invalid currencies', () => {
      const invalidCurrencies = ['XXX', 'INVALID', ''];

      invalidCurrencies.forEach((currency) => {
        const result = getCurrencySymbol(currency);
        expect(result).toBe('$'); // Default fallback
      });
    });
  });

  describe('getCurrencySymbolForCountry', () => {
    describe('2-letter country codes', () => {
      it('should return correct currency symbols for valid 2-letter codes', () => {
        const testCases = [
          { code: 'US', expected: '$' },
          { code: 'GB', expected: '£' },
          { code: 'DE', expected: '€' },
          { code: 'JP', expected: '¥' }
        ];

        testCases.forEach(({ code, expected }) => {
          const result = getCurrencySymbolForCountry(code);
          expect(result).toBe(expected);
        });
      });
    });

    describe('3-letter country codes', () => {
      it('should return correct currency symbols for valid 3-letter codes', () => {
        const testCases = [
          { code: 'USA', expected: '$' },
          { code: 'GBR', expected: '£' },
          { code: 'DEU', expected: '€' },
          { code: 'JPN', expected: '¥' }
        ];

        testCases.forEach(({ code, expected }) => {
          const result = getCurrencySymbolForCountry(code);
          expect(result).toBe(expected);
        });
      });
    });

    describe('Fallback behavior', () => {
      it('should return default symbol for invalid country codes', () => {
        const invalidCodes = ['XX', 'XXX', 'INVALID', ''];

        invalidCodes.forEach((code) => {
          const result = getCurrencySymbolForCountry(code);
          expect(result).toBe('$'); // Default fallback
        });
      });
    });
  });

  describe('COUNTRIES_SORTED', () => {
    it('should be an array sorted alphabetically', () => {
      expect(Array.isArray(COUNTRIES_SORTED)).toBe(true);
      expect(COUNTRIES_SORTED.length).toBeGreaterThan(0);
    });

    it('should be sorted alphabetically by name', () => {
      const names = COUNTRIES_SORTED.map((country) => country.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should contain all countries from the original array', () => {
      // Since we mocked 7 countries, we should have all 7 in the result
      expect(COUNTRIES_SORTED).toHaveLength(7);
    });
  });

  describe('Integration tests', () => {
    it('should work end-to-end for 2-letter codes', () => {
      const country = getCountryByCode('US');
      const currency = getCurrencyForCountry('US');
      const symbol = getCurrencySymbolForCountry('US');

      expect(country).toEqual({
        code: 'US',
        name: 'United States',
        flag: '🇺🇸'
      });
      expect(currency).toBe(FiatCurrency.USD);
      expect(symbol).toBe('$');
    });

    it('should work end-to-end for 3-letter codes', () => {
      const country = getCountryByCode('USA');
      const currency = getCurrencyForCountry('USA');
      const symbol = getCurrencySymbolForCountry('USA');

      expect(country).toEqual({
        code: 'US',
        name: 'United States',
        flag: '🇺🇸'
      });
      expect(currency).toBe(FiatCurrency.USD);
      expect(symbol).toBe('$');
    });

    it('should maintain consistency between 2-letter and 3-letter codes', () => {
      const testCases = [
        { alpha2: 'US', alpha3: 'USA' },
        { alpha2: 'GB', alpha3: 'GBR' },
        { alpha2: 'DE', alpha3: 'DEU' }
      ];

      testCases.forEach(({ alpha2, alpha3 }) => {
        const country2 = getCountryByCode(alpha2);
        const country3 = getCountryByCode(alpha3);
        const currency2 = getCurrencyForCountry(alpha2);
        const currency3 = getCurrencyForCountry(alpha3);
        const symbol2 = getCurrencySymbolForCountry(alpha2);
        const symbol3 = getCurrencySymbolForCountry(alpha3);

        expect(country2).toEqual(country3);
        expect(currency2).toBe(currency3);
        expect(symbol2).toBe(symbol3);
      });
    });
  });
});
