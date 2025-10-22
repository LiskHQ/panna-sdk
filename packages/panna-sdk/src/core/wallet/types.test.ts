import { liskSepolia } from '../chain/chain-definitions/lisk-sepolia';
import { type PannaClient, EcosystemId, type EcosystemConfig } from '../client';
import {
  LoginStrategy,
  type ConnectParams,
  type EmailConnectParams,
  type PhoneConnectParams,
  type SocialConnectParams,
  type WalletConnectParams,
  type EmailPrepareParams,
  type PhonePrepareParams,
  type LoginStrategyType,
  type Account,
  type LinkedAccount,
  type AccountConnectionOptions,
  type AccountAuth
} from './types';

describe('Wallet Types', () => {
  const mockClient = {} as PannaClient;
  const testEcosystem: EcosystemConfig = {
    id: EcosystemId.LISK,
    partnerId: 'test-partner-id'
  };

  describe('LoginStrategy', () => {
    it('should have EMAIL strategy', () => {
      expect(LoginStrategy.EMAIL).toBe('email');
    });

    it('should have PHONE strategy', () => {
      expect(LoginStrategy.PHONE).toBe('phone');
    });

    it('should have correct number of strategies', () => {
      const strategies = Object.values(LoginStrategy);
      expect(strategies).toHaveLength(4);
      expect(strategies).toEqual(['email', 'phone', 'google', 'wallet']);
    });
  });

  describe('Connect Types', () => {
    describe('EmailConnectParams', () => {
      it('should match expected structure', () => {
        const emailConnect: EmailConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        };

        expect(emailConnect.strategy).toBe('email');
        expect(emailConnect.email).toBe('test@example.com');
        expect(emailConnect.verificationCode).toBe('123456');
        expect(emailConnect.client).toBe(mockClient);
        expect(emailConnect.ecosystem).toBe(testEcosystem);
        expect(emailConnect.ecosystem.partnerId).toBe('test-partner-id');
        expect(emailConnect.ecosystem.id).toBe(EcosystemId.LISK);
      });
    });

    describe('PhoneConnectParams', () => {
      it('should match expected structure', () => {
        const phoneConnect: PhoneConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890',
          verificationCode: '123456'
        };

        expect(phoneConnect.strategy).toBe('phone');
        expect(phoneConnect.phoneNumber).toBe('+1234567890');
        expect(phoneConnect.verificationCode).toBe('123456');
        expect(phoneConnect.client).toBe(mockClient);
        expect(phoneConnect.ecosystem).toBe(testEcosystem);
        expect(phoneConnect.ecosystem.partnerId).toBe('test-partner-id');
        expect(phoneConnect.ecosystem.id).toBe(EcosystemId.LISK);
      });
    });

    describe('SocialConnectParams', () => {
      it('should match expected structure', () => {
        const socialConnect: SocialConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.GOOGLE,
          mode: 'redirect',
          redirectUrl: 'https://example.com/callback'
        };

        expect(socialConnect.strategy).toBe(LoginStrategy.GOOGLE);
        expect(socialConnect.mode).toBe('redirect');
        expect(socialConnect.redirectUrl).toBe('https://example.com/callback');
        expect(socialConnect.client).toBe(mockClient);
        expect(socialConnect.ecosystem).toBe(testEcosystem);
        expect(socialConnect.ecosystem.partnerId).toBe('test-partner-id');
        expect(socialConnect.ecosystem.id).toBe(EcosystemId.LISK);
      });

      it('should support various social providers', () => {
        const providers = [
          'google',
          'apple',
          'facebook',
          'discord',
          'github'
        ] as const;

        providers.forEach((provider) => {
          const socialConnect: SocialConnectParams = {
            client: mockClient,
            ecosystem: testEcosystem,
            strategy: provider,
            mode: 'redirect',
            redirectUrl: 'https://example.com/callback'
          };

          expect(socialConnect.strategy).toBe(provider);
        });
      });
    });

    describe('WalletConnectParams', () => {
      it('should match expected structure', () => {
        const walletConnect: WalletConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'io.metamask',
          chain: liskSepolia
        };

        expect(walletConnect.strategy).toBe(LoginStrategy.WALLET);
        expect(walletConnect.walletId).toBe('io.metamask');
        expect(walletConnect.chain).toBe(liskSepolia);
        expect(walletConnect.client).toBe(mockClient);
        expect(walletConnect.ecosystem).toBe(testEcosystem);
        expect(walletConnect.ecosystem.partnerId).toBe('test-partner-id');
        expect(walletConnect.ecosystem.id).toBe(EcosystemId.LISK);
      });
    });

    describe('ConnectParams Union', () => {
      it('should accept EmailConnectParams', () => {
        const params: ConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        };

        expect(params.strategy).toBe('email');
      });

      it('should accept PhoneConnectParams', () => {
        const params: ConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890',
          verificationCode: '123456'
        };

        expect(params.strategy).toBe('phone');
      });

      it('should accept SocialConnectParams', () => {
        const params: ConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.GOOGLE,
          mode: 'redirect',
          redirectUrl: 'https://example.com/callback'
        };

        expect(params.strategy).toBe(LoginStrategy.GOOGLE);
      });

      it('should accept WalletConnectParams', () => {
        const params: ConnectParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.WALLET,
          walletId: 'io.metamask',
          chain: liskSepolia
        };

        expect(params.strategy).toBe(LoginStrategy.WALLET);
      });
    });
  });

  describe('Prepare Login Types', () => {
    describe('EmailPrepareParams', () => {
      it('should match expected structure', () => {
        const emailPrepare: EmailPrepareParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com'
        };

        expect(emailPrepare.strategy).toBe('email');
        expect(emailPrepare.email).toBe('test@example.com');
        expect(emailPrepare.client).toBe(mockClient);
        expect(emailPrepare.ecosystem).toBe(testEcosystem);
      });
    });

    describe('PhonePrepareParams', () => {
      it('should match expected structure', () => {
        const phonePrepare: PhonePrepareParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890'
        };

        expect(phonePrepare.strategy).toBe('phone');
        expect(phonePrepare.phoneNumber).toBe('+1234567890');
        expect(phonePrepare.client).toBe(mockClient);
        expect(phonePrepare.ecosystem).toBe(testEcosystem);
      });
    });
  });

  describe('LoginStrategyType', () => {
    it('should accept all LoginStrategy values', () => {
      const emailStrategy: LoginStrategyType = LoginStrategy.EMAIL;
      const phoneStrategy: LoginStrategyType = LoginStrategy.PHONE;

      expect(emailStrategy).toBe('email');
      expect(phoneStrategy).toBe('phone');
    });
  });

  describe('Re-exported Types', () => {
    it('should re-export Account type', () => {
      // Type test - if this compiles, the type exists
      const account: Account = {} as Account;
      expect(account).toBeDefined();
    });

    it('should re-export LinkedAccount type', () => {
      // Type test - if this compiles, the type exists
      const linkedAccount: LinkedAccount = {} as LinkedAccount;
      expect(linkedAccount).toBeDefined();
    });

    it('should re-export AccountConnectionOptions type', () => {
      // Type test - if this compiles, the type exists
      const options: AccountConnectionOptions = {} as AccountConnectionOptions;
      expect(options).toBeDefined();
    });

    it('should re-export AccountAuth type', () => {
      // Type test - if this compiles, the type exists
      const method: AccountAuth = {} as AccountAuth;
      expect(method).toBeDefined();
    });
  });
});
