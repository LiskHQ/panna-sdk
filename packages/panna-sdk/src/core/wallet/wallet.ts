import {
  authenticate,
  authenticateWithRedirect,
  createWallet,
  ecosystemWallet,
  getProfiles,
  getUserEmail,
  getUserPhoneNumber,
  injectedProvider,
  linkProfile,
  preAuthenticate,
  unlinkProfile
} from 'thirdweb/wallets';
import { type Chain } from '../chain/types';
import { EcosystemId, type PannaClient } from '../client';
import {
  type Account,
  type ConnectParams,
  type CreateAccountOptions,
  type EmailPrepareParams,
  type LinkedAccount,
  LoginStrategy,
  type PhonePrepareParams
} from './types';

/**
 * Connect to ecosystem wallet with any authentication strategy
 * Handles email, phone, social, and external wallet connections
 *
 * @param params - Connection parameters with strategy-specific fields
 * @returns Connected Account instance
 * @throws Error if wallet strategy and external wallet is not installed
 *
 * @example Email Authentication
 * ```typescript
 * import { wallet, EcosystemId } from 'panna-sdk/core';
 *
 * const ecosystem = {
 *   id: EcosystemId.LISK,
 *   partnerId: 'your-partner-id'
 * };
 *
 * // Step 1: Prepare login (send OTP)
 * await wallet.prepareLogin({
 *   client: pannaClient,
 *   ecosystem,
 *   strategy: wallet.LoginStrategy.EMAIL,
 *   email: 'user@example.com'
 * });
 *
 * // Step 2: Connect with verification code
 * const account = await wallet.connect({
 *   client: pannaClient,
 *   ecosystem,
 *   strategy: wallet.LoginStrategy.EMAIL,
 *   email: 'user@example.com',
 *   verificationCode: '123456'
 * });
 * ```
 *
 * @example Social Authentication
 * ```typescript
 * const ecosystem = {
 *   id: EcosystemId.LISK,
 *   partnerId: 'your-partner-id'
 * };
 *
 * const account = await wallet.connect({
 *   client: pannaClient,
 *   ecosystem,
 *   strategy: LoginStrategy.GOOGLE,
 *   mode: 'redirect',
 *   redirectUrl: `${window.location.origin}/callback`
 * });
 * ```
 *
 * @example External Wallet Connection
 * ```typescript
 * const ecosystem = {
 *   id: EcosystemId.LISK,
 *   partnerId: 'your-partner-id'
 * };
 *
 * try {
 *   const account = await wallet.connect({
 *     client: pannaClient,
 *     ecosystem,
 *     strategy: LoginStrategy.WALLET,
 *     walletId: 'io.metamask',
 *     chain: chain.liskSepolia
 *   });
 *   console.log('Connected:', account.address);
 * } catch (error) {
 *   if (error.message.includes('not installed')) {
 *     console.error('Wallet not available');
 *   }
 * }
 * ```
 */
export async function connect(params: ConnectParams): Promise<Account> {
  // Create ecosystem wallet instance
  const ecoWallet = ecosystemWallet(params.ecosystem.id, {
    partnerId: params.ecosystem.partnerId
  });

  // Handle strategy-specific connection logic
  if (params.strategy === LoginStrategy.WALLET) {
    // External wallet strategy: check availability, create wallet, connect
    const walletParams = params as typeof params & {
      walletId: string;
      chain: Chain;
    };

    const provider = injectedProvider(
      walletParams.walletId as Parameters<typeof injectedProvider>[0]
    );

    if (!provider) {
      throw new Error(
        `External wallet "${walletParams.walletId}" is not installed or available. Please install the wallet extension and try again.`
      );
    }

    const externalWallet = createWallet(
      walletParams.walletId as Parameters<typeof createWallet>[0]
    );

    const account = await ecoWallet.connect({
      client: walletParams.client,
      strategy: LoginStrategy.WALLET,
      chain: walletParams.chain,
      wallet: externalWallet
    } as Parameters<typeof ecoWallet.connect>[0]);

    return account as unknown as Account;
  } else if (
    params.strategy === LoginStrategy.EMAIL ||
    params.strategy === LoginStrategy.PHONE
  ) {
    // Email/Phone strategy: authenticate with verification code
    await authenticate(params as Parameters<typeof authenticate>[0]);
    return ecoWallet as Account;
  } else {
    // Social strategy: redirect-based OAuth flow
    await authenticateWithRedirect(
      params as Parameters<typeof authenticateWithRedirect>[0]
    );
    return ecoWallet as Account;
  }
}

/**
 * Prepare the login process (pre-authentication)
 * @param params - Parameters including client and authentication details
 * @returns Pre-authentication result (void)
 */
export async function prepareLogin(
  params: EmailPrepareParams | PhonePrepareParams
): Promise<void> {
  return preAuthenticate(params as Parameters<typeof preAuthenticate>[0]);
}

/**
 * Create a new user account (Lisk ecosystem wallet)
 * @param options - The account configuration options
 * @param [options.ecosystemId] - The ecosystem ID (defaults to EcosystemId.LISK)
 * @param options.partnerId - Partner ID for the dApp
 * @returns New user account
 */
export function createAccount({
  ecosystemId = EcosystemId.LISK,
  partnerId
}: CreateAccountOptions): Account {
  return ecosystemWallet(ecosystemId, { partnerId });
}

/**
 * Get the user's email address
 * @param params - Parameters including client and ecosystem configuration
 * @returns User's email address or undefined if not available
 */
export async function getEmail(params: {
  client: PannaClient;
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  };
}): Promise<string | undefined> {
  return getUserEmail(params as Parameters<typeof getUserEmail>[0]);
}

/**
 * Get the user's phone number
 * @param params - Parameters including client and ecosystem configuration
 * @returns User's phone number or undefined if not available
 */
export async function getPhoneNumber(params: {
  client: PannaClient;
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  };
}): Promise<string | undefined> {
  return getUserPhoneNumber(params as Parameters<typeof getUserPhoneNumber>[0]);
}

/**
 * Link an external account to the user's account
 * @param params - Parameters including client and authentication method
 * @returns Updated list of linked profiles
 */
export async function linkAccount(
  params: Parameters<typeof linkProfile>[0]
): Promise<LinkedAccount[]> {
  return linkProfile(params);
}

/**
 * Get all linked accounts for the current user
 * @param params - Parameters including client and ecosystem configuration
 * @returns List of linked accounts
 */
export async function getLinkedAccounts(params: {
  client: PannaClient;
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  };
}): Promise<LinkedAccount[]> {
  return getProfiles(params as Parameters<typeof getProfiles>[0]);
}

/**
 * Unlink an external account from the user's account
 * @param params - Parameters including client and profile to unlink
 * @returns Updated list of profiles
 */
export async function unlinkAccount(params: {
  client: PannaClient;
  profileToUnlink: LinkedAccount;
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  };
}): Promise<LinkedAccount[]> {
  return unlinkProfile(params as Parameters<typeof unlinkProfile>[0]);
}
