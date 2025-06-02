import {
  createThirdwebClient,
  type ThirdwebClient,
  type CreateThirdwebClientOptions
} from 'thirdweb';

export type CreateFlowClientOptions = CreateThirdwebClientOptions;

/**
 * Creates a Flow client using the provided client ID (client-side) or secret key (server-side).
 *
 * @param options - Configuration options for the Flow client
 * @returns The created Flow client.
 *
 * @example
 * ```typescript
 * // Client-side usage
 * const client = createFlowClient({ clientId: "your-client-id" });
 *
 * // Server-side usage
 * const client = createFlowClient({ secretKey: "your-secret-key" });
 * ```
 */
export function createFlowClient(
  options: CreateFlowClientOptions
): ThirdwebClient {
  return createThirdwebClient(options);
}

export type { ThirdwebClient as FlowClient };
