import { formatEther, formatUnits } from 'viem';
import { TokenBalance } from '@/mocks/token-balances';
import { lisk, liskSepolia } from '../../core';
import { liskSepoliaTokenConfig, liskTokenConfig } from '../consts';
import { getCountryByCode } from './countries';

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
 * Detect user's country based on browser locale with validation.
 * Returns a validated 2-letter country code that exists in our supported countries.
 * @returns The detected and validated country code or null if detection/validation fails
 */
export function detectUserCountry(): string | null {
  try {
    // Method 1: Browser locale detection (e.g., "en-US", "fr-FR")
    const locale = navigator.language || navigator.languages?.[0];
    if (locale && locale.includes('-')) {
      const countryCode = locale.split('-')[1]?.toUpperCase();
      if (countryCode) {
        // Validate the detected country code exists in our supported countries
        const country = getCountryByCode(countryCode);
        if (country) {
          return country.code; // Return the validated 2-letter code
        }
      }
    }

    // Method 2: Try additional browser locales if available
    if (navigator.languages && navigator.languages.length > 1) {
      for (let i = 1; i < navigator.languages.length; i++) {
        const altLocale = navigator.languages[i];
        if (altLocale && altLocale.includes('-')) {
          const countryCode = altLocale.split('-')[1]?.toUpperCase();
          if (countryCode) {
            const country = getCountryByCode(countryCode);
            if (country) {
              return country.code;
            }
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Renders the fiat amount based on the token information and amount.
 * @param tokenInfo - The token information
 * @param amount - The amount to convert
 * @returns The rendered fiat amount
 */
export const renderFiatAmount = (tokenInfo: TokenBalance, amount: string) => {
  // This function calculates the fiat equivalent of the crypto amount
  // using the formula: (fiatBalance * inputAmount * tokenDecimals) / tokenBalance
  // We multiply by 10 ^ 18 to retain precision during division
  // then format the result from wei to ether
  return Number(
    formatEther(
      BigInt(
        tokenInfo.fiatBalance.amount *
          (!isNaN(Number(amount)) ? Number(amount) : 0) *
          10 ** tokenInfo.token.decimals *
          10 ** 18
      ) / (tokenInfo.tokenBalance.value || BigInt(1))
    )
  ).toFixed(2);
};

/**
 * Renders the crypto amount based on the token information and amount.
 * @param tokenInfo - The token information
 * @param amount - The amount to convert
 * @returns The rendered crypto amount
 */
export const renderCryptoAmount = (tokenInfo: TokenBalance, amount: string) => {
  // This function calculates the crypto equivalent of the fiat amount
  // using the formula: (tokenBalance * inputAmount) / (fiatBalance * tokenDecimals)
  return Number(
    formatUnits(
      (tokenInfo.tokenBalance.value *
        BigInt(
          (!isNaN(Number(amount)) ? Number(amount) : 0) *
            10 ** tokenInfo.token.decimals
        )) /
        BigInt(
          Number(
            tokenInfo.fiatBalance.amount
              ? Number(tokenInfo.fiatBalance.amount).toFixed(2)
              : '1'
          ) *
            10 ** tokenInfo.token.decimals
        ),
      tokenInfo.token.decimals
    )
  ).toFixed(6);
};
