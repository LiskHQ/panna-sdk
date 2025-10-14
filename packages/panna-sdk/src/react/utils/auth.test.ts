import { Wallet } from 'thirdweb/wallets';
import {
  generateSiwePayload,
  siweLogin,
  getValidSiweAuthToken,
  isSiweTokenExpired
} from '../../core/auth';
import {
  buildSiweMessage,
  handleSiweAuth,
  getOrRefreshSiweToken
} from './auth';

// Mock the core auth functions
jest.mock('../../core/auth', () => ({
  generateSiwePayload: jest.fn(),
  siweLogin: jest.fn(),
  getValidSiweAuthToken: jest.fn(),
  isSiweTokenExpired: jest.fn()
}));

const mockGenerateSiwePayload = generateSiwePayload as jest.MockedFunction<
  typeof generateSiwePayload
>;
const mockSiweLogin = siweLogin as jest.MockedFunction<typeof siweLogin>;
const mockGetValidSiweAuthToken = getValidSiweAuthToken as jest.MockedFunction<
  typeof getValidSiweAuthToken
>;
const mockIsSiweTokenExpired = isSiweTokenExpired as jest.MockedFunction<
  typeof isSiweTokenExpired
>;

describe('Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('buildSiweMessage', () => {
    it('should format SIWE message correctly', () => {
      const payload = {
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      };

      const result = buildSiweMessage(payload);

      expect(result).toBe(
        `panna-app.lisk.com wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

URI: https://panna-app.lisk.com
Version: 1
Chain ID: 4202
Nonce: 0xb7b1a40ac418c5bf
Issued At: 2024-01-01T00:00:00.000Z`
      );
    });

    it('should handle different domains and addresses', () => {
      const payload = {
        domain: 'example.com',
        address: '0xabcdef',
        uri: 'https://example.com',
        version: '2',
        chainId: 1,
        nonce: '0x123',
        issuedAt: '2024-01-01T12:00:00.000Z'
      };

      const result = buildSiweMessage(payload);

      expect(result).toContain('example.com wants you to sign in');
      expect(result).toContain('0xabcdef');
      expect(result).toContain('Chain ID: 1');
      expect(result).toContain('Version: 2');
    });

    it('should include optional fields when present', () => {
      const payload = {
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z',
        statement: 'I accept the Terms of Service',
        expirationTime: '2024-01-02T00:00:00.000Z',
        notBefore: '2024-01-01T00:00:00.000Z',
        requestId: 'req-123',
        resources: [
          'https://example.com/resource1',
          'https://example.com/resource2'
        ]
      };

      const result = buildSiweMessage(payload);

      expect(result).toContain('I accept the Terms of Service');
      expect(result).toContain('Expiration Time: 2024-01-02T00:00:00.000Z');
      expect(result).toContain('Not Before: 2024-01-01T00:00:00.000Z');
      expect(result).toContain('Request ID: req-123');
      expect(result).toContain('Resources:');
      expect(result).toContain('- https://example.com/resource1');
      expect(result).toContain('- https://example.com/resource2');
    });
  });

  describe('handleSiweAuth', () => {
    const mockAccount = {
      address: '0x1234567890123456789012345678901234567890',
      signMessage: jest.fn()
    };

    const mockWallet = {
      getAccount: jest.fn().mockReturnValue(mockAccount),
      getConfig: jest.fn().mockReturnValue({
        smartAccount: { chain: { id: 4202 } }
      })
    } as unknown as Wallet;

    it('should successfully authenticate with valid wallet and account', async () => {
      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(true);

      const result = await handleSiweAuth(mockWallet);

      expect(result).toBe(true);
      expect(mockGenerateSiwePayload).toHaveBeenCalledWith({
        address: mockAccount.address
      });
      expect(mockAccount.signMessage).toHaveBeenCalled();
      expect(mockSiweLogin).toHaveBeenCalledWith({
        payload: expect.any(Object),
        signature: '0xsignature',
        account: mockAccount,
        isSafeWallet: true
      });
    });

    it('should pass chainId to signMessage when provided', async () => {
      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(true);

      await handleSiweAuth(mockWallet, { chainId: 4202 });

      expect(mockAccount.signMessage).toHaveBeenCalledWith({
        message: expect.any(String),
        chainId: 4202
      });
    });

    it('should return false when no account is found', async () => {
      const walletNoAccount = {
        getAccount: jest.fn().mockReturnValue(null),
        getConfig: jest.fn()
      } as unknown as Wallet;

      const result = await handleSiweAuth(walletNoAccount);

      expect(result).toBe(false);
      expect(mockGenerateSiwePayload).not.toHaveBeenCalled();
    });

    it('should return false when SIWE login fails', async () => {
      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(false);

      const result = await handleSiweAuth(mockWallet);

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('SIWE authentication failed');
    });

    it('should handle signature errors gracefully', async () => {
      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockRejectedValue(new Error('User rejected'));

      const result = await handleSiweAuth(mockWallet);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'SIWE authentication error:',
        expect.any(Error)
      );
    });

    it('should handle 401 errors without treating as fatal', async () => {
      mockGenerateSiwePayload.mockRejectedValue(new Error('401 Unauthorized'));

      const result = await handleSiweAuth(mockWallet);

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        'Wallet not yet authenticated with thirdweb service - SIWE authentication skipped'
      );
    });

    it('should detect smart accounts correctly', async () => {
      const walletWithSmartAccount = {
        getAccount: jest.fn().mockReturnValue(mockAccount),
        getConfig: jest
          .fn()
          .mockReturnValue({ smartAccount: { chain: { id: 4202 } } })
      } as unknown as Wallet;

      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(true);

      await handleSiweAuth(walletWithSmartAccount);

      expect(mockSiweLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          isSafeWallet: true
        })
      );
    });

    it('should detect EOA accounts correctly', async () => {
      const walletWithoutSmartAccount = {
        getAccount: jest.fn().mockReturnValue(mockAccount),
        getConfig: jest.fn().mockReturnValue({})
      } as unknown as Wallet;

      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(true);

      await handleSiweAuth(walletWithoutSmartAccount);

      expect(mockSiweLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          isSafeWallet: false
        })
      );
    });
  });

  describe('getOrRefreshSiweToken', () => {
    const mockAccount = {
      address: '0x1234567890123456789012345678901234567890',
      signMessage: jest.fn()
    };

    const mockWallet = {
      getAccount: jest.fn().mockReturnValue(mockAccount),
      getConfig: jest.fn().mockReturnValue({})
    } as unknown as Wallet;

    it('should return valid token immediately if available', async () => {
      mockGetValidSiweAuthToken.mockResolvedValue('valid-token-123');

      const result = await getOrRefreshSiweToken(mockWallet);

      expect(result).toBe('valid-token-123');
      expect(mockGenerateSiwePayload).not.toHaveBeenCalled();
    });

    it('should attempt re-authentication when no valid token and wallet provided', async () => {
      mockGetValidSiweAuthToken
        .mockResolvedValueOnce(null) // First call - no valid token
        .mockResolvedValueOnce('new-token-456'); // After re-auth

      mockIsSiweTokenExpired.mockReturnValue(true);

      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(true);

      const result = await getOrRefreshSiweToken(mockWallet, { chainId: 4202 });

      expect(result).toBe('new-token-456');
      expect(console.log).toHaveBeenCalledWith(
        'SIWE token expired, attempting re-authentication...'
      );
    });

    it('should return null when re-authentication fails', async () => {
      mockGetValidSiweAuthToken.mockResolvedValue(null);
      mockIsSiweTokenExpired.mockReturnValue(true);

      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(false);

      const result = await getOrRefreshSiweToken(mockWallet);

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        'SIWE re-authentication failed'
      );
    });

    it('should return null when no wallet provided and no valid token', async () => {
      mockGetValidSiweAuthToken.mockResolvedValue(null);

      const result = await getOrRefreshSiweToken();

      expect(result).toBeNull();
      expect(mockGenerateSiwePayload).not.toHaveBeenCalled();
    });

    it('should not log expired message when token is missing (not expired)', async () => {
      mockGetValidSiweAuthToken
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('new-token');

      mockIsSiweTokenExpired.mockReturnValue(false);

      mockGenerateSiwePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweLogin.mockResolvedValue(true);

      await getOrRefreshSiweToken(mockWallet);

      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('expired')
      );
    });

    it('should handle missing account in wallet during re-auth', async () => {
      mockGetValidSiweAuthToken.mockResolvedValue(null);
      mockIsSiweTokenExpired.mockReturnValue(true);

      const walletNoAccount = {
        getAccount: jest.fn().mockReturnValue(null),
        getConfig: jest.fn()
      } as unknown as Wallet;

      const result = await getOrRefreshSiweToken(walletNoAccount);

      expect(result).toBeNull();
      // Should warn about re-authentication failure (which includes the no account case)
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
