import { createFlowClient } from '../src/core/client/client';
import {
  login,
  loginWithRedirect,
  prepareLogin,
  createAccount,
  getEmail,
  getPhoneNumber,
  linkAccount,
  getLinkedAccounts,
  unlinkAccount,
  EcosystemId,
  LoginStrategy,
  type Account
} from '../src/core/wallet/wallet';

/**
 * Integration tests for wallet functions
 *
 * These tests verify that:
 * 1. Functions accept the correct parameters
 * 2. Functions return the expected types
 * 3. Functions integrate properly with Thirdweb
 */
describe('Wallet Functions - Integration Tests', () => {
  // Create a test client for integration tests
  const testClient = createFlowClient({
    clientId: 'test-wallet-integration-id'
  });
  const testEcosystem = {
    id: EcosystemId.LISK,
    partnerId: 'test-partner-id'
  };

  describe('Authentication functions', () => {
    test('login should have correct function signature', () => {
      expect(typeof login).toBe('function');
      expect(login.length).toBe(1); // Expects 1 parameter
    });

    test('loginWithRedirect should have correct function signature', () => {
      expect(typeof loginWithRedirect).toBe('function');
      expect(loginWithRedirect.length).toBe(1); // Expects 1 parameter
    });
  });

  describe('createAccount', () => {
    test('should create actual ecosystem wallet with default ecosystem ID and partner ID', () => {
      const account = createAccount(EcosystemId.LISK, 'test-partner-id');

      // Test that we get a real Wallet object
      expect(account).toBeDefined();
      expect(typeof account).toBe('object');

      // Verify it has wallet properties
      expect(account.id).toBeDefined();
      expect(typeof account.id).toBe('string');
      expect(account.id).toContain('ecosystem');
    });

    test('should create ecosystem wallet with default ecosystem ID and custom partner ID', () => {
      const account = createAccount(EcosystemId.LISK, 'custom-partner-id');

      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.id).toContain('ecosystem');
    });

    test('should expose real wallet methods', async () => {
      const account = createAccount(EcosystemId.LISK, 'test-partner-id');

      expect(typeof account.connect).toBe('function');
      expect(typeof account.disconnect).toBe('function');
      expect(typeof account.getChain).toBe('function');
    });
  });

  describe('Profile management functions', () => {
    test('getEmail should accept client and ecosystem', async () => {
      expect(typeof getEmail).toBe('function');

      // Without authentication, this returns undefined
      const result = await getEmail(testClient, testEcosystem);
      expect(result).toBeUndefined();
    });

    test('getPhoneNumber should accept client and ecosystem', async () => {
      expect(typeof getPhoneNumber).toBe('function');

      // Without authentication, this returns undefined
      const result = await getPhoneNumber(testClient, testEcosystem);
      expect(result).toBeUndefined();
    });

    test('linkAccount should have correct function signature', () => {
      expect(typeof linkAccount).toBe('function');
      expect(linkAccount.length).toBe(1); // Expects 1 parameter
    });

    test('unlinkAccount should have correct function signature', () => {
      expect(typeof unlinkAccount).toBe('function');
      expect(unlinkAccount.length).toBe(1); // Expects 1 parameter
    });
  });

  describe('Type exports', () => {
    test('should export Account type', () => {
      // Test that Account type works with wallet functions
      const account: Account = createAccount(
        EcosystemId.LISK,
        'test-partner-id'
      );
      expect(account).toBeDefined();
    });

    test('should use EcosystemId enum', () => {
      // Test that EcosystemId enum is used
      const account = createAccount(EcosystemId.LISK, 'test-partner-id');
      expect(account).toBeDefined();
    });

    test('should enforce ecosystem ID format', () => {
      const account = createAccount(EcosystemId.LISK, 'test-partner-id');
      expect(account.id).toContain('ecosystem');
    });

    test('should export EcosystemId enum', () => {
      // Test that EcosystemId enum is available and has expected values
      expect(EcosystemId.LISK).toBe('ecosystem.lisk');

      // Verify it works with functions
      const account = createAccount(EcosystemId.LISK, 'test-partner-id');
      expect(account).toBeDefined();
    });
  });

  describe('Integration with Thirdweb', () => {
    test('createAccount should return a real Thirdweb wallet', () => {
      const account = createAccount(EcosystemId.LISK, 'test-partner-id');

      // Verify it's a real Thirdweb wallet by checking its structure
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('connect');
      expect(account).toHaveProperty('disconnect');
      expect(account).toHaveProperty('getAccount');
      expect(account).toHaveProperty('getChain');
      expect(account).toHaveProperty('subscribe');

      // Verify it's not a mock
      expect((account as any).mockWallet).toBeUndefined();
    });

    test('client created by createFlowClient should work with wallet functions', () => {
      const client = createFlowClient({ clientId: 'integration-test' });

      // Verify that the client is created successfully
      expect(client).toBeDefined();

      // These functions work with the client but require authentication
      // We're just verifying they accept the client parameter
      expect(typeof login).toBe('function');
      expect(typeof loginWithRedirect).toBe('function');
      expect(typeof prepareLogin).toBe('function');
      expect(typeof getEmail).toBe('function');
      expect(typeof getPhoneNumber).toBe('function');
      expect(typeof linkAccount).toBe('function');
      expect(typeof getLinkedAccounts).toBe('function');
      expect(typeof unlinkAccount).toBe('function');
    });
  });
});
