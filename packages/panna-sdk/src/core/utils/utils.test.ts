import { type Chain } from 'thirdweb';
import * as thirdweb from 'thirdweb';
import * as thirdwebPay from 'thirdweb/pay';
import * as thirdwebWallets from 'thirdweb/wallets';
import * as thirdwebInApp from 'thirdweb/wallets/in-app';
import { lisk } from '../chains/chain-definitions/lisk';
import { type PannaClient } from '../client';
import { type FiatCurrency, type SocialProvider } from './types';
import { accountBalance, getFiatPrice, getSocialIcon } from './utils';

// Mock thirdweb modules
jest.mock('thirdweb');
jest.mock('thirdweb/pay');
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

  describe('getFiatPrice', () => {
    beforeEach(() => {
      (thirdweb.NATIVE_TOKEN_ADDRESS as unknown as string) =
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    });

    it('should call convertCryptoToFiat for native token with correct parameters', async () => {
      const mockResult = {
        result: 3000.5
      };

      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        client: mockClient,
        amount: 1,
        currency: 'USD' as FiatCurrency
      };

      const result = await getFiatPrice(params);

      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledTimes(1);
      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith({
        client: mockClient,
        fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        fromAmount: 1,
        chain: lisk,
        to: 'USD'
      });

      expect(result).toEqual({
        price: 3000.5,
        currency: 'USD'
      });
    });

    it('should call convertCryptoToFiat for ERC20 token with correct parameters', async () => {
      const mockResult = {
        result: 1.05
      };

      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
        mockResult
      );

      const tokenAddress = '0x1234567890123456789012345678901234567890';
      const params = {
        client: mockClient,
        chain: mockChain,
        tokenAddress,
        amount: 100,
        currency: 'EUR' as FiatCurrency
      };

      const result = await getFiatPrice(params);

      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledTimes(1);
      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith({
        client: mockClient,
        fromTokenAddress: tokenAddress,
        fromAmount: 100,
        chain: mockChain,
        to: 'EUR'
      });

      expect(result).toEqual({
        price: 1.05,
        currency: 'EUR'
      });
    });

    it('should use default chain (lisk) when not provided', async () => {
      const mockResult = {
        result: 2500.0
      };

      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        client: mockClient,
        amount: 2
      };

      const result = await getFiatPrice(params);

      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith(
        expect.objectContaining({
          chain: lisk
        })
      );

      expect(result.price).toBe(2500.0);
    });

    it('should use default currency (USD) when not provided', async () => {
      const mockResult = {
        result: 150.75
      };

      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        client: mockClient,
        amount: 0.05
      };

      const result = await getFiatPrice(params);

      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'USD'
        })
      );

      expect(result).toEqual({
        price: 150.75,
        currency: 'USD'
      });
    });

    it('should throw error when client is not provided', async () => {
      const params = {
        client: undefined as unknown as PannaClient,
        amount: 1,
        currency: 'USD' as FiatCurrency
      };

      await expect(getFiatPrice(params)).rejects.toThrow(
        'Client is required for getFiatPrice'
      );
    });

    it('should handle all supported fiat currencies', async () => {
      const currencies: FiatCurrency[] = [
        'USD',
        'EUR',
        'GBP',
        'CAD',
        'AUD',
        'JPY',
        'NZD'
      ];

      for (const currency of currencies) {
        const mockResult = {
          result: 1000
        };

        (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
          mockResult
        );

        const params = {
          client: mockClient,
          amount: 1,
          currency
        };

        const result = await getFiatPrice(params);

        expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith(
          expect.objectContaining({
            to: currency
          })
        );

        expect(result.currency).toBe(currency);
      }
    });

    it('should handle fractional amounts correctly', async () => {
      const mockResult = {
        result: 0.0003
      };

      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        client: mockClient,
        tokenAddress: '0x1234567890123456789012345678901234567890',
        amount: 0.0001
      };

      const result = await getFiatPrice(params);

      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith(
        expect.objectContaining({
          fromAmount: 0.0001
        })
      );

      expect(result.price).toBe(0.0003);
    });

    it('should handle errors from convertCryptoToFiat', async () => {
      const mockError = new Error('Failed to fetch price');
      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockRejectedValue(
        mockError
      );

      const params = {
        client: mockClient,
        amount: 1
      };

      await expect(getFiatPrice(params)).rejects.toThrow(
        'Failed to fetch price'
      );
    });

    it('should handle zero amount', async () => {
      const mockResult = {
        result: 0
      };

      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        client: mockClient,
        amount: 0
      };

      const result = await getFiatPrice(params);

      expect(result.price).toBe(0);
    });
  });
});
