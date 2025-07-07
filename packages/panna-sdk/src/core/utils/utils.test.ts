import { type Chain } from 'thirdweb';
import * as thirdwebWallets from 'thirdweb/wallets';
import * as thirdwebInApp from 'thirdweb/wallets/in-app';
import { type PannaClient } from '../client';
import { type SocialProvider } from './types';
import { accountBalance, getSocialIcon } from './utils';

// Mock thirdweb modules
jest.mock('thirdweb/wallets');
jest.mock('thirdweb/wallets/in-app');

describe('Utils - Unit Tests', () => {
  const mockClient = {} as PannaClient;
  const mockChain = { id: 1 } as Chain;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('accountBalance', () => {
    it('should call getWalletBalance with correct parameters', async () => {
      const mockBalance = {
        value: BigInt('1000000000000000000'),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
        displayValue: '1.0'
      };

      (thirdwebWallets.getWalletBalance as jest.Mock).mockResolvedValue(
        mockBalance
      );

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain
      };

      const result = await accountBalance(params);

      expect(thirdwebWallets.getWalletBalance).toHaveBeenCalledTimes(1);
      expect(thirdwebWallets.getWalletBalance).toHaveBeenCalledWith({
        address: params.address,
        client: params.client,
        chain: params.chain,
        tokenAddress: undefined
      });

      expect(result).toEqual(mockBalance);
    });

    it('should call getWalletBalance with token address when provided', async () => {
      const mockBalance = {
        value: BigInt('5000000'),
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin',
        displayValue: '5.0'
      };

      (thirdwebWallets.getWalletBalance as jest.Mock).mockResolvedValue(
        mockBalance
      );

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain,
        tokenAddress: '0x0987654321098765432109876543210987654321'
      };

      const result = await accountBalance(params);

      expect(thirdwebWallets.getWalletBalance).toHaveBeenCalledTimes(1);
      expect(thirdwebWallets.getWalletBalance).toHaveBeenCalledWith({
        address: params.address,
        client: params.client,
        chain: params.chain,
        tokenAddress: params.tokenAddress
      });

      expect(result).toEqual(mockBalance);
    });

    it('should handle errors from getWalletBalance', async () => {
      const mockError = new Error('Network error');
      (thirdwebWallets.getWalletBalance as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain
      };

      await expect(accountBalance(params)).rejects.toThrow('Network error');
    });

    it('should handle zero balance correctly', async () => {
      const mockBalance = {
        value: BigInt('0'),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
        displayValue: '0.0'
      };

      (thirdwebWallets.getWalletBalance as jest.Mock).mockResolvedValue(
        mockBalance
      );

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain
      };

      const result = await accountBalance(params);

      expect(result).toEqual(mockBalance);
      expect(result.value).toBe(BigInt('0'));
    });
  });

  describe('getSocialIcon', () => {
    it('should call thirdweb getSocialIcon with correct provider', () => {
      const mockIconUri = 'https://example.com/icons/google.svg';
      (thirdwebInApp.getSocialIcon as jest.Mock).mockReturnValue(mockIconUri);

      const result = getSocialIcon('google');

      expect(thirdwebInApp.getSocialIcon).toHaveBeenCalledTimes(1);
      expect(thirdwebInApp.getSocialIcon).toHaveBeenCalledWith('google');
      expect(result).toBe(mockIconUri);
    });

    it('should handle all supported social providers', () => {
      const providers: SocialProvider[] = [
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

      providers.forEach((provider) => {
        const mockUri = `https://example.com/icons/${provider}.svg`;
        (thirdwebInApp.getSocialIcon as jest.Mock).mockReturnValue(mockUri);

        const result = getSocialIcon(provider);

        expect(thirdwebInApp.getSocialIcon).toHaveBeenCalledWith(provider);
        expect(result).toBe(mockUri);
      });

      expect(thirdwebInApp.getSocialIcon).toHaveBeenCalledTimes(
        providers.length
      );
    });

    it('should return empty string when thirdweb returns empty', () => {
      (thirdwebInApp.getSocialIcon as jest.Mock).mockReturnValue('');

      const result = getSocialIcon('google');

      expect(result).toBe('');
    });

    it('should handle undefined return from thirdweb', () => {
      (thirdwebInApp.getSocialIcon as jest.Mock).mockReturnValue(undefined);

      const result = getSocialIcon('google');

      expect(result).toBeUndefined();
    });
  });
});
