'use client';

import { FlowProvider } from 'flow-sdk';

/**
 * Next.js-specific wrapper for FlowProvider that ensures client-side rendering.
 * This prevents hydration mismatches while keeping the core FlowProvider framework agnostic.
 */
export function Providers(props: { children: React.ReactNode }) {
  return (
    <FlowProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
      {props.children}
    </FlowProvider>
  );
}
