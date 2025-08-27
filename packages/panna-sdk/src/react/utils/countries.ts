import countryToCurrency from 'country-to-currency';
import getSymbolFromCurrency from 'currency-symbol-map';
import { DEFAULT_CURRENCY } from 'src/core';
import { COUNTRIES } from '../consts';
import type { Country } from '../types/country.types';

// Popular countries based on common usage
const POPULAR_COUNTRY_CODES = [
  'US',
  'GB',
  'CA',
  'AU',
  'DE',
  'FR',
  'ES',
  'IT',
  'NL',
  'BR'
];

const POPULAR_COUNTRIES = POPULAR_COUNTRY_CODES.map((code) =>
  COUNTRIES.find((country) => country.code === code)
).filter(Boolean) as Country[];

const OTHER_COUNTRIES = COUNTRIES.filter(
  (country) => !POPULAR_COUNTRY_CODES.includes(country.code)
).sort((a, b) => a.name.localeCompare(b.name));

export const COUNTRIES_WITH_POPULAR_FIRST = [
  ...POPULAR_COUNTRIES,
  ...OTHER_COUNTRIES
];

/**
 * Get country by ISO 3166-1 alpha-2 country code
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((country) => country.code === code);
}

/**
 * Get currency code for a country
 */
export function getCurrencyForCountry(countryCode: string): string {
  return (
    countryToCurrency[countryCode as keyof typeof countryToCurrency] ||
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
 * Get currency symbol for a country code
 */
export function getCurrencySymbolForCountry(countryCode: string): string {
  const currency = getCurrencyForCountry(countryCode);
  return getCurrencySymbol(currency);
}
