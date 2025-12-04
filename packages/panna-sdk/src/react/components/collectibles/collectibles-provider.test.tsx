import { act, render, renderHook, screen } from '@testing-library/react';
import { ImageType } from 'src/core';
import {
  CollectiblesProvider,
  useCollectiblesInfo
} from './collectibles-provider';

describe('CollectiblesProvider', () => {
  it('should render children', () => {
    render(
      <CollectiblesProvider>
        <div data-testid="child">Test Child</div>
      </CollectiblesProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeVisible();
  });

  it('should provide default context values', () => {
    const { result } = renderHook(() => useCollectiblesInfo(), {
      wrapper: CollectiblesProvider
    });

    expect(result.current.activeCollectible).toBeUndefined();
    expect(result.current.activeToken).toBeUndefined();
    expect(result.current.setActiveCollectible).toBeDefined();
    expect(result.current.setActiveToken).toBeDefined();
  });

  it('should update activeCollectible when setActiveCollectible is called', () => {
    const { result } = renderHook(() => useCollectiblesInfo(), {
      wrapper: CollectiblesProvider
    });

    const mockCollectible = {
      id: '1',
      imageType: ImageType.URL,
      image: 'test.png',
      name: 'Test Collectible',
      value: '1'
    };

    act(() => {
      result.current.setActiveCollectible(mockCollectible);
    });

    expect(result.current.activeCollectible).toEqual(mockCollectible);
  });

  it('should update activeToken when setActiveToken is called', () => {
    const { result } = renderHook(() => useCollectiblesInfo(), {
      wrapper: CollectiblesProvider
    });

    const mockToken = {
      name: 'Test Token',
      symbol: 'TT',
      type: 'erc-721',
      address: '0x123',
      icon: null
    };

    act(() => {
      result.current.setActiveToken(mockToken);
    });

    expect(result.current.activeToken).toEqual(mockToken);
  });

  it('should clear activeCollectible when set to undefined', () => {
    const { result } = renderHook(() => useCollectiblesInfo(), {
      wrapper: CollectiblesProvider
    });

    const mockCollectible = {
      id: '1',
      imageType: ImageType.URL,
      image: 'test.png',
      name: 'Test Collectible',
      value: '1'
    };

    act(() => {
      result.current.setActiveCollectible(mockCollectible);
    });

    expect(result.current.activeCollectible).toEqual(mockCollectible);

    act(() => {
      result.current.setActiveCollectible(undefined);
    });

    expect(result.current.activeCollectible).toBeUndefined();
  });

  it('should throw error when useCollectiblesInfo is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useCollectiblesInfo());
    }).toThrow(
      'useCollectiblesInfo must be used within a CollectiblesProvider'
    );

    console.error = originalError;
  });

  it('should maintain independent state for multiple updates', () => {
    const { result } = renderHook(() => useCollectiblesInfo(), {
      wrapper: CollectiblesProvider
    });

    const mockCollectible1 = {
      id: '1',
      imageType: ImageType.URL,
      image: 'test1.png',
      name: 'Test Collectible 1',
      value: '1'
    };

    const mockCollectible2 = {
      id: '2',
      imageType: ImageType.SVG,
      image: 'test2.svg',
      name: 'Test Collectible 2',
      value: '2'
    };

    const mockToken1 = {
      name: 'Token 1',
      symbol: 'T1',
      type: 'erc-721',
      address: '0x111',
      icon: null
    };

    const mockToken2 = {
      name: 'Token 2',
      symbol: 'T2',
      type: 'erc-1155',
      address: '0x222',
      icon: 'icon.png'
    };

    act(() => {
      result.current.setActiveCollectible(mockCollectible1);
      result.current.setActiveToken(mockToken1);
    });

    expect(result.current.activeCollectible).toEqual(mockCollectible1);
    expect(result.current.activeToken).toEqual(mockToken1);

    act(() => {
      result.current.setActiveCollectible(mockCollectible2);
      result.current.setActiveToken(mockToken2);
    });

    expect(result.current.activeCollectible).toEqual(mockCollectible2);
    expect(result.current.activeToken).toEqual(mockToken2);
  });
});
