import { getCountryByCode } from './countries';
import {
  detectUserCountry,
  getSupportedTokens,
  getChain,
  getEnvironmentChain,
  getAAChain
} from './utils';

// Mock the countries utility
jest.mock('./countries', () => ({
  getCountryByCode: jest.fn()
}));

// Mock the core imports
jest.mock('../../core', () => ({
  lisk: { id: 1135, name: 'Lisk' },
  liskSepolia: { id: 4202, name: 'Lisk Sepolia' }
}));

// Mock the consts imports
jest.mock('../consts', () => ({
  liskTokenConfig: [{ symbol: 'LSK', name: 'Lisk' }],
  liskSepoliaTokenConfig: [{ symbol: 'LSK', name: 'Lisk Sepolia' }]
}));

const mockGetCountryByCode = getCountryByCode as jest.MockedFunction<
  typeof getCountryByCode
>;

describe('Utils Functions', () => {
  describe('getSupportedTokens', () => {
    it('should return lisk token config when testingStatus is false', () => {
      const result = getSupportedTokens(false);
      expect(result).toEqual([{ symbol: 'LSK', name: 'Lisk' }]);
    });

    it('should return lisk sepolia token config when testingStatus is true', () => {
      const result = getSupportedTokens(true);
      expect(result).toEqual([{ symbol: 'LSK', name: 'Lisk Sepolia' }]);
    });

    it('should return lisk token config when testingStatus is undefined', () => {
      const result = getSupportedTokens();
      expect(result).toEqual([{ symbol: 'LSK', name: 'Lisk' }]);
    });
  });

  describe('getChain', () => {
    it('should return lisk chain when testingStatus is false', () => {
      const result = getChain(false);
      expect(result).toEqual({ id: 1135, name: 'Lisk' });
    });

    it('should return lisk sepolia chain when testingStatus is true', () => {
      const result = getChain(true);
      expect(result).toEqual({ id: 4202, name: 'Lisk Sepolia' });
    });

    it('should return lisk chain when testingStatus is undefined', () => {
      const result = getChain();
      expect(result).toEqual({ id: 1135, name: 'Lisk' });
    });
  });

  describe('getEnvironmentChain', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should return lisk chain in production environment', () => {
      process.env.NODE_ENV = 'production';
      const result = getEnvironmentChain();
      expect(result).toEqual({ id: 1135, name: 'Lisk' });
    });

    it('should return lisk sepolia chain in development environment', () => {
      process.env.NODE_ENV = 'development';
      const result = getEnvironmentChain();
      expect(result).toEqual({ id: 4202, name: 'Lisk Sepolia' });
    });

    it('should return lisk sepolia chain when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      const result = getEnvironmentChain();
      expect(result).toEqual({ id: 4202, name: 'Lisk Sepolia' });
    });

    it('should return lisk sepolia chain in test environment', () => {
      process.env.NODE_ENV = 'test';
      const result = getEnvironmentChain();
      expect(result).toEqual({ id: 4202, name: 'Lisk Sepolia' });
    });
  });

  describe('getAAChain', () => {
    it('should return same result as getChain for false', () => {
      const result = getAAChain(false);
      expect(result).toEqual({ id: 1135, name: 'Lisk' });
    });

    it('should return same result as getChain for true', () => {
      const result = getAAChain(true);
      expect(result).toEqual({ id: 4202, name: 'Lisk Sepolia' });
    });

    it('should return same result as getChain for undefined', () => {
      const result = getAAChain();
      expect(result).toEqual({ id: 1135, name: 'Lisk' });
    });
  });
});

