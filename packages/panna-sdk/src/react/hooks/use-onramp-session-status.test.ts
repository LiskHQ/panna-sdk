import { renderHook, waitFor } from '@testing-library/react';
import { SiweAuth } from 'src/core/auth';
import { PannaClient } from 'src/core/client';
import {
  CompletedSessionStatus,
  FailedSessionStatus,
  mockSessionStatusCompleted,
  mockSessionStatusCreated,
  mockSessionStatusFailed,
  mockSessionStatusPending
} from 'src/core/onramp/onramp-money';
import { PannaApiService } from 'src/core/util/api-service';
import { createQueryClientWrapper } from '../utils/test-utils';
import { useOnrampSessionStatus } from './use-onramp-session-status';
import { usePanna } from './use-panna';

const mockPannaApiService = {
  getSessionStatus: jest.fn()
};

const mockSiweAuth = {
  getValidAuthToken: jest.fn()
};

jest.mock('./use-panna', () => ({
  usePanna: jest.fn()
}));

const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;

describe('useOnrampSessionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSiweAuth.getValidAuthToken.mockResolvedValue('mock-jwt-token');
    mockUsePanna.mockReturnValue({
      client: { clientId: 'test-client-id' } as PannaClient,
      partnerId: 'test-partner-id',
      chainId: '1135',
      pannaApiService: mockPannaApiService as unknown as PannaApiService,
      siweAuth: mockSiweAuth as unknown as SiweAuth
    });
  });

  it('returns loading state initially', () => {
    mockPannaApiService.getSessionStatus.mockImplementation(
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
    mockPannaApiService.getSessionStatus.mockResolvedValue(
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
    expect(
      (result.current.data as CompletedSessionStatus)?.transaction_hash
    ).toBeDefined();
  });

  it('calls getSessionStatus with correct parameters', async () => {
    mockPannaApiService.getSessionStatus.mockResolvedValue(
      mockSessionStatusCreated
    );

    const sessionId = 'test-session-456';
    const { result } = renderHook(() => useOnrampSessionStatus({ sessionId }), {
      wrapper: createQueryClientWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPannaApiService.getSessionStatus).toHaveBeenCalledWith({
      sessionId,
      authToken: 'mock-jwt-token'
    });
  });

  it('handles auth token being null', async () => {
    mockSiweAuth.getValidAuthToken.mockResolvedValue(null);
    mockPannaApiService.getSessionStatus.mockResolvedValue(
      mockSessionStatusCreated
    );

    const sessionId = 'test-session-789';
    const { result } = renderHook(() => useOnrampSessionStatus({ sessionId }), {
      wrapper: createQueryClientWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockPannaApiService.getSessionStatus).toHaveBeenCalledWith({
      sessionId,
      authToken: undefined
    });
  });

  it('sets error state when fetch fails', async () => {
    mockPannaApiService.getSessionStatus.mockRejectedValue(
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

  it('sets pending state when sessionId is empty', async () => {
    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: '' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.status).toBe('pending'));
  });

  it('polls every 5 seconds for pending status', async () => {
    mockPannaApiService.getSessionStatus.mockResolvedValue(
      mockSessionStatusPending
    );

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-pending' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe('pending');
  });

  it('stops polling for completed status', async () => {
    mockPannaApiService.getSessionStatus.mockResolvedValue(
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
    mockPannaApiService.getSessionStatus.mockResolvedValue(
      mockSessionStatusFailed
    );

    const { result } = renderHook(
      () => useOnrampSessionStatus({ sessionId: 'test-session-failed' }),
      { wrapper: createQueryClientWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe('failed');
    expect(
      (result.current.data as FailedSessionStatus)?.error_message
    ).toBeDefined();
  });

  it('allows manual refetch', async () => {
    let callCount = 0;
    mockPannaApiService.getSessionStatus.mockImplementation(async () => {
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
    mockPannaApiService.getSessionStatus.mockResolvedValue(
      mockSessionStatusCreated
    );

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

    expect(mockPannaApiService.getSessionStatus).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: sessionId1 })
    );
    expect(mockPannaApiService.getSessionStatus).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: sessionId2 })
    );
  });
});
