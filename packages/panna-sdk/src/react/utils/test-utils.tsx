import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Dialog } from '@/components/ui/dialog';

/**
 * Creates a QueryClient wrapper for testing React Query hooks.
 * This wrapper disables retries for faster test execution.
 */
export function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * Creates a Dialog wrapper for testing components that rely on Dialog context.
 */
export function createDialogWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <Dialog open>{children}</Dialog>
  );
}
