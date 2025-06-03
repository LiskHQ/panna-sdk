import * as thirdwebWallets from 'thirdweb/wallets';
import { type FlowClient } from '../src/core/client/client';
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
  LoginStrategy
} from '../src/core/wallet/wallet';

// Mock thirdweb/wallets module
jest.mock('thirdweb/wallets');

describe('Wallet Functions - Unit Tests', () => {
  const mockClient = {} as FlowClient;
  const testEcosystem = {
    id: EcosystemId.LISK,
    partnerId: 'test-partner-id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginStrategy enum', () => {
    it('should have EMAIL strategy with correct value', () => {
      expect(LoginStrategy.EMAIL).toBe('email');
    });

    it('should have PHONE strategy with correct value', () => {
      expect(LoginStrategy.PHONE).toBe('phone');
    });

    it('should only have EMAIL and PHONE strategies', () => {
      const strategies = Object.values(LoginStrategy);
      expect(strategies).toHaveLength(2);
      expect(strategies).toContain('email');
      expect(strategies).toContain('phone');
    });
  });

  describe('login', () => {
    it('should call authenticate with single-step auth params', async () => {
      const mockAuthResult = { success: true };
      (thirdwebWallets.authenticate as jest.Mock).mockResolvedValue(
        mockAuthResult
      );

      const params = {
        client: mockClient,
        strategy: 'google' as const,
        mode: 'popup' as const,
        ecosystem: testEcosystem
      };

      const result = await login(params);

      expect(thirdwebWallets.authenticate).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockAuthResult);
    });

    it('should call authenticate with multi-step auth params', async () => {
      const mockAuthResult = { success: true };
      (thirdwebWallets.authenticate as jest.Mock).mockResolvedValue(
        mockAuthResult
      );

      const params = {
        client: mockClient,
        strategy: 'email' as const,
        email: 'test@example.com',
        verificationCode: '123456',
        ecosystem: testEcosystem
      };

      const result = await login(params);

      expect(thirdwebWallets.authenticate).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('loginWithRedirect', () => {
    it('should call authenticateWithRedirect with correct parameters', async () => {
      const mockAuthResult = { success: true };
      (thirdwebWallets.authenticateWithRedirect as jest.Mock).mockResolvedValue(
        mockAuthResult
      );

      const params = {
        client: mockClient,
        strategy: 'google' as const,
        redirectUrl: 'https://example.com/callback',
        mode: 'redirect' as const,
        ecosystem: testEcosystem
      };

      const result = await loginWithRedirect(params);

      expect(thirdwebWallets.authenticateWithRedirect).toHaveBeenCalledWith(
        params
      );
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('prepareLogin', () => {
    it('should prepare authentication for email with required ecosystem', async () => {
      (thirdwebWallets.preAuthenticate as jest.Mock).mockResolvedValue(
        undefined
      );

      const params = {
        client: mockClient,
        strategy: LoginStrategy.EMAIL,
        email: 'test@example.com',
        ecosystem: testEcosystem
      };

      const result = await prepareLogin(params);

      expect(thirdwebWallets.preAuthenticate).toHaveBeenCalledWith(params);
      expect(result).toBeUndefined();
    });

    it('should prepare authentication for phone with required ecosystem', async () => {
      (thirdwebWallets.preAuthenticate as jest.Mock).mockResolvedValue(
        undefined
      );

      const params = {
        client: mockClient,
        strategy: LoginStrategy.PHONE,
        phoneNumber: '+1234567890',
        ecosystem: testEcosystem
      };

      const result = await prepareLogin(params);

      expect(thirdwebWallets.preAuthenticate).toHaveBeenCalledWith(params);
      expect(result).toBeUndefined();
    });
  });

  describe('createAccount', () => {
    it('should create ecosystem wallet with default ecosystem ID and required partner ID', () => {
      const mockEcosystemWallet = { type: 'ecosystem' };
      (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
        mockEcosystemWallet
      );

      const result = createAccount(EcosystemId.LISK, 'test-partner-id');

      expect(thirdwebWallets.ecosystemWallet).toHaveBeenCalledWith(
        EcosystemId.LISK,
        {
          partnerId: 'test-partner-id'
        }
      );
      expect(result).toEqual(mockEcosystemWallet);
    });
  });

  describe('getEmail', () => {
    it('should return email when available with required ecosystem', async () => {
      const mockEmail = 'test@example.com';
      (thirdwebWallets.getUserEmail as jest.Mock).mockResolvedValue(mockEmail);

      const result = await getEmail(mockClient, testEcosystem);

      expect(thirdwebWallets.getUserEmail).toHaveBeenCalledWith({
        client: mockClient,
        ecosystem: testEcosystem
      });
      expect(result).toBe(mockEmail);
    });

    it('should return undefined when email is not available', async () => {
      (thirdwebWallets.getUserEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await getEmail(mockClient, testEcosystem);

      expect(result).toBeUndefined();
    });
  });

  describe('getPhoneNumber', () => {
    it('should return phone number when available with required ecosystem', async () => {
      const mockPhone = '+1234567890';
      (thirdwebWallets.getUserPhoneNumber as jest.Mock).mockResolvedValue(
        mockPhone
      );

      const result = await getPhoneNumber(mockClient, testEcosystem);

      expect(thirdwebWallets.getUserPhoneNumber).toHaveBeenCalledWith({
        client: mockClient,
        ecosystem: testEcosystem
      });
      expect(result).toBe(mockPhone);
    });

    it('should return undefined when phone number is not available', async () => {
      (thirdwebWallets.getUserPhoneNumber as jest.Mock).mockResolvedValue(
        undefined
      );

      const result = await getPhoneNumber(mockClient, testEcosystem);

      expect(result).toBeUndefined();
    });
  });

  describe('linkAccount', () => {
    it('should link profile with correct parameters and required ecosystem', async () => {
      const mockLinkResult = [
        { type: 'email', details: { email: 'test@example.com' } },
        { type: 'google', details: {} }
      ];
      (thirdwebWallets.linkProfile as jest.Mock).mockResolvedValue(
        mockLinkResult
      );

      const params = {
        client: mockClient,
        strategy: 'google' as const,
        mode: 'popup' as const,
        ecosystem: testEcosystem
      };

      const result = await linkAccount(params);

      expect(thirdwebWallets.linkProfile).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockLinkResult);
    });
  });

  describe('getLinkedAccounts', () => {
    it('should return linked profiles with required ecosystem', async () => {
      const mockProfiles = [
        { type: 'email', details: { email: 'test@example.com' } },
        { type: 'google', details: { email: 'google@example.com' } }
      ];
      (thirdwebWallets.getProfiles as jest.Mock).mockResolvedValue(
        mockProfiles
      );

      const result = await getLinkedAccounts(mockClient, testEcosystem);

      expect(thirdwebWallets.getProfiles).toHaveBeenCalledWith({
        client: mockClient,
        ecosystem: testEcosystem
      });
      expect(result).toEqual(mockProfiles);
    });

    it('should work with different ecosystem configuration', async () => {
      const mockProfiles = [
        { type: 'email', details: { email: 'test@example.com' } }
      ];
      (thirdwebWallets.getProfiles as jest.Mock).mockResolvedValue(
        mockProfiles
      );

      const customEcosystem = {
        id: EcosystemId.LISK,
        partnerId: 'custom-partner-id'
      };

      const result = await getLinkedAccounts(mockClient, customEcosystem);

      expect(thirdwebWallets.getProfiles).toHaveBeenCalledWith({
        client: mockClient,
        ecosystem: customEcosystem
      });
      expect(result).toEqual(mockProfiles);
    });
  });

  describe('unlinkAccount', () => {
    it('should unlink profile with correct parameters and required ecosystem', async () => {
      const mockUnlinkResult = [
        { type: 'email', details: { email: 'test@example.com' } }
      ];
      const profileToUnlink = { type: 'google' as const, details: {} };

      (thirdwebWallets.unlinkProfile as jest.Mock).mockResolvedValue(
        mockUnlinkResult
      );

      const params = {
        client: mockClient,
        profileToUnlink,
        ecosystem: testEcosystem
      };

      const result = await unlinkAccount(params);

      expect(thirdwebWallets.unlinkProfile).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockUnlinkResult);
    });
  });
});
