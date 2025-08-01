import type { PannaClient } from '../client';
import type {
  OnrampStatus,
  OnrampTransaction,
  OnrampPurchaseData,
  OnrampStatusParams,
  OnrampStatusResult,
  OnrampCreatedResult,
  OnrampPendingResult,
  OnrampCompletedResult
} from './types';

describe('Onramp Types', () => {
  it('should allow valid OnrampStatus values', () => {
    const createdStatus: OnrampStatus = 'CREATED';
    const pendingStatus: OnrampStatus = 'PENDING';
    const completedStatus: OnrampStatus = 'COMPLETED';

    expect(createdStatus).toBe('CREATED');
    expect(pendingStatus).toBe('PENDING');
    expect(completedStatus).toBe('COMPLETED');
  });

  it('should enforce OnrampTransaction structure', () => {
    const transaction: OnrampTransaction = {
      chainId: 1,
      transactionHash: '0xabc123...'
    };

    expect(transaction.chainId).toBe(1);
    expect(transaction.transactionHash).toBe('0xabc123...');
  });

  it('should allow flexible OnrampPurchaseData', () => {
    const purchaseData: OnrampPurchaseData = {
      sessionId: 'session-123',
      amount: '100',
      currency: 'USD',
      customField: { nested: true },
      metadata: ['tag1', 'tag2']
    };

    expect(purchaseData.sessionId).toBe('session-123');
    expect(purchaseData.amount).toBe('100');
    expect(purchaseData.currency).toBe('USD');
    expect(purchaseData.customField).toEqual({ nested: true });
    expect(purchaseData.metadata).toEqual(['tag1', 'tag2']);
  });

  it('should enforce OnrampStatusParams structure', () => {
    const mockClient = { clientId: 'test' } as PannaClient;
    const params: OnrampStatusParams = {
      id: 'session-123',
      client: mockClient
    };

    expect(params.id).toBe('session-123');
    expect(params.client).toBe(mockClient);
  });

  it('should correctly type CREATED status result', () => {
    const createdResult: OnrampCreatedResult = {
      status: 'CREATED',
      transactions: [],
      purchaseData: { testId: 'test' }
    };

    expect(createdResult.status).toBe('CREATED');
    expect(createdResult.transactions).toHaveLength(0);

    // TypeScript should enforce empty transactions array
    const isCorrectType: OnrampStatusResult = createdResult;
    expect(isCorrectType).toBeDefined();
  });

  it('should correctly type PENDING status result', () => {
    const pendingResult: OnrampPendingResult = {
      status: 'PENDING',
      transactions: [],
      purchaseData: { testId: 'test' }
    };

    expect(pendingResult.status).toBe('PENDING');
    expect(pendingResult.transactions).toHaveLength(0);

    const isCorrectType: OnrampStatusResult = pendingResult;
    expect(isCorrectType).toBeDefined();
  });

  it('should correctly type COMPLETED status result', () => {
    const completedResult: OnrampCompletedResult = {
      status: 'COMPLETED',
      transactions: [
        { chainId: 1, transactionHash: '0x123' },
        { chainId: 56, transactionHash: '0x456' }
      ],
      purchaseData: { testId: 'test' }
    };

    expect(completedResult.status).toBe('COMPLETED');
    expect(completedResult.transactions).toHaveLength(2);

    const isCorrectType: OnrampStatusResult = completedResult;
    expect(isCorrectType).toBeDefined();
  });

  it('should allow type narrowing on OnrampStatusResult', () => {
    // Test type narrowing with a function that handles different statuses
    function handleOnrampStatus(result: OnrampStatusResult) {
      switch (result.status) {
        case 'COMPLETED':
          // TypeScript knows transactions can have items for completed status
          return result.transactions.length;
        case 'CREATED':
        case 'PENDING':
          // TypeScript knows transactions is empty for these statuses
          return result.transactions.length === 0;
        default: {
          // Exhaustiveness check
          const _exhaustiveCheck: never = result;
          return _exhaustiveCheck;
        }
      }
    }

    const completedResult: OnrampStatusResult = {
      status: 'COMPLETED',
      transactions: [{ chainId: 1, transactionHash: '0x123' }],
      purchaseData: { testId: 'test' }
    };

    const createdResult: OnrampStatusResult = {
      status: 'CREATED',
      transactions: [],
      purchaseData: { testId: 'test' }
    };

    expect(handleOnrampStatus(completedResult)).toBe(1);
    expect(handleOnrampStatus(createdResult)).toBe(true);
  });
});
