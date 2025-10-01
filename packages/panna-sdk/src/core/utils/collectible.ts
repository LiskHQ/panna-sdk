import { lisk } from '../chains';
import { newLruMemCache } from '../helpers/cache';
import * as httpUtils from '../helpers/http';
import { PannaHttpErr } from '../helpers/http';
import {
  BlockscoutAddressNFTCollection,
  BlockscoutNFTCollectionsResponse,
  BlockscoutNFTNextPageParams,
  BlockscoutAddressNFTInstanceCollection
} from './blockscout.types';
import {
  Collectible,
  CollectibleMetadata,
  GetCollectiblesByAddressParams,
  GetCollectiblesByAddressResult,
  ImageType,
  Token,
  TokenInstance
} from './collectible.types';
import {
  buildQueryString,
  getBaseApiUrl,
  getCacheKey,
  isValidAddress
} from './common';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET
} from './constants';

// Collectible cache
const collectibleCache = newLruMemCache('collectible');

/**
 * Get blockscout NFT collections endpoint.
 * @param address The address for which to return the NFT collections API endpoint.
 * @returns Blockscout NFT collections API endpoint for the supplied address.
 */
export const getBaseNFTRequestUrl = (
  address: string,
  chainID: number
): string => {
  const BASE_API_URL = getBaseApiUrl(chainID);
  return `${BASE_API_URL}/addresses/${address}/nft`;
};

/**
 * Get blockscout NFT collections endpoint.
 * @param address The address for which to return the NFT collections API endpoint.
 * @returns Blockscout NFT collections API endpoint for the supplied address.
 */
export const getBaseNFTCollectionsRequestUrl = (
  address: string,
  chainID: number
): string => {
  const BASE_API_URL = getBaseApiUrl(chainID);
  return `${BASE_API_URL}/addresses/${address}/nft/collections`;
};

/**
 * Get collectibles held by an account.
 * @param params - Parameters for fetching the collectibles.
 * @param params.address - The account address for which to retrieve the collectibles.
 * @param params.chain - (Optional) Chain object type. (Default: lisk)
 * @param params.offset - (Optional) The number of items to be skipped from the matching result. (Default: 0)
 * @param params.limit - (Optional) The number of items to be returned from the matching result. (Default: 10)
 * @returns Collectibles owned by the account.
 * @throws Error if address is invalid.
 * @example
 * ```ts
 * // Get list of collectibles owned by a given account
 * const result = await getCollectiblesByAddress({ address: userAddress, offset: 0, limit: 10 });
 * // result: {
 * // collectibles: [{
 * //   numInstancesOwned: 3,
 * //   token: {
 * //     name: 'Lisk Locking Position',
 * //     symbol: 'LLP',
 * //     type: 'erc-721',
 * //     address: '0x...',
 * //     icon: null
 * //   },
 * //   instances:[{
 * //     id: '1234',
 * //     imageType: 'unknown',
 * //     image: null,
 * //     name: null
 * //   }, ...]
 * // }, {
 * //   numInstancesOwned: 1,
 * //   token: {
 * //     name: 'Lisk of Life',
 * //     symbol: 'LOL',
 * //     type: 'erc-721',
 * //     address: '0x...',
 * //     icon: null
 * //   },
 * //   instances:[{
 * //     id: '1234',
 * //     imageType: 'url',
 * //     image: 'https://example.url/NFT-image.jpg',
 * //     name: 'Lisk of Life # 1234'
 * //   }]
 * // }, {
 * //   numInstancesOwned: 3,
 * //   token: {
 * //     name: 'Rarible',
 * //     symbol: 'RARI',
 * //     type: 'erc-1155',
 * //     address: '0x...',
 * //     icon: null
 * //   },
 * //   instances:[{
 * //     id: '1234',
 * //     imageType: 'url',
 * //     image: 'https://example.url/NFT-image.jpg',
 * //     name: 'Iron boy'
 * //   }, ...]
 * // }, ...],
 * // metadata: { count: 10, offset: 0, limit: 10, hasNextPage: true }
 * // }
 * ```
 */
