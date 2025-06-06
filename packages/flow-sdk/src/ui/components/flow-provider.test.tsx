import { render, screen } from '@testing-library/react';
import React, { useContext } from 'react';
import { createFlowClient, type FlowClient } from '../../core';
import { FlowProvider, FlowClientContext } from './flow-provider';

// Mock the thirdweb module
jest.mock('thirdweb/react', () => ({
  ThirdwebProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="thirdweb-provider">{children}</div>
  )
}));

// Mock the createFlowClient function
jest.mock('../../core', () => ({
  createFlowClient: jest.fn()
}));

const mockCreateFlowClient = createFlowClient as jest.MockedFunction<
  typeof createFlowClient
>;

// Test component to consume the context
const TestConsumer: React.FC = () => {
  const client = useContext(FlowClientContext);
  return (
    <div>
      <span data-testid="client-status">
        {client ? 'client-available' : 'client-null'}
      </span>
      <span data-testid="client-value">{JSON.stringify(client)}</span>
    </div>
  );
};

describe('FlowProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children without crashing', () => {
      render(
        <FlowProvider>
          <div data-testid="test-child">Test Child</div>
        </FlowProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should wrap children with ThirdwebProvider', () => {
      render(
        <FlowProvider>
          <div data-testid="test-child">Test Child</div>
        </FlowProvider>
      );

      expect(screen.getByTestId('thirdweb-provider')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  describe('client creation and context', () => {
    it('should provide null client when no clientId is provided', () => {
      render(
        <FlowProvider>
          <TestConsumer />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
      expect(mockCreateFlowClient).not.toHaveBeenCalled();
    });

    it('should provide null client when clientId is undefined', () => {
      render(
        <FlowProvider clientId={undefined}>
          <TestConsumer />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
      expect(mockCreateFlowClient).not.toHaveBeenCalled();
    });

    it('should provide null client when clientId is empty string', () => {
      render(
        <FlowProvider clientId="">
          <TestConsumer />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
      expect(mockCreateFlowClient).not.toHaveBeenCalled();
    });

    it('should create and provide client when valid clientId is provided', () => {
      const mockClient = { id: 'test-client' } as unknown as FlowClient;
      mockCreateFlowClient.mockReturnValue(mockClient);

      render(
        <FlowProvider clientId="test-client-id">
          <TestConsumer />
        </FlowProvider>
      );

      expect(mockCreateFlowClient).toHaveBeenCalledWith({
        clientId: 'test-client-id'
      });
      expect(mockCreateFlowClient).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
    });
  });

  describe('client memoization', () => {
    it('should not recreate client when clientId remains the same', () => {
      const mockClient = { id: 'test-client' } as unknown as FlowClient;
      mockCreateFlowClient.mockReturnValue(mockClient);

      const { rerender } = render(
        <FlowProvider clientId="test-client-id">
          <TestConsumer />
        </FlowProvider>
      );

      expect(mockCreateFlowClient).toHaveBeenCalledTimes(1);

      // Re-render with same clientId
      rerender(
        <FlowProvider clientId="test-client-id">
          <TestConsumer />
        </FlowProvider>
      );

      // Should not call createFlowClient again
      expect(mockCreateFlowClient).toHaveBeenCalledTimes(1);
    });

    it('should recreate client when clientId changes', () => {
      const mockClient1 = { id: 'test-client-1' } as unknown as FlowClient;
      const mockClient2 = { id: 'test-client-2' } as unknown as FlowClient;
      mockCreateFlowClient
        .mockReturnValueOnce(mockClient1)
        .mockReturnValueOnce(mockClient2);

      const { rerender } = render(
        <FlowProvider clientId="test-client-id-1">
          <TestConsumer />
        </FlowProvider>
      );

      expect(mockCreateFlowClient).toHaveBeenCalledWith({
        clientId: 'test-client-id-1'
      });
      expect(mockCreateFlowClient).toHaveBeenCalledTimes(1);

      // Re-render with different clientId
      rerender(
        <FlowProvider clientId="test-client-id-2">
          <TestConsumer />
        </FlowProvider>
      );

      expect(mockCreateFlowClient).toHaveBeenCalledWith({
        clientId: 'test-client-id-2'
      });
      expect(mockCreateFlowClient).toHaveBeenCalledTimes(2);
    });

    it('should change from client to null when clientId is removed', () => {
      const mockClient = { id: 'test-client' } as unknown as FlowClient;
      mockCreateFlowClient.mockReturnValue(mockClient);

      const { rerender } = render(
        <FlowProvider clientId="test-client-id">
          <TestConsumer />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );

      // Re-render without clientId
      rerender(
        <FlowProvider>
          <TestConsumer />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );
    });

    it('should change from null to client when clientId is added', () => {
      const mockClient = { id: 'test-client' } as unknown as FlowClient;
      mockCreateFlowClient.mockReturnValue(mockClient);

      const { rerender } = render(
        <FlowProvider>
          <TestConsumer />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-null'
      );

      // Re-render with clientId
      rerender(
        <FlowProvider clientId="test-client-id">
          <TestConsumer />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(mockCreateFlowClient).toHaveBeenCalledWith({
        clientId: 'test-client-id'
      });
    });
  });

  describe('integration', () => {
    it('should work with multiple nested consumers', () => {
      const mockClient = { id: 'test-client' } as unknown as FlowClient;
      mockCreateFlowClient.mockReturnValue(mockClient);

      const NestedConsumer: React.FC = () => {
        const client = useContext(FlowClientContext);
        return (
          <div data-testid="nested-consumer">
            {client ? 'nested-has-client' : 'nested-no-client'}
          </div>
        );
      };

      render(
        <FlowProvider clientId="test-client-id">
          <TestConsumer />
          <div>
            <NestedConsumer />
          </div>
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.getByTestId('nested-consumer')).toHaveTextContent(
        'nested-has-client'
      );
    });

    it('should maintain context across re-renders with dynamic children', () => {
      const mockClient = { id: 'test-client' } as unknown as FlowClient;
      mockCreateFlowClient.mockReturnValue(mockClient);

      const DynamicChildren: React.FC<{ showExtra: boolean }> = ({
        showExtra
      }) => (
        <>
          <TestConsumer />
          {showExtra && <div data-testid="extra-content">Extra Content</div>}
        </>
      );

      const { rerender } = render(
        <FlowProvider clientId="test-client-id">
          <DynamicChildren showExtra={false} />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.queryByTestId('extra-content')).not.toBeInTheDocument();

      rerender(
        <FlowProvider clientId="test-client-id">
          <DynamicChildren showExtra={true} />
        </FlowProvider>
      );

      expect(screen.getByTestId('client-status')).toHaveTextContent(
        'client-available'
      );
      expect(screen.getByTestId('extra-content')).toBeInTheDocument();
    });
  });
});
