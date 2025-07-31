import { type Chain } from 'thirdweb';
import { type PannaClient } from '../client';
import { DEFAULT_CURRENCY } from '../defaults';
import {
  type AccountBalanceParams,
  type AccountBalanceResult,
  type AccountBalanceInFiatParams,
  type AccountBalanceInFiatResult,
  type AccountBalancesInFiatParams,
  type AccountBalancesInFiatResult,
  type FiatCurrency,
  type GetFiatPriceParams,
  type GetFiatPriceResult,
  type SocialProvider,
  type TokenBalanceError
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
        DEFAULT_CURRENCY,
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
        currency: DEFAULT_CURRENCY
      };

      expect(params.client).toBe(mockClient);
      expect(params.chain).toBe(mockChain);
      expect(params.tokenAddress).toBe(
        '0x1234567890123456789012345678901234567890'
      );
      expect(params.amount).toBe(100);
      expect(params.currency).toBe(DEFAULT_CURRENCY);
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
        currency: DEFAULT_CURRENCY
      };

      expect(result.price).toBe(3000.5);
      expect(result.currency).toBe(DEFAULT_CURRENCY);
    });

    it('should accept different currencies', () => {
      const currencies: FiatCurrency[] = [
        DEFAULT_CURRENCY,
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
        currency: DEFAULT_CURRENCY
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
        currency: DEFAULT_CURRENCY
      };

      expect(params.address).toBe('0x1234567890123456789012345678901234567890');
      expect(params.client).toBe(mockClient);
      expect(params.chain).toBe(mockChain);
      expect(params.tokenAddress).toBe(
        '0x1234567890123456789012345678901234567890'
      );
      expect(params.currency).toBe(DEFAULT_CURRENCY);
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
        fiatBalance: { amount: 3000.5, currency: DEFAULT_CURRENCY }
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
      expect(result.fiatBalance.currency).toBe(DEFAULT_CURRENCY);
    });

    it('should accept different currencies', () => {
      const currencies: FiatCurrency[] = [
        DEFAULT_CURRENCY,
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
        fiatBalance: { amount: 0.0003, currency: DEFAULT_CURRENCY }
      };

      expect(result.fiatBalance.amount).toBeCloseTo(0.0003);
    });
  });

  describe('AccountBalancesInFiatParams', () => {
    it('should accept valid parameters with all fields', () => {
      const mockClient = {} as PannaClient;
      const mockChain = { id: 1 } as Chain;

      const params: AccountBalancesInFiatParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        chain: mockChain,
        tokens: [
          {}, // Native token
          { address: '0x0987654321098765432109876543210987654321' },
          { address: '0x1111111111111111111111111111111111111111' }
        ],
        currency: 'EUR'
      };

      expect(params.address).toBe('0x1234567890123456789012345678901234567890');
      expect(params.client).toBe(mockClient);
      expect(params.chain).toBe(mockChain);
      expect(params.tokens).toHaveLength(3);
      expect(params.tokens[0]).toEqual({});
      expect(params.tokens[1].address).toBe(
        '0x0987654321098765432109876543210987654321'
      );
      expect(params.tokens[2].address).toBe(
        '0x1111111111111111111111111111111111111111'
      );
      expect(params.currency).toBe('EUR');
    });

    it('should accept parameters with only required fields', () => {
      const mockClient = {} as PannaClient;

      const params: AccountBalancesInFiatParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        tokens: []
      };

      expect(params.address).toBe('0x1234567890123456789012345678901234567890');
      expect(params.client).toBe(mockClient);
      expect(params.chain).toBeUndefined();
      expect(params.tokens).toEqual([]);
      expect(params.currency).toBeUndefined();
    });

    it('should accept empty tokens array', () => {
      const mockClient = {} as PannaClient;

      const params: AccountBalancesInFiatParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        tokens: []
      };

      expect(params.tokens).toHaveLength(0);
    });

    it('should accept mixed token types', () => {
      const mockClient = {} as PannaClient;

      const params: AccountBalancesInFiatParams = {
        address: '0x1234567890123456789012345678901234567890',
        client: mockClient,
        tokens: [
          {}, // Native token (empty object)
          { address: undefined }, // Native token (explicit undefined)
          { address: '0x0987654321098765432109876543210987654321' } // ERC20 token
        ]
      };

      expect(params.tokens).toHaveLength(3);
      expect(params.tokens[0]).toEqual({});
      expect(params.tokens[1].address).toBeUndefined();
      expect(params.tokens[2].address).toBe(
        '0x0987654321098765432109876543210987654321'
      );
    });
  });

  describe('AccountBalancesInFiatResult', () => {
    it('should have all required properties', () => {
      const result: AccountBalancesInFiatResult = {
        totalValue: {
          amount: 5250.75,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: [
          {
            token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
            tokenBalance: {
              value: BigInt('1000000000000000000'),
              displayValue: '1.0'
            },
            fiatBalance: { amount: 3000.0, currency: DEFAULT_CURRENCY }
          },
          {
            token: {
              address: '0x0987654321098765432109876543210987654321',
              symbol: 'USDC',
              name: 'USD Coin',
              decimals: 6
            },
            tokenBalance: {
              value: BigInt('1000000000'),
              displayValue: '1000.0'
            },
            fiatBalance: { amount: 1000.0, currency: DEFAULT_CURRENCY }
          },
          {
            token: {
              address: '0x1111111111111111111111111111111111111111',
              symbol: 'DAI',
              name: 'Dai Stablecoin',
              decimals: 18
            },
            tokenBalance: {
              value: BigInt('1250750000000000000000'),
              displayValue: '1250.75'
            },
            fiatBalance: { amount: 1250.75, currency: DEFAULT_CURRENCY }
          }
        ]
      };

      expect(result).not.toBeNull();

      expect(result).toHaveProperty('totalValue');
      expect(result.totalValue).not.toBeNull();
      expect(result.totalValue.amount).toBe(5250.75);
      expect(result.totalValue.currency).toBe(DEFAULT_CURRENCY);

      expect(result).toHaveProperty('tokenBalances');
      expect(result.tokenBalances).toHaveLength(3);

      // Check first token (native ETH)
      expect(result.tokenBalances[0].token.symbol).toBe('ETH');
      expect(result.tokenBalances[0].token.address).toBeUndefined();
      expect(result.tokenBalances[0].fiatBalance.amount).toBe(3000.0);

      // Check second token (USDC)
      expect(result.tokenBalances[1].token.symbol).toBe('USDC');
      expect(result.tokenBalances[1].token.address).toBe(
        '0x0987654321098765432109876543210987654321'
      );
      expect(result.tokenBalances[1].fiatBalance.amount).toBe(1000.0);

      // Check third token (DAI)
      expect(result.tokenBalances[2].token.symbol).toBe('DAI');
      expect(result.tokenBalances[2].token.address).toBe(
        '0x1111111111111111111111111111111111111111'
      );
      expect(result.tokenBalances[2].fiatBalance.amount).toBe(1250.75);
    });

    it('should accept empty token balances', () => {
      const result: AccountBalancesInFiatResult = {
        totalValue: {
          amount: 0,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: []
      };

      expect(result.tokenBalances).toHaveLength(0);
      expect(result.totalValue.amount).toBe(0);
    });

    it('should accept different currencies', () => {
      const currencies: FiatCurrency[] = [
        DEFAULT_CURRENCY,
        'EUR',
        'GBP',
        'CAD',
        'AUD',
        'JPY',
        'NZD'
      ];

      currencies.forEach((currency) => {
        const result: AccountBalancesInFiatResult = {
          totalValue: {
            amount: 1000,
            currency
          },
          tokenBalances: [
            {
              token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
              tokenBalance: {
                value: BigInt('1000000000000000000'),
                displayValue: '1.0'
              },
              fiatBalance: { amount: 1000, currency }
            }
          ]
        };

        expect(result.totalValue.currency).toBe(currency);
        expect(result.tokenBalances[0].fiatBalance.currency).toBe(currency);
      });
    });

    it('should accept fractional amounts', () => {
      const result: AccountBalancesInFiatResult = {
        totalValue: {
          amount: 0.0003456,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: [
          {
            token: { symbol: 'SHIB', name: 'Shiba Inu', decimals: 18 },
            tokenBalance: {
              value: BigInt('123456789000000000000000'),
              displayValue: '123456.789'
            },
            fiatBalance: { amount: 0.0003456, currency: DEFAULT_CURRENCY }
          }
        ]
      };

      expect(result.totalValue.amount).toBeCloseTo(0.0003456);
      expect(result.tokenBalances[0].fiatBalance.amount).toBeCloseTo(0.0003456);
    });

    it('should correctly sum total value', () => {
      const result: AccountBalancesInFiatResult = {
        totalValue: {
          amount: 7006.25, // 4500.75 + 2505.5
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: [
          {
            token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
            tokenBalance: {
              value: BigInt('1500000000000000000'),
              displayValue: '1.5'
            },
            fiatBalance: { amount: 4500.75, currency: DEFAULT_CURRENCY }
          },
          {
            token: {
              address: '0x0987654321098765432109876543210987654321',
              symbol: 'USDC',
              name: 'USD Coin',
              decimals: 6
            },
            tokenBalance: {
              value: BigInt('2505500000'),
              displayValue: '2505.5'
            },
            fiatBalance: { amount: 2505.5, currency: DEFAULT_CURRENCY }
          }
        ]
      };

      const calculatedTotal = result.tokenBalances.reduce(
        (sum, token) => sum + token.fiatBalance.amount,
        0
      );

      expect(result.totalValue.amount).toBe(calculatedTotal);
      expect(result.totalValue.amount).toBe(7006.25);
    });

    it('should accept optional errors property', () => {
      const result: AccountBalancesInFiatResult = {
        totalValue: {
          amount: 3000.0,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: [
          {
            token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
            tokenBalance: {
              value: BigInt('1000000000000000000'),
              displayValue: '1.0'
            },
            fiatBalance: { amount: 3000.0, currency: DEFAULT_CURRENCY }
          }
        ],
        errors: [
          {
            token: { address: '0x0987654321098765432109876543210987654321' },
            error:
              'Failed to get balance for 0x0987654321098765432109876543210987654321: Network error'
          }
        ]
      };

      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0].token.address).toBe(
        '0x0987654321098765432109876543210987654321'
      );
      expect(result.errors![0].error).toContain('Network error');
    });

    it('should work without errors property', () => {
      const result: AccountBalancesInFiatResult = {
        totalValue: {
          amount: 3000.0,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: [
          {
            token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
            tokenBalance: {
              value: BigInt('1000000000000000000'),
              displayValue: '1.0'
            },
            fiatBalance: { amount: 3000.0, currency: DEFAULT_CURRENCY }
          }
        ]
      };

      expect(result.errors).toBeUndefined();
      expect(result.tokenBalances).toHaveLength(1);
      expect(result.totalValue.amount).toBe(3000.0);
    });

    it('should handle empty errors array', () => {
      const result: AccountBalancesInFiatResult = {
        totalValue: {
          amount: 3000.0,
          currency: DEFAULT_CURRENCY
        },
        tokenBalances: [
          {
            token: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
            tokenBalance: {
              value: BigInt('1000000000000000000'),
              displayValue: '1.0'
            },
            fiatBalance: { amount: 3000.0, currency: DEFAULT_CURRENCY }
          }
        ],
        errors: []
      };

      expect(result.errors).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('TokenBalanceError', () => {
    it('should have all required properties for ERC20 token error', () => {
      const error: TokenBalanceError = {
        token: { address: '0x0987654321098765432109876543210987654321' },
        error:
          'Failed to get balance for 0x0987654321098765432109876543210987654321: Token not found'
      };

      expect(error.token).toBeDefined();
      expect(error.token.address).toBe(
        '0x0987654321098765432109876543210987654321'
      );
      expect(error.error).toBe(
        'Failed to get balance for 0x0987654321098765432109876543210987654321: Token not found'
      );
    });

    it('should have all required properties for native token error', () => {
      const error: TokenBalanceError = {
        token: {},
        error: 'Failed to get balance for native token: RPC error'
      };

      expect(error.token).toBeDefined();
      expect(error.token.address).toBeUndefined();
      expect(error.error).toBe(
        'Failed to get balance for native token: RPC error'
      );
    });

    it('should accept token with undefined address for native token', () => {
      const error: TokenBalanceError = {
        token: { address: undefined },
        error: 'Failed to get balance for native token: Network timeout'
      };

      expect(error.token.address).toBeUndefined();
      expect(error.error).toContain('native token');
    });

    it('should handle validation errors', () => {
      const error: TokenBalanceError = {
        token: { address: 'invalid-address' },
        error: 'Invalid token address format: invalid-address'
      };

      expect(error.token.address).toBe('invalid-address');
      expect(error.error).toContain('Invalid token address format');
    });

    it('should handle API errors', () => {
      const error: TokenBalanceError = {
        token: { address: '0x1234567890123456789012345678901234567890' },
        error:
          'Failed to get balance for 0x1234567890123456789012345678901234567890: Service unavailable'
      };

      expect(error.token.address).toBe(
        '0x1234567890123456789012345678901234567890'
      );
      expect(error.error).toContain('Service unavailable');
    });

    it('should handle generic error messages', () => {
      const error: TokenBalanceError = {
        token: { address: '0x1234567890123456789012345678901234567890' },
        error:
          'Failed to get balance for 0x1234567890123456789012345678901234567890: Unknown error'
      };

      expect(error.error).toContain('Unknown error');
    });

    it('should allow various error message formats', () => {
      const errors: TokenBalanceError[] = [
        {
          token: {},
          error: 'Network timeout'
        },
        {
          token: { address: '0x123' },
          error: 'Rate limit exceeded'
        },
        {
          token: { address: '0x456' },
          error: 'Contract not found'
        }
      ];

      errors.forEach((error) => {
        expect(error.token).toBeDefined();
        expect(error.error).toBeDefined();
        expect(typeof error.error).toBe('string');
        expect(error.error.length).toBeGreaterThan(0);
      });

      expect(errors).toHaveLength(3);
    });
  });
});
