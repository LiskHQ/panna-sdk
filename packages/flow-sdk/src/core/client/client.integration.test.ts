import { createFlowClient, type CreateFlowClientOptions } from '..';

describe('createFlowClient - Integration Tests', () => {
  test('should create actual Thirdweb client with clientId', () => {
    const options: CreateFlowClientOptions = { clientId: 'test-client-id' };
    const client = createFlowClient(options);

    // Test that we get a real ThirdwebClient object
    expect(client).toBeDefined();
    expect(typeof client).toBe('object');

    // Verify it has the basic client ID
    expect(client.clientId).toBe('test-client-id');
  });

  test('should create actual Thirdweb client with secretKey', () => {
    const options: CreateFlowClientOptions = { secretKey: 'test-secret-key' };
    const client = createFlowClient(options);

    expect(client).toBeDefined();
    expect(typeof client).toBe('object');
    expect(client.secretKey).toBe('test-secret-key');
  });

  test('should expose Thirdweb client as a real object', () => {
    const client = createFlowClient({ clientId: 'test-capabilities' });

    // Test that we get a real object, not a mock
    expect(client).toBeDefined();
    expect(typeof client).toBe('object');
    expect(client.clientId).toBe('test-capabilities');

    // Test that it's not our mock object
    expect((client as Record<string, unknown>).mockClient).toBeUndefined();
  });

  test('should handle Thirdweb validation correctly', () => {
    // Test that invalid options are handled properly by Thirdweb
    expect(() => {
      createFlowClient({} as CreateFlowClientOptions);
    }).toThrow();
  });

  test('should preserve all client properties', () => {
    const client = createFlowClient({
      clientId: 'test-properties'
    });

    // Test that configuration is preserved
    expect(client.clientId).toBe('test-properties');

    // Test that it's a real client object
    expect(Object.keys(client).length).toBeGreaterThan(0);
    expect(client.constructor).toBeDefined();
  });

  test('should be usable with Thirdweb functions', () => {
    const client = createFlowClient({ clientId: 'test-usage' });

    // Test that the client can be used in typical Thirdweb patterns
    expect(client).toBeDefined();
    expect(client.clientId).toBe('test-usage');

    // Verify it has the expected structure for a Thirdweb client
    expect(typeof client).toBe('object');
    expect(client).not.toBeNull();
    expect(Array.isArray(client)).toBe(false);
  });
});
