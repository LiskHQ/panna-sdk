import type { Account } from 'thirdweb/wallets';
import { PannaApiService } from '../util/api-service';
import type {
  AuthChallengeReply,
  AuthVerifyReply,
  LoginPayload
} from '../util/types';
import { SiweAuth, type GeneratePayloadParams } from './siwe-auth';

jest.mock('../util/api-service');

const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
};

jest.mock('universal-cookie', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockCookies)
}));

describe('SiweAuth', () => {
  let mockPannaApiService: jest.Mocked<PannaApiService>;
  let siweAuth: SiweAuth;

  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockChainId = 1135;
  const mockDomain = 'panna-app.lisk.com';
  const mockUri = 'https://panna-app.lisk.com';
  const mockNonce = '0xb7b1a40ac418c5bf';
  const mockIssuedAt = '2024-01-01T10:00:00Z';
  const mockToken = 'mock-jwt-token-12345';
  const mockExpiresAt = 1735740000;

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true
    });

    mockCookies.get.mockReturnValue(undefined);
    mockCookies.set.mockImplementation(() => {});
    mockCookies.remove.mockImplementation(() => {});

    mockPannaApiService = {
      getAuthChallenge: jest.fn(),
      verifyAuth: jest.fn()
    } as unknown as jest.Mocked<PannaApiService>;

    siweAuth = new SiweAuth(mockPannaApiService);
  });

  afterEach(() => {
    delete (global as { window?: unknown }).window;
  });

  describe('constructor', () => {
    it('should initialize with empty auth state', () => {
      expect(siweAuth.getAuthToken()).toBeNull();
      expect(siweAuth.getUser()).toBeNull();
      expect(siweAuth.getTokenExpiry()).toBeNull();
      expect(siweAuth.isLoggedIn()).toBe(false);
    });

    it('should load auth data from cookies if available', () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'panna_auth_token') return mockToken;
        if (key === 'panna_user_address') return mockAddress;
        if (key === 'panna_auth_token_expiry') return mockExpiresAt.toString();
        return undefined;
      });

      const authWithCookies = new SiweAuth(mockPannaApiService);

      expect(authWithCookies.getAuthToken()).toBe(mockToken);
      expect(authWithCookies.getUser()).toBe(mockAddress);
      expect(authWithCookies.getTokenExpiry()).toBe(mockExpiresAt);
    });

    it('should not load auth data if cookies are not available', () => {
      mockCookies.get.mockReturnValue(undefined);

      const authWithoutCookies = new SiweAuth(mockPannaApiService);

      expect(authWithoutCookies.getAuthToken()).toBeNull();
      expect(authWithoutCookies.getUser()).toBeNull();
    });

    it('should not load auth data if only token is available but address is missing', () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'panna_auth_token') return mockToken;
        return undefined;
      });

      const authWithPartialCookies = new SiweAuth(mockPannaApiService);

      expect(authWithPartialCookies.getAuthToken()).toBeNull();
      expect(authWithPartialCookies.getUser()).toBeNull();
    });
  });

  describe('generatePayload', () => {
    const mockChallenge: AuthChallengeReply = {
      domain: mockDomain,
      address: mockAddress,
      uri: mockUri,
      version: '1',
      chainId: mockChainId,
      nonce: mockNonce,
      issuedAt: mockIssuedAt,
      statement: 'Sign in to Panna',
      expirationTime: '2024-01-01T11:00:00Z',
      notBefore: '2024-01-01T09:00:00Z',
      requestId: 'request-123',
      resources: ['https://api.panna.dev']
    };

    it('should call PannaApiService.getAuthChallenge with correct params', async () => {
      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);

      const params: GeneratePayloadParams = {
        address: mockAddress,
        chainId: mockChainId
      };

      await siweAuth.generatePayload(params);

      expect(mockPannaApiService.getAuthChallenge).toHaveBeenCalledWith({
        address: mockAddress
      });
      expect(mockPannaApiService.getAuthChallenge).toHaveBeenCalledTimes(1);
    });

    it('should return EIP-4361 compliant payload with all fields', async () => {
      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);

      const params: GeneratePayloadParams = {
        address: mockAddress
      };

      const payload = await siweAuth.generatePayload(params);

      expect(payload).toEqual({
        domain: mockChallenge.domain,
        address: mockChallenge.address,
        uri: mockChallenge.uri,
        version: mockChallenge.version,
        chainId: mockChallenge.chainId,
        nonce: mockChallenge.nonce,
        issuedAt: mockChallenge.issuedAt,
        statement: mockChallenge.statement,
        expirationTime: mockChallenge.expirationTime,
        notBefore: mockChallenge.notBefore,
        requestId: mockChallenge.requestId,
        resources: mockChallenge.resources
      });
    });

    it('should return EIP-4361 compliant payload with only required fields', async () => {
      const minimalChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(minimalChallenge);

      const params: GeneratePayloadParams = {
        address: mockAddress
      };

      const payload = await siweAuth.generatePayload(params);

      expect(payload).toEqual({
        domain: minimalChallenge.domain,
        address: minimalChallenge.address,
        uri: minimalChallenge.uri,
        version: minimalChallenge.version,
        chainId: minimalChallenge.chainId,
        nonce: minimalChallenge.nonce,
        issuedAt: minimalChallenge.issuedAt,
        statement: undefined,
        expirationTime: undefined,
        notBefore: undefined,
        requestId: undefined,
        resources: undefined
      });
    });

    it('should store challenge for later use in verification', async () => {
      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);

      const params: GeneratePayloadParams = {
        address: mockAddress
      };

      await siweAuth.generatePayload(params);

      // Verify challenge is stored by attempting login without generating new payload
      const mockAccount = { address: mockAddress } as Account;
      const mockSignature = '0xabcdef';
      const mockPayload: LoginPayload = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(mockPannaApiService.verifyAuth).toHaveBeenCalled();
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error');
      mockPannaApiService.getAuthChallenge.mockRejectedValue(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const params: GeneratePayloadParams = {
        address: mockAddress
      };

      await expect(siweAuth.generatePayload(params)).rejects.toThrow(
        'Network error'
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to generate login payload:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('login', () => {
    const mockAccount = { address: mockAddress } as Account;
    const mockSignature = '0xabcdef1234567890';
    const mockPayload: LoginPayload = {
      domain: mockDomain,
      address: mockAddress,
      uri: mockUri,
      version: '1',
      chainId: mockChainId,
      nonce: mockNonce,
      issuedAt: mockIssuedAt
    };

    const mockChallenge: AuthChallengeReply = {
      domain: mockDomain,
      address: mockAddress,
      uri: mockUri,
      version: '1',
      chainId: mockChainId,
      nonce: mockNonce,
      issuedAt: mockIssuedAt,
      statement: 'Sign in to Panna',
      expirationTime: '2024-01-01T11:00:00Z'
    };

    beforeEach(async () => {
      // Generate payload first to store challenge
      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });
    });

    it('should return false if no challenge available', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const freshAuth = new SiweAuth(mockPannaApiService);

      const result = await freshAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to verify login:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should call PannaApiService.verifyAuth with correct params', async () => {
      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(mockPannaApiService.verifyAuth).toHaveBeenCalledWith({
        domain: mockChallenge.domain,
        address: mockChallenge.address,
        uri: mockChallenge.uri,
        version: mockChallenge.version,
        chainId: mockChallenge.chainId,
        nonce: mockChallenge.nonce,
        issuedAt: mockChallenge.issuedAt,
        signature: mockSignature,
        isSafeWallet: false,
        statement: mockChallenge.statement,
        expirationTime: mockChallenge.expirationTime
      });
    });

    it('should store auth token and user address on success', async () => {
      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const result = await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(result).toBe(true);
      expect(siweAuth.getAuthToken()).toBe(mockToken);
      expect(siweAuth.getUser()).toBe(mockAddress);
      expect(siweAuth.getTokenExpiry()).toBe(mockExpiresAt);
    });

    it('should store data in cookies', async () => {
      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(mockCookies.set).toHaveBeenCalledWith(
        'panna_auth_token',
        mockToken
      );
      expect(mockCookies.set).toHaveBeenCalledWith(
        'panna_user_address',
        mockAddress
      );
      expect(mockCookies.set).toHaveBeenCalledWith(
        'panna_auth_token_expiry',
        mockExpiresAt.toString()
      );
    });

    it('should handle expiresIn for backward compatibility', async () => {
      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresIn: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(siweAuth.getTokenExpiry()).toBe(mockExpiresAt);
    });

    it('should prefer expiresAt over expiresIn', async () => {
      const differentExpiry = mockExpiresAt + 1000;
      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt,
        expiresIn: differentExpiry
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(siweAuth.getTokenExpiry()).toBe(mockExpiresAt);
    });

    it('should clear challenge after successful login', async () => {
      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      // Try to login again without generating new payload - should return false
      const result = await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(result).toBe(false);
    });

    it('should handle isSafeWallet parameter', async () => {
      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount,
        isSafeWallet: true
      });

      expect(mockPannaApiService.verifyAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          isSafeWallet: true
        })
      );
    });

    it('should return false when no token in response', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: '',
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const result = await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'SIWE Auth - No token received from verify response'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should clear challenge on error', async () => {
      const mockError = new Error('Verification failed');
      mockPannaApiService.verifyAuth.mockRejectedValue(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to verify login:',
        mockError
      );

      // Try to login again - should return false because challenge was cleared
      const secondResult = await siweAuth.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(secondResult).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it('should include optional SIWE fields in verify request', async () => {
      const fullChallenge: AuthChallengeReply = {
        ...mockChallenge,
        statement: 'Sign in to Panna',
        expirationTime: '2024-01-01T11:00:00Z',
        notBefore: '2024-01-01T09:00:00Z',
        requestId: 'request-123',
        resources: ['https://api.panna.dev']
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(fullChallenge);
      const authWithFullChallenge = new SiweAuth(mockPannaApiService);
      await authWithFullChallenge.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      await authWithFullChallenge.login({
        payload: mockPayload,
        signature: mockSignature,
        account: mockAccount
      });

      expect(mockPannaApiService.verifyAuth).toHaveBeenCalledWith({
        domain: fullChallenge.domain,
        address: fullChallenge.address,
        uri: fullChallenge.uri,
        version: fullChallenge.version,
        chainId: fullChallenge.chainId,
        nonce: fullChallenge.nonce,
        issuedAt: fullChallenge.issuedAt,
        signature: mockSignature,
        isSafeWallet: false,
        statement: fullChallenge.statement,
        expirationTime: fullChallenge.expirationTime,
        notBefore: fullChallenge.notBefore,
        requestId: fullChallenge.requestId,
        resources: fullChallenge.resources
      });
    });
  });

  describe('isLoggedIn', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1735730000000); // ~10000 seconds before expiry
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true when logged in with valid token', async () => {
      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.isLoggedIn()).toBe(true);
    });

    it('should return false when token is expired', async () => {
      const expiredTime = Math.floor(Date.now() / 1000) - 1000; // 1000 seconds ago

      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'panna_auth_token') return mockToken;
        if (key === 'panna_user_address') return mockAddress;
        if (key === 'panna_auth_token_expiry') return expiredTime.toString();
        return undefined;
      });

      const authWithExpiredToken = new SiweAuth(mockPannaApiService);

      expect(authWithExpiredToken.isLoggedIn()).toBe(false);
    });

    it('should return false when no token exists', () => {
      expect(siweAuth.isLoggedIn()).toBe(false);
    });

    it('should load from cookies if not in memory', () => {
      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'panna_auth_token') return mockToken;
        if (key === 'panna_user_address') return mockAddress;
        if (key === 'panna_auth_token_expiry') return mockExpiresAt.toString();
        return undefined;
      });

      expect(siweAuth.isLoggedIn()).toBe(true);
      expect(siweAuth.getAuthToken()).toBe(mockToken);
      expect(siweAuth.getUser()).toBe(mockAddress);
    });

    it('should return false when cookies exist but token is expired', () => {
      const expiredTime = Math.floor(Date.now() / 1000) - 1000;

      mockCookies.get.mockImplementation((key: string) => {
        if (key === 'panna_auth_token') return mockToken;
        if (key === 'panna_user_address') return mockAddress;
        if (key === 'panna_auth_token_expiry') return expiredTime.toString();
        return undefined;
      });

      expect(siweAuth.isLoggedIn()).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1735730000000);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return false when no token exists', () => {
      expect(siweAuth.isTokenExpired()).toBe(false);
    });

    it('should return true when token exists but no expiry info', async () => {
      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: null as unknown as number
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.isTokenExpired()).toBe(true);
    });

    it('should return true when token is expired', async () => {
      const expiredTime = Math.floor(Date.now() / 1000) - 1000;

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: expiredTime
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.isTokenExpired()).toBe(true);
    });

    it('should return false when token is still valid', async () => {
      const validTime = Math.floor(Date.now() / 1000) + 10000; // 10000 seconds in future

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: validTime
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.isTokenExpired()).toBe(false);
    });

    it('should account for 60 second buffer time', async () => {
      // Token expires in 30 seconds, but with 60 second buffer should be considered expired
      const nearExpiry = Math.floor(Date.now() / 1000) + 30;

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: nearExpiry
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.isTokenExpired()).toBe(true);
    });

    it('should not be expired when beyond 60 second buffer', async () => {
      // Token expires in 120 seconds, beyond 60 second buffer
      const validTime = Math.floor(Date.now() / 1000) + 120;

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: validTime
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.isTokenExpired()).toBe(false);
    });
  });

  describe('getUser', () => {
    it('should return null when not logged in', () => {
      expect(siweAuth.getUser()).toBeNull();
    });

    it('should return user address when logged in', async () => {
      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.getUser()).toBe(mockAddress);
    });
  });

  describe('getAuthToken', () => {
    it('should return null when not logged in', () => {
      expect(siweAuth.getAuthToken()).toBeNull();
    });

    it('should return token when logged in', async () => {
      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.getAuthToken()).toBe(mockToken);
    });

    it('should return token even if expired', async () => {
      const expiredTime = Math.floor(Date.now() / 1000) - 1000;

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: expiredTime
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.getAuthToken()).toBe(mockToken);
      expect(siweAuth.isTokenExpired()).toBe(true);
    });
  });

  describe('getValidAuthToken', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1735730000000);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return null when not logged in', () => {
      expect(siweAuth.getValidAuthToken()).toBeNull();
    });

    it('should return null when token is expired', async () => {
      const expiredTime = Math.floor(Date.now() / 1000) - 1000;

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: expiredTime
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.getValidAuthToken()).toBeNull();
    });

    it('should return token when valid', async () => {
      const validTime = Math.floor(Date.now() / 1000) + 10000;

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: validTime
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.getValidAuthToken()).toBe(mockToken);
    });
  });

  describe('getTokenExpiry', () => {
    it('should return null when not logged in', () => {
      expect(siweAuth.getTokenExpiry()).toBeNull();
    });

    it('should return expiry timestamp when logged in', async () => {
      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(siweAuth.getTokenExpiry()).toBe(mockExpiresAt);
    });
  });

  describe('logout', () => {
    beforeEach(async () => {
      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: mockNonce,
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: mockToken,
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });
    });

    it('should clear memory state', () => {
      expect(siweAuth.getAuthToken()).toBe(mockToken);
      expect(siweAuth.getUser()).toBe(mockAddress);

      siweAuth.logout();

      expect(siweAuth.getAuthToken()).toBeNull();
      expect(siweAuth.getUser()).toBeNull();
      expect(siweAuth.getTokenExpiry()).toBeNull();
    });

    it('should clear cookies', () => {
      siweAuth.logout();

      expect(mockCookies.remove).toHaveBeenCalledWith('panna_auth_token');
      expect(mockCookies.remove).toHaveBeenCalledWith('panna_user_address');
      expect(mockCookies.remove).toHaveBeenCalledWith(
        'panna_auth_token_expiry'
      );
    });

    it('should clear challenge', async () => {
      siweAuth.logout();

      // Trying to login without generating new payload should return false
      const mockAccount = { address: mockAddress } as Account;
      const result = await siweAuth.login({
        payload: {
          domain: mockDomain,
          address: mockAddress,
          uri: mockUri,
          version: '1',
          chainId: mockChainId,
          nonce: mockNonce,
          issuedAt: mockIssuedAt
        },
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(result).toBe(false);
    });

    it('should allow user to log in again after logout', async () => {
      siweAuth.logout();

      const mockChallenge: AuthChallengeReply = {
        domain: mockDomain,
        address: mockAddress,
        uri: mockUri,
        version: '1',
        chainId: mockChainId,
        nonce: '0xnewnonce',
        issuedAt: mockIssuedAt
      };

      mockPannaApiService.getAuthChallenge.mockResolvedValue(mockChallenge);
      await siweAuth.generatePayload({ address: mockAddress });

      const mockAuthResult: AuthVerifyReply = {
        address: mockAddress,
        token: 'new-token',
        expiresAt: mockExpiresAt
      };

      mockPannaApiService.verifyAuth.mockResolvedValue(mockAuthResult);

      const mockAccount = { address: mockAddress } as Account;
      const result = await siweAuth.login({
        payload: mockChallenge,
        signature: '0xabcdef',
        account: mockAccount
      });

      expect(result).toBe(true);
      expect(siweAuth.getAuthToken()).toBe('new-token');
    });
  });
});
