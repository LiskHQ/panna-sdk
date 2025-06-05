<<<<<<<< HEAD:packages/flow-sdk/src/core/client/client.test.ts
import {
  createFlowClient,
  type CreateFlowClientOptions,
  type FlowClient
} from '..';
========
import { createFlowClient, type CreateFlowClientOptions } from '../../src/core';
>>>>>>>> b873966 (refactor(flow-sdk): restructure Jest configuration and remove obsolete tests for createFlowClient):packages/flow-sdk/__tests__/core/createFlowClient.test.ts

// Mock thirdweb module for unit tests
jest.mock('thirdweb', () => ({
  createThirdwebClient: jest.fn((options: CreateFlowClientOptions) => ({
    clientId: options.clientId,
    secretKey: options.secretKey,
    mockClient: true
  }))
}));

describe('createFlowClient - Unit Tests', () => {
  test('should create client with clientId', () => {
    const options: CreateFlowClientOptions = { clientId: 'test-client-id' };
    const client = createFlowClient(options) as FlowClient & {
      mockClient: boolean;
    };

    expect(client).toBeDefined();
    expect(client.clientId).toBe('test-client-id');
    expect(client.mockClient).toBe(true);
  });

  test('should create client with secretKey', () => {
    const options: CreateFlowClientOptions = { secretKey: 'test-secret-key' };
    const client = createFlowClient(options) as FlowClient & {
      mockClient: boolean;
    };

    expect(client).toBeDefined();
    expect(client.secretKey).toBe('test-secret-key');
    expect(client.mockClient).toBe(true);
  });

  test('should delegate validation to createThirdwebClient', () => {
    const { createThirdwebClient } = jest.requireMock('thirdweb');
    const options: CreateFlowClientOptions = { clientId: 'test-client-id' };

    createFlowClient(options);

    expect(createThirdwebClient).toHaveBeenCalledWith(options);
  });

  test('should pass options directly to createThirdwebClient', () => {
    const { createThirdwebClient } = jest.requireMock('thirdweb');
    const options: CreateFlowClientOptions = { clientId: 'test-client-id' };

    createFlowClient(options);

    expect(createThirdwebClient).toHaveBeenCalledWith(options);
  });
});
