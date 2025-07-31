import { Bridge } from 'thirdweb';
import type { OnrampStatusParams, OnrampStatusResult } from './types';

/**
 * Retrieves the status of an Onramp session created via prepareOnRamp
 *
 * The status will include any on-chain transactions that have occurred as a result
 * of the onramp as well as any arbitrary purchaseData that was supplied when the
 * onramp was prepared. This function allows you to track the progress of a fiat-to-crypto
 * onramp transaction from creation through completion.
 *
 * @param params - Parameters for retrieving the onramp status
 * @param params.id - The onramp session identifier (UUID returned from prepareOnRamp)
 * @param params.client - The Panna client instance used for authentication
 * @returns Promise resolving to the onramp status with transaction details and purchase data
 * @throws Error if the session ID is invalid, client is unauthorized, or network request fails
 *
 * @example
 * ```ts
 * // Check the status of an onramp session
 * const status = await onRampStatus({
 *   id: "022218cc-96af-4291-b90c-dadcb47571ec",
 *   client: pannaClient
 * });
 *
 * // Handle different status types
 * switch (status.status) {
 *   case 'CREATED':
 *     console.log('Onramp session created, waiting for payment');
 *     // status.transactions: [] (empty)
 *     // status.purchaseData: { sessionId: "abc", metadata: {...} }
 *     break;
 *
 *   case 'PENDING':
 *     console.log('Payment received, processing onramp...');
 *     // status.transactions: [] (empty)
 *     // status.purchaseData: { sessionId: "abc", amount: 100 }
 *     break;
 *
 *   case 'COMPLETED':
 *     console.log('Onramp completed successfully!');
 *     console.log('Transactions:', status.transactions);
 *     // status.transactions: [{ chainId: 1, transactionHash: "0x..." }, ...]
 *     // status.purchaseData: { sessionId: "abc", completedAt: "2024-01-15T10:30:00Z" }
 *     break;
 * }
 * ```
 */
export async function onRampStatus(
  params: OnrampStatusParams
): Promise<OnrampStatusResult> {
  const { id, client } = params;

  try {
    const result = await Bridge.Onramp.status({
      id,
      client
    });

    return result as OnrampStatusResult;
  } catch (error) {
    // Re-throw with more context
    throw new Error(
      `Failed to get onramp status for session ${id}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
