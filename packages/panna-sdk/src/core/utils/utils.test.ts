import { type Chain } from 'thirdweb';
import * as thirdweb from 'thirdweb';
import * as thirdwebPay from 'thirdweb/pay';
import * as thirdwebWallets from 'thirdweb/wallets';
import * as thirdwebInApp from 'thirdweb/wallets/in-app';
import { liskSepolia } from '../chains';
import { lisk } from '../chains/chain-definitions/lisk';
import { type PannaClient } from '../client';
import { DEFAULT_CURRENCY, NATIVE_TOKEN_ADDRESS } from '../defaults';
import {
  type FiatCurrency,
  type SocialProvider,
  type AccountBalanceResult,
  type GetFiatPriceResult,
  type AccountBalancesInFiatParams
} from './types';
import {
  accountBalance,
  accountBalanceInFiat,
  accountBalancesInFiat,
  getFiatPrice,
  getSocialIcon,
  toWei
} from './utils';
import * as utils from './utils';
import {
  fixture_convertBalanceToFiat,
  fixture_fiatBalanceSample,
  fixture_getPriceInCurrency,
  fixture_getTotalValue
} from './utils.fixture.test';

// Mock thirdweb modules
jest.mock('thirdweb');
jest.mock('thirdweb/pay');
jest.mock('thirdweb/wallets');
jest.mock('thirdweb/wallets/in-app');

