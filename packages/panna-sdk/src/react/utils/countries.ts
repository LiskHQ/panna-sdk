import { COUNTRIES } from '../consts';
import type { Country } from '../types/country.types';

/**
 * Get country by ISO 3166-1 alpha-2 country code
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((country) => country.code === code);
}

/**
 * Get countries sorted alphabetically by name
 */
export function getCountriesSortedByName(): Country[] {
  return [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get countries with popular ones at the top, followed by the rest alphabetically
 */
export function getCountriesWithPopularFirst(): Country[] {
  // Popular countries based on common usage
  const popularCodes = [
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

  const popularCountries = popularCodes
    .map((code) => getCountryByCode(code))
    .filter(Boolean) as Country[];

  const otherCountries = COUNTRIES.filter(
    (country) => !popularCodes.includes(country.code)
  ).sort((a, b) => a.name.localeCompare(b.name));

  return [...popularCountries, ...otherCountries];
}

/**
 * Country to currency mapping based on ISO country codes
 */
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // USD countries
  US: 'USD',
  GU: 'USD',
  EC: 'USD',
  SV: 'USD',
  PA: 'USD',

  // EUR countries (Eurozone)
  AD: 'EUR',
  AT: 'EUR',
  BE: 'EUR',
  CY: 'EUR',
  DE: 'EUR',
  EE: 'EUR',
  ES: 'EUR',
  FI: 'EUR',
  FR: 'EUR',
  GR: 'EUR',
  IE: 'EUR',
  IT: 'EUR',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  MC: 'EUR',
  MT: 'EUR',
  NL: 'EUR',
  PT: 'EUR',
  SI: 'EUR',
  SK: 'EUR',
  SM: 'EUR',

  // GBP countries
  GB: 'GBP',
  GG: 'GBP',
  IM: 'GBP',
  JE: 'GBP',

  // CAD countries
  CA: 'CAD',

  // AUD countries
  AU: 'AUD',

  // JPY countries
  JP: 'JPY',

  // NZD countries
  NZ: 'NZD'

  // Other major currencies - defaulting to USD for countries not explicitly mapped
};

/**
 * Currency symbol mapping
 */
const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  NZD: 'NZ$'
};

/**
 * Get currency code for a country
 */
export function getCurrencyForCountry(countryCode: string): string {
  return COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOL_MAP[currencyCode] || '$';
}

/**
 * Get currency symbol for a country code
 */
export function getCurrencySymbolForCountry(countryCode: string): string {
  const currency = getCurrencyForCountry(countryCode);
  return getCurrencySymbol(currency);
}
