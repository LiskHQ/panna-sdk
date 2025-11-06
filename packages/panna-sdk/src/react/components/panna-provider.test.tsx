import { render, screen } from '@testing-library/react';
import React, { useContext } from 'react';
import { createPannaClient, type PannaClient } from '../../core';
import { PannaClientContext, PannaProvider } from './panna-provider';

// Mock panna-api module before any imports
jest.mock('../utils/panna-api', () => ({
  getPannaApiUrl: jest.fn((chainId: string, isDevMode: boolean) => {
    if (isDevMode) return 'http://localhost:8080/v1';
    if (chainId === '1135') return 'https://panna-app.lisk.com/v1';
    if (chainId === '4202') return 'https://stg-panna-app.lisk.com/v1';
    // Return a default URL for test chain IDs
    return 'https://panna-app.lisk.com/v1';
  })
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  )
}));

// Mock the thirdweb module
jest.mock('thirdweb/react', () => ({
  ThirdwebProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="thirdweb-provider">{children}</div>
  ),
  AutoConnect: () => <div data-testid="auto-connect" />,
  useActiveAccount: jest.fn(() => null),
  useActiveWallet: jest.fn(() => null),
  useProfiles: jest.fn(() => ({ data: [] }))
}));

// Mock the AccountEventProvider
jest.mock('./account-event-provider', () => ({
  AccountEventProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="account-event-provider">{children}</div>
  )
}));

// Mock the createPannaClient function
jest.mock('../../core', () => ({
  createPannaClient: jest.fn(),
  lisk: { id: 1135, name: 'Lisk' }
}));

const mockCreatePannaClient = createPannaClient as jest.MockedFunction<
  typeof createPannaClient
>;

// Test component to consume the context
const TestConsumer: React.FC = () => {
  const context = useContext(PannaClientContext);
  return (
    <div>
      <span data-testid="client-status">
        {context?.client ? 'client-available' : 'client-null'}
      </span>
      <span data-testid="partner-id">
        {context?.partnerId || 'no-partner-id'}
      </span>
      <span data-testid="client-value">{JSON.stringify(context)}</span>
    </div>
  );
};

