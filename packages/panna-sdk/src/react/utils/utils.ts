import { formatEther, formatUnits } from 'viem';
import { TokenBalance } from '@/mocks/token-balances';
import { chains, lisk } from '../../core';
import type { LoginPayload } from '../../core/utils/types';
import { tokenConfig } from '../consts';
import { getCountryByCode } from './countries';

/**
 * Get the supported tokens for a given chain.
 * @param chainId - The chain ID from environment variable
 * @returns The supported tokens for the given chain
 */
export function getSupportedTokens(chainId?: string) {
  const envChain = getEnvironmentChain(chainId);
  return tokenConfig[envChain.id] ?? [];
}

/**
 * Get the chain settings based on the current environment.
 * In production (CHAIN_ID=1135), uses lisk.
 * In development/staging (CHAIN_ID=4202), uses liskSepolia.
 * @param chainId - The chain ID from environment variable
 * @returns The chain settings for the current environment
 */
export function getEnvironmentChain(chainId?: string) {
  const chain = chainId ? chains[Number(chainId)] : undefined;
  return chain ?? lisk;
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
 * This function calculates the fiat equivalent of the crypto amount
 * using the formula: (fiatBalance * inputAmount * tokenDecimals) / tokenBalance
 * We multiply by 10 ^ 18 to retain precision during division
 * then format the result from wei to ether
 * @param tokenInfo - The token information
 * @param amount - The amount to convert
 * @returns The rendered fiat amount
 */
export const renderFiatAmount = (tokenInfo: TokenBalance, amount: string) => {
  return Number(
    formatEther(
      BigInt(
        tokenInfo.fiatBalance.amount *
          (!isNaN(Number(amount)) ? Number(amount) : 0) *
          10 ** tokenInfo.token.decimals *
          10 ** 18
      ) /
        (tokenInfo.tokenBalance.value ||
          BigInt(1 * 10 ** tokenInfo.token.decimals))
    )
  ).toFixed(2);
};

/**
 * Renders the crypto amount based on the token information and fiat input amount.
 * Calculates crypto equivalent using: (tokenBalance * inputAmount) / fiatBalance
 *
 * @param tokenInfo - The token information containing balances and metadata
 * @param amount - The amount to convert (as string)
 * @returns The rendered crypto amount formatted to 6 decimal places, or "0.000000" if invalid
 */
export const renderCryptoAmount = (tokenInfo: TokenBalance, amount: string) => {
  // Input validation
  if (!tokenInfo?.tokenBalance?.value || !tokenInfo?.token?.decimals) {
    return '0.000000';
  }

  // Parse and validate the input amount
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount < 0) {
    return '0.000000';
  }

  // Handle zero or invalid fiat balance
  const fiatAmount = tokenInfo.fiatBalance?.amount
    ? parseFloat(String(tokenInfo.fiatBalance.amount))
    : 1;

  if (fiatAmount <= 0) {
    return '0.000000';
  }

  try {
    const { decimals } = tokenInfo.token;
    const tokenBalance = tokenInfo.tokenBalance.value;

    // Convert input amount to BigInt with proper decimal scaling
    // Using parseFloat ensures we handle decimal inputs correctly
    const scaledInputAmount = BigInt(
      Math.floor(numericAmount * 10 ** decimals)
    );

    // Convert fiat amount to BigInt with proper decimal scaling
    const scaledFiatAmount = BigInt(Math.floor(fiatAmount * 10 ** decimals));

    // Perform the calculation: (tokenBalance * inputAmount) / fiatBalance
    const result = (tokenBalance * scaledInputAmount) / scaledFiatAmount;

    // Format the result back to human-readable format
    const formattedResult = formatUnits(result, decimals);

    return Number(formattedResult).toFixed(6);
  } catch (error) {
    console.warn('Error calculating crypto amount:', error);
    return '0.000000';
  }
};

/**
 * Format a SIWE login payload into a standard EIP-4361 message string
 *
 * @param payload - The SIWE login payload
 * @returns The formatted SIWE message string
 *
 * @example
 * ```ts
 * const message = formatSiweMessage(payload);
 * const signature = await account.signMessage({ message });
 * ```
 */
export function formatSiweMessage(payload: LoginPayload): string {
  const {
    domain,
    address,
    statement,
    uri,
    version,
    chain_id,
    nonce,
    issued_at,
    expiration_time,
    invalid_before,
    resources
  } = payload;

  let message = `${domain} wants you to sign in with your Ethereum account:\n`;
  message += `${address}\n\n`;

  if (statement) {
    message += `${statement}\n\n`;
  }

  message += `URI: ${uri}\n`;
  message += `Version: ${version}\n`;
  message += `Chain ID: ${chain_id}\n`;
  message += `Nonce: ${nonce}\n`;
  message += `Issued At: ${issued_at}\n`;

  if (expiration_time) {
    message += `Expiration Time: ${expiration_time}\n`;
  }

  if (invalid_before) {
    message += `Not Before: ${invalid_before}\n`;
  }

  if (resources && resources.length > 0) {
    message += `Resources:\n`;
    resources.forEach((resource: string) => {
      message += `- ${resource}\n`;
    });
  }

  return message;
}
