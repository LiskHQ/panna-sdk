import type { Wallet } from 'thirdweb/wallets';
import type { SmartWalletOptions } from 'thirdweb/wallets';
import {
  generateSiwePayload,
  siweLogin,
  getValidSiweAuthToken,
  isSiweTokenExpired
} from '../../core/auth';
import type { LoginPayload } from '../../core/utils/types';

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
      console.warn('No account found for SIWE authentication');
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
    console.error('SIWE authentication error:', error);

    // Check if it's a 401 unauthorized error from thirdweb
    if (error instanceof Error && error.message.includes('401')) {
      console.warn(
        'Wallet not yet authenticated with thirdweb service - SIWE authentication skipped'
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
    console.log('SIWE token expired, attempting re-authentication...');

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
