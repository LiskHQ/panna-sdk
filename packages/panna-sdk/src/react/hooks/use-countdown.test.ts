import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useCountdown } from './use-countdown';

jest.useFakeTimers();

describe('useCountdown', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should initialize with the start value', () => {
    const { result } = renderHook(() => useCountdown(5));
    expect(result.current[0]).toBe(5);
  });

  it('should decrement the value every interval', () => {
    const { result } = renderHook(() => useCountdown(3, 1000));
    expect(result.current[0]).toBe(3);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current[0]).toBe(2);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current[0]).toBe(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current[0]).toBe(0);
  });

  it('should not decrement below zero', () => {
    const { result } = renderHook(() => useCountdown(1, 1000));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current[0]).toBe(0);
  });

  it('should reset to start value when reset is called', () => {
    const { result } = renderHook(() => useCountdown(2, 1000));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](); // reset
    });
    expect(result.current[0]).toBe(2);
  });

  it('should reset timer when start value changes', () => {
    let start = 5;
    const { result, rerender } = renderHook(() => useCountdown(start, 1000));
    expect(result.current[0]).toBe(5);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current[0]).toBe(3);

    start = 10;
    rerender();
    expect(result.current[0]).toBe(10);
  });

  it('should use custom intervalMs', () => {
    const { result } = renderHook(() => useCountdown(2, 500));
    expect(result.current[0]).toBe(2);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current[0]).toBe(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current[0]).toBe(0);
  });
});
