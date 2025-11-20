import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { SessionData } from '../../core/util/types';
import type { QuoteData } from '../types/onramp-quote.types';
import { usePanna } from './use-panna';

export type CreateSessionParams = {
  tokenSymbol: string;
  network: string;
  fiatAmount: number;
  fiatCurrency: string;
  quoteData?: QuoteData;
  redirectUrl?: string;
};

function isValidParams(params: CreateSessionParams): boolean {
  return (
    Boolean(params.tokenSymbol) &&
    Boolean(params.network) &&
    typeof params.fiatAmount === 'number' &&
    Number.isFinite(params.fiatAmount) &&
    params.fiatAmount > 0 &&
    Boolean(params.fiatCurrency)
  );
}

function ensureValidSessionData(session: SessionData): SessionData {
  if (!session.session_id || !session.redirect_url || !session.expires_at) {
    throw new Error('Invalid session data received from Panna API.');
  }

  return session;
}

/**
 * Hook to create an onramp session backed by the Panna API.
 *
 * @returns The React Query mutation object for managing onramp session creation.
 *
 * @example
 * ```tsx
 * const { mutateAsync, isPending } = useCreateOnrampSession();
 *
 * async function handleClick() {
 *   const session = await mutateAsync({
 *     tokenSymbol: 'USDC',
 *     network: 'lisk',
 *     fiatAmount: 100,
 *     fiatCurrency: 'USD',
 *     quoteData
 *   });
 *
 *   window.location.href = session.redirect_url;
 * }
 * ```
 */
export function useCreateOnrampSession(): UseMutationResult<
  SessionData,
  Error,
  CreateSessionParams
> {
  const { pannaApiService, siweAuth } = usePanna();

  return useMutation<SessionData, Error, CreateSessionParams>({
    mutationFn: async (params) => {
      if (!isValidParams(params)) {
        throw new Error('Invalid session parameters provided.');
      }

      const authToken = siweAuth.getValidAuthToken();

      if (!authToken) {
        throw new Error('Missing authentication token for onramp session.');
      }

      const walletAddress = siweAuth.getUser();

      if (!walletAddress) {
        throw new Error('Missing wallet address for onramp session.');
      }

      console.debug('Creating onramp session with params:', params);

      const sessionData = await pannaApiService.createOnrampSession(
        {
          walletAddress,
          tokenSymbol: params.tokenSymbol,
          network: params.network,
          fiatAmount: params.fiatAmount,
          fiatCurrency: params.fiatCurrency,
          redirectUrl: params.redirectUrl,
          quoteData: params.quoteData
        },
        authToken
      );

      console.info('Onramp session created successfully:', sessionData);

      return ensureValidSessionData(sessionData);
    }
  });
}
