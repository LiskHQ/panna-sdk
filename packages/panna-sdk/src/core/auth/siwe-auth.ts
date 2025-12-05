import type { Account } from 'thirdweb/wallets';
import Cookies from 'universal-cookie';
import { defaultCookieOptions } from '@/consts/cookies';
import { PannaApiService } from '../util/api-service';
import type {
  AuthChallengeReply,
  AuthChallengeRequest,
  AuthVerifyRequest,
  LoginPayload
} from '../util/types';

const defaultTokenExpiryBufferSecs = 60;

/**
 * Cookie keys for SIWE authentication
 */
const STORAGE_KEYS = {
  AUTH_TOKEN: 'panna_auth_token',
  USER_ADDRESS: 'panna_user_address',
  TOKEN_EXPIRY: 'panna_auth_token_expiry'
} as const;

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
 * Configuration options for SiweAuth
 */
export type SiweAuthOptions = {
  /**
   * Buffer time in seconds before token expiry to consider token as expired.
   * This ensures tokens are refreshed before they actually expire.
   * @default 60
   */
  tokenExpiryBufferSecs?: number;
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
  private pannaApiService: PannaApiService;
  private cookies: Cookies;
  private tokenExpiryBufferSecs: number;

  constructor(pannaApiService: PannaApiService, options: SiweAuthOptions = {}) {
    this.tokenExpiryBufferSecs =
      options.tokenExpiryBufferSecs ?? defaultTokenExpiryBufferSecs;
    this.pannaApiService = pannaApiService;
    // Cookie configuration for auth token storage
    // Using sameSite: 'strict' for CSRF protection, and secure: true to require HTTPS.
    this.cookies = new Cookies(null, defaultCookieOptions);

    // Load existing auth data from cookies on initialization
    if (typeof window !== 'undefined') {
      const storedToken = this.cookies.get(STORAGE_KEYS.AUTH_TOKEN);
      const storedAddress = this.cookies.get(STORAGE_KEYS.USER_ADDRESS);
      const storedExpiry = this.cookies.get(STORAGE_KEYS.TOKEN_EXPIRY);
      if (storedToken && storedAddress) {
        this.authToken = storedToken;
        this.userAddress = storedAddress;
        this.tokenExpiresAt = storedExpiry ? parseInt(storedExpiry, 10) : null;
      }
    }
  }

  /**
   * Generate a SIWE compliant login payload (EIP-4361)
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
        await this.pannaApiService.getAuthChallenge(challengeRequest);

      // Store the challenge for later use in verification
      this.lastChallenge = challenge;

      // Create EIP-4361 compliant LoginPayload for message signing
      const payload: LoginPayload = {
        // Required fields per EIP-4361
        domain: challenge.domain,
        address: challenge.address,
        uri: challenge.uri,
        version: challenge.version,
        chainId: challenge.chainId,
        nonce: challenge.nonce,
        issuedAt: challenge.issuedAt,

        // Optional fields - include from challenge if provided
        statement: challenge.statement,
        expirationTime: challenge.expirationTime,
        notBefore: challenge.notBefore,
        requestId: challenge.requestId,
        resources: challenge.resources
      };

      return payload;
    } catch (error) {
      console.error('Failed to generate login payload:', error);
      throw error;
    }
  }

  /**
   * Verify the signed payload and login the user (EIP-4361)
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

      // Build EIP-4361 compliant verify request with all fields from challenge
      const verifyRequest: AuthVerifyRequest = {
        // Required SIWE message fields
        domain: this.lastChallenge.domain,
        address: this.lastChallenge.address,
        uri: this.lastChallenge.uri,
        version: this.lastChallenge.version,
        chainId: this.lastChallenge.chainId,
        nonce: this.lastChallenge.nonce,
        issuedAt: this.lastChallenge.issuedAt,

        // Required custom fields for verification
        signature: params.signature,
        isSafeWallet: params.isSafeWallet || false,

        // Optional SIWE message fields - include if present in challenge
        ...(this.lastChallenge.statement && {
          statement: this.lastChallenge.statement
        }),
        ...(this.lastChallenge.expirationTime && {
          expirationTime: this.lastChallenge.expirationTime
        }),
        ...(this.lastChallenge.notBefore && {
          notBefore: this.lastChallenge.notBefore
        }),
        ...(this.lastChallenge.requestId && {
          requestId: this.lastChallenge.requestId
        }),
        ...(this.lastChallenge.resources && {
          resources: this.lastChallenge.resources
        })
      };

      // Verify with Panna API
      const authResult = await this.pannaApiService.verifyAuth(verifyRequest);

      if (authResult.token) {
        // Store auth token and user address
        this.authToken = authResult.token;
        this.userAddress = authResult.address;

        // The API currently returns the expiry timestamp as the expiresIn property.
        // For semantic appropriation, the property will be renamed to expiresAt.
        // Hence, the fallback for backward compatibility.
        this.tokenExpiresAt =
          authResult.expiresAt || authResult.expiresIn || null;

        // Store in cookies for persistence (if available)
        if (typeof window !== 'undefined') {
          this.cookies.set(STORAGE_KEYS.AUTH_TOKEN, authResult.token);
          this.cookies.set(STORAGE_KEYS.USER_ADDRESS, authResult.address);
          if (this.tokenExpiresAt) {
            this.cookies.set(
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
      // Also clear challenge on error to force new challenge generation
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

    // Check cookies (if available)
    if (typeof window !== 'undefined') {
      const storedToken = this.cookies.get(STORAGE_KEYS.AUTH_TOKEN);
      const storedAddress = this.cookies.get(STORAGE_KEYS.USER_ADDRESS);
      const storedExpiry = this.cookies.get(STORAGE_KEYS.TOKEN_EXPIRY);

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

    // expiresAt is a Unix timestamp in seconds
    // Use configured buffer time to refresh tokens before they actually expire
    const now = Math.floor(Date.now() / 1000);
    return now >= this.tokenExpiresAt - this.tokenExpiryBufferSecs;
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

    // Clear cookies (if available)
    if (typeof window !== 'undefined') {
      this.cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
      this.cookies.remove(STORAGE_KEYS.USER_ADDRESS);
      this.cookies.remove(STORAGE_KEYS.TOKEN_EXPIRY);
    }
  }
}
