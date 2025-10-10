import { Bridge } from 'thirdweb';
import { liskSepolia } from '../chain';
import { type PannaClient } from '../client';
import * as httpUtils from '../helpers/http';
import {
  fillTokenTransactions,
  getActivitiesByAddress,
  getAmountType,
  getBaseTokenTransferRequestUrl,
  getBaseTransactionsRequestUrl,
  getBaseInternalTransactionsRequestUrl
} from './activity';
import * as fixture from './activity.fixture.test';
import { TokenERC, TokenType } from './activity.types';
import {
  BlockscoutTransaction,
  BlockscoutTransactionsResponse
} from './blockscout.types';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  REGEX_URL
} from './constants';

// Mock upstream modules
jest.mock('../helpers/http');
jest.mock('./activity', () => jest.requireActual('./activity'));
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

describe('getBaseTransactionsRequestUrl', () => {
  it('should return the transactions API endpoint for the given address', () => {
    const address = '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F';
    const url = getBaseTransactionsRequestUrl(address, liskSepolia.id);

    expect(typeof url).toBe('string');
    expect(url).toMatch(REGEX_URL);
    expect(url.startsWith('https')).toBeTruthy();
    expect(url.endsWith('transactions')).toBeTruthy();
    expect(url.includes(address)).toBeTruthy();
  });
});

describe('getBaseTokenTransferRequestUrl', () => {
  it('should return the token transfers API endpoint for the given address', () => {
    const address = '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F';
    const url = getBaseTokenTransferRequestUrl(address, liskSepolia.id);

    expect(typeof url).toBe('string');
    expect(url).toMatch(REGEX_URL);
    expect(url.startsWith('https')).toBeTruthy();
    expect(url.endsWith('token-transfers')).toBeTruthy();
    expect(url.includes(address)).toBeTruthy();
  });
});

describe('getBaseInternalTransactionsRequestUrl', () => {
  it('should return the token transfers API endpoint for the given address', () => {
    const address = '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F';
    const url = getBaseInternalTransactionsRequestUrl(address, liskSepolia.id);

    expect(typeof url).toBe('string');
    expect(url).toMatch(REGEX_URL);
    expect(url.startsWith('https')).toBeTruthy();
    expect(url.endsWith('internal-transactions')).toBeTruthy();
    expect(url.includes(address)).toBeTruthy();
  });
});

describe('fillTokenTransactions', () => {
  it('should return empty array when there are no transactions', () => {
    const params = {
      address: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
      chain: liskSepolia,
      transactions: []
    };
    expect(
      fillTokenTransactions(
        params.address,
        params.chain.id,
        params.transactions
      )
    ).resolves.toBe(params.transactions);
  });

  it('should assign empty array to token_transfers for each transaction', () => {
    const params = {
      address: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
      chain: liskSepolia,
      transactions: fixture.fillTokenTransactions
        .should_assign_empty_array_to_token_transfers_for_each_transaction
        .inputTransactions as unknown as BlockscoutTransaction[]
    };

    (httpUtils.request as jest.Mock).mockResolvedValue(
      fixture.fillTokenTransactions
        .should_assign_empty_array_to_token_transfers_for_each_transaction
        .mockHttpResponse
    );

    expect(
      fillTokenTransactions(
        params.address,
        params.chain.id,
        params.transactions
      )
    ).resolves.toStrictEqual(
      fixture.fillTokenTransactions
        .should_assign_empty_array_to_token_transfers_for_each_transaction
        .wantResult
    );
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chain.id)
    );
  });

  it('should invoke updateTokenTransactionsCache only for eligible contract calls and token activity types', () => {
    const params = {
      address: '0x7e0bCc78E317Fa28f73a44567d854b081004622d',
      chain: liskSepolia,
      transactions: fixture.fillTokenTransactions
        .should_invoke_updateTokenTransactionsCache_only_for_eligible_contract_calls_and_token_activity_types
        .inputTransactions as unknown as BlockscoutTransaction[]
    };

    (httpUtils.request as jest.Mock).mockResolvedValue(
      fixture.fillTokenTransactions
        .should_invoke_updateTokenTransactionsCache_only_for_eligible_contract_calls_and_token_activity_types
        .mockHttpResponse
    );

    expect(
      fillTokenTransactions(
        params.address,
        params.chain.id,
        params.transactions
      )
    ).resolves.toStrictEqual(
      fixture.fillTokenTransactions
        .should_invoke_updateTokenTransactionsCache_only_for_eligible_contract_calls_and_token_activity_types
        .wantResult
    );
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chain.id)
    );
  });
});

