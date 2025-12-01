import { Bridge } from 'thirdweb';
import { lisk } from '../../chain';
import {
  OnrampIntent,
  OnrampPrepareParams,
  OnrampPrepareResult,
  OnrampStatusParams,
  OnrampStatusResult
} from './types';

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
 * import { onramp } from 'panna-sdk';
 *
 * // Check the status of an onramp session
 * const status = await onramp.onRampStatus({
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

/**
 * Prepares an onramp session for a fiat-to-crypto transaction
 *
 * This function creates a new onramp session that can be used to track the progress
 * of a fiat-to-crypto onramp transaction from creation through completion.
 *
 * @param params - Parameters for preparing the onramp
 * @param params.client - The Panna client instance used for authentication
 * @param params.chainId - The chain ID of the token being purchased
 * @param params.tokenAddress - The address of the token being purchased
 * @param params.receiver - The address of the receiver of the token
 * @param params.amount - The amount of the token being purchased
 * @param params.country - The country code for the onramp provider
 * @param params.purchaseData - Additional data to be stored with the onramp session
 * @param params.onRampProvider - The onramp provider to use
 * @returns Promise resolving to the onramp session identifier
 * @throws Error if the onramp session cannot be prepared
 *
 * @example
 * ```ts
 * import { onramp, NATIVE_TOKEN_ADDRESS } from 'panna-sdk';
 *
 * // Prepare an onramp session for a fiat-to-crypto transaction
 * const result = await onramp.onRampPrepare({
 *   client: pannaClient,
 *   chainId: 1,
 *   tokenAddress: NATIVE_TOKEN_ADDRESS,
 *   receiver: userWalletAddress,
 *   amount: '100',
 *   purchaseData: { sessionId: '123' },
 *   onrampProvider: 'stripe'
 * });
 * ```
 */
export async function onRampPrepare(
  params: OnrampPrepareParams
): Promise<OnrampPrepareResult> {
  const {
    client,
    chainId,
    tokenAddress,
    receiver,
    amount,
    country,
    purchaseData,
    onRampProvider
  } = params;

  try {
    // TODO: In case of providers outside thirdweb, we need to handle the result differently
    const result = await Bridge.Onramp.prepare({
      client,
      chainId: chainId || lisk.id,
      onramp: onRampProvider,
      tokenAddress,
      receiver,
      amount: BigInt(amount),
      purchaseData,
      country
    });
    const intent: OnrampIntent | undefined = result.intent
      ? {
          amount: result.intent.amount || '0',
          chainId: result.intent.chainId,
          onRampProvider: result.intent.onramp,
          receiver: result.intent.receiver,
          tokenAddress: result.intent.tokenAddress
        }
      : undefined;

    return {
      currency: result.currency,
      currencyAmount: result.currencyAmount.toString(),
      destinationAmount: result.destinationAmount.toString(),
      expiration: result.expiration,
      id: result.id,
      link: result.link,
      timestamp: result.timestamp,
      intent
    };
  } catch (error) {
    throw new Error(
      `Failed to prepare onramp: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
