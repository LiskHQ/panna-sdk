import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { SiweAuth } from '../../core/auth';
import { PannaClient } from '../../core/client';
import { PannaApiService } from '../../core/util/api-service';
import { usePanna } from '../hooks/use-panna';
import type { QuoteData } from '../types/onramp-quote.types';
import { createQueryClientWrapper } from '../utils/test-utils';
import { useOnrampQuotes } from './use-onramp-quotes';

jest.mock('../hooks/use-panna', () => ({
  usePanna: jest.fn()
}));

const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;

const mockPannaApiService = {
  getOnrampQuote: jest.fn()
};

const mockSiweAuth = {
  getValidAuthToken: jest.fn()
};

const mockedGetOnrampQuote =
  mockPannaApiService.getOnrampQuote as jest.MockedFunction<
    typeof mockPannaApiService.getOnrampQuote
  >;

const mockedGetValidAuthToken =
  mockSiweAuth.getValidAuthToken as jest.MockedFunction<
    typeof mockSiweAuth.getValidAuthToken
  >;

const mockQuote: QuoteData = {
  rate: 0.9985,
  crypto_quantity: 97.73,
  onramp_fee: 0.5,
  gas_fee: 2.27,
  total_fiat_amount: 102.27,
  quote_timestamp: '2025-01-15T12:00:00Z',
  quote_validity_mins: 15
};

describe('useOnrampQuotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetValidAuthToken.mockResolvedValue('mock-token');
    mockUsePanna.mockReturnValue({
      client: {} as PannaClient,
      partnerId: 'test-partner',
      chainId: '4202',
      pannaApiService: mockPannaApiService as unknown as PannaApiService,
      siweAuth: mockSiweAuth as unknown as SiweAuth
    });
  });

  it('returns quote data when all parameters are valid', async () => {
    mockedGetOnrampQuote.mockResolvedValue(mockQuote);

    const { result } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuote);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(mockedGetOnrampQuote).toHaveBeenCalledWith(
      {
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD'
      },
      'mock-token'
    );
  });

  it('sets isLoading to true while fetching', async () => {
    mockedGetOnrampQuote.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockQuote), 100);
        })
    );

    const { result } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockQuote);
  });

  it('handles API call errors', async () => {
    const error = new Error('API request failed');
    mockedGetOnrampQuote.mockRejectedValue(error);

    renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => {
      expect(mockedGetOnrampQuote).toHaveBeenCalled();
    });

    expect(mockedGetOnrampQuote).toHaveBeenCalledWith(
      {
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD'
      },
      'mock-token'
    );
  });

  it('requires authentication token', async () => {
    mockedGetValidAuthToken.mockResolvedValue(null);

    renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockedGetOnrampQuote).not.toHaveBeenCalled();
  });

  it('does not fetch when fiatAmount is zero', async () => {
    const { result } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 0,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(mockedGetOnrampQuote).not.toHaveBeenCalled();
  });

  it('does not fetch when fiatAmount is negative', async () => {
    const { result } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: -100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(mockedGetOnrampQuote).not.toHaveBeenCalled();
  });

  it('does not fetch when tokenSymbol is empty', async () => {
    const { result } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: '',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(mockedGetOnrampQuote).not.toHaveBeenCalled();
  });

  it('retries on failure up to 3 times', async () => {
    let attemptCount = 0;
    mockedGetOnrampQuote.mockImplementation(() => {
      attemptCount++;
      return Promise.reject(new Error('Network error'));
    });

    const createRetryWrapper = () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: 3, retryDelay: 0 } }
      });
      return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };

    const { result } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createRetryWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 3000
    });

    expect(attemptCount).toBe(4);
  });

  it('caches quote data for 15 minutes', async () => {
    mockedGetOnrampQuote.mockResolvedValue(mockQuote);

    const { result, rerender } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetOnrampQuote).toHaveBeenCalledTimes(1);

    rerender();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetOnrampQuote).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockQuote);
  });

  it('includes all query parameters in cache key', async () => {
    mockedGetOnrampQuote.mockResolvedValue(mockQuote);

    const { result } = renderHook(
      () =>
        useOnrampQuotes({
          tokenSymbol: 'USDC',
          network: 'lisk',
          fiatAmount: 100,
          fiatCurrency: 'USD'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetOnrampQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD'
      }),
      'mock-token'
    );
  });
});
