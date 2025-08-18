import type { Country } from '../components/buy/types';
import { COUNTRIES } from '../consts';

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
