import {
  GetSessionStatusParams,
  mockSessionStatusCompleted,
  mockSessionStatusCreated,
  mockSessionStatusPending,
  OnrampMoneySessionStatusEnum,
  SessionStatusResponse,
  SessionStatusResult
} from '../onramp';
import {
  type AccountEventPayload,
  type AuthChallengeReply,
  type AuthChallengeRequest,
  type AuthVerifyReply,
  type AuthVerifyRequest,
  type OnrampQuoteRequest,
  type OnrampQuoteResponse,
  type OnrampSessionRequest,
  type OnrampSessionResponse,
  type QuoteData,
  type SessionData
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
 * Mock JWT token for testing purposes
 */
const MOCK_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTU2NDUzMjUsInN1YiI6IjB4N2UwYmNjNzhlMzE3ZmEyOGY3M2E0NDU2N2Q4NTRiMDgxMDA0NjIyZCJ9.6_tOR5eayoQWTR2-4rsQmlX30I4acFtXaIdPCnd3pTc';

/**
 * Creates mock quote data for testing/development purposes
 * @param fiatAmount - The fiat amount to create mock quote for
 * @returns Mock quote data
 */
const createMockQuoteData = (fiatAmount: number): QuoteData => ({
  rate: 1,
  crypto_quantity: fiatAmount,
  onramp_fee: 0,
  client_fee: 0,
  gateway_fee: 0,
  gas_fee: 0,
  total_fiat_amount: fiatAmount,
  quote_timestamp: new Date().toISOString(),
  quote_validity_mins: 15
});

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
        token: MOCK_JWT_TOKEN,
        expiresAt: 1755645325
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

  /**
   * Retrieves the status of an onramp.money session
   *
   * This function requests the Panna API to get the current status of a fiat-to-crypto
   * onramp session. The status includes transaction details, amounts, and any error messages.
   *
   * @param params - Parameters for retrieving the session status
   * @param params.sessionId - The onramp.money session identifier
   * @param params.authToken - JWT token for authentication
   * @returns Promise resolving to the session status with all transaction details
   * @throws Error if the session ID is invalid or network request fails
   */
  public async getSessionStatus(
    params: GetSessionStatusParams
  ): Promise<SessionStatusResult> {
    const { baseUrl, isMockMode } = this.config;
    const { sessionId, authToken } = params;

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (sessionId.includes(OnrampMoneySessionStatusEnum.Created)) {
        return mockSessionStatusCreated;
      } else if (sessionId.includes(OnrampMoneySessionStatusEnum.Pending)) {
        return mockSessionStatusPending;
      } else {
        return mockSessionStatusCompleted;
      }
    }

    if (!authToken) {
      throw new Error('Auth token is required to fetch session status');
    }

    try {
      const url = `${baseUrl}/v1/onramp/session/${sessionId}`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      };

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get session status: ${response.status} ${response.statusText}`
        );
      }

      const result: SessionStatusResponse = await response.json();

      if (!result.success || !result.data.session_id || !result.data.status) {
        throw new Error('Invalid response format from API');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching session status:', error);
      throw new Error(
        `Failed to get onramp.money session status for ${sessionId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Fetch fiat-to-crypto onramp quote data
   * @param request - The onramp quote request payload
   * @param authToken - JWT authentication token
   * @returns Promise resolving to the quote data
   */
  public async getOnrampQuote(
    request: OnrampQuoteRequest,
    authToken: string
  ): Promise<QuoteData> {
    const { baseUrl, isMockMode } = this.config;

    if (!baseUrl) {
      throw new Error('Panna API base URL is not configured.');
    }

    const url = `${baseUrl}/onramp/quote`;

    if (!authToken) {
      throw new Error(
        'Authentication token is required to fetch onramp quotes.'
      );
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    };

    if (isMockMode) {
      return createMockQuoteData(request.fiatAmount);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          token_symbol: request.tokenSymbol,
          network: request.network,
          fiat_amount: request.fiatAmount,
          fiat_currency: request.fiatCurrency
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Panna API onramp quote failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const payload = (await response.json()) as OnrampQuoteResponse;

      if (!payload.success) {
        throw new Error(
          'Panna API onramp quote response marked as unsuccessful.'
        );
      }

      return payload.data;
    } catch (error) {
      console.error('Failed to fetch onramp quote from Panna API:', error);
      throw error;
    }
  }

  /**
   * Create an onramp session for fiat-to-crypto purchase
   * @param request - The onramp session creation payload
   * @param authToken - JWT authentication token
   * @returns Promise resolving to the session data
   */
  public async createOnrampSession(
    request: OnrampSessionRequest,
    authToken?: string
  ): Promise<SessionData> {
    const { baseUrl, isMockMode } = this.config;

    if (!baseUrl) {
      throw new Error('Panna API base URL is not configured.');
    }

    if (!authToken) {
      throw new Error(
        'Authentication token is required to create an onramp session.'
      );
    }

    const url = `${baseUrl}/onramp/session`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    };

    const {
      walletAddress,
      tokenSymbol,
      network,
      fiatAmount,
      fiatCurrency,
      redirectUrl,
      quoteData
    } = request;

    const requestPayload = {
      wallet_address: walletAddress,
      token_symbol: tokenSymbol,
      network,
      fiat_amount: fiatAmount,
      fiat_currency: fiatCurrency,
      ...(redirectUrl && { redirect_url: redirectUrl }),
      ...(quoteData && {
        quote_data: {
          rate: quoteData.rate,
          crypto_quantity: quoteData.crypto_quantity,
          ...(quoteData.onramp_fee !== undefined && {
            onramp_fee: quoteData.onramp_fee
          }),
          ...(quoteData.client_fee !== undefined && {
            client_fee: quoteData.client_fee
          }),
          ...(quoteData.gateway_fee !== undefined && {
            gateway_fee: quoteData.gateway_fee
          }),
          ...(quoteData.gas_fee !== undefined && {
            gas_fee: quoteData.gas_fee
          }),
          ...(quoteData.quote_timestamp && {
            quote_timestamp: quoteData.quote_timestamp
          })
        }
      })
    };

    console.debug('Panna API request: POST /onramp/session', {
      url,
      payload: requestPayload
    });

    if (isMockMode) {
      const mockSession: SessionData = {
        session_id: 'c59309e4-3647-49a8-bf32-beab50923a27',
        redirect_url: 'https://sandbox.onramp.money/session/mock',
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        ...(quoteData && { quote_data: quoteData })
      };

      console.info('Panna API mock response: /onramp/session', mockSession);

      return mockSession;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Panna API onramp session failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const payload = (await response.json()) as OnrampSessionResponse;

      if (!payload.success) {
        throw new Error(
          'Panna API onramp session response marked as unsuccessful.'
        );
      }

      console.info('Panna API response: /onramp/session', payload.data);

      return payload.data;
    } catch (error) {
      console.error('Failed to create onramp session with Panna API:', error);
      throw error;
    }
  }
}