describe('Utils - Unit Tests', () => {
  const mockClient = {} as PannaClient;
  const mockChain = { id: 1 } as Chain;

  jest
    .spyOn(thirdweb.Bridge, 'tokens')
    .mockResolvedValue(fixture_fiatBalanceSample);

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

    it('should throw error for invalid address', async () => {
      const params = {
        address: '0xinvalid',
        client: mockClient,
        chain: mockChain
      };

      await expect(accountBalance(params)).rejects.toThrow(
        'Invalid address format'
      );
    });

    it('should throw error for invalid token address', async () => {
      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain,
        tokenAddress: 'not-an-address'
      };

      await expect(accountBalance(params)).rejects.toThrow(
        'Invalid token address format'
      );
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
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
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
        currency: DEFAULT_CURRENCY
      };

      const result = await getFiatPrice(params);

      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledTimes(1);
      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith({
        client: mockClient,
        fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        fromAmount: 1,
        chain: lisk,
        to: DEFAULT_CURRENCY
      });

      expect(result).toEqual({
        price: 3000.5,
        currency: DEFAULT_CURRENCY
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
          to: DEFAULT_CURRENCY
        })
      );

      expect(result).toEqual({
        price: 150.75,
        currency: DEFAULT_CURRENCY
      });
    });

    it('should throw error when client is not provided', async () => {
      const params = {
        client: undefined as unknown as PannaClient,
        amount: 1,
        currency: DEFAULT_CURRENCY
      };

      await expect(getFiatPrice(params)).rejects.toThrow(
        'Client is required for getFiatPrice'
      );
    });

    it('should handle all supported fiat currencies', async () => {
      const currencies: FiatCurrency[] = [
        DEFAULT_CURRENCY,
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

    it('should throw error for invalid token address', async () => {
      const params = {
        client: mockClient,
        tokenAddress: 'invalid-address',
        amount: 1
      };

      await expect(getFiatPrice(params)).rejects.toThrow(
        'Invalid token address format'
      );
    });

    it('should accept undefined token address (for native token)', async () => {
      const mockResult = {
        result: 3000.5
      };

      (thirdwebPay.convertCryptoToFiat as jest.Mock).mockResolvedValue(
        mockResult
      );

      const params = {
        client: mockClient,
        amount: 1
      };

      const result = await getFiatPrice(params);

      expect(result.price).toBe(3000.5);
      expect(thirdwebPay.convertCryptoToFiat).toHaveBeenCalledWith(
        expect.objectContaining({
          fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        })
      );
    });
  });

  describe('accountBalanceInFiat', () => {
    it('should call accountBalanceInFiat with correct parameters', async () => {
      const mockAccountBalance = {
        value: BigInt('1000000000000000000'),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
        displayValue: '1.0'
      } as AccountBalanceResult;
      jest.spyOn(utils, 'accountBalance').mockResolvedValue(mockAccountBalance);

      const mockFiatPrice = {
        price: 3000.5,
        currency: DEFAULT_CURRENCY
      } as GetFiatPriceResult;
      jest.spyOn(utils, 'getFiatPrice').mockResolvedValue(mockFiatPrice);

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain
      };

      const result = await accountBalanceInFiat(params);

      expect(utils.accountBalance).toHaveBeenCalledTimes(1);
      expect(utils.accountBalance).toHaveBeenCalledWith({
        address: params.address,
        client: params.client,
        chain: params.chain,
        tokenAddress: undefined
      });

      expect(utils.getFiatPrice).toHaveBeenCalledTimes(1);
      expect(utils.getFiatPrice).toHaveBeenCalledWith({
        client: params.client,
        chain: params.chain,
        amount: Number(mockAccountBalance.displayValue),
        tokenAddress: undefined,
        currency: undefined
      });

      expect(result.fiatBalance).toEqual({
        amount: mockFiatPrice.price,
        currency: mockFiatPrice.currency
      });
    });

    it('should call accountBalance with token address when provided', async () => {
      const mockAccountBalance = {
        value: BigInt('5000000'),
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin',
        displayValue: '5.0'
      } as AccountBalanceResult;
      jest.spyOn(utils, 'accountBalance').mockResolvedValue(mockAccountBalance);

      const mockFiatPrice = {
        price: 5,
        currency: DEFAULT_CURRENCY
      } as GetFiatPriceResult;
      jest.spyOn(utils, 'getFiatPrice').mockResolvedValue(mockFiatPrice);

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain,
        tokenAddress: '0x0987654321098765432109876543210987654321'
      };

      const result = await accountBalanceInFiat(params);

      expect(utils.accountBalance).toHaveBeenCalledTimes(1);
      expect(utils.accountBalance).toHaveBeenCalledWith({
        address: params.address,
        client: params.client,
        chain: params.chain,
        tokenAddress: params.tokenAddress
      });

      expect(utils.getFiatPrice).toHaveBeenCalledTimes(1);
      expect(utils.getFiatPrice).toHaveBeenCalledWith({
        client: params.client,
        chain: params.chain,
        amount: Number(mockAccountBalance.displayValue),
        tokenAddress: params.tokenAddress,
        currency: undefined
      });

      expect(result.fiatBalance).toEqual({
        amount: mockFiatPrice.price,
        currency: mockFiatPrice.currency
      });
    });

    it('should handle errors from accountBalance', async () => {
      const mockError = new Error('Network error');
      jest.spyOn(utils, 'accountBalance').mockRejectedValue(mockError);

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain
      };

      await expect(accountBalanceInFiat(params)).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle zero balance correctly', async () => {
      const mockAccountBalance = {
        value: BigInt('0'),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
        displayValue: '0.0'
      };
      jest.spyOn(utils, 'accountBalance').mockResolvedValue(mockAccountBalance);

      const mockFiatPrice = {
        price: 0,
        currency: DEFAULT_CURRENCY
      } as GetFiatPriceResult;
      jest.spyOn(utils, 'getFiatPrice').mockResolvedValue(mockFiatPrice);

      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain
      };

      const result = await accountBalanceInFiat(params);

      expect(result.fiatBalance).toEqual({
        amount: mockFiatPrice.price,
        currency: mockFiatPrice.currency
      });
      expect(result.fiatBalance.amount).toBe(0);
    });

    it('should throw error for invalid address', async () => {
      const params = {
        address: '0xinvalid',
        client: mockClient,
        chain: mockChain
      };

      await expect(accountBalanceInFiat(params)).rejects.toThrow(
        'Invalid address format'
      );
    });

    it('should throw error for invalid token address', async () => {
      const params = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain,
        tokenAddress: 'not-an-address'
      };

      await expect(accountBalanceInFiat(params)).rejects.toThrow(
        'Invalid token address format'
      );
    });
  });

  describe('accountBalancesInFiat', () => {
    const validAddress = '0x1234567890123456789012345678901234567890';

    beforeEach(() => {
      (thirdweb.NATIVE_TOKEN_ADDRESS as unknown as string) =
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    });

    it('should calculate balances for single native token', async () => {
      const mockAccountBalanceResult: AccountBalanceResult = {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        value: BigInt('1000000000000000000'), // 1 ETH
        displayValue: '1.0'
      };

      const expectedResult = fixture_convertBalanceToFiat(
        [mockAccountBalanceResult],
        fixture_fiatBalanceSample
      );

      jest
        .spyOn(utils, 'accountBalance')
        .mockResolvedValue(mockAccountBalanceResult);

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [NATIVE_TOKEN_ADDRESS], // Native token
        currency: DEFAULT_CURRENCY
      };

      const result = await accountBalancesInFiat(params);

      expect(result).toEqual({
        totalValue: {
          amount: expectedResult[0].fiatBalance.amount,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: [expectedResult[0]]
      });
    });

    it('should calculate balances for multiple tokens', async () => {
      const mockAccountBalanceResult: AccountBalanceResult[] = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          value: BigInt('1000000000000000000'), // 1 ETH
          displayValue: '1.0'
        },
        {
          symbol: 'USDC.e',
          name: 'USD Coin',
          decimals: 6,
          value: BigInt('1000000000'), // 1000 USDC
          displayValue: '1000.0'
        },
        {
          symbol: 'USDT',
          name: 'Tether',
          decimals: 6,
          value: BigInt('500000000'), // 500 USDT
          displayValue: '500.0'
        }
      ];

      const mockResults = fixture_convertBalanceToFiat(
        mockAccountBalanceResult,
        fixture_fiatBalanceSample
      );
      const totalValue = fixture_getTotalValue(mockResults);

      // Mock accountBalanceInFiat to return different results for each call
      let callCount = 0;
      jest.spyOn(utils, 'accountBalance').mockImplementation(() => {
        const result = mockAccountBalanceResult[callCount];
        callCount++;
        return Promise.resolve(result);
      });

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [
          NATIVE_TOKEN_ADDRESS, // Native token
          '0x0987654321098765432109876543210987654321',
          '0x1111111111111111111111111111111111111111'
        ],
        currency: DEFAULT_CURRENCY
      };

      const result = await accountBalancesInFiat(params);

      expect(result.totalValue).toEqual({
        amount: totalValue, // 3000 + 1000 + 500
        currency: DEFAULT_CURRENCY
      });

      expect(result.tokenBalances).toHaveLength(3);
      expect(result.tokenBalances[0].fiatBalance.amount).toBe(
        fixture_getPriceInCurrency(
          mockAccountBalanceResult[0].symbol,
          mockAccountBalanceResult[0].value,
          fixture_fiatBalanceSample
        )
      );
      expect(result.tokenBalances[1].fiatBalance.amount).toBe(
        fixture_getPriceInCurrency(
          mockAccountBalanceResult[1].symbol,
          mockAccountBalanceResult[1].value,
          fixture_fiatBalanceSample
        )
      );
      expect(result.tokenBalances[2].fiatBalance.amount).toBe(
        fixture_getPriceInCurrency(
          mockAccountBalanceResult[2].symbol,
          mockAccountBalanceResult[2].value,
          fixture_fiatBalanceSample
        )
      );
    });

    it('should handle empty token array', async () => {
      const accountBalanceInFiatSpy = jest.spyOn(utils, 'accountBalance');

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [],
        currency: DEFAULT_CURRENCY
      };

      const result = await accountBalancesInFiat(params);

      expect(result).toEqual({
        totalValue: {
          amount: 0,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: []
      });

      expect(accountBalanceInFiatSpy).not.toHaveBeenCalled();
    });

    it('should use default USD currency when not specified', async () => {
      const accountBalanceResult: AccountBalanceResult = {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        value: BigInt('1000000000000000000'),
        displayValue: '1.0'
      };

      jest
        .spyOn(utils, 'accountBalance')
        .mockResolvedValue(accountBalanceResult);

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [NATIVE_TOKEN_ADDRESS]
        // currency not specified
      };

      const result = await accountBalancesInFiat(params);

      expect(result.totalValue.currency).toBe(DEFAULT_CURRENCY);
      expect(result.tokenBalances[0].fiatBalance.currency).toBe(
        DEFAULT_CURRENCY
      );
    });

    it('should support different currencies', async () => {
      const accountBalanceResult: AccountBalanceResult = {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        value: BigInt('1000000000000000000'),
        displayValue: '1.0'
      };

      jest
        .spyOn(utils, 'accountBalance')
        .mockResolvedValue(accountBalanceResult);

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [NATIVE_TOKEN_ADDRESS],
        currency: 'EUR'
      };

      const result = await accountBalancesInFiat(params);

      expect(result.totalValue.currency).toBe('EUR');
    });

    it('should throw error for invalid wallet address', async () => {
      const params: AccountBalancesInFiatParams = {
        address: '0xinvalid',
        client: mockClient,
        chain: mockChain,
        tokens: [NATIVE_TOKEN_ADDRESS]
      };

      await expect(accountBalancesInFiat(params)).rejects.toThrow(
        'Invalid address format'
      );
    });

    it('should return error for invalid token address', async () => {
      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: ['invalid-token-address']
      };

      const result = await accountBalancesInFiat(params);

      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0]).toEqual({
        token: { address: 'invalid-token-address' },
        error: 'Invalid token address format: invalid-token-address'
      });
      expect(result.tokenBalances).toHaveLength(0);
      expect(result.totalValue.amount).toBe(0);
    });

    it('should handle errors from balance fetching with context', async () => {
      const mockError = new Error('Network error');
      jest.spyOn(utils, 'accountBalance').mockRejectedValue(mockError);

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: ['0x0987654321098765432109876543210987654321']
      };

      const result = await accountBalancesInFiat(params);

      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0]).toEqual({
        token: { address: '0x0987654321098765432109876543210987654321' },
        error:
          'Failed to get balance for 0x0987654321098765432109876543210987654321: Network error'
      });
      expect(result.tokenBalances).toHaveLength(0);
      expect(result.totalValue.amount).toBe(0);
    });

    it('should handle errors for native token with proper context', async () => {
      const mockError = new Error('RPC error');
      jest.spyOn(utils, 'accountBalance').mockRejectedValue(mockError);

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [NATIVE_TOKEN_ADDRESS] // Native token
      };

      const result = await accountBalancesInFiat(params);

      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0]).toEqual({
        token: { address: NATIVE_TOKEN_ADDRESS },
        error: 'Failed to get balance for native token: RPC error'
      });
      expect(result.tokenBalances).toHaveLength(0);
      expect(result.totalValue.amount).toBe(0);
    });

    it('should calculate correct total with fractional amounts', async () => {
      const mockAccountBalanceResult: AccountBalanceResult[] = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          value: BigInt('1500000000000000000'), // 1.5 ETH
          displayValue: '1.5'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          value: BigInt('2505500000'), // 2505.5 USDC
          displayValue: '2505.5'
        }
      ];

      const mockResults = fixture_convertBalanceToFiat(
        mockAccountBalanceResult,
        fixture_fiatBalanceSample
      );

      jest.spyOn(utils, 'accountBalance').mockImplementation(() => {
        return Promise.resolve(mockAccountBalanceResult.shift()!);
      });

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [
          NATIVE_TOKEN_ADDRESS,
          '0x0987654321098765432109876543210987654321'
        ]
      };

      const result = await accountBalancesInFiat(params);

      expect(result.totalValue.amount).toBe(fixture_getTotalValue(mockResults));
    });

    it('should handle mixed success and failure scenarios', async () => {
      const accountBalanceResult = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          value: BigInt('1000000000000000000'), // 1 ETH
          displayValue: '1.0'
        },
        {
          symbol: 'USDT',
          name: 'Tether',
          decimals: 6,
          value: BigInt('500000000'), // 500 USDT
          displayValue: '500.0'
        }
      ];
      const expectedResult = fixture_convertBalanceToFiat(
        accountBalanceResult,
        fixture_fiatBalanceSample
      );

      // Mock accountBalance to return different results for each call
      const mockResolvedValuesAccountBalance = [
        accountBalanceResult[0],
        null,
        accountBalanceResult[1]
      ];
      jest.spyOn(utils, 'accountBalance').mockImplementation(() => {
        const result = mockResolvedValuesAccountBalance.shift();
        if (!result) {
          return Promise.reject(new Error('Token not found'));
        }
        return Promise.resolve(result);
      });

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [
          NATIVE_TOKEN_ADDRESS, // Native token - succeeds
          '0x0987654321098765432109876543210987654321', // Fails
          '0x1111111111111111111111111111111111111111' // Succeeds
        ]
      };

      const result = await accountBalancesInFiat(params);

      // Should have 2 successful balances
      expect(result.tokenBalances).toHaveLength(2);
      expect(result.tokenBalances[0].fiatBalance.amount).toBe(
        expectedResult[0].fiatBalance.amount
      );
      expect(result.tokenBalances[1].fiatBalance.amount).toBe(
        expectedResult[1].fiatBalance.amount
      );

      // Should have 1 error
      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0]).toEqual({
        token: { address: '0x0987654321098765432109876543210987654321' },
        error:
          'Failed to get balance for 0x0987654321098765432109876543210987654321: Token not found'
      });

      // Total should only include successful balances
      expect(result.totalValue.amount).toBe(
        fixture_getTotalValue(expectedResult)
      );
    });

    it('should handle all tokens failing', async () => {
      jest
        .spyOn(utils, 'accountBalanceInFiat')
        .mockRejectedValue(new Error('Service unavailable'));

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [
          NATIVE_TOKEN_ADDRESS,
          '0x0987654321098765432109876543210987654321',
          '0x1111111111111111111111111111111111111111'
        ]
      };

      const result = await accountBalancesInFiat(params);

      // No successful balances
      expect(result.tokenBalances).toHaveLength(0);
      expect(result.totalValue.amount).toBe(0);

      // All should be errors
      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(3);
      expect(result.errors![0].error).toContain(
        'Failed to get balance for native token'
      );
      expect(result.errors![1].error).toContain(
        'Failed to get balance for 0x0987654321098765432109876543210987654321'
      );
      expect(result.errors![2].error).toContain(
        'Failed to get balance for 0x1111111111111111111111111111111111111111'
      );
    });

    it('should handle mix of invalid addresses and API failures', async () => {
      const accountBalanceResult: AccountBalanceResult = {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        value: BigInt('1000000000000000000'), // 1 ETH
        displayValue: '1.0'
      };
      jest.spyOn(utils, 'accountBalance').mockImplementation((params) => {
        // Only native token succeeds
        if (!params.tokenAddress) {
          return Promise.resolve(accountBalanceResult);
        }
        return Promise.reject(new Error('API timeout'));
      });

      const expectedResult = fixture_convertBalanceToFiat(
        [accountBalanceResult],
        fixture_fiatBalanceSample
      );

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [
          NATIVE_TOKEN_ADDRESS, // Native token - succeeds
          'not-valid', // Invalid address
          '0x0987654321098765432109876543210987654321' // Valid but API fails
        ]
      };

      const result = await accountBalancesInFiat(params);

      // Only native token succeeds
      expect(result.tokenBalances).toHaveLength(1);
      expect(result.tokenBalances[0].fiatBalance.amount).toBe(
        expectedResult[0].fiatBalance.amount
      );

      // 2 errors
      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(2);
      expect(result.errors![0]).toEqual({
        token: { address: 'not-valid' },
        error: 'Invalid token address format: not-valid'
      });
      expect(result.errors![1].error).toContain('API timeout');

      expect(result.totalValue.amount).toBe(
        expectedResult[0].fiatBalance.amount
      );
    });

    it('should not include errors property when all succeed', async () => {
      const accountBalanceResult: AccountBalanceResult = {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        value: BigInt('1000000000000000000'), // 1 ETH
        displayValue: '1.0'
      };

      jest
        .spyOn(utils, 'accountBalance')
        .mockResolvedValue(accountBalanceResult);

      const expectedResult = fixture_convertBalanceToFiat(
        [accountBalanceResult],
        fixture_fiatBalanceSample
      );

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: mockChain,
        tokens: [NATIVE_TOKEN_ADDRESS]
      };

      const result = await accountBalancesInFiat(params);

      // Should not have errors property
      expect(result.errors).toBeUndefined();
      expect(result.tokenBalances).toHaveLength(1);
      expect(result.totalValue.amount).toBe(
        expectedResult[0].fiatBalance.amount
      );
    });

    it('should use default chain (lisk) when liskSepolia is provided', async () => {
      const mockAccountBalanceResult: AccountBalanceResult = {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        value: BigInt('1000000000000000000'), // 1 ETH
        displayValue: '1.0'
      };

      jest
        .spyOn(utils, 'accountBalance')
        .mockResolvedValue(mockAccountBalanceResult);

      const params: AccountBalancesInFiatParams = {
        address: validAddress,
        client: mockClient,
        chain: liskSepolia, // Using liskSepolia
        tokens: [NATIVE_TOKEN_ADDRESS],
        currency: DEFAULT_CURRENCY
      };

      const result = await accountBalancesInFiat(params);

      expect(thirdweb.Bridge.tokens).toHaveBeenCalledWith(
        expect.objectContaining({
          chainId: lisk.id
        })
      );
      expect(result.tokenBalances[0].token.symbol).toBe('ETH');
      expect(result.totalValue.currency).toBe(DEFAULT_CURRENCY);
    });
  });

  describe('toWei', () => {
    it('should convert string tokens to wei bigint', () => {
      const result = toWei('1');
      expect(result).toBe(BigInt('1000000000000000000'));
      expect(typeof result).toBe('bigint');
    });

    it('should handle decimal values', () => {
      const result = toWei('1.5');
      expect(result).toBe(BigInt('1500000000000000000'));
    });

    it('should handle small decimal values', () => {
      const result = toWei('0.001');
      expect(result).toBe(BigInt('1000000000000000'));
    });

    it('should handle zero', () => {
      const result = toWei('0');
      expect(result).toBe(BigInt('0'));
    });
  });
});
