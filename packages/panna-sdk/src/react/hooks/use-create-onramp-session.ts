import { useMutation } from '@tanstack/react-query';
import type { QuoteData } from '../types/onramp-quote.types';

type CreateSessionResult = {
  url: string;
};

type CreateSessionParams = {
  quote: QuoteData;
};

/**
 * Hook to create an onramp session
 * Currently mocked - will be replaced with real API call
 */
export function useCreateOnrampSession() {
  return useMutation<CreateSessionResult, Error, CreateSessionParams>({
    mutationFn: async ({ quote }: CreateSessionParams) => {
      // TODO: Replace with real API call to create onramp session
      // This is a mocked implementation for now
      console.log('Creating onramp session for quote:', quote);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock response
      return {
        url: 'https://onramp.money'
      };
    }
  });
}
