import {
  mockSessionStatusCompleted,
  mockSessionStatusCreated,
  mockSessionStatusPending
} from './mocks';
import type { GetSessionStatusParams, SessionStatusResult } from './types';

const PANNA_API_URL = process.env.PANNA_API_URL || 'https://api.panna.dev';
const IS_MOCK_MODE = process.env.MOCK_PANNA_API === 'true';

/**
 * Retrieves the status of an onramp.money session
 *
 * This function polls the onramp.money API to get the current status of a fiat-to-crypto
 * onramp session. The status includes transaction details, amounts, and any error messages.
 *
 * @param params - Parameters for retrieving the session status
 * @param params.sessionId - The onramp.money session identifier
 * @param params.client - The Panna client instance used for authentication
 * @param params.authToken - Optional JWT token for authentication
 * @returns Promise resolving to the session status with all transaction details
 * @throws Error if the session ID is invalid, client is unauthorized, or network request fails
 *
 * @example
 * ```ts
 * import { getSessionStatus } from 'panna-sdk/core';
 *
 * // Check the status of an onramp.money session
 * const status = await getSessionStatus({
 *   sessionId: "session-123",
 *   client: pannaClient,
 *   authToken: "your-jwt-token" // optional
 * });
 *
 * // Handle different status types
 * switch (status.status) {
 *   case 'created':
 *     console.log('Session created, waiting for payment');
 *     break;
 *
 *   case 'pending':
 *     console.log('Payment received, processing onramp...');
 *     break;
 *
 *   case 'completed':
 *     console.log('Onramp completed successfully!');
 *     console.log('Transaction hash:', status.transaction_hash);
 *     break;
 *
 *   case 'failed':
 *     console.error('Onramp failed:', status.error_message);
 *     break;
 *
 *   case 'cancelled':
 *     console.log('Session was cancelled');
 *     break;
 *
 *   case 'expired':
 *     console.log('Session expired');
 *     break;
 * }
 * ```
 */
export async function getSessionStatus(
  params: GetSessionStatusParams
): Promise<SessionStatusResult> {
  const { sessionId, client, authToken } = params;

  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  if (!client) {
    throw new Error('Panna client is required');
  }

  // Mock mode for testing
  if (IS_MOCK_MODE) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data based on session ID pattern for testing
    if (sessionId.includes('created')) {
      return mockSessionStatusCreated;
    } else if (sessionId.includes('pending')) {
      return mockSessionStatusPending;
    } else {
      return mockSessionStatusCompleted;
    }
  }

  try {
    const url = `${PANNA_API_URL}/api/v1/onramp/session/${sessionId}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get session status: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result.session_id || !result.status) {
      throw new Error('Invalid response format from API');
    }

    return result as SessionStatusResult;
  } catch (error) {
    console.error('Error fetching session status:', error);
    throw new Error(
      `Failed to get onramp.money session status for ${sessionId}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
