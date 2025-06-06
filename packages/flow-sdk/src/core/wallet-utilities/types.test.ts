import { type Chain } from 'thirdweb';
import { type FlowClient } from '../client';
import {
  type AccountBalanceParams,
  type AccountBalanceResult,
  type SocialProvider
} from './types';

describe('Wallet Utilities Types', () => {
  describe('AccountBalanceParams', () => {
    it('should accept valid parameters', () => {
      const mockClient = {} as FlowClient;
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
      const mockClient = {} as FlowClient;
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
});
