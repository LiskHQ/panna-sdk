import { Bridge } from 'thirdweb';
import { liskSepolia } from '../chain';
import { lisk } from '../chain/chain-definitions/lisk';
import { type PannaClient } from '../client';
import { DEFAULT_CURRENCY } from '../defaults';
import * as httpUtils from '../helpers/http';
import { calculateFiatValue, getActivitiesByAddress } from './activity';
import { TokenERC } from './activity.types';
import {
  BlockscoutAddressParam,
  BlockscoutTokenInfo,
  BlockscoutTokenTransfer,
  BlockscoutTransaction
} from './blockscout.types';
import { FiatCurrency } from './types';

// Mock token prices for fiat value testing
const fixture_tokenPrices = [
  {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'ETH',
    prices: { USD: 3000, EUR: 2700, GBP: 2400 }
  },
  {
    address: '0xf242275d3a6527d877f2c927a82d9b057609cc71',
    symbol: 'USDC',
    prices: { USD: 1.0, EUR: 0.9, GBP: 0.8 }
  },
  {
    address: '0x05d032ac25d322df992303dca074ee7392c117b9',
    symbol: 'USDT',
    prices: { USD: 1.0, EUR: 0.9, GBP: 0.8 }
  },
  {
    address: '0xac485391eb2d7d88253a7f1ef18c37f4242d1a24',
    symbol: 'LSK',
    prices: { USD: 1.5, EUR: 1.35, GBP: 1.2 }
  }
];

// Helper function to calculate expected fiat value
const calculateExpectedFiatValue = (
  value: string,
  decimals: number,
  pricePerToken: number
): number => {
  return (Number(value) / 10 ** decimals) * pricePerToken;
};

// Helper function to get price for symbol and currency
const getTokenPrice = (
  symbol: string,
  currency: string = FiatCurrency.USD
): number | undefined => {
  // Special case for USDC.e (maps to USDC)
  const lookupSymbol = symbol === 'USDC.e' ? 'USDC' : symbol;
  const token = fixture_tokenPrices.find((t) => t.symbol === lookupSymbol);
  return token?.prices[currency as keyof typeof token.prices];
};

// Mock upstream modules
jest.mock('../helpers/http');
jest.mock('thirdweb', () => ({
  Bridge: {
    tokens: jest.fn()
  },
  NATIVE_TOKEN_ADDRESS: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
}));

// Mock the cache module with complete reset capability
jest.mock('../helpers/cache', () => {
  let caches = new Map<string, Map<string, unknown>>();

  return {
    newLruMemCache: (id: string) => {
      if (!caches.has(id)) {
        caches.set(id, new Map());
      }
      const cache = caches.get(id)!;

      return {
        get: (key: string) => cache.get(key),
        set: (key: string, value: unknown) => cache.set(key, value),
        has: (key: string) => cache.has(key),
        delete: (key: string) => cache.delete(key),
        clear: () => cache.clear()
      };
    },
    // Completely reset the cache Map (not just clear contents)
    __resetAllCaches: () => {
      caches = new Map<string, Map<string, unknown>>();
    }
  };
});

const mockClient = {} as PannaClient;

// Fixed test addresses and hashes (cache is completely reset between tests)
const TEST_USER_ADDRESS = '0x1234567890123456789012345678901234567890';
const TEST_RECIPIENT_ADDRESS = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const TEST_TX_HASH =
  '0x1000000000000000000000000000000000000000000000000000000000000000';
const TEST_BLOCK_HASH =
  '0x2000000000000000000000000000000000000000000000000000000000000000';

