import { Wallet } from 'thirdweb/wallets';
import { getValidSiweAuthToken, SiweAuth } from '../../core/auth';
import { PannaClient } from '../../core/client';
import { PannaApiService } from '../../core/util/api-service';
import { usePanna } from '../hooks/use-panna';
import {
  buildSiweMessage,
  handleSiweAuth,
  getOrRefreshSiweToken
} from './auth';

// Mock the core auth functions
jest.mock('../../core/auth', () => ({
  getValidSiweAuthToken: jest.fn(),
  SiweAuth: jest.fn()
}));

// Mock usePanna hook
jest.mock('../hooks/use-panna', () => ({
  usePanna: jest.fn()
}));

const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;
const mockGetValidSiweAuthToken = getValidSiweAuthToken as jest.MockedFunction<
  typeof getValidSiweAuthToken
>;

// Create mock SiweAuth instance
const mockSiweAuth = {
  generatePayload: jest.fn(),
  login: jest.fn(),
  isLoggedIn: jest.fn(),
  isTokenExpired: jest.fn(),
  getUser: jest.fn(),
  getAuthToken: jest.fn(),
  getValidAuthToken: jest.fn(),
  getTokenExpiry: jest.fn(),
  logout: jest.fn()
};

describe('Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();

    // Reset and clear mockSiweAuth methods to avoid test pollution
    mockSiweAuth.generatePayload.mockReset().mockClear();
    mockSiweAuth.login.mockReset().mockClear();
    mockSiweAuth.isTokenExpired.mockReset().mockClear();
    mockSiweAuth.getValidAuthToken.mockReset().mockClear();

    // Reset mockGetValidSiweAuthToken
    mockGetValidSiweAuthToken.mockReset().mockClear();

    // Setup usePanna mock to return siweAuth
    mockUsePanna.mockReturnValue({
      client: {} as unknown as PannaClient,
      partnerId: 'test-partner',
      chainId: '4202',
      pannaApiService: {} as unknown as PannaApiService,
      siweAuth: mockSiweAuth as unknown as SiweAuth
    });
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
      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(true);

      const result = await handleSiweAuth(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet
      );

      expect(result).toBe(true);
      expect(mockSiweAuth.generatePayload).toHaveBeenCalledWith({
        address: mockAccount.address
      });
      expect(mockAccount.signMessage).toHaveBeenCalled();
      expect(mockSiweAuth.login).toHaveBeenCalledWith({
        payload: expect.any(Object),
        signature: '0xsignature',
        account: mockAccount,
        isSafeWallet: true
      });
    });

    it('should pass chainId to signMessage when provided', async () => {
      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(true);

      await handleSiweAuth(mockSiweAuth as unknown as SiweAuth, mockWallet, {
        chainId: 4202
      });

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

      const result = await handleSiweAuth(
        mockSiweAuth as unknown as SiweAuth,
        walletNoAccount
      );

      expect(result).toBe(false);
      expect(mockSiweAuth.generatePayload).not.toHaveBeenCalled();
    });

    it('should return false when SIWE login fails', async () => {
      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(false);

      const result = await handleSiweAuth(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet
      );

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('SIWE authentication failed');
    });

    it('should handle signature errors gracefully', async () => {
      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockRejectedValue(new Error('User rejected'));

      const result = await handleSiweAuth(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet
      );

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'SIWE authentication error:',
        expect.any(Error)
      );
    });

    it('should handle 401 errors without treating as fatal', async () => {
      mockSiweAuth.generatePayload.mockRejectedValue(
        new Error('401 Unauthorized')
      );

      const result = await handleSiweAuth(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet
      );

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

      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(true);

      await handleSiweAuth(
        mockSiweAuth as unknown as SiweAuth,
        walletWithSmartAccount
      );

      expect(mockSiweAuth.login).toHaveBeenCalledWith(
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

      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(true);

      await handleSiweAuth(
        mockSiweAuth as unknown as SiweAuth,
        walletWithoutSmartAccount
      );

      expect(mockSiweAuth.login).toHaveBeenCalledWith(
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

      const result = await getOrRefreshSiweToken(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet
      );

      expect(result).toBe('valid-token-123');
      expect(mockSiweAuth.generatePayload).not.toHaveBeenCalled();
    });

    it('should attempt re-authentication when no valid token and wallet provided', async () => {
      mockGetValidSiweAuthToken
        .mockResolvedValueOnce(null) // First call - no valid token
        .mockResolvedValueOnce('new-token-456'); // After re-auth

      mockSiweAuth.getValidAuthToken.mockReturnValueOnce('new-token-456'); // Mock for successful re-auth
      mockSiweAuth.isTokenExpired.mockReturnValue(true);

      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(true);

      const result = await getOrRefreshSiweToken(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet,
        { chainId: 4202 }
      );

      expect(result).toBe('new-token-456');
      expect(console.log).toHaveBeenCalledWith(
        'SIWE token expired, attempting re-authentication...'
      );
    });

    it('should return null when re-authentication fails', async () => {
      mockGetValidSiweAuthToken.mockResolvedValue(null);
      mockSiweAuth.isTokenExpired.mockReturnValue(true);
      mockSiweAuth.getValidAuthToken.mockReturnValue(null); // Mock for failed re-auth

      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(false);

      const result = await getOrRefreshSiweToken(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet
      );

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        'SIWE re-authentication failed'
      );
    });

    it('should return null when no wallet provided and no valid token', async () => {
      mockGetValidSiweAuthToken.mockResolvedValue(null);

      const result = await getOrRefreshSiweToken(
        mockSiweAuth as unknown as SiweAuth
      );

      expect(result).toBeNull();
      expect(mockSiweAuth.generatePayload).not.toHaveBeenCalled();
    });

    it('should not log expired message when token is missing (not expired)', async () => {
      mockGetValidSiweAuthToken
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('new-token');

      mockSiweAuth.getValidAuthToken.mockReturnValueOnce('new-token'); // Mock for successful re-auth
      mockSiweAuth.isTokenExpired.mockReturnValue(false);

      mockSiweAuth.generatePayload.mockResolvedValue({
        domain: 'panna-app.lisk.com',
        address: '0x1234567890123456789012345678901234567890',
        uri: 'https://panna-app.lisk.com',
        version: '1',
        chainId: 4202,
        nonce: '0xb7b1a40ac418c5bf',
        issuedAt: '2024-01-01T00:00:00.000Z'
      });

      mockAccount.signMessage.mockResolvedValue('0xsignature');
      mockSiweAuth.login.mockResolvedValue(true);

      await getOrRefreshSiweToken(
        mockSiweAuth as unknown as SiweAuth,
        mockWallet
      );

      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('expired')
      );
    });

    it('should handle missing account in wallet during re-auth', async () => {
      mockGetValidSiweAuthToken.mockResolvedValue(null);
      mockSiweAuth.isTokenExpired.mockReturnValue(true);
      mockSiweAuth.getValidAuthToken.mockReturnValue(null); // Mock for failed re-auth

      const walletNoAccount = {
        getAccount: jest.fn().mockReturnValue(null),
        getConfig: jest.fn()
      } as unknown as Wallet;

      const result = await getOrRefreshSiweToken(
        mockSiweAuth as unknown as SiweAuth,
        walletNoAccount
      );

      expect(result).toBeNull();
      // Should warn about re-authentication failure (which includes the no account case)
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
