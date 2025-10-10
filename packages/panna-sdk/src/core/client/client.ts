import {
  createThirdwebClient,
  type ThirdwebClient,
  type CreateThirdwebClientOptions
} from 'thirdweb';

export type CreatePannaClientOptions = CreateThirdwebClientOptions;
export type PannaClient = ThirdwebClient;

/**
 * Creates a Panna client using the provided client ID (client-side) or secret key (server-side).
 *
 * @param options - Configuration options for the Panna client
 * @returns The created Panna client.
 *
 * @example
 * ```typescript
 * import { client } from 'panna-sdk';
 *
 * // Client-side usage
 * const pannaClient = client.createPannaClient({ clientId: "your-client-id" });
 *
 * // Server-side usage
 * const pannaClient = client.createPannaClient({ secretKey: "your-secret-key" });
 * ```
 */
export function createPannaClient(
  options: CreatePannaClientOptions
): PannaClient {
  return createThirdwebClient(options);
}
