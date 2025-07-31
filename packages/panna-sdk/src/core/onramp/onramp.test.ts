import { Bridge } from 'thirdweb';
import type { PannaClient } from '../client';
import { onRampStatus } from './onramp';
import type {
  OnrampCreatedResult,
  OnrampPendingResult,
  OnrampCompletedResult
} from './types';

// Mock thirdweb Bridge module
jest.mock('thirdweb', () => ({
  Bridge: {
    Onramp: {
      status: jest.fn()
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
