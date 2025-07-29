import { type Chain } from 'thirdweb';
import { type PannaClient } from '../client';
import {
  type AccountBalanceParams,
  type AccountBalanceResult,
  type AccountBalanceInFiatParams,
  type AccountBalanceInFiatResult,
  type FiatCurrency,
  type GetFiatPriceParams,
  type GetFiatPriceResult,
  type SocialProvider
} from './types';

describe('Utils Types', () => {
  describe('AccountBalanceParams', () => {
    it('should accept valid parameters', () => {
      const mockClient = {} as PannaClient;
      const mockChain = { id: 1 } as Chain;

      const params: AccountBalanceParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain
      };

      expect(params.address).toBe('0x1234567890123456789012345678901234567890');
      expect(params.client).toBe(mockClient);
      expect(params.chain).toBe(mockChain);
      expect(params.tokenAddress).toBeUndefined();
    });

    it('should accept optional tokenAddress', () => {
      const mockClient = {} as PannaClient;
      const mockChain = { id: 1 } as Chain;

      const params: AccountBalanceParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain,
        tokenAddress: '0x0987654321098765432109876543210987654321'
      };

      expect(params.tokenAddress).toBe(
        '0x0987654321098765432109876543210987654321'
      );
    });
  });

  describe('AccountBalanceResult', () => {
    it('should have all required properties', () => {
      const result: AccountBalanceResult = {
        value: BigInt('1000000000000000000'),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
        displayValue: '1.0'
      };

      expect(result.value).toBe(BigInt('1000000000000000000'));
      expect(result.decimals).toBe(18);
      expect(result.symbol).toBe('ETH');
      expect(result.name).toBe('Ethereum');
      expect(result.displayValue).toBe('1.0');
    });
  });

  describe('SocialProvider', () => {
    it('should accept all valid social providers', () => {
      const validProviders: SocialProvider[] = [
        'google',
        'apple',
        'facebook',
        'discord',
        'line',
        'x',
        'coinbase',
        'farcaster',
        'telegram',
        'github',
        'twitch',
        'steam',
        'guest',
        'backend',
        'email',
        'phone',
        'passkey',
        'wallet'
      ];

      validProviders.forEach((provider) => {
        const testProvider: SocialProvider = provider;
        expect(testProvider).toBe(provider);
      });

      expect(validProviders).toHaveLength(18);
    });
  });

  describe('FiatCurrency', () => {
    it('should accept all valid fiat currencies', () => {
      const validCurrencies: FiatCurrency[] = [
        'USD',
        'EUR',
        'GBP',
        'CAD',
        'AUD',
        'JPY',
        'NZD'
      ];

      validCurrencies.forEach((currency) => {
        const testCurrency: FiatCurrency = currency;
        expect(testCurrency).toBe(currency);
      });

      expect(validCurrencies).toHaveLength(7);
    });
  });

  describe('GetFiatPriceParams', () => {
    it('should accept valid parameters with all fields', () => {
      const mockClient = {} as PannaClient;
      const mockChain = { id: 1 } as Chain;

      const params: GetFiatPriceParams = {
        client: mockClient,
        chain: mockChain,
        tokenAddress: '0x1234567890123456789012345678901234567890',
        amount: 100,
        currency: 'USD'
      };

      expect(params.client).toBe(mockClient);
      expect(params.chain).toBe(mockChain);
      expect(params.tokenAddress).toBe(
        '0x1234567890123456789012345678901234567890'
      );
      expect(params.amount).toBe(100);
      expect(params.currency).toBe('USD');
    });

    it('should accept parameters with only required fields', () => {
      const mockClient = {} as PannaClient;

      const params: GetFiatPriceParams = {
        client: mockClient,
        amount: 1
      };

      expect(params.client).toBe(mockClient);
      expect(params.amount).toBe(1);
      expect(params.chain).toBeUndefined();
      expect(params.tokenAddress).toBeUndefined();
      expect(params.currency).toBeUndefined();
    });

    it('should accept fractional amounts', () => {
      const mockClient = {} as PannaClient;

      const params: GetFiatPriceParams = {
        client: mockClient,
        amount: 0.0001
      };

      expect(params.amount).toBe(0.0001);
    });
  });

  describe('GetFiatPriceResult', () => {
    it('should have all required properties', () => {
      const result: GetFiatPriceResult = {
        price: 3000.5,
        currency: 'USD'
      };

      expect(result.price).toBe(3000.5);
      expect(result.currency).toBe('USD');
    });

    it('should accept different currencies', () => {
      const currencies: FiatCurrency[] = [
        'USD',
        'EUR',
        'GBP',
        'CAD',
        'AUD',
        'JPY',
        'NZD'
      ];

      currencies.forEach((currency) => {
        const result: GetFiatPriceResult = {
          price: 1000,
          currency
        };

        expect(result.currency).toBe(currency);
      });
    });

    it('should accept fractional prices', () => {
      const result: GetFiatPriceResult = {
        price: 0.0003,
        currency: 'USD'
      };

      expect(result.price).toBe(0.0003);
    });
  });

  describe('AccountBalanceInFiatParams', () => {
    it('should accept valid parameters with all fields', () => {
      const mockClient = {} as PannaClient;
      const mockChain = { id: 1 } as Chain;

      const params: AccountBalanceInFiatParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain,
        tokenAddress: '0x1234567890123456789012345678901234567890',
        currency: 'USD'
      };

      expect(params.address).toBe('0x1234567890123456789012345678901234567890');
      expect(params.client).toBe(mockClient);
      expect(params.chain).toBe(mockChain);
      expect(params.tokenAddress).toBe(
        '0x1234567890123456789012345678901234567890'
      );
      expect(params.currency).toBe('USD');
    });

    it('should accept parameters with only required fields', () => {
      const mockClient = {} as PannaClient;

      const params: AccountBalanceInFiatParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient
      };

      expect(params.address).toBe('0x1234567890123456789012345678901234567890');
      expect(params.client).toBe(mockClient);
      expect(params.chain).toBeUndefined();
      expect(params.tokenAddress).toBeUndefined();
      expect(params.currency).toBeUndefined();
    });
  });

  describe('AccountBalanceInFiatResult', () => {
    it('should have all required properties', () => {
      const result: AccountBalanceInFiatResult = {
        token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
        tokenBalance: { value: BigInt(10e18), displayValue: '1' },
        fiatBalance: { amount: 3000.5, currency: 'USD' }
      };

      expect(result).not.toBeNull();

      expect(result).toHaveProperty('token');
      expect(result.token).not.toBeNull();
      expect(result.token.symbol).toBe('ETH');
      expect(result.token.name).toBe('Ethereum');
      expect(result.token.decimals).toBe(18);

      expect(result).toHaveProperty('tokenBalance');
      expect(result.tokenBalance).not.toBeNull();
      expect(result.tokenBalance.value).toBe(BigInt(10e18));
      expect(result.tokenBalance.displayValue).toBe('1');

      expect(result).toHaveProperty('fiatBalance');
      expect(result.fiatBalance).not.toBeNull();
      expect(result.fiatBalance.amount).toBeCloseTo(3000.5);
      expect(result.fiatBalance.currency).toBe('USD');
    });

    it('should accept different currencies', () => {
      const currencies: FiatCurrency[] = [
        'USD',
        'EUR',
        'GBP',
        'CAD',
        'AUD',
        'JPY',
        'NZD'
      ];

      currencies.forEach((currency) => {
        const result: AccountBalanceInFiatResult = {
          token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
          tokenBalance: { value: BigInt(10e18), displayValue: '1' },
          fiatBalance: { amount: 1000, currency }
        };

        expect(result.fiatBalance.currency).toBe(currency);
      });
    });

    it('should accept fractional prices', () => {
      const result: AccountBalanceInFiatResult = {
        token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
        tokenBalance: { value: BigInt(10e11), displayValue: '0.0000001' },
        fiatBalance: { amount: 0.0003, currency: 'USD' }
      };

      expect(result.fiatBalance.amount).toBeCloseTo(0.0003);
    });
  });
});
