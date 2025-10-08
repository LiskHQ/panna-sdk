import type { Wallet } from 'thirdweb/wallets';
import type { SmartWalletOptions } from 'thirdweb/wallets';
import { formatEther, formatUnits } from 'viem';
import { TokenBalance } from '@/mocks/token-balances';
import { chains, lisk } from '../../core';
import {
  generateSiwePayload,
  siweLogin,
  getValidSiweAuthToken,
  isSiweTokenExpired
} from '../../core/auth';
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
 * Format a SIWE login payload into the format expected by Panna API
 * This follows the simplified format used by the Panna API, not the full EIP-4361 spec
 *
 * @param payload - The SIWE login payload
 * @returns The formatted SIWE message string
 *
 * @example
 * ```ts
 * const message = buildSiweMessage(payload);
 * const signature = await account.signMessage({ message });
 * ```
 */
export function buildSiweMessage(payload: LoginPayload): string {
  const { domain, address, uri, version, chain_id, nonce, issued_at } = payload;

  // Use the simplified format expected by Panna API (matches the working test script)
  return `${domain} wants you to sign in with your Ethereum account:
${address}

URI: ${uri}
Version: ${version}
Chain ID: ${chain_id}
Nonce: ${nonce}
Issued At: ${issued_at}`;
}

/**
 * Perform SIWE authentication after wallet connection
 * This function generates a SIWE payload, signs it with the wallet account,
 * and sends it to the Panna API for verification
 *
 * @param wallet - The connected wallet instance
 * @param options - Optional configuration
 * @param options.chainId - The chain ID to use for signing (optional)
 * @returns Promise<boolean> - Returns true if authentication was successful, false otherwise
 *
 * @example
 * ```ts
 * // With chain ID (for login form)
 * const success = await handleSiweAuth(wallet, { chainId: 4202 });
 *
 * // Without chain ID (for OTP form)
 * const success = await handleSiweAuth(wallet);
 * ```
 */
export async function handleSiweAuth(
  wallet: Wallet,
  options?: { chainId?: number }
): Promise<boolean> {
  try {
    const account = wallet.getAccount();
    const isSmartAccount = !!(
      wallet.getConfig() as unknown as { smartAccount: SmartWalletOptions }
    ).smartAccount;

    if (!account) {
      console.warn('Kein Account für SIWE-Authentifizierung gefunden');
      return false;
    }

    const payload = await generateSiwePayload({
      address: account.address
    });

    const siweMessage = buildSiweMessage(payload);

    // Try to get ERC-191 compliant ECDSA signature for SIWE
    let signature;
    if (options?.chainId) {
      signature = await account.signMessage({
        message: siweMessage,
        chainId: options.chainId
      });
    } else {
      signature = await account.signMessage({
        message: siweMessage
      });
    }

    const signedPayload = {
      payload,
      signature
    };

    const isSuccess = await siweLogin({
      payload: signedPayload.payload,
      signature: signedPayload.signature,
      account,
      isSafeWallet: isSmartAccount
    });

    if (!isSuccess) {
      console.warn('SIWE authentication failed');
    }

    return isSuccess;
  } catch (error) {
    console.error('SIWE Authentifizierungsfehler:', error);

    // Check if it's a 401 unauthorized error from thirdweb
    if (error instanceof Error && error.message.includes('401')) {
      console.warn(
        'Wallet noch nicht bei thirdweb Service authentifiziert - SIWE-Authentifizierung übersprungen'
      );
      // Don't treat this as a fatal error, just log it
      return false;
    }

    return false;
  }
}

/**
 * Get a valid SIWE auth token with automatic re-authentication
 * If the token is expired and a wallet is provided, automatically re-authenticates
 *
 * @param wallet - Optional wallet instance for re-authentication if token is expired
 * @param options - Optional configuration for re-authentication
 * @returns Promise<string | null> - Valid auth token or null if unavailable/failed
 *
 * @example
 * ```ts
 * // Without wallet (just checks if token is valid)
 * const token = await getOrRefreshSiweToken();
 *
 * // With wallet (will re-authenticate if expired)
 * const token = await getOrRefreshSiweToken(wallet, { chainId: 4202 });
 * ```
 */
export async function getOrRefreshSiweToken(
  wallet?: Wallet,
  options?: { chainId?: number }
): Promise<string | null> {
  // First check if we have a valid (non-expired) token
  const validToken = await getValidSiweAuthToken();

  if (validToken) {
    return validToken;
  }

  // If token is expired and we have a wallet, try to re-authenticate
  if (wallet && isSiweTokenExpired()) {
    const reAuthSuccess = await handleSiweAuth(wallet, options);

    if (reAuthSuccess) {
      // Return the newly generated token
      return await getValidSiweAuthToken();
    } else {
      console.warn('SIWE re-authentication failed');
      return null;
    }
  }

  // No valid token and can't re-authenticate
  return null;
}
