import { signLoginPayload } from 'thirdweb/auth';
import type { Account } from 'thirdweb/wallets';
import { pannaApiService } from '../utils/api-service';
import type {
  AuthChallengeRequest,
  AuthChallengeReply,
  AuthVerifyRequest,
  LoginPayload,
  SignedLoginPayload
} from '../utils/types';

/**
 * Parameters for generating a login payload
 */
export type GeneratePayloadParams = {
  address: string;
  chainId?: number;
};

/**
 * Parameters for login verification
 */
export type LoginParams = {
  payload: LoginPayload;
  signature: string;
  account: Account;
  isSafeWallet?: boolean;
};

/**
 * Parameters for signing a login payload
 */
export type SignLoginPayloadParams = {
  payload: LoginPayload;
  account: Account;
};

/**
 * SIWE authentication service for Panna
 * Implements the Sign-In with Ethereum flow using Panna API
 */
export class SiweAuth {
  private authToken: string | null = null;
  private userAddress: string | null = null;
  private lastChallenge: AuthChallengeReply | null = null;

  constructor() {
    // Load existing auth data from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('panna_auth_token');
      const storedAddress = localStorage.getItem('panna_user_address');

      if (storedToken && storedAddress) {
        this.authToken = storedToken;
        this.userAddress = storedAddress;
      }
    }
  }

  /**
   * Generate a SIWE compliant login payload
   * This function should be called by the frontend to get a challenge message
   */
  public async generatePayload(
    params: GeneratePayloadParams
  ): Promise<LoginPayload> {
    const challengeRequest: AuthChallengeRequest = {
      address: params.address
    };

    try {
      // Get challenge from Panna API
      const challenge: AuthChallengeReply =
        await pannaApiService.getAuthChallenge(challengeRequest);

      // Store the challenge for later use in verification
      this.lastChallenge = challenge;

      // Create minimal LoginPayload for message signing
      const payload: LoginPayload = {
        address: challenge.address.toLowerCase(),
        chain_id: challenge.chainId.toString(),
        domain: challenge.domain,
        uri: challenge.uri,
        version: challenge.version,
        nonce: challenge.nonce,
        issued_at: challenge.issuedAt,
        // Minimal required fields only - no expiration, resources, etc.
        expiration_time: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        invalid_before: challenge.issuedAt,
        statement: '',
        resources: []
      };

      return payload;
    } catch (error) {
      console.error('Failed to generate login payload:', error);
      throw error;
    }
  }

  /**
   * Sign a login payload using thirdweb's signLoginPayload function
   */
  public async signPayload(
    params: SignLoginPayloadParams
  ): Promise<SignedLoginPayload> {
    try {
      const result = await signLoginPayload({
        account: params.account,
        payload: params.payload
      });

      return result;
    } catch (error) {
      console.error('Failed to sign login payload:', error);
      throw error;
    }
  }

  /**
   * Verify the signed payload and login the user
   * This function should be called by the frontend after the user signs the message
   */
  public async login(params: LoginParams): Promise<boolean> {
    try {
      // Use the challenge response directly with signature added
      if (!this.lastChallenge) {
        throw new Error(
          'No challenge available for verification. Please generate a payload first.'
        );
      }

      const verifyRequest: AuthVerifyRequest = {
        ...this.lastChallenge,
        // Fix timestamp format - convert to UTC with Z suffix
        issuedAt: this.lastChallenge.issuedAt.replace(/\+\d{2}:\d{2}$/, 'Z'),
        signature: params.signature,
        isSafeWallet: params.isSafeWallet || false
      };

      // Verify with Panna API
      const authResult = await pannaApiService.verifyAuth(verifyRequest);

      if (authResult.token) {
        // Store auth token and user address
        this.authToken = authResult.token;
        this.userAddress = authResult.address;

        // Store in localStorage for persistence (if available)
        if (typeof window !== 'undefined') {
          localStorage.setItem('panna_auth_token', authResult.token);
          localStorage.setItem('panna_user_address', authResult.address);
        }

        return true;
      }

      console.warn('SIWE Auth - No token received from verify response');
      return false;
    } catch (error) {
      console.error('Failed to verify login:', error);
      return false;
    }
  }

  /**
   * Check if the user is currently logged in
   */
  public async isLoggedIn(): Promise<boolean> {
    // Check memory first
    if (this.authToken && this.userAddress) {
      return true;
    }

    // Check localStorage (if available)
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('panna_auth_token');
      const storedAddress = localStorage.getItem('panna_user_address');

      if (storedToken && storedAddress) {
        this.authToken = storedToken;
        this.userAddress = storedAddress;
        return true;
      }
    }

    return false;
  }

  /**
   * Get the current user's address
   */
  public getUser(): string | null {
    return this.userAddress;
  }

  /**
   * Get the current auth token
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Logout the user
   */
  public async logout(): Promise<void> {
    // Clear memory
    this.authToken = null;
    this.userAddress = null;

    // Clear localStorage (if available)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('panna_auth_token');
      localStorage.removeItem('panna_user_address');
    }
  }
}

/**
 * Default instance of SIWE auth service
 */
export const siweAuth = new SiweAuth();

/**
 * Helper function to generate a SIWE login payload
 * Compatible with thirdweb's auth flow
 */
export async function generateSiwePayload(
  params: GeneratePayloadParams
): Promise<LoginPayload> {
  return siweAuth.generatePayload(params);
}

/**
 * Helper function to login a user with SIWE
 * Compatible with thirdweb's auth flow
 */
export async function siweLogin(params: LoginParams): Promise<boolean> {
  return siweAuth.login(params);
}

/**
 * Helper function to check if user is logged in with SIWE
 * Compatible with thirdweb's auth flow
 */
export async function isSiweLoggedIn(): Promise<boolean> {
  return siweAuth.isLoggedIn();
}

/**
 * Helper function to get current SIWE user
 * Compatible with thirdweb's auth flow
 */
export async function getSiweUser(): Promise<string | null> {
  return siweAuth.getUser();
}

/**
 * Helper function to get current SIWE auth token
 * Compatible with thirdweb's auth flow
 */
export async function getSiweAuthToken(): Promise<string | null> {
  return siweAuth.getAuthToken();
}

/**
 * Helper function to logout SIWE user
 * Compatible with thirdweb's auth flow
 */
export async function siweLogout(): Promise<void> {
  return siweAuth.logout();
}
