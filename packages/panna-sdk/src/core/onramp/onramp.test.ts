import { Bridge } from 'thirdweb';
import { liskSepolia } from '../chains';
import type { PannaClient } from '../client';
import { onRampStatus, onRampPrepare, getOnrampProviders } from './onramp';
// import { OnrampProvider } from './constants';
import type {
  OnrampCreatedResult,
  OnrampPendingResult,
  OnrampCompletedResult,
  OnrampPrepareParams
} from './types';

// Mock thirdweb Bridge module
jest.mock('thirdweb', () => ({
  Bridge: {
    Onramp: {
      status: jest.fn(),
      prepare: jest.fn()
    }
  }
}));

describe('onRampStatus', () => {
  const mockClient = { clientId: 'test-client-id' } as PannaClient;
  const mockSessionId = '022218cc-96af-4291-b90c-dadcb47571ec';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return CREATED status successfully', async () => {
    const mockCreatedResult: OnrampCreatedResult = {
      status: 'CREATED',
      transactions: [],
      purchaseData: {
        customId: '123',
        metadata: { source: 'mobile' }
      }
    };

    (Bridge.Onramp.status as jest.Mock).mockResolvedValue(mockCreatedResult);

    const result = await onRampStatus({
      id: mockSessionId,
      client: mockClient
    });

    expect(result).toEqual(mockCreatedResult);
    expect(Bridge.Onramp.status).toHaveBeenCalledWith({
      id: mockSessionId,
      client: mockClient
    });
  });

  it('should return PENDING status successfully', async () => {
    const mockPendingResult: OnrampPendingResult = {
      status: 'PENDING',
      transactions: [],
      purchaseData: {
        userId: 'user-456',
        purchaseAmount: 100,
        currency: 'USD'
      }
    };

    (Bridge.Onramp.status as jest.Mock).mockResolvedValue(mockPendingResult);

    const result = await onRampStatus({
      id: mockSessionId,
      client: mockClient
    });

    expect(result).toEqual(mockPendingResult);
    expect(result.status).toBe('PENDING');
    expect(result.transactions).toHaveLength(0);
  });

  it('should return COMPLETED status with transactions', async () => {
    const mockCompletedResult: OnrampCompletedResult = {
      status: 'COMPLETED',
      transactions: [
        {
          chainId: 1,
          transactionHash: '0x123abc...'
        },
        {
          chainId: 56,
          transactionHash: '0x456def...'
        }
      ],
      purchaseData: {
        sessionId: 'session-789',
        completedAt: '2024-01-15T10:30:00Z',
        finalAmount: '100.50'
      }
    };

    (Bridge.Onramp.status as jest.Mock).mockResolvedValue(mockCompletedResult);

    const result = await onRampStatus({
      id: mockSessionId,
      client: mockClient
    });

    expect(result).toEqual(mockCompletedResult);
    expect(result.status).toBe('COMPLETED');
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0].chainId).toBe(1);
    expect(result.transactions[0].transactionHash).toBe('0x123abc...');
  });

  it('should handle errors from thirdweb API', async () => {
    const mockError = new Error('API request failed');
    (Bridge.Onramp.status as jest.Mock).mockRejectedValue(mockError);

    await expect(
      onRampStatus({
        id: mockSessionId,
        client: mockClient
      })
    ).rejects.toThrow(
      `Failed to get onramp status for session ${mockSessionId}: API request failed`
    );
  });

  it('should handle non-Error objects thrown by API', async () => {
    (Bridge.Onramp.status as jest.Mock).mockRejectedValue('String error');

    await expect(
      onRampStatus({
        id: mockSessionId,
        client: mockClient
      })
    ).rejects.toThrow(
      `Failed to get onramp status for session ${mockSessionId}: Unknown error`
    );
  });

  it('should pass correct parameters to Bridge.Onramp.status', async () => {
    const mockResult: OnrampCreatedResult = {
      status: 'CREATED',
      transactions: [],
      purchaseData: { testId: 'test' }
    };

    (Bridge.Onramp.status as jest.Mock).mockResolvedValue(mockResult);

    const testId = 'custom-session-id';
    const testClient = { clientId: 'custom-client' } as PannaClient;

    await onRampStatus({
      id: testId,
      client: testClient
    });

    expect(Bridge.Onramp.status).toHaveBeenCalledTimes(1);
    expect(Bridge.Onramp.status).toHaveBeenCalledWith({
      id: testId,
      client: testClient
    });
  });
});

