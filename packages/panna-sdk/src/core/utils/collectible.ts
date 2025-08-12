import { newLruMemCache } from '../helpers/cache';
import * as httpUtils from '../helpers/http';
import { getCacheKey } from './activity';
import {
  BlockscoutAddressNFTCollection,
  BlockscoutNFTNextPageParams,
  BlockscoutNFTCollectionsResponse,
  Collectible,
  CollectibleMetadata,
  GetCollectiblesByAddressParams,
  GetCollectiblesByAddressResult,
  Token,
  TokenInstance
} from './collectible.types';
import { isValidAddress } from './common';
import {
  BASE_BLOCKSCOUT_URL,
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_PAGINATION_LIMIT
} from './constants';

// Collectible cache
const collectibleCache = newLruMemCache('collectible');

/**
 * Get blockscout NFT collections endpoint.
 * @param address The address for which to return the NFT collections API endpoint.
 * @returns Blockscout NFT collections API endpoint for the supplied address.
 */
export const getBaseNFTRequestUrl = (address: string): string =>
  `${BASE_BLOCKSCOUT_URL}/addresses/${address}/nft`;

/**
 * Get blockscout NFT collections endpoint.
 * @param address The address for which to return the NFT collections API endpoint.
 * @returns Blockscout NFT collections API endpoint for the supplied address.
 */
export const getBaseNFTCollectionsRequestUrl = (address: string): string =>
  `${BASE_BLOCKSCOUT_URL}/addresses/${address}/nft/collections`;

/**
 * Get collectibles held by an account.
 * @param params - Parameters for fetching the collectibles.
 * @param params.address - The account address for which to retrieve the collectibles.
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
 * //     image: 'https://example.url/NFT-image.jpg',
 * //     name: 'Iron boy'
 * //   }, ...]
 * // }, ...],
 * // metadata: { count: 10, offset: 0, limit: 10, hasNextPage: true }
 * // }
 * ```
 */
export const getCollectiblesByAddress = async function name(
  params: GetCollectiblesByAddressParams
): Promise<GetCollectiblesByAddressResult> {
  if (!isValidAddress(params.address)) {
    throw new Error('Invalid address format');
  }

  // Set default pagination params
  const {
    address,
    offset = DEFAULT_PAGINATION_OFFSET,
    limit = DEFAULT_PAGINATION_LIMIT
  } = params;

  const cacheKeyCollectibles = getCacheKey(address, 'collectibles');
  const cacheKeyNextPageParams = getCacheKey(
    address,
    'collectibles_next_params'
  );

  const userCollections: BlockscoutAddressNFTCollection[] =
    collectibleCache.has(cacheKeyCollectibles)
      ? (collectibleCache.get(
          cacheKeyCollectibles
        ) as BlockscoutAddressNFTCollection[])
      : [];

  let nextPageParams: BlockscoutNFTNextPageParams | null = collectibleCache.has(
    cacheKeyNextPageParams
  )
    ? (collectibleCache.get(
        cacheKeyNextPageParams
      ) as BlockscoutNFTNextPageParams)
    : null;

  const baseCollectionsRequestUrl = getBaseNFTCollectionsRequestUrl(address);
  while (userCollections.length <= offset + limit) {
    const requestUrl =
      nextPageParams === null
        ? baseCollectionsRequestUrl
        : `${baseCollectionsRequestUrl}?token_contract_address_hash=${nextPageParams.token_contract_address_hash}&token_type=${nextPageParams.token_type}`;

    const response: BlockscoutNFTCollectionsResponse =
      await httpUtils.request(requestUrl);

    if ('code' in response && 'message' in response) {
      throw new Error(`Cannot fetch user NFT collections: ${response.message}`);
    }

    userCollections.push(...response.items);
    nextPageParams = response.next_page_params;

    collectibleCache.set(cacheKeyCollectibles, userCollections);
    collectibleCache.set(cacheKeyNextPageParams, nextPageParams);

    // Continue the loop only if more pages exist
    // Second condition ensures handling of no existing activities
    if (
      nextPageParams === null &&
      userCollections.length >= response.items.length
    ) {
      collectibleCache.delete(cacheKeyNextPageParams);
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
        address: collection.token.address,
        icon: collection.token.icon_url
      };

      const instances: TokenInstance[] = collection.token_instances.map((e) => {
        const instance: TokenInstance = {
          id: e.id,
          image: e.image_url || e.metadata?.image_url,
          name: e.metadata?.name
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
