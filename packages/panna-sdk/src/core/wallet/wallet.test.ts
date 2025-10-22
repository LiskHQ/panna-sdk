import * as thirdwebWallets from 'thirdweb/wallets';
import { type Chain } from '../chain/types';
import { type PannaClient, EcosystemId } from '../client';
import { LoginStrategy, type Account } from './types';
import {
  connect,
  createAccount,
  getEmail,
  getLinkedAccounts,
  getPhoneNumber,
  linkAccount,
  prepareLogin,
  unlinkAccount
} from './wallet';

// Mock thirdweb/wallets module
jest.mock('thirdweb/wallets');

describe('Wallet Functions - Unit Tests', () => {
  const mockClient = {} as PannaClient;
  const testEcosystem = {
    id: EcosystemId.LISK,
    partnerId: 'test-partner-id'
  };
  const mockChain = {
    id: 4202,
    rpc: 'https://rpc.sepolia-api.lisk.com'
  } as Chain;

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

    it('should have all supported strategies', () => {
      const strategies = Object.values(LoginStrategy);
      expect(strategies).toHaveLength(4);
      expect(strategies).toContain('email');
      expect(strategies).toContain('phone');
      expect(strategies).toContain('google');
      expect(strategies).toContain('wallet');
    });
  });

  describe('connect', () => {
    describe('Email strategy', () => {
      it('should connect with email and verification code', async () => {
        const mockEcosystemWallet = { type: 'ecosystem' } as unknown as Account;
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.authenticate as jest.Mock).mockResolvedValue(
          undefined
        );

        const result = await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        });

        expect(thirdwebWallets.ecosystemWallet).toHaveBeenCalledWith(
          EcosystemId.LISK,
          { partnerId: 'test-partner-id' }
        );
        expect(thirdwebWallets.authenticate).toHaveBeenCalledWith({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        });
        expect(result).toEqual(mockEcosystemWallet);
      });

      it('should use custom ecosystem ID if provided', async () => {
        const mockEcosystemWallet = { type: 'ecosystem' } as unknown as Account;
        const customEcosystem = {
          id: 'ecosystem.custom' as EcosystemId,
          partnerId: 'test-partner-id'
        };

        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.authenticate as jest.Mock).mockResolvedValue(
          undefined
        );

        await connect({
          client: mockClient,
          ecosystem: customEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        });

        expect(thirdwebWallets.ecosystemWallet).toHaveBeenCalledWith(
          'ecosystem.custom',
          { partnerId: 'test-partner-id' }
        );
      });
    });

    describe('Phone strategy', () => {
      it('should connect with phone and verification code', async () => {
        const mockEcosystemWallet = { type: 'ecosystem' } as unknown as Account;
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.authenticate as jest.Mock).mockResolvedValue(
          undefined
        );

        const result = await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890',
          verificationCode: '123456'
        });

        expect(thirdwebWallets.ecosystemWallet).toHaveBeenCalledWith(
          EcosystemId.LISK,
          { partnerId: 'test-partner-id' }
        );
        expect(thirdwebWallets.authenticate).toHaveBeenCalledWith({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890',
          verificationCode: '123456'
        });
        expect(result).toEqual(mockEcosystemWallet);
      });
    });

    describe('Social strategy', () => {
      it('should connect with Google OAuth', async () => {
        const mockEcosystemWallet = { type: 'ecosystem' } as unknown as Account;
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (
          thirdwebWallets.authenticateWithRedirect as jest.Mock
        ).mockResolvedValue(undefined);

        const result = await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.GOOGLE,
          mode: 'redirect',
          redirectUrl: 'https://example.com/callback'
        });

        expect(thirdwebWallets.authenticateWithRedirect).toHaveBeenCalledWith({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.GOOGLE,
          mode: 'redirect',
          redirectUrl: 'https://example.com/callback'
        });
        expect(result).toEqual(mockEcosystemWallet);
      });

      it('should connect with Facebook OAuth', async () => {
        const mockEcosystemWallet = { type: 'ecosystem' } as unknown as Account;
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (
          thirdwebWallets.authenticateWithRedirect as jest.Mock
        ).mockResolvedValue(undefined);

        await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: 'facebook',
          mode: 'redirect',
          redirectUrl: 'https://example.com/auth'
        });

        expect(thirdwebWallets.authenticateWithRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            strategy: 'facebook'
          })
        );
      });

      it('should work with multiple social providers', async () => {
        const providers = ['apple', 'discord', 'github', 'x'] as const;
        const mockEcosystemWallet = { type: 'ecosystem' } as unknown as Account;
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );

        for (const provider of providers) {
          (
            thirdwebWallets.authenticateWithRedirect as jest.Mock
          ).mockResolvedValue(undefined);

          await connect({
            client: mockClient,
            ecosystem: testEcosystem,
            strategy: provider,
            mode: 'redirect',
            redirectUrl: 'https://example.com/callback'
          });

          expect(thirdwebWallets.authenticateWithRedirect).toHaveBeenCalledWith(
            expect.objectContaining({
              strategy: provider
            })
          );
        }
      });
    });

    describe('Wallet strategy', () => {
      const mockProvider = { name: 'MetaMask', isMetaMask: true };

      it('should connect with MetaMask when available', async () => {
        const mockExternalWallet = { id: 'io.metamask' };
        const mockConnectedAccount = {
          address: '0x123',
          id: 'connected'
        } as unknown as Account;
        const mockEcosystemWallet = {
          connect: jest.fn().mockResolvedValue(mockConnectedAccount)
        } as unknown as Account;

        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(
          mockProvider
        );
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.createWallet as jest.Mock).mockReturnValue(
          mockExternalWallet
        );

        const result = await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'io.metamask',
          chain: mockChain
        });

        expect(thirdwebWallets.injectedProvider).toHaveBeenCalledWith(
          'io.metamask'
        );
        expect(thirdwebWallets.createWallet).toHaveBeenCalledWith(
          'io.metamask'
        );
        expect(mockEcosystemWallet.connect).toHaveBeenCalledWith({
          client: mockClient,
          strategy: LoginStrategy.WALLET,
          chain: mockChain,
          wallet: mockExternalWallet
        });
        expect(result).toEqual(mockConnectedAccount);
      });

      it('should connect with Coinbase Wallet when available', async () => {
        const mockExternalWallet = { id: 'com.coinbase.wallet' };
        const mockConnectedAccount = {
          address: '0x456',
          id: 'coinbase'
        } as unknown as Account;
        const mockEcosystemWallet = {
          connect: jest.fn().mockResolvedValue(mockConnectedAccount)
        } as unknown as Account;

        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(
          mockProvider
        );
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.createWallet as jest.Mock).mockReturnValue(
          mockExternalWallet
        );

        const result = await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'com.coinbase.wallet',
          chain: mockChain
        });

        expect(thirdwebWallets.injectedProvider).toHaveBeenCalledWith(
          'com.coinbase.wallet'
        );
        expect(result).toEqual(mockConnectedAccount);
      });

      it('should connect with WalletConnect', async () => {
        const mockExternalWallet = { id: 'walletConnect' };
        const mockConnectedAccount = {
          address: '0x789',
          id: 'wc'
        } as unknown as Account;
        const mockEcosystemWallet = {
          connect: jest.fn().mockResolvedValue(mockConnectedAccount)
        } as unknown as Account;

        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(
          mockProvider
        );
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.createWallet as jest.Mock).mockReturnValue(
          mockExternalWallet
        );

        const result = await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'walletConnect',
          chain: mockChain
        });

        expect(thirdwebWallets.createWallet).toHaveBeenCalledWith(
          'walletConnect'
        );
        expect(result).toEqual(mockConnectedAccount);
      });

      it('should check injectedProvider before connecting', async () => {
        const mockExternalWallet = { id: 'io.metamask' };
        const mockConnectedAccount = { address: '0xabc' } as unknown as Account;
        const mockEcosystemWallet = {
          connect: jest.fn().mockResolvedValue(mockConnectedAccount)
        } as unknown as Account;

        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(
          mockProvider
        );
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.createWallet as jest.Mock).mockReturnValue(
          mockExternalWallet
        );

        await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'io.metamask',
          chain: mockChain
        });

        expect(thirdwebWallets.injectedProvider).toHaveBeenCalledWith(
          'io.metamask'
        );
      });

      it('should throw error when wallet is not installed', async () => {
        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(
          undefined
        );
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue({});

        await expect(
          connect({
            client: mockClient,
            ecosystem: testEcosystem,
            strategy: LoginStrategy.WALLET,
            walletId: 'io.metamask',
            chain: mockChain
          })
        ).rejects.toThrow(
          'External wallet "io.metamask" is not installed or available. Please install the wallet extension and try again.'
        );

        expect(thirdwebWallets.injectedProvider).toHaveBeenCalledWith(
          'io.metamask'
        );
        expect(thirdwebWallets.createWallet).not.toHaveBeenCalled();
      });

      it('should throw error when wallet is null', async () => {
        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(null);
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue({});

        await expect(
          connect({
            client: mockClient,
            ecosystem: testEcosystem,
            strategy: LoginStrategy.WALLET,
            walletId: 'com.coinbase.wallet',
            chain: mockChain
          })
        ).rejects.toThrow(
          'External wallet "com.coinbase.wallet" is not installed or available. Please install the wallet extension and try again.'
        );

        expect(thirdwebWallets.createWallet).not.toHaveBeenCalled();
      });

      it('should pass correct chain parameter', async () => {
        const mockExternalWallet = { id: 'io.metamask' };
        const mockConnectedAccount = { address: '0xdef' } as unknown as Account;
        const mockEcosystemWallet = {
          connect: jest.fn().mockResolvedValue(mockConnectedAccount)
        } as unknown as Account;

        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(
          mockProvider
        );
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.createWallet as jest.Mock).mockReturnValue(
          mockExternalWallet
        );

        await connect({
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'io.metamask',
          chain: mockChain
        });

        expect(mockEcosystemWallet.connect).toHaveBeenCalledWith(
          expect.objectContaining({
            chain: mockChain
          })
        );
      });

      it('should use custom ecosystemId if provided for wallet strategy', async () => {
        const mockExternalWallet = { id: 'io.metamask' };
        const mockConnectedAccount = { address: '0xghi' } as unknown as Account;
        const mockEcosystemWallet = {
          connect: jest.fn().mockResolvedValue(mockConnectedAccount)
        } as unknown as Account;
        const customEcosystem = {
          id: 'ecosystem.custom' as EcosystemId,
          partnerId: 'custom-partner'
        };

        (thirdwebWallets.injectedProvider as jest.Mock).mockReturnValue(
          mockProvider
        );
        (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
          mockEcosystemWallet
        );
        (thirdwebWallets.createWallet as jest.Mock).mockReturnValue(
          mockExternalWallet
        );

        await connect({
          client: mockClient,
          ecosystem: customEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'io.metamask',
          chain: mockChain
        });

        expect(thirdwebWallets.ecosystemWallet).toHaveBeenCalledWith(
          'ecosystem.custom',
          { partnerId: 'custom-partner' }
        );
      });
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

      const result = createAccount({
        partnerId: 'test-partner-id'
      });

      expect(thirdwebWallets.ecosystemWallet).toHaveBeenCalledWith(
        EcosystemId.LISK,
        {
          partnerId: 'test-partner-id'
        }
      );
      expect(result).toEqual(mockEcosystemWallet);
    });

    it('should create ecosystem wallet with custom ecosystem ID and custom partner ID', () => {
      const mockEcosystemWallet = { type: 'ecosystem' };
      (thirdwebWallets.ecosystemWallet as jest.Mock).mockReturnValue(
        mockEcosystemWallet
      );

      const result = createAccount({
        ecosystemId: 'ecosystem.org123',
        partnerId: 'custom-partner-id'
      });

      expect(thirdwebWallets.ecosystemWallet).toHaveBeenCalledWith(
        'ecosystem.org123',
        {
          partnerId: 'custom-partner-id'
        }
      );
      expect(result).toEqual(mockEcosystemWallet);
    });
  });

  describe('getEmail', () => {
    it('should return email when available with required ecosystem', async () => {
      const mockEmail = 'test@example.com';
      (thirdwebWallets.getUserEmail as jest.Mock).mockResolvedValue(mockEmail);

      const params = { client: mockClient, ecosystem: testEcosystem };
      const result = await getEmail(params);

      expect(thirdwebWallets.getUserEmail).toHaveBeenCalledWith(params);
      expect(result).toBe(mockEmail);
    });

    it('should return undefined when email is not available', async () => {
      (thirdwebWallets.getUserEmail as jest.Mock).mockResolvedValue(undefined);

      const params = { client: mockClient, ecosystem: testEcosystem };
      const result = await getEmail(params);

      expect(result).toBeUndefined();
    });
  });

  describe('getPhoneNumber', () => {
    it('should return phone number when available with required ecosystem', async () => {
      const mockPhone = '+1234567890';
      (thirdwebWallets.getUserPhoneNumber as jest.Mock).mockResolvedValue(
        mockPhone
      );

      const params = { client: mockClient, ecosystem: testEcosystem };
      const result = await getPhoneNumber(params);

      expect(thirdwebWallets.getUserPhoneNumber).toHaveBeenCalledWith(params);
      expect(result).toBe(mockPhone);
    });

    it('should return undefined when phone number is not available', async () => {
      (thirdwebWallets.getUserPhoneNumber as jest.Mock).mockResolvedValue(
        undefined
      );

      const params = { client: mockClient, ecosystem: testEcosystem };
      const result = await getPhoneNumber(params);

      expect(result).toBeUndefined();
    });
  });

  describe('linkAccount', () => {
    it('should link profile with correct parameters and required ecosystem', async () => {
      const mockLinkResult = [
        { type: 'email', details: { email: 'test@example.com' } },
        { type: 'phone', details: { phoneNumber: '+1234567890' } }
      ];
      (thirdwebWallets.linkProfile as jest.Mock).mockResolvedValue(
        mockLinkResult
      );

      const params = {
        client: mockClient,
        strategy: LoginStrategy.EMAIL,
        email: 'test@example.com',
        verificationCode: '123456',
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
        { type: 'phone', details: { phoneNumber: '+1234567890' } }
      ];
      (thirdwebWallets.getProfiles as jest.Mock).mockResolvedValue(
        mockProfiles
      );

      const params = { client: mockClient, ecosystem: testEcosystem };
      const result = await getLinkedAccounts(params);

      expect(thirdwebWallets.getProfiles).toHaveBeenCalledWith(params);
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

      const params = { client: mockClient, ecosystem: customEcosystem };
      const result = await getLinkedAccounts(params);

      expect(thirdwebWallets.getProfiles).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockProfiles);
    });
  });

  describe('unlinkAccount', () => {
    it('should unlink profile with correct parameters and required ecosystem', async () => {
      const mockUnlinkResult = [
        { type: 'email', details: { email: 'test@example.com' } }
      ];
      const profileToUnlink = {
        type: 'phone' as const,
        details: { phone: '+1234567890' }
      };

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
