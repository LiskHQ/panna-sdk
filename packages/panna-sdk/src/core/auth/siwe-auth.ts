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

  constructor() {
    // Load existing auth data from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('panna_auth_token');
      const storedAddress = localStorage.getItem('panna_user_address');

      if (storedToken && storedAddress) {
        this.authToken = storedToken;
        this.userAddress = storedAddress;
        console.log('SIWE Auth - Loaded existing token from localStorage');
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
      console.log(
        'SIWE Auth - Requesting challenge for address:',
        params.address
      );

      // Get challenge from Panna API
      const challenge: AuthChallengeReply =
        await pannaApiService.getAuthChallenge(challengeRequest);

      console.log('SIWE Auth - Received challenge:', {
        address: challenge.address,
        domain: challenge.domain,
        chainId: challenge.chainId,
        nonce: challenge.nonce
      });

      // Transform API response to thirdweb LoginPayload format
      // Ensure address consistency (use the address from challenge which should be normalized)
      const payload: LoginPayload = {
        address: challenge.address.toLowerCase(), // Normalize to lowercase for consistency
        chain_id: challenge.chainId.toString(),
        domain: challenge.domain,
        expiration_time: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(), // 24 hours from now
        invalid_before: challenge.issuedAt,
        issued_at: challenge.issuedAt,
        nonce: challenge.nonce,
        statement: 'Sign in to Panna with Ethereum',
        uri: challenge.uri,
        version: challenge.version,
        resources: ['https://panna-app.lisk.com']
      };

      console.log('SIWE Auth - Generated payload:', {
        address: payload.address,
        domain: payload.domain,
        chain_id: payload.chain_id,
        nonce: payload.nonce
      });

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
      // Convert LoginPayload to AuthVerifyRequest format
      // Normalize address to lowercase to match API expectations
      const verifyRequest: AuthVerifyRequest = {
        domain: params.payload.domain,
        address: params.payload.address.toLowerCase(),
        uri: params.payload.uri || '',
        version: params.payload.version,
        chainId: parseInt(params.payload.chain_id || '1'),
        nonce: params.payload.nonce,
        issuedAt: params.payload.issued_at,
        signature: params.signature,
        isSafeWallet: false // TODO: Detect if it's a Safe wallet
      };

      // Debug logging to help diagnose issues
      console.log('SIWE Auth - Sending verify request:', {
        ...verifyRequest,
        signature: verifyRequest.signature.substring(0, 10) + '...' // Truncate signature for logging
      });

      // Also log the full signature for debugging
      console.log('SIWE Auth - Full signature:', verifyRequest.signature);
      console.log(
        'SIWE Auth - Signature length:',
        verifyRequest.signature.length
      );
      console.log(
        'SIWE Auth - Is valid ECDSA signature format:',
        /^0x[0-9a-fA-F]{130}$/.test(verifyRequest.signature)
      );
      console.log(
        'SIWE Auth - Original payload that was signed:',
        params.payload
      );

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

        console.log('SIWE Auth - Successfully authenticated and stored token');
        return true;
      }

      console.warn('SIWE Auth - No token received from verify response');
      return false;
    } catch (error) {
      console.error('Failed to verify login:', error);
      console.error('SIWE Auth - Request details:', {
        address: params.payload.address,
        domain: params.payload.domain,
        chainId: params.payload.chain_id,
        hasSignature: !!params.signature
      });
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
