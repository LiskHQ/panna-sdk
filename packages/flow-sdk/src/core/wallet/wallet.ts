import {
  authenticate,
  authenticateWithRedirect,
  ecosystemWallet,
  getProfiles,
  getUserEmail,
  getUserPhoneNumber,
  linkProfile,
  preAuthenticate,
  unlinkProfile,
  type Wallet,
  type Profile,
  type InAppWalletConnectionOptions,
  type SingleStepAuthArgsType,
  type MultiStepAuthArgsType,
  type InAppWalletAuth
} from 'thirdweb/wallets';
import { type FlowClient } from '../client/client';

// Enum for allowed ecosystem IDs
export enum EcosystemId {
  LISK = 'ecosystem.lisk'
}

// Enum for login strategies
export const LoginStrategy = {
  EMAIL: 'email',
  PHONE: 'phone'
} as const;

// Re-export types with web2-friendly names
export type Account = Wallet;
export type AccountConnectionOptions = InAppWalletConnectionOptions;
export type LoginMethod = InAppWalletAuth;
export type LinkedAccount = Profile;

/**
 * Login a user with various authentication methods
 * @param params - Login parameters including client and authentication method
 * @returns Authenticated result
 */
export async function login(
  params: (SingleStepAuthArgsType | MultiStepAuthArgsType) & {
    client: FlowClient;
    ecosystem: {
      id: EcosystemId;
      partnerId: string;
    };
  }
) {
  return authenticate(params);
}

/**
 * Login a user and redirect to a specified URL
 * @param params - Login parameters including client, redirect URL, and authentication method
 */
export async function loginWithRedirect(params: {
  client: FlowClient;
  strategy: LoginMethod;
  redirectUrl: string;
  mode: 'redirect';
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  };
}) {
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
  params:
    | {
        client: FlowClient;
        strategy: typeof LoginStrategy.EMAIL;
        email: string;
        ecosystem: {
          id: EcosystemId;
          partnerId: string;
        };
      }
    | {
        client: FlowClient;
        strategy: typeof LoginStrategy.PHONE;
        phoneNumber: string;
        ecosystem: {
          id: EcosystemId;
          partnerId: string;
        };
      }
): Promise<void> {
  return preAuthenticate(params);
}

/**
 * Create a new user account (Lisk ecosystem wallet)
 * @param ecosystemId - The ecosystem ID (defaults to EcosystemId.LISK)
 * @param partnerId - Partner ID for the dApp
 * @returns New user account
 */
export function createAccount(
  ecosystemId: EcosystemId = EcosystemId.LISK,
  partnerId: string
): Account {
  return ecosystemWallet(ecosystemId, { partnerId });
}

/**
 * Get the user's email address
 * @param client - Flow client
 * @param ecosystem - Ecosystem configuration with partner ID
 * @returns User's email address or undefined if not available
 */
export async function getEmail(
  client: FlowClient,
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  }
): Promise<string | undefined> {
  return getUserEmail({ client, ecosystem });
}

/**
 * Get the user's phone number
 * @param client - Flow client
 * @param ecosystem - Ecosystem configuration with partner ID
 * @returns User's phone number or undefined if not available
 */
export async function getPhoneNumber(
  client: FlowClient,
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  }
): Promise<string | undefined> {
  return getUserPhoneNumber({ client, ecosystem });
}

/**
 * Link an external account to the user's account
 * @param params - Parameters including client and authentication method
 * @returns Updated list of linked profiles
 */
export async function linkAccount(
  params: (SingleStepAuthArgsType | MultiStepAuthArgsType) & {
    client: FlowClient;
    ecosystem: {
      id: EcosystemId;
      partnerId: string;
    };
  }
): Promise<LinkedAccount[]> {
  return linkProfile(params);
}

/**
 * Get all linked accounts for the current user
 * @param client - Flow client
 * @param ecosystem - Ecosystem configuration with partner ID
 * @returns List of linked accounts
 */
export async function getLinkedAccounts(
  client: FlowClient,
  ecosystem: {
    id: EcosystemId;
    partnerId: string;
  }
): Promise<LinkedAccount[]> {
  return getProfiles({ client, ecosystem });
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
  return unlinkProfile(params);
}