describe('getAmountType', () => {
  it(`should throw error for invalid transaction`, () => {
    const invalidTx = fixture.getAmountType
      .should_throw_error_for_invalid_transaction
      .invalidTx as unknown as BlockscoutTransaction;
    expect(() => getAmountType(invalidTx.from.hash, invalidTx)).toThrow(
      'Unable to determine transaction amount type'
    );
  });

  it(`should throw error for invalid transaction making a contract_call`, () => {
    const invalidContractCallTx = fixture.getAmountType
      .should_throw_error_for_invalid_transaction_making_a_contract_call
      .invalidContractCallTx as unknown as BlockscoutTransaction;
    expect(() =>
      getAmountType(invalidContractCallTx.from.hash, invalidContractCallTx)
    ).toThrow('Unable to determine the amount ERC standard');
  });

  it(`should return valid ERC type for a valid transaction making a contract_call`, () => {
    const validContractCallTx = fixture.getAmountType
      .should_return_valid_ERC_type_for_a_valid_transaction_making_a_contract_call
      .validContractCallTx as unknown as BlockscoutTransaction;
    expect(
      Object.values(TokenERC).includes(
        getAmountType(validContractCallTx.from.hash, validContractCallTx)
      )
    ).toBeTruthy();
  });

  it(`should return one of '${TokenERC.ERC20}', '${TokenERC.ERC721}' or '${TokenERC.ERC1155}' for a token_transfer transaction making a contract_call`, () => {
    const tokenTransferTx = fixture.getAmountType
      .should_return_one_of_erc_20_erc_721_or_erc_1155_for_a_token_transfer_transaction_making_a_contract_call
      .tokenTransferTx as unknown as BlockscoutTransaction;
    expect(
      [TokenERC.ERC20, TokenERC.ERC721, TokenERC.ERC1155].includes(
        getAmountType(
          tokenTransferTx.from.hash,
          tokenTransferTx
        ) as unknown as Exclude<TokenType, 'eth'>
      )
    ).toBeTruthy();
  });

  it(`should return one of '${TokenERC.ERC20}', '${TokenERC.ERC721}' or '${TokenERC.ERC1155}' for a token_minting transaction making a contract_call`, () => {
    const tokenMintingTx = fixture.getAmountType
      .should_return_one_of_erc_20_erc_721_or_erc_1155_for_a_token_minting_transaction_making_a_contract_call
      .tokenMintingTx as unknown as BlockscoutTransaction;
    expect(
      [TokenERC.ERC20, TokenERC.ERC721, TokenERC.ERC1155].includes(
        getAmountType(
          tokenMintingTx.from.hash,
          tokenMintingTx
        ) as unknown as Exclude<TokenType, 'eth'>
      )
    ).toBeTruthy();
  });

  it(`should return amount type '${TokenERC.ERC20}' for valid ERC-20 transaction`, () => {
    const erc20Tx = fixture.getAmountType
      .should_return_amount_type_erc_20_for_valid_ERC_20_transaction
      .erc20Tx as unknown as BlockscoutTransaction;
    expect(getAmountType(erc20Tx.from.hash, erc20Tx)).toBe(TokenERC.ERC20);
  });

  it(`should return amount type '${TokenERC.ERC721}' for valid ERC-721 transaction`, () => {
    const erc721Tx = fixture.getAmountType
      .should_return_amount_type_erc_721_for_valid_ERC_721_transaction
      .erc721Tx as unknown as BlockscoutTransaction;
    expect(getAmountType(erc721Tx.from.hash, erc721Tx)).toBe(TokenERC.ERC721);
  });

  it(`should return amount type '${TokenERC.ERC1155}' for valid ERC-1155 transaction`, () => {
    const erc1155Tx = fixture.getAmountType
      .should_return_amount_type_erc_1155_for_valid_ERC_1155_transaction
      .erc1155Tx as unknown as BlockscoutTransaction;
    expect(getAmountType(erc1155Tx.from.hash, erc1155Tx)).toBe(
      TokenERC.ERC1155
    );
  });

  it(`should return amount type '${TokenERC.ETH}' for valid ETH transaction`, () => {
    const ethTx = fixture.getAmountType
      .should_return_amount_type_eth_for_valid_ETH_transaction
      .ethTx as unknown as BlockscoutTransaction;
    expect(getAmountType(ethTx.from.hash, ethTx)).toBe(TokenERC.ETH);
  });
});