describe('calculateFiatValue - Unit Tests', () => {
  const NATIVE_ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  const mockTokenPrices = [
    {
      address: NATIVE_ETH_ADDRESS,
      symbol: 'ETH',
      prices: { USD: 3000, EUR: 2700, GBP: 2400 }
    },
    {
      address: '0xf242275d3a6527d877f2c927a82d9b057609cc71',
      symbol: 'USDC',
      prices: { USD: 1.0, EUR: 0.9, GBP: 0.8 }
    },
    {
      address: '0xac485391eb2d7d88253a7f1ef18c37f4242d1a24',
      symbol: 'LSK',
      prices: { USD: 1.5, EUR: 1.35, GBP: 1.2 }
    }
  ];

  describe('Currency Calculations', () => {
    it('should calculate USD fiat value correctly', () => {
      const result = calculateFiatValue(
        NATIVE_ETH_ADDRESS,
        '1000000000000000000', // 1 ETH in wei
        18,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toEqual({ amount: 3000, currency: FiatCurrency.USD });
    });

    it('should calculate EUR fiat value correctly', () => {
      const result = calculateFiatValue(
        NATIVE_ETH_ADDRESS,
        '2000000000000000000', // 2 ETH in wei
        18,
        mockTokenPrices,
        FiatCurrency.EUR,
        lisk.id
      );
      expect(result).toEqual({ amount: 5400, currency: FiatCurrency.EUR });
    });

    it('should calculate GBP fiat value correctly', () => {
      const result = calculateFiatValue(
        NATIVE_ETH_ADDRESS,
        '1000000000000000000', // 1 ETH in wei
        18,
        mockTokenPrices,
        FiatCurrency.GBP,
        lisk.id
      );
      expect(result).toEqual({ amount: 2400, currency: FiatCurrency.GBP });
    });
  });

  describe('Decimal Handling', () => {
    it('should handle different decimals correctly (6 decimals)', () => {
      const result = calculateFiatValue(
        '0xf242275d3a6527d877f2c927a82d9b057609cc71',
        '1000000', // 1 USDC with 6 decimals
        6,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toEqual({ amount: 1.0, currency: FiatCurrency.USD });
    });

    it('should handle different decimals correctly (18 decimals)', () => {
      const result = calculateFiatValue(
        '0xac485391eb2d7d88253a7f1ef18c37f4242d1a24',
        '1500000000000000000', // 1.5 LSK with 18 decimals
        18,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toEqual({ amount: 2.25, currency: FiatCurrency.USD });
    });
  });

  describe('Edge Cases', () => {
    it('should return undefined when price not found', () => {
      const result = calculateFiatValue(
        '0x0000000000000000000000000000000000000000',
        '1000000',
        6,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined when currency not available', () => {
      const result = calculateFiatValue(
        NATIVE_ETH_ADDRESS,
        '1000000000000000000',
        18,
        mockTokenPrices,
        FiatCurrency.JPY, // Using JPY which is not in mock prices
        lisk.id
      );
      expect(result).toBeUndefined();
    });

    it('should handle zero value correctly', () => {
      const result = calculateFiatValue(
        NATIVE_ETH_ADDRESS,
        '0',
        18,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toEqual({ amount: 0, currency: FiatCurrency.USD });
    });

    it('should handle empty token prices array', () => {
      const result = calculateFiatValue(
        NATIVE_ETH_ADDRESS,
        '1000000000000000000',
        18,
        [],
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toBeUndefined();
    });
  });

  describe('Address Lookup', () => {
    it('should return undefined for unknown address', () => {
      const result = calculateFiatValue(
        '0x0000000000000000000000000000000000000123', // Unknown address
        '1000000', // 1 token with 6 decimals
        6,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      // Should return undefined since address is not in price list
      expect(result).toBeUndefined();
    });

    it('should return fiat value for known address', () => {
      const result = calculateFiatValue(
        '0xf242275d3a6527d877f2c927a82d9b057609cc71', // USDC address
        '1000000', // 1 USDC with 6 decimals
        6,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      // Should return fiat value since address is in price list
      expect(result).toEqual({ amount: 1.0, currency: FiatCurrency.USD });
    });
  });

  describe('Fractional Amounts', () => {
    it('should calculate fractional token amounts correctly', () => {
      const result = calculateFiatValue(
        NATIVE_ETH_ADDRESS,
        '500000000000000000', // 0.5 ETH
        18,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toEqual({ amount: 1500, currency: FiatCurrency.USD });
    });

    it('should calculate very small amounts correctly', () => {
      const result = calculateFiatValue(
        '0xf242275d3a6527d877f2c927a82d9b057609cc71',
        '1', // 0.000001 USDC (1 micro USDC)
        6,
        mockTokenPrices,
        FiatCurrency.USD,
        lisk.id
      );
      expect(result).toEqual({ amount: 0.000001, currency: FiatCurrency.USD });
    });
  });
});

describe('getActivitiesByAddress - Fiat Value Tests', () => {
  // Map of symbols to real contract addresses (matching fixture_tokenPrices)
  const TOKEN_ADDRESSES: Record<string, string> = {
    ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    USDC: '0xf242275d3a6527d877f2c927a82d9b057609cc71',
    'USDC.e': '0xf242275d3a6527d877f2c927a82d9b057609cc71', // Same as USDC
    USDT: '0x05d032ac25d322df992303dca074ee7392c117b9',
    LSK: '0xac485391eb2d7d88253a7f1ef18c37f4242d1a24',
    UNKNOWNTOKEN: '0xUNKNOWNTOKEN' // Unknown token for negative tests
  };

  // Helper function to create complete mock transactions
  const createMockTransaction = (
    overrides: Partial<BlockscoutTransaction> = {}
  ) => ({
    priority_fee: '1000000',
    raw_input: '0x',
    result: 'success',
    hash: TEST_TX_HASH,
    max_fee_per_gas: '72579481',
    revert_reason: null,
    confirmation_duration: [0, 2000],
    transaction_burnt_fee: '487688191320',
    type: 2,
    token_transfers_overflow: false,
    confirmations: 100,
    position: 10,
    max_priority_fee_per_gas: '971721',
    transaction_tag: null,
    created_contract: null,
    value: '0',
    from: {
      ens_domain_name: null,
      hash: TEST_USER_ADDRESS,
      implementations: [],
      is_contract: false,
      is_scam: false,
      is_verified: false,
      metadata: null,
      name: null,
      private_tags: [],
      proxy_type: 'unknown',
      public_tags: [],
      watchlist_names: []
    },
    gas_used: '27329',
    status: 'ok',
    to: {
      ens_domain_name: null,
      hash: TEST_RECIPIENT_ADDRESS,
      implementations: [],
      is_contract: false,
      is_scam: false,
      is_verified: false,
      metadata: null,
      name: null,
      private_tags: [],
      proxy_type: 'unknown',
      public_tags: [],
      watchlist_names: []
    },
    method: null,
    fee: { type: 'actual', value: '4381877876096' },
    actions: [],
    gas_limit: 27674,
    gas_price: '18816801',
    decoded_input: null,
    token_transfers: [],
    base_fee_per_gas: '17845080',
    timestamp: '2025-01-01T00:00:00.000000Z',
    nonce: 8,
    historic_exchange_rate: '3224.35',
    transaction_types: ['coin_transfer'],
    exchange_rate: '4558.13',
    block_number: 1,
    has_error_in_internal_transactions: false,
    ...overrides
  });

  // Helper function to create complete mock address
  const createMockAddress = (hash: string): BlockscoutAddressParam => ({
    hash,
    name: null,
    ens_domain_name: null,
    implementations: [],
    is_contract: false,
    is_scam: false,
    is_verified: false,
    metadata: null,
    private_tags: [],
    proxy_type: 'unknown',
    public_tags: [],
    watchlist_names: []
  });

  // Helper function to create complete mock token info
  const createMockTokenInfo = (
    symbol: string,
    decimals: string,
    type: string
  ): BlockscoutTokenInfo => ({
    address: TOKEN_ADDRESSES[symbol] || `0x${symbol}`,
    name: symbol,
    symbol,
    decimals,
    type,
    circulating_market_cap: null,
    icon_url: null,
    exchange_rate: null,
    total_supply: null
  });

  // Helper function to create complete mock token transfer
  const createMockTokenTransfer = (
    symbol: string,
    decimals: string,
    value: string,
    tokenType: 'ERC-20' | 'ERC-1155'
  ): BlockscoutTokenTransfer => {
    const token = createMockTokenInfo(symbol, decimals, tokenType);
    const total =
      tokenType === 'ERC-20'
        ? { decimals, value }
        : { token_id: '1', decimals: decimals, value };

    return {
      block_hash: TEST_BLOCK_HASH,
      log_index: 0,
      from: createMockAddress(TEST_USER_ADDRESS),
      to: createMockAddress(TEST_RECIPIENT_ADDRESS),
      token,
      total,
      transaction_hash: TEST_TX_HASH,
      type: 'token_transfer' // This is the transaction type, not the token standard
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Completely reset cache state between tests
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cacheModule = require('../helpers/cache');
    if (cacheModule.__resetAllCaches) {
      cacheModule.__resetAllCaches();
    }

    // Default mock for Bridge.tokens
    (Bridge.tokens as jest.Mock).mockResolvedValue(fixture_tokenPrices);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ETH Transaction Fiat Values', () => {
    it('should include fiatValue for ETH transaction when prices available', async () => {
      const ethValue = '1000000000000000000'; // 1 ETH
      const mockTransaction = createMockTransaction({
        value: ethValue,
        transaction_types: ['coin_transfer']
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia,
        currency: DEFAULT_CURRENCY
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect(resultActivity.amount.type).toBe(TokenERC.ETH);

      if ('fiatValue' in resultActivity.amount) {
        const expectedFiatValue = calculateExpectedFiatValue(
          ethValue,
          18,
          getTokenPrice('ETH', DEFAULT_CURRENCY)!
        );
        expect(resultActivity.amount.fiatValue).toBeDefined();
        expect(resultActivity.amount.fiatValue?.amount).toBe(expectedFiatValue);
        expect(resultActivity.amount.fiatValue?.currency).toBe(
          DEFAULT_CURRENCY
        );
      } else {
        throw new Error('fiatValue should be present on ETH transaction');
      }
    });

    it('should include fiatValue with zero amount for ETH transaction with zero value', async () => {
      const ethValue = '0';
      const mockTransaction = createMockTransaction({
        value: ethValue
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];

      if ('fiatValue' in resultActivity.amount) {
        expect(resultActivity.amount.fiatValue?.amount).toBe(0);
      }
    });

    it('should not include fiatValue for ETH transaction when prices unavailable', async () => {
      (Bridge.tokens as jest.Mock).mockResolvedValue([]);

      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect('fiatValue' in resultActivity.amount).toBe(false);
    });
  });

  describe('ERC20 Transaction Fiat Values', () => {
    it('should include fiatValue for ERC20 transaction when prices available', async () => {
      const tokenValue = '1000000000'; // 1000 USDC (6 decimals)
      const mockTransaction = createMockTransaction({
        transaction_types: ['contract_call', 'token_transfer'],
        token_transfers: [] // Will be populated by fillTokenTransactions
      });

      const tokenTransfer = createMockTokenTransfer(
        'USDC',
        '6',
        tokenValue,
        'ERC-20'
      );
      // Override transaction_hash to match mockTransaction
      tokenTransfer.transaction_hash = mockTransaction.hash;

      // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled),
      // 4. token transfers again (fillTokenTransactions)
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({
          items: [tokenTransfer],
          next_page_params: null
        }) // token transfers (Promise.allSettled)
        .mockResolvedValueOnce({
          items: [tokenTransfer],
          next_page_params: null
        }); // token transfers (fillTokenTransactions)

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect(resultActivity.amount.type).toBe(TokenERC.ERC20);

      if ('fiatValue' in resultActivity.amount) {
        const expectedFiatValue = calculateExpectedFiatValue(
          tokenValue,
          6,
          getTokenPrice('USDC')!
        );
        expect(resultActivity.amount.fiatValue).toBeDefined();
        expect(resultActivity.amount.fiatValue?.amount).toBe(expectedFiatValue);
        expect(resultActivity.amount.fiatValue?.currency).toBe(
          DEFAULT_CURRENCY
        );
      } else {
        throw new Error('fiatValue should be present on ERC20 transaction');
      }
    });

    it('should map USDC.e to USDC for fiat value calculation', async () => {
      const tokenValue = '500000000'; // 500 USDC.e (6 decimals)

      const mockTransaction = createMockTransaction({
        transaction_types: ['contract_call', 'token_transfer'],
        token_transfers: [] // Will be populated by fillTokenTransactions
      });

      const tokenTransfer = createMockTokenTransfer(
        'USDC.e',
        '6',
        tokenValue,
        'ERC-20'
      );
      // Override transaction_hash to match mockTransaction
      tokenTransfer.transaction_hash = mockTransaction.hash;

      // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled),
      // 4. token transfers again (fillTokenTransactions)
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({
          items: [tokenTransfer],
          next_page_params: null
        }) // token transfers (Promise.allSettled)
        .mockResolvedValueOnce({
          items: [tokenTransfer],
          next_page_params: null
        }); // token transfers (fillTokenTransactions)

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];

      if ('fiatValue' in resultActivity.amount) {
        // Should use USDC price for USDC.e
        const expectedFiatValue = calculateExpectedFiatValue(
          tokenValue,
          6,
          getTokenPrice('USDC.e')! // This helper maps to USDC
        );
        expect(resultActivity.amount.fiatValue?.amount).toBe(expectedFiatValue);
      } else {
        throw new Error('fiatValue should be present on USDC.e transaction');
      }
    });

    it('should not include fiatValue for ERC20 when token not in price list', async () => {
      // Mock Bridge.tokens to NOT include UNK token
      (Bridge.tokens as jest.Mock).mockResolvedValue(
        fixture_tokenPrices.filter((t) => t.symbol !== 'UNK')
      );

      const tokenValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        transaction_types: ['contract_call', 'token_transfer'],
        token_transfers: []
      });

      const unknownTokenTransfer = createMockTokenTransfer(
        'UNKNOWNTOKEN',
        '18',
        tokenValue,
        'ERC-20'
      );
      unknownTokenTransfer.transaction_hash = mockTransaction.hash;

      // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled),
      // 4. token transfers again (fillTokenTransactions)
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({
          items: [unknownTokenTransfer],
          next_page_params: null
        }) // token transfers (Promise.allSettled)
        .mockResolvedValueOnce({
          items: [unknownTokenTransfer],
          next_page_params: null
        }); // token transfers (fillTokenTransactions)

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect('fiatValue' in resultActivity.amount).toBe(false);
    });

    it('should correctly calculate fiatValue for tokens with different decimals', async () => {
      // Test with 18 decimals (LSK)
      const lskValue = '2000000000000000000'; // 2 LSK
      const mockTransaction = createMockTransaction({
        transaction_types: ['contract_call', 'token_transfer'],
        token_transfers: []
      });

      const lskTokenTransfer = createMockTokenTransfer(
        'LSK',
        '18',
        lskValue,
        'ERC-20'
      );
      lskTokenTransfer.transaction_hash = mockTransaction.hash;

      // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled),
      // 4. token transfers again (fillTokenTransactions)
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({
          items: [lskTokenTransfer],
          next_page_params: null
        }) // token transfers (Promise.allSettled)
        .mockResolvedValueOnce({
          items: [lskTokenTransfer],
          next_page_params: null
        }); // token transfers (fillTokenTransactions)

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];

      if ('fiatValue' in resultActivity.amount) {
        const expectedFiatValue = calculateExpectedFiatValue(
          lskValue,
          18,
          getTokenPrice('LSK')!
        );
        expect(resultActivity.amount.fiatValue?.amount).toBe(expectedFiatValue);
      } else {
        throw new Error('fiatValue should be present on LSK transaction');
      }
    });
  });

  describe('ERC1155 Transaction Fiat Values', () => {
    it('should include fiatValue for ERC1155 transaction when prices available', async () => {
      const tokenValue = '5'; // 5 tokens
      const mockTransaction = createMockTransaction({
        transaction_types: ['contract_call', 'token_transfer'],
        token_transfers: []
      });

      const usdcTokenTransfer = createMockTokenTransfer(
        'USDC',
        '6',
        tokenValue,
        'ERC-1155'
      );
      usdcTokenTransfer.transaction_hash = mockTransaction.hash;

      // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled),
      // 4. token transfers again (fillTokenTransactions)
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({
          items: [usdcTokenTransfer],
          next_page_params: null
        }) // token transfers (Promise.allSettled)
        .mockResolvedValueOnce({
          items: [usdcTokenTransfer],
          next_page_params: null
        }); // token transfers (fillTokenTransactions)

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect(resultActivity.amount.type).toBe(TokenERC.ERC1155);

      if ('fiatValue' in resultActivity.amount) {
        const expectedFiatValue = calculateExpectedFiatValue(
          tokenValue,
          6,
          getTokenPrice('USDC')!
        );
        expect(resultActivity.amount.fiatValue).toBeDefined();
        expect(resultActivity.amount.fiatValue?.amount).toBe(expectedFiatValue);
      } else {
        throw new Error('fiatValue should be present on ERC1155 transaction');
      }
    });

    it('should not include fiatValue for ERC1155 when token not in price list', async () => {
      // Mock Bridge.tokens to NOT include UNKNFT token
      (Bridge.tokens as jest.Mock).mockResolvedValue(
        fixture_tokenPrices.filter((t) => t.symbol !== 'UNKNFT')
      );

      const tokenValue = '3';
      const mockTransaction = createMockTransaction({
        transaction_types: ['contract_call', 'token_transfer'],
        token_transfers: []
      });

      const unknftTokenTransfer = createMockTokenTransfer(
        'UNKNOWNTOKEN1155',
        '0',
        tokenValue,
        'ERC-1155'
      );
      unknftTokenTransfer.transaction_hash = mockTransaction.hash;

      // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled),
      // 4. token transfers again (fillTokenTransactions)
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({
          items: [unknftTokenTransfer],
          next_page_params: null
        }) // token transfers (Promise.allSettled)
        .mockResolvedValueOnce({
          items: [unknftTokenTransfer],
          next_page_params: null
        }); // token transfers (fillTokenTransactions)

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect('fiatValue' in resultActivity.amount).toBe(false);
    });
  });

  describe('Currency Parameter Tests', () => {
    it('should use USD currency by default', async () => {
      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue,
        transaction_types: ['coin_transfer']
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
        // currency not specified
      };

      const result = await getActivitiesByAddress(params);

      const resultActivity = result.activities[0];
      if ('fiatValue' in resultActivity.amount) {
        expect(resultActivity.amount.fiatValue?.currency).toBe(
          FiatCurrency.USD
        );
      }
    });

    it('should use EUR currency when specified', async () => {
      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue,
        transaction_types: ['coin_transfer']
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia,
        currency: FiatCurrency.EUR
      };

      const result = await getActivitiesByAddress(params);

      const resultActivity = result.activities[0];
      if ('fiatValue' in resultActivity.amount) {
        expect(resultActivity.amount.fiatValue?.currency).toBe(
          FiatCurrency.EUR
        );
        const expectedFiatValue = calculateExpectedFiatValue(
          ethValue,
          18,
          getTokenPrice('ETH', FiatCurrency.EUR)!
        );
        expect(resultActivity.amount.fiatValue?.amount).toBe(expectedFiatValue);
      }
    });

    it('should use GBP currency when specified', async () => {
      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue,
        transaction_types: ['coin_transfer']
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia,
        currency: FiatCurrency.GBP
      };

      const result = await getActivitiesByAddress(params);

      const resultActivity = result.activities[0];
      if ('fiatValue' in resultActivity.amount) {
        expect(resultActivity.amount.fiatValue?.currency).toBe(
          FiatCurrency.GBP
        );
        const expectedFiatValue = calculateExpectedFiatValue(
          ethValue,
          18,
          getTokenPrice('ETH', FiatCurrency.GBP)!
        );
        expect(resultActivity.amount.fiatValue?.amount).toBe(expectedFiatValue);
      }
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle Bridge.tokens() error gracefully', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      (Bridge.tokens as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect('fiatValue' in resultActivity.amount).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to fetch token prices:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle empty price array from Bridge.tokens()', async () => {
      (Bridge.tokens as jest.Mock).mockResolvedValue([]);

      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(1);
      const resultActivity = result.activities[0];
      expect('fiatValue' in resultActivity.amount).toBe(false);
    });

    it('should handle mixed scenario with some tokens having prices', async () => {
      // Mock Bridge.tokens to only include ETH (not UNK)
      (Bridge.tokens as jest.Mock).mockResolvedValue(
        fixture_tokenPrices.filter((t) => t.symbol === 'ETH')
      );

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      // Create first transaction (ETH) - has price
      const ethTx = createMockTransaction({
        value: '1000000000000000000',
        transaction_types: ['coin_transfer']
      });

      // Create second transaction (unknown ERC20 token) - no price
      const secondTxHash =
        '0x2000000000000000000000000000000000000000000000000000000000000001';
      const unknownTokenTransfer = createMockTokenTransfer(
        'UNKNOWNTOKEN',
        '18',
        '1000000000000000000',
        'ERC-20'
      );
      // Override transaction_hash for the second transaction
      unknownTokenTransfer.transaction_hash = secondTxHash;
      unknownTokenTransfer.from = createMockAddress(params.address);

      const erc20Tx = createMockTransaction({
        hash: secondTxHash,
        transaction_types: ['contract_call', 'token_transfer'],
        token_transfers: [unknownTokenTransfer],
        from: createMockAddress(params.address)
      });

      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [ethTx, erc20Tx],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({
          items: [unknownTokenTransfer],
          next_page_params: null
        }) // token transfers (Promise.allSettled)
        .mockResolvedValueOnce({
          items: [unknownTokenTransfer],
          next_page_params: null
        }); // token transfers (fillTokenTransactions)

      const result = await getActivitiesByAddress(params);

      expect(result.activities).toHaveLength(2);
      // First activity (ETH) should have fiatValue
      expect('fiatValue' in result.activities[0].amount).toBe(true);
      // Second activity (unknown token) should not have fiatValue
      expect('fiatValue' in result.activities[1].amount).toBe(false);
    });
  });

  describe('Chain Mapping Tests', () => {
    it('should use lisk.id when chain is liskSepolia', async () => {
      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: liskSepolia
      };

      await getActivitiesByAddress(params);

      expect(Bridge.tokens).toHaveBeenCalledWith({
        chainId: lisk.id,
        client: mockClient
      });
    });

    it('should use provided chain.id when chain is not liskSepolia', async () => {
      const ethValue = '1000000000000000000';
      const mockTransaction = createMockTransaction({
        value: ethValue
      });

      // Order matches Promise.allSettled in getActivitiesByAddress:
      // 1. internal transactions, 2. transactions, 3. token transfers
      (httpUtils.request as jest.Mock)
        .mockResolvedValueOnce({ items: [], next_page_params: null }) // internal
        .mockResolvedValueOnce({
          items: [mockTransaction],
          next_page_params: null
        }) // transactions
        .mockResolvedValueOnce({ items: [], next_page_params: null }); // token transfers

      const params = {
        address: TEST_USER_ADDRESS,
        client: mockClient,
        chain: lisk
      };

      await getActivitiesByAddress(params);

      expect(Bridge.tokens).toHaveBeenCalledWith({
        chainId: lisk.id,
        client: mockClient
      });
    });
  });
});
