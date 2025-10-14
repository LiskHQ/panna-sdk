import { renderHook, waitFor } from '@testing-library/react';
import {
  getActivitiesByAddress,
  DEFAULT_CURRENCY,
  type PannaClient,
  TransactionActivity,
  TokenERC
} from 'src/core';
import { mockActivities } from '@/mocks/activities';
import { createQueryClientWrapper } from '../utils/test-utils';
import { useActivities } from './use-activities';

jest.mock('./use-panna', () => ({
  usePanna: jest.fn(() => ({
    client: {} as unknown as { clientId: string },
    partnerId: ''
  }))
}));

jest.mock('src/core', () => {
  const actual = jest.requireActual('src/core');
  return {
    ...actual,
    getActivitiesByAddress: jest.fn()
  };
});

const mockedGetActivitiesByAddress =
  getActivitiesByAddress as jest.MockedFunction<typeof getActivitiesByAddress>;

describe('useActivities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns activities data when address is valid', async () => {
    mockedGetActivitiesByAddress.mockResolvedValue({
      activities: [
        {
          activityType: TransactionActivity.SENT,
          transactionID: '0x123',
          amount: {
            type: TokenERC.ETH,
            value: '1000000000000000000',
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
              type: TokenERC.ETH,
              icon: null
            },
            fiatValue: {
              amount: 3000,
              currency: DEFAULT_CURRENCY
            }
          },
          status: 'success'
        }
      ],
      metadata: {
        count: 1,
        offset: 0,
        limit: 10,
        hasNextPage: false
      }
    });

    const { result } = renderHook(
      () =>
        useActivities({
          address: '0x1234567890123456789012345678901234567890',
          client: {} as PannaClient
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.activities).toHaveLength(1);
    expect(result.current.data?.activities[0].activityType).toBe(
      TransactionActivity.SENT
    );
    expect(result.current.data?.activities[0].amount.type).toBe(TokenERC.ETH);

    const activity = result.current.data?.activities[0];
    if (activity && 'fiatValue' in activity.amount) {
      expect(activity.amount.fiatValue?.amount).toBe(3000);
      expect(activity.amount.fiatValue?.currency).toBe(DEFAULT_CURRENCY);
    }
  });

  it('sets error state when address is invalid', async () => {
    const { result } = renderHook(
      () =>
        useActivities({
          address: 'invalid-address',
          client: {} as PannaClient
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('includes all query parameters in cache key', async () => {
    mockedGetActivitiesByAddress.mockResolvedValue(mockActivities);

    const { result } = renderHook(
      () =>
        useActivities({
          address: '0x1234567890123456789012345678901234567890',
          client: {} as PannaClient,
          limit: 20,
          offset: 10
        }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetActivitiesByAddress).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0x1234567890123456789012345678901234567890',
        limit: 20,
        offset: 10
      })
    );
  });
});
