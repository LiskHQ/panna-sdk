import {
  createThirdwebClient,
  type ThirdwebClient,
  type CreateThirdwebClientOptions
} from 'thirdweb';

export type CreateFlowClientOptions = CreateThirdwebClientOptions;
export type FlowClient = ThirdwebClient;

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
export function createFlowClient(options: CreateFlowClientOptions): FlowClient {
  return createThirdwebClient(options);
}
