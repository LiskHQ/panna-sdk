import { use } from 'react';
import {
  FlowClientContext,
  FlowContextValue
} from '../components/flow-provider';

/**
 * Hook to access the Flow context
 *
 * @returns The Flow context
 * @throws {Error} When used outside of FlowProvider context or when no client is available
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, partnerId } = useFlow();
 *
 *   // client is guaranteed to be available here
 *   return <div>Connected with client ID: {client.clientId} and partner ID: {partnerId}</div>;
 * }
 * ```
 */
export function useFlow(): FlowContextValue {
  const context = use(FlowClientContext);

  if (!context) {
    throw new Error(
      'useFlow must be used within a FlowProvider. ' +
        'Make sure to wrap your app with <FlowProvider clientId="your-client-id">.'
    );
  }

  if (!context.client) {
    throw new Error(
      'Flow client is not available. ' +
        'Make sure to provide a valid clientId to FlowProvider.'
    );
  }

  return context as FlowContextValue;
}
