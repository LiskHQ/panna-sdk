import { use } from 'react';
import {
  PannaClientContext,
  PannaContextValue
} from '../components/panna-provider';

/**
 * Hook to access the Panna context
 *
 * @returns The Panna context
 * @throws {Error} When used outside of PannaProvider context or when no client is available
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, partnerId, chainId } = usePanna();
 *
 *   // client is guaranteed to be available here
 *   return <div>Connected with client ID: {client.clientId}, partner ID: {partnerId}, and chain ID: {chainId}</div>;
 * }
 * ```
 */
export function usePanna(): PannaContextValue {
  const context = use(PannaClientContext);

  if (!context) {
    throw new Error(
      'usePanna must be used within a PannaProvider. ' +
        'Make sure to wrap your app with <PannaProvider clientId="your-client-id">.'
    );
  }

  if (!context.client) {
    throw new Error(
      'Panna client is not available. ' +
        'Make sure to provide a valid clientId to PannaProvider.'
    );
  }

  return context as PannaContextValue;
}
