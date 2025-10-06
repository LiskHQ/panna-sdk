import { liskSepolia } from '../chain';
import * as httpUtils from '../helpers/http';
import {
  getBaseNFTCollectionsRequestUrl,
  getBaseNFTRequestUrl,
  getCollectiblesByAddress
} from './collectible';
import * as fixture from './collectible.fixture.test';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  REGEX_URL
} from './constants';

// Mock upstream modules
jest.mock('../helpers/cache', () => jest.requireActual('../helpers/cache'));
jest.mock('../helpers/http');

describe('getBaseNFTRequestUrl', () => {
  it('should return the NFT API endpoint for the given address', () => {
    const address = '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F';
    const url = getBaseNFTRequestUrl(address, liskSepolia.id);

    expect(typeof url).toBe('string');
    expect(url).toMatch(REGEX_URL);
    expect(url.startsWith('https')).toBeTruthy();
    expect(url.endsWith('nft')).toBeTruthy();
    expect(url.includes(address)).toBeTruthy();
  });
});

describe('getBaseNFTCollectionsRequestUrl', () => {
  it('should return the NFT collections API endpoint for the given address', () => {
    const address = '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F';
    const url = getBaseNFTCollectionsRequestUrl(address, liskSepolia.id);

    expect(typeof url).toBe('string');
    expect(url).toMatch(REGEX_URL);
    expect(url.startsWith('https')).toBeTruthy();
    expect(url.endsWith('collections')).toBeTruthy();
    expect(url.includes(address)).toBeTruthy();
  });
});

describe('getCollectiblesByAddress', () => {
  it('should throw error when address in params is invalid', async () => {
    const params = { address: 'invalidAddress' };
    expect(async () => getCollectiblesByAddress(params)).rejects.toThrow(
      'Invalid address format'
    );
  });

  it('should return empty list of collections if none exist', async () => {
    const mockRequestResponse = {
      items: [],
      next_page_params: null
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);

    const params = { address: '0xe1287E785D424cd3d0998957388C4770488ed841' };
    const result = await getCollectiblesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenCalledWith(
      `https://blockscout.lisk.com/api/v2/addresses/${params.address}/nft/collections`
    );
    expect(result).toStrictEqual({
      collectibles: [],
      metadata: {
        count: mockRequestResponse.items.length,
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: DEFAULT_PAGINATION_LIMIT,
        hasNextPage: false
      }
    });
  });

  it('should return list of collectibles (lower than default limit)', async () => {
    const mockRequestResponse =
      fixture.getCollectiblesByAddress
        .should_return_list_of_collectibles_lower_than_default_limit
        .mockRequestResponse;
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);

    const params = {
      address: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
      chain: liskSepolia
    };
    const result = await getCollectiblesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseNFTCollectionsRequestUrl(params.address, liskSepolia.id)
    );
    expect(result).toStrictEqual(
      fixture.getCollectiblesByAddress
        .should_return_list_of_collectibles_lower_than_default_limit.wantResult
    );
  });

  it('should return list of collectibles (multiple API requests)', async () => {
    const mockRequestResponse1 =
      fixture.getCollectiblesByAddress
        .should_return_list_of_collectibles_multiple_API_requests
        .mockRequestResponse1;
    const mockRequestResponse2 =
      fixture.getCollectiblesByAddress
        .should_return_list_of_collectibles_multiple_API_requests
        .mockRequestResponse2;

    (httpUtils.request as jest.Mock)
      .mockResolvedValueOnce(mockRequestResponse1)
      .mockResolvedValueOnce(mockRequestResponse2);
    const params = {
      address: '0x1AC80cE05ed1775BfBb7cEB2D42ed7874810EB3F',
      chain: liskSepolia,
      offset: 3,
      limit: 10
    };
    const result = await getCollectiblesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(2);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseNFTCollectionsRequestUrl(params.address, liskSepolia.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      2,
      `${getBaseNFTCollectionsRequestUrl(params.address, liskSepolia.id)}?token_contract_address_hash=${mockRequestResponse1.next_page_params.token_contract_address_hash}&token_type=${mockRequestResponse1.next_page_params.token_type}`
    );

    expect(result).toStrictEqual(
      fixture.getCollectiblesByAddress
        .should_return_list_of_collectibles_multiple_API_requests.wantResult
    );
  });
});
