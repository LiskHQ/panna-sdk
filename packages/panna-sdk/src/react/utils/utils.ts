import { lisk, liskSepolia } from '../../core';
import { liskSepoliaTokenConfig, liskTokenConfig } from '../consts';

/**
 * Get the supported tokens for a given chain.
 * @param testingStatus - The testing status
 * @returns The supported tokens for the given chain
 */
export function getSupportedTokens(testingStatus?: boolean | undefined) {
  return testingStatus ? liskSepoliaTokenConfig : liskTokenConfig;
}

/**
 * Get the chain settings for a given chain.
 * @param testingStatus - The testing status
 * @returns The chain settings for the given chain
 */
export function getChain(testingStatus?: boolean | undefined) {
  return testingStatus ? liskSepolia : lisk;
}

/**
 * Get the chain settings based on the current environment.
 * In production (NODE_ENV=production), uses lisk.
 * In development/staging (NODE_ENV=development), uses liskSepolia.
 * @returns The chain settings for the current environment
 */
export function getEnvironmentChain() {
  const isProduction =
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
  return isProduction ? lisk : liskSepolia;
}

/**
 * Get the account abstraction settings for a given chain.
 * @param testingStatus - The testing status
 * @returns The account abstraction settings for the given chain
 */
export function getAAChain(testingStatus?: boolean | undefined) {
  return getChain(testingStatus);
}

/**
 * Detect user's country based on browser locale.
 * @returns The detected country code or null if detection fails
 */
export function detectUserCountry(): string | null {
  try {
    // Get browser locale (e.g., "en-US", "fr-FR")
    const locale = navigator.language || navigator.languages?.[0];
    if (locale && locale.includes('-')) {
      const countryCode = locale.split('-')[1]?.toUpperCase();
      return countryCode || null;
    }
    return null;
  } catch {
    return null;
  }
}
