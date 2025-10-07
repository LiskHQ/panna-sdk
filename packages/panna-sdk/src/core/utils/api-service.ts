import {
  type AccountEventPayload,
  type AuthChallengeRequest,
  type AuthChallengeReply,
  type AuthVerifyRequest,
  type AuthVerifyReply
} from './types';

export type PannaApiConfig = {
  baseUrl?: string;
  isMockMode?: boolean;
};

const DEFAULT_CONFIG: PannaApiConfig = {
  baseUrl: process.env.PANNA_API_URL,
  isMockMode: process.env.MOCK_PANNA_API === 'true'
};

/**
 * API service for sending account events to the Panna app.
 */
export class PannaApiService {
  private config: PannaApiConfig;

  constructor(config: PannaApiConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Send account event data to the Panna API
   * @param payload - The account event payload
   * @param authToken - JWT authentication token
   * @returns Promise resolving to the API response
   */
  public async sendAccountEvent(
    address: string,
    payload: AccountEventPayload,
    authToken?: string
  ): Promise<Response> {
    const { baseUrl, isMockMode } = this.config;

    const url = `${baseUrl}/account/${address}/activity`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    if (isMockMode) {
      const mockId = 'c59309e4-3647-49a8-bf32-beab50923a27';
      const mockResponse = {
        details: {
          id: mockId
        },
        message: 'Account event received',
        status: 'success'
      };

      return new Response(JSON.stringify(mockResponse), {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(
          `Panna API request failed: ${response.status} ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      console.error('Failed to send account event to Panna API:', error);
      throw error;
    }
  }

  /**
   * Get authentication challenge for SIWE
   * @param request - The auth challenge request containing wallet address
   * @returns Promise resolving to the auth challenge response
   */
  public async getAuthChallenge(
    request: AuthChallengeRequest
  ): Promise<AuthChallengeReply> {
    const { baseUrl, isMockMode } = this.config;
    const url = `${baseUrl}/auth/challenge/${request.address}`;

    if (isMockMode) {
      const mockResponse: AuthChallengeReply = {
        address: request.address,
        chainId: 1135,
        domain: 'panna-app.lisk.com',
        issuedAt: new Date().toISOString(),
        nonce: '0xb7b1a40ac418c5bf',
        uri: 'https://panna-app.lisk.com',
        version: '1'
      };
      return mockResponse;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(
          `Panna API challenge request failed: ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as AuthChallengeReply;
    } catch (error) {
      console.error('Failed to get auth challenge from Panna API:', error);
      throw error;
    }
  }

  /**
   * Create authentication challenge for SIWE
   * @param request - The auth challenge request containing wallet address
   * @returns Promise resolving to the auth challenge response
   */
  public async createAuthChallenge(
    request: AuthChallengeRequest
  ): Promise<AuthChallengeReply> {
    const { baseUrl, isMockMode } = this.config;
    const url = `${baseUrl}/auth/challenge`;

    if (isMockMode) {
      const mockResponse: AuthChallengeReply = {
        address: request.address,
        chainId: 1135,
        domain: 'panna-app.lisk.com',
        issuedAt: new Date().toISOString(),
        nonce: '0xb7b1a40ac418c5bf',
        uri: 'https://panna-app.lisk.com',
        version: '1'
      };
      return mockResponse;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(
          `Panna API challenge creation failed: ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as AuthChallengeReply;
    } catch (error) {
      console.error('Failed to create auth challenge with Panna API:', error);
      throw error;
    }
  }

  /**
   * Verify authentication signature for SIWE
   * @param request - The auth verify request containing signed message
   * @returns Promise resolving to the auth token response
   */
  public async verifyAuth(
    request: AuthVerifyRequest
  ): Promise<AuthVerifyReply> {
    const { baseUrl, isMockMode } = this.config;
    const url = `${baseUrl}/auth/verify`;

    if (isMockMode) {
      const mockResponse: AuthVerifyReply = {
        address: request.address,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTU2NDUzMjUsInN1YiI6IjB4N2UwYmNjNzhlMzE3ZmEyOGY3M2E0NDU2N2Q4NTRiMDgxMDA0NjIyZCJ9.6_tOR5eayoQWTR2-4rsQmlX30I4acFtXaIdPCnd3pTc',
        expiresIn: 1755645325
      };
      return mockResponse;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Panna API auth verification failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = (await response.json()) as AuthVerifyReply;
      return result;
    } catch (error) {
      console.error('Failed to verify auth with Panna API:', error);
      throw error;
    }
  }
}

/**
 * Default instance of the Panna API service
 */
export const pannaApiService = new PannaApiService();
