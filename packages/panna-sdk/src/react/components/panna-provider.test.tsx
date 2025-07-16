import { render, screen } from '@testing-library/react';
import React, { useContext } from 'react';
import { createPannaClient, type PannaClient } from '../../core';
import { PannaProvider, PannaClientContext } from './panna-provider';

// Mock the thirdweb module
jest.mock('thirdweb/react', () => ({
  ThirdwebProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="thirdweb-provider">{children}</div>
  )
}));

// Mock the createPannaClient function
jest.mock('../../core', () => ({
  createPannaClient: jest.fn()
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

    it('should wrap children with ThirdwebProvider', () => {
      render(
        <PannaProvider>
          <div data-testid="test-child">Test Child</div>
        </PannaProvider>
      );

      expect(screen.getByTestId('thirdweb-provider')).toBeInTheDocument();
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
