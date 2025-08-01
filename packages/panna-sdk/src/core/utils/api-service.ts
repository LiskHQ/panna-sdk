import { type AccountEventPayload } from './types';

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

    const url = `${baseUrl}/v1/account/${address}/activity`;

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
        status: 200,
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
      console.error('Failed to send account event to Panna dashboard:', error);
      throw error;
    }
  }
}

/**
 * Default instance of the Panna API service
 */
export const pannaApiService = new PannaApiService();
