import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useDialog } from './use-dialog';

describe('useDialog', () => {
  it('should initialize with isOpen as false', () => {
    const { result } = renderHook(() => useDialog());
    expect(result.current.isOpen).toBe(false);
  });

  it('should open the dialog when onOpen is called', () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('should not set isOpen to true if already open', () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.onOpen();
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('should close the dialog when onClose is called', () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.onOpen();
    });
    act(() => {
      result.current.onClose();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should keep isOpen as false when onClose is called while already closed', () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.onClose();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should allow direct setting of isOpen via setIsOpen', () => {
    const { result } = renderHook(() => useDialog());
    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsOpen(false);
    });
    expect(result.current.isOpen).toBe(false);
  });
});
