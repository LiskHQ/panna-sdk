import { renderHook, waitFor } from '@testing-library/react';
import { getValidSiweAuthToken } from 'src/core/auth';
import {
  getSessionStatus,
  mockSessionStatusCompleted,
  mockSessionStatusCreated,
  mockSessionStatusFailed,
  mockSessionStatusPending
} from 'src/core/onramp/onramp-money';
import { createQueryClientWrapper } from '../utils/test-utils';
import { useOnrampSessionStatus } from './use-onramp-session-status';

jest.mock('./use-panna', () => ({
  usePanna: jest.fn(() => ({
    client: { clientId: 'test-client-id' },
    partnerId: 'test-partner-id',
    chainId: 1135
  }))
}));

jest.mock('src/core/auth', () => ({
  getValidSiweAuthToken: jest.fn()
}));

jest.mock('src/core/onramp/onramp-money', () => {
  return {
    ...jest.requireActual('src/core/onramp/onramp-money'),
    getSessionStatus: jest.fn()
  };
});

describe('useOnrampSessionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getValidSiweAuthToken as jest.Mock).mockResolvedValue('mock-jwt-token');
  });

  it('returns loading state initially', () => {
    (getSessionStatus as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-123' }),
      { wrapper: createQueryClientWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns session status data when fetch succeeds', async () => {
    (getSessionStatus as jest.Mock).mockResolvedValue(
      mockSessionStatusCompleted
    );

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-123' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.status).toBe('completed');
    expect(result.current.data?.session_id).toBe('test-session-completed-789');
    expect(result.current.data?.transaction_hash).toBeDefined();
  });

  it('calls getSessionStatus with correct parameters', async () => {
    (getSessionStatus as jest.Mock).mockResolvedValue(mockSessionStatusCreated);

    const sessionId = 'test-session-456';
    const { result } = renderHook(() => useOnrampSessionStatus({ sessionId }), {
      wrapper: createQueryClientWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getSessionStatus).toHaveBeenCalledWith({
      sessionId,
      client: { clientId: 'test-client-id' },
      authToken: 'mock-jwt-token'
    });
  });

  it('handles auth token being null', async () => {
    (getValidSiweAuthToken as jest.Mock).mockResolvedValue(null);
    (getSessionStatus as jest.Mock).mockResolvedValue(mockSessionStatusCreated);

    const sessionId = 'test-session-789';
    const { result } = renderHook(() => useOnrampSessionStatus({ sessionId }), {
      wrapper: createQueryClientWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getSessionStatus).toHaveBeenCalledWith({
      sessionId,
      client: { clientId: 'test-client-id' },
      authToken: undefined
    });
  });

  it('sets error state when fetch fails', async () => {
    (getSessionStatus as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch session status')
    );

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-error' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 5000
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toContain(
      'Failed to fetch session status'
    );
  });

  it('sets error state when sessionId is empty', async () => {
    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: '' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('Invalid query state');
  });

  it('polls every 5 seconds for pending status', async () => {
    (getSessionStatus as jest.Mock).mockResolvedValue(mockSessionStatusPending);

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-pending' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe('pending');
  });

  it('stops polling for completed status', async () => {
    (getSessionStatus as jest.Mock).mockResolvedValue(
      mockSessionStatusCompleted
    );

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-completed' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe('completed');
  });

  it('stops polling for failed status', async () => {
    (getSessionStatus as jest.Mock).mockResolvedValue(mockSessionStatusFailed);

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-failed' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe('failed');
    expect(result.current.data?.error_message).toBeDefined();
  });

  it('allows manual refetch', async () => {
    let callCount = 0;
    (getSessionStatus as jest.Mock).mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return mockSessionStatusPending;
      }
      return mockSessionStatusCompleted;
    });

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-refetch' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('pending');

    await result.current.refetch();

    await waitFor(() => expect(result.current.data?.status).toBe('completed'));
  });

  it('includes sessionId in query key for caching', async () => {
    (getSessionStatus as jest.Mock).mockResolvedValue(mockSessionStatusCreated);

    const sessionId1 = 'session-1';
    const sessionId2 = 'session-2';

    const { result: result1 } = renderHook(
      () => useOnrampSessionStatus({ sessionId: sessionId1 }),
      { wrapper: createQueryClientWrapper() }
    );

    const { result: result2 } = renderHook(
      () => useOnrampSessionStatus({ sessionId: sessionId2 }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    expect(getSessionStatus).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: sessionId1 })
    );
    expect(getSessionStatus).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: sessionId2 })
    );
  });
});
