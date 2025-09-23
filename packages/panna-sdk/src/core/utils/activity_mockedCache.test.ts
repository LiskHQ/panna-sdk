import { liskSepolia } from '../chains';
import * as cache from '../helpers/cache';
import * as httpUtils from '../helpers/http';
import * as activity from './activity';
import {
  LAST_PAGE_REACHED,
  getBaseTokenTransferRequestUrl,
  getBaseTransactionsRequestUrl,
  updateTokenTransactionsCache,
  updateTransactionsCache
} from './activity';
import * as fixture from './activity.fixture.test';
import { BlockscoutTransactionsResponse } from './blockscout.types';
import { buildQueryString, getCacheKey } from './common';

// Mock upstream modules
jest.mock('../helpers/cache');
jest.mock('../helpers/http');
jest.mock('./activity', () => jest.requireActual('./activity'));

const mockCacheInstanceDefault = {
  set: jest.fn().mockImplementation(() => mockCacheInstanceDefault),
  get: jest.fn(),
  has: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn()
};

describe('updateTransactionsCache', () => {
  it('should make initial cache fill if no information exists in cache', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest.fn().mockReturnValue(undefined)
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockRequestResponse = fixture.updateTransactionsCache
      .should_make_initial_cache_fill_if_no_information_exists_in_cache
      .mockRequestResponse as unknown as BlockscoutTransactionsResponse;
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);

    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTransactions = getCacheKey(
      params.address,
      params.chainID,
      'transactions'
    );
    const cacheKeyTransactionsNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'transactions_next_params'
    );

    jest
      .spyOn(activity, 'fillTokenTransactions')
      .mockResolvedValue(mockRequestResponse.items);
    await expect(
      updateTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTransactionsRequestUrl(params.address, params.chainID)
    );

    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTransactionsNextPageParams
    );
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      2,
      cacheKeyTransactions
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      1,
      cacheKeyTransactions,
      mockRequestResponse.items
    );
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      2,
      cacheKeyTransactionsNextPageParams,
      LAST_PAGE_REACHED
    );
  });

  it('should not update cache if last page has been reached', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest.fn().mockReturnValue(LAST_PAGE_REACHED)
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTransactionsNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'transactions_next_params'
    );
    await expect(
      updateTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(0);
    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(1);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTransactionsNextPageParams
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(0);
  });

  it('should update cache with next page information if previous page exists', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest.fn().mockReturnValue(undefined)
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockRequestResponse = fixture.updateTransactionsCache
      .should_update_cache_with_next_page_information_if_previous_page_exists
      .mockRequestResponse as unknown as BlockscoutTransactionsResponse;
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);

    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTransactions = getCacheKey(
      params.address,
      params.chainID,
      'transactions'
    );
    const cacheKeyTransactionsNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'transactions_next_params'
    );

    jest
      .spyOn(activity, 'fillTokenTransactions')
      .mockResolvedValue(mockRequestResponse.items);
    await expect(
      updateTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTransactionsRequestUrl(params.address, params.chainID)
    );

    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTransactionsNextPageParams
    );
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      2,
      cacheKeyTransactions
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      1,
      cacheKeyTransactions,
      mockRequestResponse.items
    );
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      2,
      cacheKeyTransactionsNextPageParams,
      mockRequestResponse.next_page_params
    );
  });

  it('should update cache with end of page information if last page is returned', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest.fn().mockReturnValue(undefined)
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockRequestResponse = fixture.updateTransactionsCache
      .should_update_cache_with_end_of_page_information_if_last_page_is_returned
      .mockRequestResponse as unknown as BlockscoutTransactionsResponse;
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);

    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTransactions = getCacheKey(
      params.address,
      params.chainID,
      'transactions'
    );
    const cacheKeyTransactionsNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'transactions_next_params'
    );

    jest
      .spyOn(activity, 'fillTokenTransactions')
      .mockResolvedValue(mockRequestResponse.items);
    await expect(
      updateTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTransactionsRequestUrl(params.address, params.chainID)
    );

    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTransactionsNextPageParams
    );
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      2,
      cacheKeyTransactions
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      1,
      cacheKeyTransactions,
      mockRequestResponse.items
    );
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      2,
      cacheKeyTransactionsNextPageParams,
      LAST_PAGE_REACHED
    );
  });

  it('should throw error if API request returns PannaHttpErr object', async () => {
    const mockCacheInstanceLocal = { ...mockCacheInstanceDefault };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockHttpResponse = {
      code: 'ERR_NETWORK',
      message: 'Connection problems. Retry after some time.'
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockHttpResponse);

    const params = {
      address: '',
      chainID: liskSepolia.id
    };

    await expect(
      updateTransactionsCache(params.address, params.chainID)
    ).rejects.toThrow(
      `Unable to fetch user transactions: ${mockHttpResponse.message}`
    );
  });
});

