import getUnicodeFlag from 'country-flag-icons/unicode';
import iso3166 from 'iso-3166-1-alpha-2';
import type { Country } from '../types/country.types';

/**
 * Dynamically generates a comprehensive list of all countries with their ISO codes, names, and flag emojis.
 * Uses iso-3166-1-alpha-2 for country codes/names and country-flag-icons for flag emojis.
 * This ensures we have all 251 countries from the ISO 3166-1 alpha-2 standard.
 */
export const COUNTRIES: Country[] = iso3166
  .getCodes()
  .map((code: string) => {
    const name = iso3166.getCountry(code);
    const flag = getUnicodeFlag(code);

    // Skip if we can't get the name or flag (some codes might not have flags)
    if (!name || !flag) {
      return null;
    }

    return {
      code,
      name,
      flag
    };
  })
  .filter((country): country is Country => country !== null)
  .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

const ONRAMP_SUPPORTED_COUNTRY_CODES = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'NL', // Netherlands
  'NO', // Norway
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'ES', // Spain
  'SE', // Sweden
  'CH', // Switzerland
  'GB' // United Kingdom
];

export const ONRAMP_SUPPORTED_COUNTRIES = COUNTRIES.filter((country) =>
  ONRAMP_SUPPORTED_COUNTRY_CODES.includes(country.code)
);
