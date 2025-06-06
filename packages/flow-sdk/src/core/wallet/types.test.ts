import { type FlowClient } from '../client';
import {
  EcosystemId,
  LoginStrategy,
  type AuthParams,
  type SingleStepAuthParams,
  type MultiStepAuthParams,
  type EmailAuthParams,
  type PhoneAuthParams,
  type EmailPrepareParams,
  type PhonePrepareParams,
  type EcosystemConfig,
  type LoginStrategyType,
  type Account,
  type LinkedAccount,
  type AccountConnectionOptions,
  type AccountAuth
} from './types';

describe('Types', () => {
  const mockClient = {} as FlowClient;
  const testEcosystem: EcosystemConfig = {
    id: EcosystemId.LISK,
    partnerId: 'test-partner-id'
  };

  describe('EcosystemId enum', () => {
    it('should have LISK ecosystem with correct value', () => {
      expect(EcosystemId.LISK).toBe('ecosystem.lisk');
    });

    it('should only have LISK ecosystem', () => {
      const ecosystems = Object.values(EcosystemId);
      expect(ecosystems).toHaveLength(1);
      expect(ecosystems).toContain('ecosystem.lisk');
    });
  });

  describe('LoginStrategy', () => {
    it('should have EMAIL strategy', () => {
      expect(LoginStrategy.EMAIL).toBe('email');
    });

    it('should have PHONE strategy', () => {
      expect(LoginStrategy.PHONE).toBe('phone');
    });

    it('should have correct number of strategies', () => {
      const strategies = Object.values(LoginStrategy);
      expect(strategies).toHaveLength(2);
      expect(strategies).toEqual(['email', 'phone']);
    });
  });

  describe('Authentication Types', () => {
    describe('EmailAuthParams', () => {
      it('should match expected structure', () => {
        const emailAuth: EmailAuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        };

        expect(emailAuth.strategy).toBe('email');
        expect(emailAuth.email).toBe('test@example.com');
        expect(emailAuth.verificationCode).toBe('123456');
        expect(emailAuth.client).toBe(mockClient);
        expect(emailAuth.ecosystem).toBe(testEcosystem);
      });
    });

    describe('PhoneAuthParams', () => {
      it('should match expected structure', () => {
        const phoneAuth: PhoneAuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890',
          verificationCode: '123456'
        };

        expect(phoneAuth.strategy).toBe('phone');
        expect(phoneAuth.phoneNumber).toBe('+1234567890');
        expect(phoneAuth.verificationCode).toBe('123456');
        expect(phoneAuth.client).toBe(mockClient);
        expect(phoneAuth.ecosystem).toBe(testEcosystem);
      });
    });

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

  describe('Union Types', () => {
    describe('SingleStepAuthParams', () => {
      it('should accept EmailAuthParams', () => {
        const emailAuth: SingleStepAuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        };

        expect(emailAuth.strategy).toBe('email');
      });

      it('should accept PhoneAuthParams', () => {
        const phoneAuth: SingleStepAuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890',
          verificationCode: '123456'
        };

        expect(phoneAuth.strategy).toBe('phone');
      });

      it('should accept all auth types', () => {
        const strategies: Array<SingleStepAuthParams['strategy']> = [
          LoginStrategy.EMAIL,
          LoginStrategy.PHONE
        ];

        expect(strategies).toHaveLength(2);
      });
    });

    describe('MultiStepAuthParams', () => {
      it('should accept EmailPrepareParams', () => {
        const emailPrepare: MultiStepAuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com'
        };

        expect(emailPrepare.strategy).toBe('email');
      });

      it('should accept PhonePrepareParams', () => {
        const phonePrepare: MultiStepAuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.PHONE,
          phoneNumber: '+1234567890'
        };

        expect(phonePrepare.strategy).toBe('phone');
      });
    });

    describe('AuthParams', () => {
      it('should accept SingleStepAuthParams', () => {
        const singleStep: AuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com',
          verificationCode: '123456'
        };

        expect(singleStep.strategy).toBe('email');
      });

      it('should accept MultiStepAuthParams', () => {
        const multiStep: AuthParams = {
          client: mockClient,
          ecosystem: testEcosystem,
          strategy: LoginStrategy.EMAIL,
          email: 'test@example.com'
        };

        expect(multiStep.strategy).toBe('email');
      });
    });
  });

  describe('EcosystemConfig', () => {
    it('should match expected structure', () => {
      const config: EcosystemConfig = {
        id: EcosystemId.LISK,
        partnerId: 'test-partner-id'
      };

      expect(config.id).toBe(EcosystemId.LISK);
      expect(config.partnerId).toBe('test-partner-id');
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
