import type { Account } from 'thirdweb/wallets';
import { pannaApiService } from '../utils/api-service';
import type {
  AuthChallengeRequest,
  AuthChallengeReply,
  AuthVerifyRequest,
  LoginPayload
} from '../utils/types';

/**
 * LocalStorage keys for SIWE authentication
 */
const STORAGE_KEYS = {
  AUTH_TOKEN: 'panna_auth_token',
  USER_ADDRESS: 'panna_user_address',
  TOKEN_EXPIRY: 'panna_auth_token_expiry'
} as const;

/**
 * Default expiration time for SIWE login payload (in milliseconds)
 * TODO: Make this configurable via constructor options
 */
const DEFAULT_PAYLOAD_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

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
 * SIWE authentication service for Panna
 * Implements the Sign-In with Ethereum flow using Panna API
 */
export class SiweAuth {
  private authToken: string | null = null;
  private userAddress: string | null = null;
  private tokenExpiresAt: number | null = null;
  private lastChallenge: AuthChallengeReply | null = null;

  constructor() {
    // Load existing auth data from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedAddress = localStorage.getItem(STORAGE_KEYS.USER_ADDRESS);
      const storedExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

      if (storedToken && storedAddress) {
        this.authToken = storedToken;
        this.userAddress = storedAddress;
        this.tokenExpiresAt = storedExpiry ? parseInt(storedExpiry, 10) : null;
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
          Date.now() + DEFAULT_PAYLOAD_EXPIRATION_MS
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
        // Ensure timestamp is in ISO 8601 format with Z suffix
        issuedAt: new Date(this.lastChallenge.issuedAt).toISOString(),
        signature: params.signature,
        isSafeWallet: params.isSafeWallet || false
      };

      // Verify with Panna API
      const authResult = await pannaApiService.verifyAuth(verifyRequest);

      if (authResult.token) {
        // Store auth token and user address
        this.authToken = authResult.token;
        this.userAddress = authResult.address;

        // The API currently returns the expiry timestamp as the expiresIn property.
        // For semantic appropriation, the property will be renamed to expiresAt.
        // Hence, the fallback for backward compatibility.
        this.tokenExpiresAt =
          authResult.expiresAt || authResult.expiresIn || null;

        // Store in localStorage for persistence (if available)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResult.token);
          localStorage.setItem(STORAGE_KEYS.USER_ADDRESS, authResult.address);
          if (this.tokenExpiresAt) {
            localStorage.setItem(
              STORAGE_KEYS.TOKEN_EXPIRY,
              this.tokenExpiresAt.toString()
            );
          }
        }

        // Clear challenge after successful login to prevent reuse
        this.lastChallenge = null;

        return true;
      }

      console.warn('SIWE Auth - No token received from verify response');
      return false;
    } catch (error) {
      console.error('Failed to verify login:', error);
      //  Also clear challenge on error to force new challenge generation
      this.lastChallenge = null;
      return false;
    }
  }

  /**
   * Check if the user is currently logged in with a valid (non-expired) token
   */
  public isLoggedIn(): boolean {
    // Check memory first
    if (this.authToken && this.userAddress) {
      // Also check if token is not expired
      return !this.isTokenExpired();
    }

    // Check localStorage (if available)
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedAddress = localStorage.getItem(STORAGE_KEYS.USER_ADDRESS);
      const storedExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

      if (storedToken && storedAddress) {
        this.authToken = storedToken;
        this.userAddress = storedAddress;
        this.tokenExpiresAt = storedExpiry ? parseInt(storedExpiry, 10) : null;
        // Also check if token is not expired
        return !this.isTokenExpired();
      }
    }

    return false;
  }

  /**
   * Check if the current auth token is expired
   * @returns true if token is expired, false if still valid or no token exists
   */
  public isTokenExpired(): boolean {
    // If no token exists at all, return false (not expired, just doesn't exist)
    if (!this.authToken) {
      return false;
    }

    // If we have a token but no expiry info, treat as expired for safety
    if (!this.tokenExpiresAt) {
      return true;
    }

    // expiresIn is a Unix timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 60; // Add 60 second buffer to refresh before actual expiry

    return now >= this.tokenExpiresAt - bufferTime;
  }

  /**
   * Get the current user's address
   */
  public getUser(): string | null {
    return this.userAddress;
  }

  /**
   * Get the current auth token
   * Note: This does not check expiry. Use getValidAuthToken() if you need expiry checking.
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Get the current auth token only if it's still valid (not expired)
   * @returns The auth token if valid, null if expired or not available
   */
  public getValidAuthToken(): string | null {
    if (!this.authToken) {
      return null;
    }

    if (this.isTokenExpired()) {
      return null;
    }

    return this.authToken;
  }

  /**
   * Get the token expiry timestamp
   */
  public getTokenExpiry(): number | null {
    return this.tokenExpiresAt;
  }

  /**
   * Logout the user
   */
  public logout(): void {
    // Clear memory
    this.authToken = null;
    this.userAddress = null;
    this.tokenExpiresAt = null;
    this.lastChallenge = null;

    // Clear localStorage (if available)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ADDRESS);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
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
export function isSiweLoggedIn(): boolean {
  return siweAuth.isLoggedIn();
}

/**
 * Helper function to get current SIWE user
 * Compatible with thirdweb's auth flow
 */
export function getSiweUser(): string | null {
  return siweAuth.getUser();
}

/**
 * Helper function to get current SIWE auth token
 * Compatible with thirdweb's auth flow
 * Note: This does not check expiry
 */
export async function getSiweAuthToken(): Promise<string | null> {
  return siweAuth.getAuthToken();
}

/**
 * Helper function to get a valid (non-expired) SIWE auth token
 * Returns null if token is expired or not available
 */
export async function getValidSiweAuthToken(): Promise<string | null> {
  return siweAuth.getValidAuthToken();
}

/**
 * Helper function to check if the current SIWE auth token is expired
 */
export function isSiweTokenExpired(): boolean {
  return siweAuth.isTokenExpired();
}

/**
 * Helper function to logout SIWE user
 * Compatible with thirdweb's auth flow
 */
export function siweLogout(): void {
  return siweAuth.logout();
}