export const getCollectiblesByAddress = async function (
  params: GetCollectiblesByAddressParams
): Promise<GetCollectiblesByAddressResult> {
  if (!isValidAddress(params.address)) {
    throw new Error('Invalid address format');
  }

  // Set default pagination params
  const {
    address,
    chain = lisk,
    offset = DEFAULT_PAGINATION_OFFSET,
    limit = DEFAULT_PAGINATION_LIMIT
  } = params;

  const ckCollectibles = getCacheKey(address, chain.id, 'collectibles');
  const ckNextPageParams = getCacheKey(
    address,
    chain.id,
    'collectibles_next_params'
  );

  const userCollections: BlockscoutAddressNFTCollection[] =
    (collectibleCache.get(ckCollectibles) ||
      []) as BlockscoutAddressNFTCollection[];

  let nextPageParams: BlockscoutNFTNextPageParams | null =
    (collectibleCache.get(ckNextPageParams) as BlockscoutNFTNextPageParams) ||
    null;

  const baseCollectionsRequestUrl = getBaseNFTCollectionsRequestUrl(
    address,
    chain.id
  );
  while (userCollections.length < offset + limit) {
    // No new pages exist, avoid unnecessary API calls
    if (userCollections.length && nextPageParams === null) {
      break;
    }

    const requestUrl = baseCollectionsRequestUrl.concat(
      buildQueryString(nextPageParams)
    );
    const response = await httpUtils.request(requestUrl);

    const errResponse = response as PannaHttpErr;
    if ('code' in errResponse && 'message' in errResponse) {
      throw new Error(
        `Unable to fetch user NFT collections: ${errResponse.message}`
      );
    }

    const blockscoutRes =
      response as unknown as BlockscoutNFTCollectionsResponse;
    userCollections.push(...blockscoutRes.items);
    nextPageParams = blockscoutRes.next_page_params;

    collectibleCache.set(ckCollectibles, userCollections);
    collectibleCache.set(ckNextPageParams, nextPageParams);

    // Continue the loop only if more pages exist
    // Second condition ensures handling of no existing collections
    if (
      nextPageParams === null &&
      userCollections.length >= blockscoutRes.items.length
    ) {
      collectibleCache.delete(ckNextPageParams);
      break;
    }
  }

  const collectibles: Collectible[] = userCollections
    .slice(offset, offset + limit)
    .map((collection) => {
      const numInstancesOwned = Number(collection.amount);

      const token: Token = {
        name: collection.token.name,
        symbol: collection.token.symbol,
        type: collection.token.type.toLowerCase(),
        address: collection.token.address_hash as string,
        icon: collection.token.icon_url
      };

      const instances: TokenInstance[] = collection.token_instances.map((e) => {
        const instance: TokenInstance = {
          id: e.id,
          imageType: determineImageType(e),
          image:
            e.image_url ||
            e.metadata?.image_url ||
            e.metadata?.image_data ||
            null,
          name: e.metadata?.name,
          value: e.value || null
        };
        return instance;
      });

      const collectible: Collectible = { numInstancesOwned, token, instances };
      return collectible;
    });

  const metadata: CollectibleMetadata = {
    count: collectibles.length,
    offset,
    limit,
    hasNextPage:
      nextPageParams != null || userCollections.length > offset + limit
  };

  const result: GetCollectiblesByAddressResult = { collectibles, metadata };
  return result;
};

function determineImageType(
  e: BlockscoutAddressNFTInstanceCollection
): ImageType {
  if (
    ['https', 'ipfs', 'data'].find((type) =>
      (e.image_url || e.metadata?.image_url || '').startsWith(type)
    )
  ) {
    return ImageType.URL;
  } else if (
    typeof e.metadata?.image_data === 'string' &&
    /^<svg[\s>]/i.test(e.metadata.image_data)
  ) {
    return ImageType.SVG;
  } else {
    return ImageType.UNKNOWN;
  }
}