describe('updateTokenTransactionsCache', () => {
  it('should make initial cache fill if no information exists in cache', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest.fn().mockReturnValue(undefined)
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockRequestResponse = {
      items: [{}],
      next_page_params: { block_number: 123, index: 1, items_count: 3 }
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);
    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTokenTransferTxs = getCacheKey(
      params.address,
      params.chainID,
      'token_transfers'
    );
    const cacheKeyTokenTransferNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'token_transfers_next_params'
    );
    await expect(
      updateTokenTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chainID)
    );

    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferNextPageParams
    );
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferTxs
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferTxs,
      mockRequestResponse.items
    );
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferNextPageParams,
      mockRequestResponse.next_page_params
    );
  });

  it('should not update cache if last page has been reached', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest.fn().mockReturnValue(LAST_PAGE_REACHED)
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTokenTransferNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'token_transfers_next_params'
    );
    await expect(
      updateTokenTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(0);
    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(1);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferNextPageParams
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(0);
  });

  it('should update cache with next page information if previous page exists', async () => {
    const mockNextPageParams = { block_number: 123, index: 1, items_count: 3 };
    const mockCachedTokenTxs = [{}];
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest
        .fn()
        .mockReturnValueOnce(mockNextPageParams)
        .mockReturnValueOnce([...mockCachedTokenTxs])
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockRequestResponse = {
      items: [{}, {}],
      next_page_params: { block_number: 456, index: 3, items_count: 10 }
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);
    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTokenTransferTxs = getCacheKey(
      params.address,
      params.chainID,
      'token_transfers'
    );
    const cacheKeyTokenTransferNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'token_transfers_next_params'
    );
    await expect(
      updateTokenTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chainID).concat(
        buildQueryString(mockNextPageParams)
      )
    );

    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferNextPageParams
    );
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferTxs
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferTxs,
      mockCachedTokenTxs.concat(mockRequestResponse.items)
    );
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferNextPageParams,
      mockRequestResponse.next_page_params
    );
  });

  it('should update cache with end of page information if last page is returned', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest.fn().mockReturnValue(undefined)
    };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockRequestResponse = {
      items: [{}],
      next_page_params: null
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);
    const params = {
      address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
      chainID: liskSepolia.id
    };
    const cacheKeyTokenTransferTxs = getCacheKey(
      params.address,
      params.chainID,
      'token_transfers'
    );
    const cacheKeyTokenTransferNextPageParams = getCacheKey(
      params.address,
      params.chainID,
      'token_transfers_next_params'
    );
    await expect(
      updateTokenTransactionsCache(params.address, params.chainID)
    ).resolves.toBeUndefined();
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(0);
    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chainID)
    );

    expect(mockCacheInstanceLocal.get).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferNextPageParams
    );
    expect(mockCacheInstanceLocal.get).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferTxs
    );

    expect(mockCacheInstanceLocal.set).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferTxs,
      mockRequestResponse.items
    );
    expect(mockCacheInstanceLocal.set).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferNextPageParams,
      LAST_PAGE_REACHED
    );
  });

  it('should throw error if API request returns PannaHttpErr object', async () => {
    const mockCacheInstanceLocal = { ...mockCacheInstanceDefault };
    jest
      .spyOn(cache, 'newLruMemCache')
      .mockImplementation(() => mockCacheInstanceLocal);

    const mockHttpResponse = {
      code: 'ERR_NETWORK',
      message: 'Connection problems. Retry after some time.'
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockHttpResponse);

    const params = {
      address: '',
      chainID: liskSepolia.id
    };

    await expect(
      updateTokenTransactionsCache(params.address, params.chainID)
    ).rejects.toThrow(
      `Unable to fetch user token-transfers: ${mockHttpResponse.message}`
    );
  });
});
