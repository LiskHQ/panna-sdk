import { renderHook, waitFor } from '@testing-library/react';
// Extract mocked functions for use in tests
import { accountBalancesInFiat } from 'src/core';
import { TokenBalance as UITokenBalance } from '@/mocks/token-balances';
import { createQueryClientWrapper } from '../test-utils';
import { useTokenBalances } from './use-token-balances';

// Mock usePanna to provide a client without needing the full provider
jest.mock('./use-panna', () => ({
  usePanna: jest.fn(() => ({
    client: {} as unknown as { clientId: string },
    partnerId: ''
  }))
}));

// Partially mock core: only override accountBalancesInFiat
jest.mock('src/core', () => {
  const actual = jest.requireActual('src/core');
  return {
    ...actual,
    accountBalancesInFiat: jest.fn()
  };
});

// Mock utils to control chain and supported tokens/icon mapping
jest.mock('@/utils', () => ({
  getEnvironmentChain: jest.fn(() => ({ id: 123 })),
  getSupportedTokens: jest.fn(() => ({
    123: [
      {
        address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        symbol: 'AAA',
        name: 'Alpha',
        icon: 'icon-alpha'
      },
      {
        address: '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        symbol: 'BBB',
        name: 'Beta'
        // no icon to test fallback
      }
    ]
  }))
}));

const mockedAccountBalancesInFiat =
  accountBalancesInFiat as jest.MockedFunction<typeof accountBalancesInFiat>;

describe('useTokenBalances', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns token balances with icons mapped from supported tokens', async () => {
    mockedAccountBalancesInFiat.mockResolvedValue({
      totalValue: { amount: 100, currency: 'USD' },
      tokenBalances: [
        {
          token: {
            address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            symbol: 'AAA',
            name: 'Alpha',
            decimals: 18
          },
          tokenBalance: { value: BigInt(1), displayValue: '1' },
          fiatBalance: { amount: 60, currency: 'USD' }
        },
        {
          token: {
            address: '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
            symbol: 'BBB',
            name: 'Beta',
            decimals: 18
          },
          tokenBalance: { value: BigInt(2), displayValue: '2' },
          fiatBalance: { amount: 40, currency: 'USD' }
        }
      ]
    });

    const { result } = renderHook(
      () =>
        useTokenBalances({
          address: '0x1234567890123456789012345678901234567890'
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data as UITokenBalance[];
    expect(data).toHaveLength(2);
    // First token uses its own icon
    expect(data[0].token.symbol).toBe('AAA');
    expect(data[0].token.icon).toBe('icon-alpha');
    // Second token falls back to the first icon
    expect(data[1].token.symbol).toBe('BBB');
    expect(data[1].token.icon).toBe('icon-alpha');
  });

  it('sets error state when address is invalid', async () => {
    const { result } = renderHook(
      () => useTokenBalances({ address: 'invalid-address' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
