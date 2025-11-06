import type { Wallet } from 'thirdweb/wallets';
import type { SmartWalletOptions } from 'thirdweb/wallets';
import { getValidSiweAuthToken, SiweAuth } from '../../core/auth';
import type { LoginPayload } from '../../core/util/types';

/**
 * Format a SIWE login payload into an EIP-4361 compliant message
 * This follows the full EIP-4361 specification format
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
  const { domain, address, uri, version, chainId, nonce, issuedAt } = payload;

  // Build the message according to EIP-4361 format
  let message = `${domain} wants you to sign in with your Ethereum account:\n${address}`;

  // Add statement if present (with empty line before it per EIP-4361)
  if (payload.statement) {
    message += `\n\n${payload.statement}`;
  }

  // Add required fields
  message += `\n\nURI: ${uri}`;
  message += `\nVersion: ${version}`;
  message += `\nChain ID: ${chainId}`;
  message += `\nNonce: ${nonce}`;
  message += `\nIssued At: ${issuedAt}`;

  // Add optional fields if present
  if (payload.expirationTime) {
    message += `\nExpiration Time: ${payload.expirationTime}`;
  }

  if (payload.notBefore) {
    message += `\nNot Before: ${payload.notBefore}`;
  }

  if (payload.requestId) {
    message += `\nRequest ID: ${payload.requestId}`;
  }

  // Add resources if present
  if (payload.resources && payload.resources.length > 0) {
    message += '\nResources:';
    for (const resource of payload.resources) {
      message += `\n- ${resource}`;
    }
  }

  return message;
}

/**
 * Perform SIWE authentication after wallet connection
 * This function generates a SIWE payload, signs it with the wallet account,
 * and sends it to the Panna API for verification
 *
 * @param wallet - The connected wallet instance
 * @param siweAuth - The SiweAuth instance for handling SIWE operations
 * @param options - Optional configuration
 * @param options.chainId - The chain ID to use for signing (optional)
 * @returns Promise<boolean> - Returns true if authentication was successful, false otherwise
 *
 * @example
 * ```ts
 * // With chain ID (for login form)
 * const success = await handleSiweAuth(siweAuth, wallet, { chainId: chain.lisk.id });
 *
 * // Without chain ID (for OTP form)
 * const success = await handleSiweAuth(siweAuth, wallet);
 * ```
 */
export async function handleSiweAuth(
  siweAuth: SiweAuth,
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

    const payload = await siweAuth.generatePayload({
      address: account.address
    });

    const siweMessage = buildSiweMessage(payload);

    // Try to get ERC-191 compliant ECDSA signature for SIWE
    const signMessageParams = { message: siweMessage };
    if (options?.chainId) {
      Object.assign(signMessageParams, { chainId: options.chainId });
    }

    const signature = await account.signMessage(signMessageParams);

    const signedPayload = {
      payload,
      signature
    };

    const isSuccess = await siweAuth.login({
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
 * @param siweAuth - The SiweAuth instance to use for authentication
 * @param wallet - Optional wallet instance for re-authentication if token is expired
 * @param options - Optional configuration for re-authentication
 * @returns Promise<string | null> - Valid auth token or null if unavailable/failed
 *
 * @example
 * ```ts
 * // Without wallet (just checks if token is valid)
 * const token = await getOrRefreshSiweToken(siweAuth);
 *
 * // With wallet (will re-authenticate if expired)
 * const token = await getOrRefreshSiweToken(siweAuth, wallet, { chainId: chain.lisk.id });
 * ```
 */
export async function getOrRefreshSiweToken(
  siweAuth: SiweAuth,
  wallet?: Wallet,
  options?: { chainId?: number }
): Promise<string | null> {
  // First check if we have a valid (non-expired) token
  const validToken = await getValidSiweAuthToken();

  if (validToken) {
    return validToken;
  }

  // If no valid token and we have a wallet, try to (re-)authenticate
  if (wallet) {
    const isExpired = siweAuth.isTokenExpired();

    if (isExpired) {
      console.log('SIWE token expired, attempting re-authentication...');
    }

    const reAuthSuccess = await handleSiweAuth(siweAuth, wallet, options);

    if (reAuthSuccess) {
      // Return the newly generated token
      return siweAuth.getValidAuthToken();
    } else {
      console.warn('SIWE re-authentication failed');
      return null;
    }
  }

  // No valid token and can't re-authenticate (no wallet)
  return null;
}
