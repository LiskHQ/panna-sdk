import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useDisconnect } from 'thirdweb/react';
import { Wallet, WalletId } from 'thirdweb/wallets';
import { useLogout } from './use-logout';
import { usePanna } from './use-panna';

jest.mock('thirdweb/react');
jest.mock('./use-panna');

describe('useLogout', () => {
  let mockDisconnect: jest.Mock;
  let mockSiweAuthLogout: jest.Mock;
  let mockWallet: Wallet<WalletId>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockDisconnect = jest.fn();
    mockSiweAuthLogout = jest.fn();
    mockWallet = {
      id: 'test-wallet',
      getChain: jest.fn(),
      getAccount: jest.fn(),
      autoConnect: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      switchChain: jest.fn(),
      subscribe: jest.fn(),
      getConfig: jest.fn()
    } as unknown as Wallet<WalletId>;

    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect: mockDisconnect
    });

    (usePanna as jest.Mock).mockReturnValue({
      siweAuth: {
        logout: mockSiweAuthLogout
      }
    });
  });

  afterEach(() => {
    // Only run pending timers if we're using fake timers
    try {
      jest.runOnlyPendingTimers();
    } catch {
      // Silently ignore if fake timers are not active
    }
    jest.useRealTimers();
  });

  describe('disconnect', () => {
    it('should call wallet disconnect immediately', () => {
      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
      });

      expect(mockDisconnect).toHaveBeenCalledWith(mockWallet);
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should call siweAuth.logout after 2 second delay', () => {
      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
      });

      // Should not be called immediately
      expect(mockSiweAuthLogout).not.toHaveBeenCalled();

      // Fast-forward time by 2 seconds
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockSiweAuthLogout).toHaveBeenCalledTimes(1);
    });

    it('should not call siweAuth.logout before delay completes', () => {
      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
      });

      // Fast-forward time by 1 second (half the delay)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockSiweAuthLogout).not.toHaveBeenCalled();
    });

    it('should handle siweAuth.logout errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Logout failed');
      mockSiweAuthLogout.mockImplementation(() => {
        throw mockError;
      });

      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to complete SIWE logout:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should clear previous timeout when disconnect is called multiple times', () => {
      const { result } = renderHook(() => useLogout());

      // First disconnect
      act(() => {
        result.current.disconnect(mockWallet);
      });

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Second disconnect before first timeout completes
      act(() => {
        result.current.disconnect(mockWallet);
      });

      // Advance time by 1 more second (total 2 seconds from first call)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should not have been called yet (first timeout was cleared)
      expect(mockSiweAuthLogout).not.toHaveBeenCalled();

      // Advance another second (2 seconds from second call)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should be called exactly once (from second disconnect)
      expect(mockSiweAuthLogout).toHaveBeenCalledTimes(1);
      expect(mockDisconnect).toHaveBeenCalledTimes(2);
    });

    it('should work with multiple sequential disconnects', () => {
      const { result } = renderHook(() => useLogout());

      // First disconnect
      act(() => {
        result.current.disconnect(mockWallet);
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockSiweAuthLogout).toHaveBeenCalledTimes(1);

      // Second disconnect
      act(() => {
        result.current.disconnect(mockWallet);
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockSiweAuthLogout).toHaveBeenCalledTimes(2);
    });
  });

  describe('cleanup', () => {
    it('should clear timeout on component unmount', () => {
      const { result, unmount } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
      });

      // Unmount before timeout completes
      unmount();

      // Fast-forward past the timeout
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should not be called because timeout was cleared on unmount
      expect(mockSiweAuthLogout).not.toHaveBeenCalled();
    });

    it('should clear timeout even if disconnect was called multiple times', () => {
      const { result, unmount } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
        result.current.disconnect(mockWallet);
        result.current.disconnect(mockWallet);
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should not be called because all timeouts were cleared
      expect(mockSiweAuthLogout).not.toHaveBeenCalled();
    });

    it('should not interfere with completed timeouts on unmount', () => {
      const { result, unmount } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
      });

      // Complete the timeout before unmount
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockSiweAuthLogout).toHaveBeenCalledTimes(1);

      // Unmount should not cause issues
      unmount();

      expect(mockSiweAuthLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('return value', () => {
    it('should return an object with disconnect function', () => {
      const { result } = renderHook(() => useLogout());

      expect(result.current).toHaveProperty('disconnect');
      expect(typeof result.current.disconnect).toBe('function');
    });
  });

  describe('error scenarios', () => {
    it('should propagate wallet disconnect errors', () => {
      const mockError = new Error('Wallet disconnect failed');
      mockDisconnect.mockImplementation(() => {
        throw mockError;
      });

      const { result } = renderHook(() => useLogout());

      // Error should propagate from wallet disconnect
      expect(() => {
        act(() => {
          result.current.disconnect(mockWallet);
        });
      }).toThrow('Wallet disconnect failed');

      // Timeout should not be set if wallet disconnect throws
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // SIWE logout should not be called because disconnect threw an error
      expect(mockSiweAuthLogout).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    it('should work with real timer delay', async () => {
      jest.useRealTimers();

      const { result } = renderHook(() => useLogout());

      act(() => {
        result.current.disconnect(mockWallet);
      });

      expect(mockSiweAuthLogout).not.toHaveBeenCalled();

      await waitFor(
        () => {
          expect(mockSiweAuthLogout).toHaveBeenCalledTimes(1);
        },
        { timeout: 3000 }
      );

      expect(mockDisconnect).toHaveBeenCalledWith(mockWallet);
    });
  });
});
