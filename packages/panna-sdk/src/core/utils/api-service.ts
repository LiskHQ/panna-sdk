import { type AccountEventPayload } from './types';

/**
 * Configuration for the Panna dashboard API
 */
export type PannaApiConfig = {
  baseUrl?: string;
  apiKey?: string;
};

/**
 * Default configuration for the Panna dashboard API
 */
const DEFAULT_CONFIG: PannaApiConfig = {
  baseUrl: process.env.PANNA_API_URL || 'https://api.panna.dev'
};

/**
 * API service for sending account events to the Panna dashboard
 */
export class PannaApiService {
  private config: PannaApiConfig;

  constructor(config: PannaApiConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Send account event data to the Panna dashboard API
   * @param payload - The account event payload
   * @param authToken - JWT authentication token
   * @returns Promise resolving to the API response
   */
  public async sendAccountEvent(
    payload: AccountEventPayload,
    authToken?: string
  ): Promise<Response> {
    const { baseUrl } = this.config;
    const { address } = payload;

    const url = `${baseUrl}/api/v1/account/${address}/activity`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add authorization header if token is provided
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
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