describe('PannaProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children without crashing', () => {
      render(
        <PannaProvider>
          <div data-testid="test-child">Test Child</div>
        </PannaProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should wrap children with all provider layers', () => {
      render(
        <PannaProvider>
          <div data-testid="test-child">Test Child</div>
        </PannaProvider>
      );

      expect(screen.getByTestId('query-client-provider')).toBeInTheDocument();
      expect(screen.getByTestId('thirdweb-provider')).toBeInTheDocument();
      expect(screen.getByTestId('account-event-provider')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  describe('client creation and context', () => {
    it('should provide null client when no clientId is provided', () => {
      render(
        <PannaProvider>
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
      expect(screen.getByTestId('partner-id')).toHaveTextContent(
        'no-partner-id'
      );
      expect(mockCreatePannaClient).not.toHaveBeenCalled();
    });

    it('should provide null client when clientId is undefined', () => {
      render(
        <PannaProvider clientId={undefined}>
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
      expect(screen.getByTestId('partner-id')).toHaveTextContent(
        'no-partner-id'
      );
      expect(mockCreatePannaClient).not.toHaveBeenCalled();
    });

    it('should provide null client when clientId is empty string', () => {
      render(
        <PannaProvider clientId="">
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
      expect(screen.getByTestId('partner-id')).toHaveTextContent(
        'no-partner-id'
      );
      expect(mockCreatePannaClient).not.toHaveBeenCalled();
    });

    it('should create and provide client when valid clientId is provided', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      render(
        <PannaProvider clientId="test-client-id">
          <TestConsumer />
        </PannaProvider>
      );

      expect(mockCreatePannaClient).toHaveBeenCalledWith({
        clientId: 'test-client-id'
      });
      expect(mockCreatePannaClient).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.getByTestId('partner-id')).toHaveTextContent(
        'no-partner-id'
      );
    });

    it('should provide partnerId when specified', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      render(
        <PannaProvider clientId="test-client-id" partnerId="test-partner">
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.getByTestId('partner-id')).toHaveTextContent(
        'test-partner'
      );
    });

    it('should provide default chainId when none is specified', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      render(
        <PannaProvider clientId="test-client-id">
          <TestConsumer />
        </PannaProvider>
      );

      // The default chainId should be lisk.id (mocked as 1135)
      const contextValue = JSON.parse(
        screen.getByTestId('client-value').textContent || '{}'
      );
      expect(contextValue.chainId).toBe('1135');
    });

    it('should provide custom chainId when specified', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      render(
        <PannaProvider clientId="test-client-id" chainId="9999">
          <TestConsumer />
        </PannaProvider>
      );

      const contextValue = JSON.parse(
        screen.getByTestId('client-value').textContent || '{}'
      );
      expect(contextValue.chainId).toBe('9999');
    });

    it('should update chainId when prop changes', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      const { rerender } = render(
        <PannaProvider clientId="test-client-id" chainId="1234">
          <TestConsumer />
        </PannaProvider>
      );

      let contextValue = JSON.parse(
        screen.getByTestId('client-value').textContent || '{}'
      );
      expect(contextValue.chainId).toBe('1234');

      rerender(
        <PannaProvider clientId="test-client-id" chainId="5678">
          <TestConsumer />
        </PannaProvider>
      );

      contextValue = JSON.parse(
        screen.getByTestId('client-value').textContent || '{}'
      );
      expect(contextValue.chainId).toBe('5678');
    });

    it('should fallback to default chainId if chainId is undefined', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      render(
        <PannaProvider clientId="test-client-id" chainId={undefined}>
          <TestConsumer />
        </PannaProvider>
      );

      const contextValue = JSON.parse(
        screen.getByTestId('client-value').textContent || '{}'
      );
      expect(contextValue.chainId).toBe('1135');
    });

    it('should fallback to default chainId if chainId is null', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      render(
        // @ts-expect-error: testing null chainId
        <PannaProvider clientId="test-client-id" chainId={null}>
          <TestConsumer />
        </PannaProvider>
      );

      const contextValue = JSON.parse(
        screen.getByTestId('client-value').textContent || '{}'
      );
      expect(contextValue.chainId).toBe('1135');
    });
  });

  describe('client memoization', () => {
    it('should not recreate client when clientId remains the same', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      const { rerender } = render(
        <PannaProvider clientId="test-client-id">
          <TestConsumer />
        </PannaProvider>
      );

      expect(mockCreatePannaClient).toHaveBeenCalledTimes(1);

      // Re-render with same clientId
      rerender(
        <PannaProvider clientId="test-client-id">
          <TestConsumer />
        </PannaProvider>
      );

      // Should not call createPannaClient again
      expect(mockCreatePannaClient).toHaveBeenCalledTimes(1);
    });

    it('should recreate client when clientId changes', () => {
      const mockClient1 = { id: 'test-client-1' } as unknown as PannaClient;
      const mockClient2 = { id: 'test-client-2' } as unknown as PannaClient;
      mockCreatePannaClient
        .mockReturnValueOnce(mockClient1)
        .mockReturnValueOnce(mockClient2);

      const { rerender } = render(
        <PannaProvider clientId="test-client-id-1">
          <TestConsumer />
        </PannaProvider>
      );

      expect(mockCreatePannaClient).toHaveBeenCalledWith({
        clientId: 'test-client-id-1'
      });
      expect(mockCreatePannaClient).toHaveBeenCalledTimes(1);

      // Re-render with different clientId
      rerender(
        <PannaProvider clientId="test-client-id-2">
          <TestConsumer />
        </PannaProvider>
      );

      expect(mockCreatePannaClient).toHaveBeenCalledWith({
        clientId: 'test-client-id-2'
      });
      expect(mockCreatePannaClient).toHaveBeenCalledTimes(2);
    });

    it('should change from client to null when clientId is removed', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      const { rerender } = render(
        <PannaProvider clientId="test-client-id">
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );

      // Re-render without clientId
      rerender(
        <PannaProvider>
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
    });

    it('should change from null to client when clientId is added', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      const { rerender } = render(
        <PannaProvider>
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );

      // Re-render with clientId
      rerender(
        <PannaProvider clientId="test-client-id">
          <TestConsumer />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(mockCreatePannaClient).toHaveBeenCalledWith({
        clientId: 'test-client-id'
      });
    });
  });

  describe('error handling', () => {
    // Suppress console.error for error boundary tests
    const originalError = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });

    afterAll(() => {
      console.error = originalError;
    });

    it('should catch errors during provider setup', () => {
      // Mock createPannaClient to throw an error
      mockCreatePannaClient.mockImplementation(() => {
        throw new Error('Client creation failed');
      });

      render(
        <PannaProvider clientId="test-client-id">
          <div data-testid="test-child">Test Child</div>
        </PannaProvider>
      );

      // Should render default error UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });

    it('should catch errors with custom fallback', () => {
      mockCreatePannaClient.mockImplementation(() => {
        throw new Error('Setup error');
      });

      const customFallback = <div>Custom error message</div>;

      render(
        <PannaProvider clientId="test-client-id" errorFallback={customFallback}>
          <div data-testid="test-child">Test Child</div>
        </PannaProvider>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      mockCreatePannaClient.mockImplementation(() => {
        throw new Error('Test error');
      });

      render(
        <PannaProvider clientId="test-client-id" onError={onError}>
          <div data-testid="test-child">Test Child</div>
        </PannaProvider>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      const [error] = onError.mock.calls[0];
      expect(error.message).toContain('Test error');
    });

    it('should render normally when no error occurs', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      render(
        <PannaProvider
          clientId="test-client-id"
          errorFallback={<div>Error occurred</div>}
        >
          <div data-testid="test-child">Test Child</div>
        </PannaProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('should work with multiple nested consumers', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      const NestedConsumer: React.FC = () => {
        const context = useContext(PannaClientContext);
        return (
          <div data-testid="nested-consumer">
            {context?.client ? 'nested-has-client' : 'nested-no-client'}
          </div>
        );
      };

      render(
        <PannaProvider clientId="test-client-id">
          <TestConsumer />
          <div>
            <NestedConsumer />
          </div>
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.getByTestId('nested-consumer')).toHaveTextContent(
        'nested-has-client'
      );
    });

    it('should maintain context across re-renders with dynamic children', () => {
      const mockClient = { id: 'test-client' } as unknown as PannaClient;
      mockCreatePannaClient.mockReturnValue(mockClient);

      const DynamicChildren: React.FC<{ showExtra: boolean }> = ({
        showExtra
      }) => (
        <>
          <TestConsumer />
          {showExtra && <div data-testid="extra-content">Extra Content</div>}
        </>
      );

      const { rerender } = render(
        <PannaProvider clientId="test-client-id">
          <DynamicChildren showExtra={false} />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.queryByTestId('extra-content')).not.toBeInTheDocument();

      rerender(
        <PannaProvider clientId="test-client-id">
          <DynamicChildren showExtra={true} />
        </PannaProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.getByTestId('extra-content')).toBeInTheDocument();
    });
  });
});