describe('detectUserCountry', () => {
  // Store original navigator to restore after tests
  const originalNavigator = global.navigator;

  beforeEach(() => {
    // Reset mocks
    mockGetCountryByCode.mockReset();

    // Mock a basic navigator object
    Object.defineProperty(global, 'navigator', {
      writable: true,
      value: {
        language: 'en-US',
        languages: ['en-US', 'en']
      }
    });
  });

  afterAll(() => {
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      writable: true,
      value: originalNavigator
    });
  });

  describe('Method 1: Primary browser locale detection', () => {
    it('should detect country from navigator.language', () => {
      // Mock successful country lookup
      mockGetCountryByCode.mockReturnValue({
        code: 'US',
        name: 'United States',
        flag: '🇺🇸'
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).toHaveBeenCalledWith('US');
      expect(result).toBe('US');
    });

    it('should handle different locale formats', () => {
      const testCases = [
        {
          locale: 'en-GB',
          expectedCode: 'GB',
          country: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' }
        },
        {
          locale: 'fr-FR',
          expectedCode: 'FR',
          country: { code: 'FR', name: 'France', flag: '🇫🇷' }
        },
        {
          locale: 'de-DE',
          expectedCode: 'DE',
          country: { code: 'DE', name: 'Germany', flag: '🇩🇪' }
        }
      ];

      testCases.forEach(({ locale, expectedCode, country }) => {
        // Reset mock and set up new locale
        mockGetCountryByCode.mockReset();
        mockGetCountryByCode.mockReturnValue(country);

        Object.defineProperty(global.navigator, 'language', {
          writable: true,
          value: locale
        });

        const result = detectUserCountry();

        expect(mockGetCountryByCode).toHaveBeenCalledWith(expectedCode);
        expect(result).toBe(expectedCode);
      });
    });

    it('should return null when country is not supported', () => {
      // Mock unsupported country
      mockGetCountryByCode.mockReturnValue(undefined);

      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: 'en-XX' // Invalid country code
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).toHaveBeenCalledWith('XX');
      expect(result).toBeNull();
    });

    it('should handle locales without country codes', () => {
      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: 'en' // No country code
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle invalid locale formats', () => {
      const testCases = [
        { locale: '', shouldCallMock: false },
        { locale: 'invalid', shouldCallMock: false },
        { locale: 'en_US', shouldCallMock: false }, // No dash, should not process
        { locale: 'en.US', shouldCallMock: false } // No dash, should not process
      ];

      testCases.forEach(({ locale, shouldCallMock }) => {
        mockGetCountryByCode.mockReset();

        Object.defineProperty(global.navigator, 'language', {
          writable: true,
          value: locale
        });

        Object.defineProperty(global.navigator, 'languages', {
          writable: true,
          value: [locale]
        });

        const result = detectUserCountry();

        if (shouldCallMock) {
          expect(mockGetCountryByCode).toHaveBeenCalled();
        } else {
          expect(mockGetCountryByCode).not.toHaveBeenCalled();
        }
        expect(result).toBeNull();
      });
    });
  });

  describe('Method 2: Fallback browser locales', () => {
    it('should try fallback locales when primary fails', () => {
      // Primary locale fails, fallback succeeds
      mockGetCountryByCode
        .mockReturnValueOnce(undefined) // First call (XX) fails
        .mockReturnValueOnce({
          code: 'GB',
          name: 'United Kingdom',
          flag: '🇬🇧'
        }); // Second call (GB) succeeds

      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: 'en-XX' // Invalid primary
      });

      Object.defineProperty(global.navigator, 'languages', {
        writable: true,
        value: ['en-XX', 'en-GB', 'en'] // Valid fallback
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).toHaveBeenCalledWith('XX');
      expect(mockGetCountryByCode).toHaveBeenCalledWith('GB');
      expect(result).toBe('GB');
    });

    it('should skip locales without country codes in fallback', () => {
      mockGetCountryByCode.mockReturnValue(undefined);

      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: 'en-XX'
      });

      Object.defineProperty(global.navigator, 'languages', {
        writable: true,
        value: ['en-XX', 'en', 'fr'] // No valid country codes in fallback
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).toHaveBeenCalledWith('XX');
      expect(mockGetCountryByCode).toHaveBeenCalledTimes(1); // Only called for primary
      expect(result).toBeNull();
    });

    it('should handle empty or single-item languages array', () => {
      mockGetCountryByCode.mockReturnValue(undefined);

      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: 'en-XX'
      });

      // Test empty array
      Object.defineProperty(global.navigator, 'languages', {
        writable: true,
        value: []
      });

      let result = detectUserCountry();
      expect(result).toBeNull();

      // Test single-item array
      Object.defineProperty(global.navigator, 'languages', {
        writable: true,
        value: ['en-XX']
      });

      result = detectUserCountry();
      expect(result).toBeNull();
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle missing navigator.language', () => {
      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: undefined
      });

      Object.defineProperty(global.navigator, 'languages', {
        writable: true,
        value: undefined
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle navigator.languages fallback when language is missing', () => {
      mockGetCountryByCode.mockReturnValue({
        code: 'CA',
        name: 'Canada',
        flag: '🇨🇦'
      });

      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: undefined
      });

      Object.defineProperty(global.navigator, 'languages', {
        writable: true,
        value: ['en-CA']
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).toHaveBeenCalledWith('CA');
      expect(result).toBe('CA');
    });

    it('should handle exceptions gracefully', () => {
      // Mock getCountryByCode to throw an error
      mockGetCountryByCode.mockImplementation(() => {
        throw new Error('Test error');
      });

      const result = detectUserCountry();

      expect(result).toBeNull();
    });

    it('should handle missing navigator object', () => {
      // Temporarily remove navigator
      Object.defineProperty(global, 'navigator', {
        writable: true,
        value: undefined
      });

      const result = detectUserCountry();

      expect(result).toBeNull();
    });
  });

  describe('Case sensitivity', () => {
    it('should handle lowercase country codes', () => {
      mockGetCountryByCode.mockReturnValue({
        code: 'US',
        name: 'United States',
        flag: '🇺🇸'
      });

      Object.defineProperty(global.navigator, 'language', {
        writable: true,
        value: 'en-us' // lowercase
      });

      const result = detectUserCountry();

      expect(mockGetCountryByCode).toHaveBeenCalledWith('US'); // Should be uppercase
      expect(result).toBe('US');
    });
  });
});
