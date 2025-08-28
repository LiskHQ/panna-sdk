import { liskSepolia } from '../chains';
import * as cache from '../helpers/cache';
import * as httpUtils from '../helpers/http';
import {
  LAST_PAGE_REACHED,
  getBaseTokenTransferRequestUrl,
  updateTokenTransactionsCache
} from './activity';
import { getCacheKey } from './common';

// Mock upstream modules
jest.mock('../helpers/cache');
jest.mock('../helpers/http');
jest.mock('./activity', () => jest.requireActual('./activity'));

describe('updateTokenTransactionsCache', () => {
  const mockCacheInstanceDefault = {
    set: jest.fn().mockImplementation(() => mockCacheInstanceDefault),
    get: jest.fn(),
    has: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn()
  };

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
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.has).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferTxs
    );
    expect(mockCacheInstanceLocal.has).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferNextPageParams
    );

    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chainID)
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

  it('should update cache with next page information if previous page exists', async () => {
    const mockCacheInstanceLocal = {
      ...mockCacheInstanceDefault,
      set: jest.fn().mockImplementation(() => mockCacheInstanceLocal),
      get: jest
        .fn()
        .mockReturnValueOnce([{}])
        .mockReturnValueOnce({ block_number: 123, index: 1, items_count: 3 })
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
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.has).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferTxs
    );
    expect(mockCacheInstanceLocal.has).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferNextPageParams
    );

    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chainID)
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
    expect(mockCacheInstanceLocal.has).toHaveBeenCalledTimes(2);
    expect(mockCacheInstanceLocal.has).toHaveBeenNthCalledWith(
      1,
      cacheKeyTokenTransferTxs
    );
    expect(mockCacheInstanceLocal.has).toHaveBeenNthCalledWith(
      2,
      cacheKeyTokenTransferNextPageParams
    );

    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTokenTransferRequestUrl(params.address, params.chainID)
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
