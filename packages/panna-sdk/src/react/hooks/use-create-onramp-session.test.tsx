import { renderHook, waitFor } from '@testing-library/react';
import type { SiweAuth } from '../../core/auth/siwe-auth';
import type { PannaClient } from '../../core/client/client';
import type { PannaApiService } from '../../core/util/api-service';
import type { SessionData } from '../../core/util/types';
import type { PannaContextValue } from '../components/panna-provider';
import type { QuoteData } from '../types/onramp-quote.types';
import { createQueryClientWrapper } from '../utils/test-utils';
import { useCreateOnrampSession } from './use-create-onramp-session';
import { usePanna } from './use-panna';

jest.mock('./use-panna', () => ({
  usePanna: jest.fn()
}));

const mockApiService = {
  createOnrampSession: jest.fn()
};

const mockSiweAuth = {
  getValidAuthToken: jest.fn(),
  getUser: jest.fn()
};

const mockQuote: QuoteData = {
  rate: 0.9985,
  crypto_quantity: 97.73,
  onramp_fee: 0.5,
  client_fee: 0,
  gateway_fee: 0,
  gas_fee: 2.27,
  total_fiat_amount: 102.27,
  quote_timestamp: '2025-01-15T12:00:00Z',
  quote_validity_mins: 15
};

const mockSession: SessionData = {
  session_id: 'c59309e4-3647-49a8-bf32-beab50923a27',
  redirect_url: 'https://sandbox.onramp.money/main/buy/?appId=mock',
  expires_at: '2025-01-15T12:30:00Z',
  quote_data: mockQuote
};

const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;

describe('useCreateOnrampSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSiweAuth.getValidAuthToken.mockReturnValue('mock-token');
    mockSiweAuth.getUser.mockReturnValue(
      '0x1234567890abcdef1234567890abcdef12345678'
    );

    const mockContext: PannaContextValue = {
      client: {} as PannaClient,
      partnerId: 'partner-id',
      chainId: '1',
      pannaApiService: mockApiService as unknown as PannaApiService,
      siweAuth: mockSiweAuth as unknown as SiweAuth
    };

    mockUsePanna.mockReturnValue(mockContext);
  });

  it('creates an onramp session with quote data', async () => {
    mockApiService.createOnrampSession.mockResolvedValue(mockSession);

    const { result } = renderHook(() => useCreateOnrampSession(), {
      wrapper: createQueryClientWrapper()
    });

    await expect(
      result.current.mutateAsync({
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD',
        quoteData: mockQuote
      })
    ).resolves.toEqual(mockSession);

    await waitFor(() => expect(result.current.data).toEqual(mockSession));

    expect(mockApiService.createOnrampSession).toHaveBeenCalledWith(
      {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD',
        redirectUrl: undefined,
        quoteData: mockQuote
      },
      'mock-token'
    );
  });

  it('creates an onramp session without quote data', async () => {
    const sessionWithoutQuote: SessionData = {
      ...mockSession,
      quote_data: undefined
    };

    mockApiService.createOnrampSession.mockResolvedValue(sessionWithoutQuote);

    const { result } = renderHook(() => useCreateOnrampSession(), {
      wrapper: createQueryClientWrapper()
    });

    await expect(
      result.current.mutateAsync({
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 200,
        fiatCurrency: 'USD'
      })
    ).resolves.toEqual(sessionWithoutQuote);

    await waitFor(() =>
      expect(result.current.data).toEqual(sessionWithoutQuote)
    );

    expect(mockApiService.createOnrampSession).toHaveBeenCalledWith(
      {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 200,
        fiatCurrency: 'USD',
        redirectUrl: undefined,
        quoteData: undefined
      },
      'mock-token'
    );
  });

  it('propagates API errors', async () => {
    const apiError = new Error('API request failed');
    mockApiService.createOnrampSession.mockRejectedValue(apiError);

    const { result } = renderHook(() => useCreateOnrampSession(), {
      wrapper: createQueryClientWrapper()
    });

    await expect(
      result.current.mutateAsync({
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD',
        quoteData: mockQuote
      })
    ).rejects.toThrow('API request failed');

    await waitFor(() => expect(result.current.error).toBe(apiError));
  });

  it('throws when authentication token is missing', async () => {
    mockSiweAuth.getValidAuthToken.mockReturnValueOnce(null);

    const { result } = renderHook(() => useCreateOnrampSession(), {
      wrapper: createQueryClientWrapper()
    });

    await expect(
      result.current.mutateAsync({
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD',
        quoteData: mockQuote
      })
    ).rejects.toThrow('Missing authentication token for onramp session.');

    expect(mockApiService.createOnrampSession).not.toHaveBeenCalled();
  });
});
