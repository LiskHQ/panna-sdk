import {
  createPannaClient,
  type CreatePannaClientOptions,
  type PannaClient
} from '..';

// Mock thirdweb module for unit tests
jest.mock('thirdweb', () => ({
  createThirdwebClient: jest.fn((options: CreatePannaClientOptions) => ({
    clientId: options.clientId,
    secretKey: options.secretKey,
    mockClient: true
  }))
}));

describe('createPannaClient - Unit Tests', () => {
  test('should create client with clientId', () => {
    const options: CreatePannaClientOptions = { clientId: 'test-client-id' };
    const client = createPannaClient(options) as PannaClient & {
      mockClient: boolean;
    };

    expect(client).toBeDefined();
    expect(client.clientId).toBe('test-client-id');
    expect(client.mockClient).toBe(true);
  });

  test('should create client with secretKey', () => {
    const options: CreatePannaClientOptions = { secretKey: 'test-secret-key' };
    const client = createPannaClient(options) as PannaClient & {
      mockClient: boolean;
    };

    expect(client).toBeDefined();
    expect(client.secretKey).toBe('test-secret-key');
    expect(client.mockClient).toBe(true);
  });

  test('should delegate validation to createThirdwebClient', () => {
    const { createThirdwebClient } = jest.requireMock('thirdweb');
    const options: CreatePannaClientOptions = { clientId: 'test-client-id' };

    createPannaClient(options);

    expect(createThirdwebClient).toHaveBeenCalledWith(options);
  });

  test('should pass options directly to createThirdwebClient', () => {
    const { createThirdwebClient } = jest.requireMock('thirdweb');
    const options: CreatePannaClientOptions = { clientId: 'test-client-id' };

    createPannaClient(options);

    expect(createThirdwebClient).toHaveBeenCalledWith(options);
  });
});
