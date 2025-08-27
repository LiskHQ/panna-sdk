import countryToCurrency from 'country-to-currency';
import getSymbolFromCurrency from 'currency-symbol-map';
import * as countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { DEFAULT_CURRENCY } from 'src/core';
import { COUNTRIES } from '../consts';
import type { Country } from '../types/country.types';

// Register English locale for i18n-iso-countries
countries.registerLocale(enLocale);

// Export countries sorted alphabetically by name
export const COUNTRIES_SORTED = COUNTRIES.sort((a, b) =>
  a.name.localeCompare(b.name)
);

/**
 * Get country by ISO 3166-1 alpha-2 or alpha-3 country code
 * @param code - 2-letter (e.g., "US") or 3-letter (e.g., "USA") country code
 * @returns Country object or undefined if not found
 */
export function getCountryByCode(code: string): Country | undefined {
  if (!code) return undefined;

  const normalizedCode = code.toUpperCase();

  // Handle 2-letter codes (current format)
  if (normalizedCode.length === 2) {
    // Validate it's a valid ISO 3166-1 alpha-2 code
    if (!countries.isValid(normalizedCode)) {
      return undefined;
    }
    return COUNTRIES.find((country) => country.code === normalizedCode);
  }

  // Handle 3-letter codes by converting to 2-letter
  if (normalizedCode.length === 3) {
    // Validate it's a valid ISO 3166-1 alpha-3 code
    if (!countries.isValid(normalizedCode)) {
      return undefined;
    }
    const alpha2Code = countries.alpha3ToAlpha2(normalizedCode);
    return alpha2Code
      ? COUNTRIES.find((country) => country.code === alpha2Code)
      : undefined;
  }

  // Invalid length
  return undefined;
}

/**
 * Get currency code for a country (supports both 2-letter and 3-letter codes)
 * @param countryCode - 2-letter (e.g., "US") or 3-letter (e.g., "USA") country code
 * @returns Currency code (e.g., "USD") or default currency if not found
 */
export function getCurrencyForCountry(countryCode: string): string {
  if (!countryCode) return DEFAULT_CURRENCY;

  let alpha2Code = countryCode.toUpperCase();

  // Convert 3-letter to 2-letter if needed
  if (alpha2Code.length === 3) {
    const converted = countries.alpha3ToAlpha2(alpha2Code);
    if (!converted) return DEFAULT_CURRENCY;
    alpha2Code = converted;
  }

  // Validate it's a 2-letter code
  if (alpha2Code.length !== 2) return DEFAULT_CURRENCY;

  return (
    countryToCurrency[alpha2Code as keyof typeof countryToCurrency] ||
    DEFAULT_CURRENCY
  );
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  return getSymbolFromCurrency(currencyCode) || '$';
}

/**
 * Get currency symbol for a country code (supports both 2-letter and 3-letter codes)
 * @param countryCode - 2-letter (e.g., "US") or 3-letter (e.g., "USA") country code
 * @returns Currency symbol (e.g., "$") or default symbol if not found
 */
export function getCurrencySymbolForCountry(countryCode: string): string {
  const currency = getCurrencyForCountry(countryCode);
  return getCurrencySymbol(currency);
}
