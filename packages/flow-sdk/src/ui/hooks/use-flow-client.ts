import { use } from 'react';
import type { FlowClient } from '../../core';
import { FlowClientContext } from '../components/flow-provider';

/**
 * Hook to access the Flow client from context
 *
 * @returns The Flow client from context, or null if not available
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const client = useFlowClient();
 *
 *   if (!client) {
 *     return <div>No Flow client available</div>;
 *   }
 *
 *   // Use client for custom logic
 *   return <div>Connected with client ID: {client.clientId}</div>;
 * };
 * ```
 */
export function useFlowClient(): FlowClient | null {
  return use(FlowClientContext);
}
