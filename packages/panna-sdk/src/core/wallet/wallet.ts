import {
  authenticate,
  authenticateWithRedirect,
  ecosystemWallet,
  getProfiles,
  getUserEmail,
  getUserPhoneNumber,
  linkProfile,
  preAuthenticate,
  unlinkProfile
} from 'thirdweb/wallets';
import { EcosystemId, type FlowClient } from '../client';
import {
  type Account,
  type AuthParams,
  type CreateAccountOptions,
  type EmailPrepareParams,
  type LinkedAccount,
  type PhonePrepareParams,
  type SocialLoginParams
} from './types';

/**
 * Login a user with various authentication methods
 * @param params - Login parameters including client and authentication method
 * @returns Authenticated result
 */
export async function login(params: AuthParams) {
  return authenticate(params as Parameters<typeof authenticate>[0]);
}

/**
 * Login a user using social authentication providers with redirect flow
 * @param params - Social login parameters including client, provider strategy and redirect URL
 * @returns Promise that resolves when redirect is initiated
 */
export async function socialLogin(params: SocialLoginParams): Promise<void> {
  return authenticateWithRedirect(
    params as Parameters<typeof authenticateWithRedirect>[0]
  );
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
  client: FlowClient;
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
  client: FlowClient;
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
  params: AuthParams
): Promise<LinkedAccount[]> {
  return linkProfile(params as Parameters<typeof linkProfile>[0]);
}

/**
 * Get all linked accounts for the current user
 * @param params - Parameters including client and ecosystem configuration
 * @returns List of linked accounts
 */
export async function getLinkedAccounts(params: {
  client: FlowClient;
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
  client: FlowClient;
  profileToUnlink: LinkedAccount;
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  };
}): Promise<LinkedAccount[]> {
  return unlinkProfile(params as Parameters<typeof unlinkProfile>[0]);
}
