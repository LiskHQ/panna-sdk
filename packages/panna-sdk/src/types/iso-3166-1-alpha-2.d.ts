// Declaration file for iso-3166-1-alpha-2 module
// This file provides type definitions for the iso-3166-1-alpha-2 package
// which is used to get country names from ISO 3166-1 alpha-2 codes.
declare module 'iso-3166-1-alpha-2' {
  export function getCountry(code: string): string | undefined;
  export function getCodes(): string[];
}