describe('onRampPrepare', () => {
  const mockClient = { clientId: 'test-client' } as PannaClient;

  const onRampProvider = 'stripe';
  const expectedPrepareResult = {
    id: 'session-prepare-1',
    link: 'https://onramp.example.com/session-prepare-1',
    currency: 'USD',
    currencyAmount: '100',
    destinationAmount: '11',
    timestamp: 1710000000,
    expiration: 1710003600
  };

  const expectedIntent = {
    onRampProvider,
    chainId: 1,
    tokenAddress: '0xToken',
    receiver: '0xReceiver',
    amount: '100'
  };

  const mockPrepareResult = {
    ...expectedPrepareResult,
    currencyAmount: Number(expectedPrepareResult.currencyAmount),
    destinationAmount: BigInt(expectedPrepareResult.destinationAmount)
  };

  const mockPrepareIntent = {
    onramp: onRampProvider,
    chainId: expectedIntent.chainId,
    tokenAddress: expectedIntent.tokenAddress,
    receiver: expectedIntent.receiver,
    amount: expectedIntent.amount
  };

  const params: OnrampPrepareParams = {
    client: mockClient,
    onRampProvider: onRampProvider,
    tokenAddress: '0xToken',
    receiver: '0xReceiver',
    amount: '100',
    country: 'US',
    chainId: liskSepolia.id,
    purchaseData: undefined
  };

  const expectedParams = {
    client: params.client,
    onramp: params.onRampProvider,
    tokenAddress: params.tokenAddress,
    receiver: params.receiver,
    amount: BigInt(params.amount),
    country: params.country,
    chainId: params.chainId,
    purchaseData: params.purchaseData
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Bridge.Onramp.prepare with correct parameters', async () => {
    (Bridge.Onramp.prepare as jest.Mock).mockResolvedValue({
      ...mockPrepareResult,
      intent: { ...mockPrepareIntent }
    });

    const result = await onRampPrepare(params);

    expect(Bridge.Onramp.prepare).toHaveBeenCalledTimes(1);
    expect(Bridge.Onramp.prepare).toHaveBeenCalledWith(expectedParams);
    expect(result).toEqual({
      ...expectedPrepareResult,
      intent: { ...expectedIntent }
    });
  });

  it('should throw with descriptive error if Bridge.Onramp.prepare throws Error', async () => {
    (Bridge.Onramp.prepare as jest.Mock).mockRejectedValue(
      new Error('API prepare failed')
    );

    await expect(
      onRampPrepare({
        client: mockClient,
        onRampProvider: 'stripe',
        chainId: 1,
        tokenAddress: '0xToken',
        receiver: '0xReceiver',
        amount: '100',
        country: 'US'
      })
    ).rejects.toThrow('Failed to prepare onramp: API prepare failed');
  });

  it('should throw with generic error if Bridge.Onramp.prepare throws non-Error', async () => {
    (Bridge.Onramp.prepare as jest.Mock).mockRejectedValue('String error');

    await expect(
      onRampPrepare({
        client: mockClient,
        onRampProvider: 'stripe',
        chainId: 1,
        tokenAddress: '0xToken',
        receiver: '0xReceiver',
        amount: '100',
        country: 'US'
      })
    ).rejects.toThrow('Failed to prepare onramp: Unknown error');
  });

  it('should work with minimal required parameters', async () => {
    (Bridge.Onramp.prepare as jest.Mock).mockResolvedValue(mockPrepareResult);

    const result = await onRampPrepare(params);

    expect(Bridge.Onramp.prepare).toHaveBeenCalledWith(expectedParams);
    expect(result).toEqual(expectedPrepareResult);
  });
});

describe('getOnrampProviders', () => {
  const expectedResultForDeAndUs = [
    {
      id: 'transak',
      displayName: 'Transak',
      websiteUrl: 'https://www.transak.com'
    },
    {
      id: 'coinbase',
      displayName: 'Coinbase',
      websiteUrl: 'https://www.coinbase.com'
    },
    {
      id: 'stripe',
      displayName: 'Stripe',
      websiteUrl: 'https://www.stripe.com'
    }
  ];
  const expectedResultForSA = [
    {
      id: 'coinbase',
      displayName: 'Coinbase',
      websiteUrl: 'https://www.coinbase.com'
    },
    {
      id: 'stripe',
      displayName: 'Stripe',
      websiteUrl: 'https://www.stripe.com'
    }
  ];

  it('should get onramp providers for a specific country DE', async () => {
    const resultUS = await getOnrampProviders('US');
    const resultDE = await getOnrampProviders('DE');
    expect(resultUS).toEqual(expectedResultForDeAndUs);
    expect(resultDE).toEqual(expectedResultForDeAndUs);
  });

  it('should handle case insensitivity for country codes', async () => {
    const result1 = await getOnrampProviders('de');
    expect(result1).toEqual(expectedResultForDeAndUs);

    const result2 = await getOnrampProviders('De');
    expect(result2).toEqual(expectedResultForDeAndUs);
  });

  it('should return providers for a valid country code SA', async () => {
    const result = await getOnrampProviders('SA');
    expect(result).toEqual(expectedResultForSA);
  });

  it('should return an empty array for unsupported countries', async () => {
    const result = await getOnrampProviders('aQ');
    expect(result).toEqual([]);
  });

  it('should throw an error for invalid country codes', async () => {
    expect(() => getOnrampProviders('INVALID')).toThrow(
      'Invalid country code: INVALID'
    );
  });
});