describe('getActivitiesByAddress', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Completely reset cache state between tests
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cacheModule = require('../helpers/cache');
    if (cacheModule.__resetAllCaches) {
      cacheModule.__resetAllCaches();
    }

    // Mock Bridge.tokens to return empty array (no fiat prices)
    (Bridge.tokens as jest.Mock).mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return empty list of activities if none exist', async () => {
    const mockRequestResponse = {
      items: [],
      next_page_params: null
    };

    // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled)
    (httpUtils.request as jest.Mock)
      .mockResolvedValueOnce(mockRequestResponse) // internal transactions
      .mockResolvedValueOnce(mockRequestResponse) // transactions
      .mockResolvedValueOnce(mockRequestResponse); // token transfers

    const params = {
      address: '0xe1287E785D424cd3d0998957388C4770488ed841',
      client: mockClient,
      chain: liskSepolia
    };
    const result = await getActivitiesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(3);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseInternalTransactionsRequestUrl(params.address, liskSepolia.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      2,
      getBaseTransactionsRequestUrl(params.address, liskSepolia.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      3,
      getBaseTokenTransferRequestUrl(params.address, liskSepolia.id)
    );
    expect(result).toStrictEqual({
      activities: [],
      metadata: {
        count: mockRequestResponse.items.length,
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: DEFAULT_PAGINATION_LIMIT,
        hasNextPage: false
      }
    });
  });

  it('should return list of activities (lower than default limit)', async () => {
    const mockRequestResponse = fixture.getActivitiesByAddress
      .should_return_list_of_activities_lower_than_default_limit
      .mockRequestResponse as unknown as BlockscoutTransactionsResponse;

    const emptyResponse = {
      items: [],
      next_page_params: null
    };

    // Order: 1. internal, 2. transactions, 3. token transfers (Promise.allSettled),
    // 4. token transfers (fillTokenTransactions - some transactions have token_transfer type)
    (httpUtils.request as jest.Mock)
      .mockResolvedValueOnce(emptyResponse) // internal transactions
      .mockResolvedValueOnce(mockRequestResponse) // transactions
      .mockResolvedValueOnce(emptyResponse) // token transfers (Promise.allSettled)
      .mockResolvedValueOnce(emptyResponse); // token transfers (fillTokenTransactions)

    const params = {
      address: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
      client: mockClient,
      chain: liskSepolia
    };
    const result = await getActivitiesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(4);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseInternalTransactionsRequestUrl(params.address, params.chain.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      2,
      getBaseTransactionsRequestUrl(params.address, params.chain.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      3,
      getBaseTokenTransferRequestUrl(params.address, params.chain.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      4,
      getBaseTokenTransferRequestUrl(params.address, params.chain.id)
    );
    expect(result).toStrictEqual(
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_lower_than_default_limit.wantResult
    );
  });

  it('should return list of activities (multiple API requests)', async () => {
    const mockRequestResponse1 = fixture.getActivitiesByAddress
      .should_return_list_of_activities_multiple_API_requests
      .mockRequestResponse1 as unknown as BlockscoutTransactionsResponse;
    const mockRequestResponse2 = fixture.getActivitiesByAddress
      .should_return_list_of_activities_multiple_API_requests
      .mockRequestResponse2 as unknown as BlockscoutTransactionsResponse;
    const mockRequestResponse3 = fixture.getActivitiesByAddress
      .should_return_list_of_activities_multiple_API_requests
      .mockRequestResponse3 as unknown as BlockscoutTransactionsResponse;

    const emptyResponse = {
      items: [],
      next_page_params: null
    };

    // Order: 1. internal (initial), 2. transactions page 1 (initial), 3. token transfers (initial),
    // 4. transactions page 2 (pagination), 5. transactions page 3 (pagination)
    (httpUtils.request as jest.Mock)
      .mockResolvedValueOnce(emptyResponse) // internal transactions (initial)
      .mockResolvedValueOnce(mockRequestResponse1) // transactions page 1 (initial)
      .mockResolvedValueOnce(emptyResponse) // token transfers (initial)
      .mockResolvedValueOnce(mockRequestResponse2) // transactions page 2 (pagination)
      .mockResolvedValueOnce(mockRequestResponse3); // transactions page 3 (pagination)

    const params = {
      address: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
      client: mockClient,
      chain: liskSepolia,
      offset: 4,
      limit: 4
    };
    const result = await getActivitiesByAddress(params);
    expect(httpUtils.request).toHaveBeenCalledTimes(5);

    const baseRequestUrl = getBaseTransactionsRequestUrl(
      params.address,
      params.chain.id
    );

    // Initial calls via Promise.allSettled
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseInternalTransactionsRequestUrl(params.address, params.chain.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(2, baseRequestUrl);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      3,
      getBaseTokenTransferRequestUrl(params.address, params.chain.id)
    );

    // Pagination calls
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      4,
      `${baseRequestUrl}?block_number=${mockRequestResponse1.next_page_params?.block_number}&index=${mockRequestResponse1.next_page_params?.index}&items_count=${mockRequestResponse1.next_page_params?.items_count}`
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      5,
      `${baseRequestUrl}?block_number=${mockRequestResponse2.next_page_params?.block_number}&index=${mockRequestResponse2.next_page_params?.index}&items_count=${mockRequestResponse2.next_page_params?.items_count}`
    );
    expect(result).toStrictEqual(
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_multiple_API_requests.wantResult
    );
  });

  it('should throw error when address in params is invalid', async () => {
    const params = { address: 'invalidAddress', client: mockClient };
    expect(async () => getActivitiesByAddress(params)).rejects.toThrow(
      'Invalid address format'
    );
  });
});
