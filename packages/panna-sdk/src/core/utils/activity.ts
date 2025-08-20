import { ethIcon } from '@/consts';
import { lisk } from '../chains';
import { NATIVE_TOKEN_ADDRESS } from '../defaults';
import { newLruMemCache } from '../helpers/cache';
import * as httpUtils from '../helpers/http';
import { PannaHttpErr } from '../helpers/http';
import {
  // const
  TokenERC,
  TransactionActivity,
  type Activity,
  type ActivityMetadata,
  type ActivityType,
  type ERC1155Amount,
  type ERC20Amount,
  type ERC721Amount,
  type EtherAmount,
  // type
  type GetActivitiesByAddressParams,
  type GetActivitiesByAddressResult,
  type TokenType,
  type TransactionAmount
} from './activity.types';
import {
  type BlockscoutNextPageParams,
  type BlockscoutTokenTransfer,
  type BlockscoutTokenTransfersResponse,
  type BlockscoutTotalERC1155,
  type BlockscoutTotalERC721,
  type BlockscoutTransaction,
  type BlockscoutTransactionsResponse
} from './blockscout.types';
import { getBaseApiUrl, getCacheKey, isValidAddress } from './common';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET
} from './constants';

// Activity cache
const activityCache = newLruMemCache('activity');

/**
 * Get blockscout transactions endpoint.
 * @param address The address for which to return the transactions API endpoint.
 * @returns Blockscout transactions API endpoint for the supplied address.
 */
export const getBaseTransactionsRequestUrl = (
  address: string,
  chainID: number
): string => {
  const BASE_API_URL = getBaseApiUrl(chainID);
  return `${BASE_API_URL}/addresses/${address}/transactions`;
};

/**
 * Get blockscout token transfers endpoint.
 * @param address The address for which to return the token transfers API endpoint.
 * @returns Blockscout token transfers API endpoint for the supplied address.
 */
export const getBaseTokenTransferRequestUrl = (
  address: string,
  chainID: number
): string => {
  const BASE_API_URL = getBaseApiUrl(chainID);
  return `${BASE_API_URL}/addresses/${address}/token-transfers`;
};

/*
 * Get recent activities for an account.
 * @param params - Parameters for fetching the account activities.
 * @param params.address - The address for which to retrieve the activities.
 * @param params.chain - (Optional) Chain object type. (Default: lisk)
 * @param params.offset - (Optional) The number of items to be skipped from the matching result. (Default: 0)
 * @param params.limit - (Optional) The number of items to be returned from the matching result. (Default: 10)
 * @returns Account activity information.
 * @throws Error if address is invalid.
 * @example
 * ```ts
 * // Get list of recent activities for the specified user
 * const result = await getActivitiesByAddress({ address: userAddress, offset: 0, limit: 10 });
 * // result: {
 * //   activities: [{
 * //     activityType: 'sent',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'eth',
 * //       value: '100000000000',
 * //       tokenInfo: {
 * //         address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
 * //         name: 'Ether',
 * //         symbol: 'ETH',
 * //         decimals: 18,
 * //         type: 'eth'
 * //       }
 * //     },
 * //     status: 'ok'
 * //   }, {
 * //     activityType: 'received',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'erc-20',
 * //       value: '100000000000',
 * //       tokenInfo: {
 * //         address: '0x...',
 * //         name: 'Lisk',
 * //         symbol: 'LSK',
 * //         decimals: 18,
 * //         type: 'erc-20'
 * //         icon: null
 * //       }
 * //     },
 * //     status: 'ok'
 * //   }, {
 * //     activityType: 'received',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'erc-721',
 * //       tokenId: '9500',
 * //       instance: {
 * //         id: '9500',
 * //         isUnique: null,
 * //         owner: null,
 * //         tokenInfo: {
 * //           address: '0x...',
 * //           name: 'Lisk of Life',
 * //           symbol: 'LOL',
 * //           decimals: null,
 * //           type: 'erc-721',
 * //           icon: null
 * //         }
 * //       },
 * //     status: 'ok'
 * //   }, {
 * //     activityType: 'minted',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'erc-1155',
 * //       tokenId: '29900446396079726096...',
 * //       value: '100000000000',
 * //       tokenInfo: {
 * //         address: '0x...',
 * //         name: 'Rarible',
 * //         symbol: RARI,
 * //         decimals: null,
 * //         type: 'erc-1155',
 * //         icon: null
 * //       }
 * //     },
 * //     status: 'error'
 * //   }, ...],
 * //   metadata: { count: 10, offset: 0, limit: 10, hasNextPage: true }
 * // }
 * ```
 */
export const getActivitiesByAddress = async function (
  params: GetActivitiesByAddressParams
): Promise<GetActivitiesByAddressResult> {
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
  const cacheKeyTransactions = getCacheKey(address, chain.id, 'transactions');
  const cacheKeyNextPageParams = getCacheKey(
    address,
    chain.id,
    'transactions_next_params'
  );

  const userTransactions: BlockscoutTransaction[] = (activityCache.get(
    cacheKeyTransactions
  ) || []) as BlockscoutTransaction[];

  let nextPageParams: BlockscoutNextPageParams | null =
    (activityCache.get(cacheKeyNextPageParams) as BlockscoutNextPageParams) ||
    null;

  const baseTxRequestUrl = getBaseTransactionsRequestUrl(address, chain.id);
  while (userTransactions.length <= offset + limit) {
    // No new pages exist, avoid unnecessary API calls
    if (userTransactions.length && nextPageParams === null) {
      break;
    }

    const requestUrl =
      nextPageParams === null
        ? baseTxRequestUrl
        : `${baseTxRequestUrl}?block_number=${nextPageParams.block_number}&index=${nextPageParams.index}&items_count=${nextPageParams.items_count}`;

    const response = await httpUtils.request(requestUrl);

    const errResponse = response as PannaHttpErr;
    if ('code' in errResponse && 'message' in errResponse) {
      throw new Error(
        `Unable to fetch user activities: ${errResponse.message}`
      );
    }

    const blockscoutRes = response as unknown as BlockscoutTransactionsResponse;
    userTransactions.push(
      ...(await fillTokenTransactions(address, chain.id, blockscoutRes.items))
    );
    nextPageParams = blockscoutRes.next_page_params;

    activityCache.set(cacheKeyTransactions, userTransactions);
    activityCache.set(cacheKeyNextPageParams, nextPageParams);

    // Continue the loop only if more pages exist
    // Second condition ensures handling of no existing activities
    if (
      nextPageParams === null &&
      userTransactions.length >= blockscoutRes.items.length
    ) {
      activityCache.delete(cacheKeyNextPageParams);
      break;
    }
  }

  const activities: Activity[] = userTransactions
    .slice(offset, offset + limit)
    .map((tx) => {
      try {
        const transactionID = tx.hash;
        const status = tx.result;

        let activityType: ActivityType = TransactionActivity.SENT;

        if (tx.from.hash.toLowerCase() === address.toLowerCase()) {
          activityType = TransactionActivity.SENT;
        } else if (tx.to.hash.toLowerCase() === address.toLowerCase()) {
          activityType = TransactionActivity.RECEIVED;
        } else if (
          tx.to.is_contract &&
          tx.token_transfers.find(
            (t) => t.type.toLowerCase() === 'token_minting'
          )
        ) {
          activityType = TransactionActivity.MINTED;
        }

        let amount: TransactionAmount;
        const amountType = getAmountType(address, tx);
        switch (amountType) {
          case TokenERC.ETH: {
            amount = {
              type: TokenERC.ETH,
              value: tx.value,
              tokenInfo: {
                address: NATIVE_TOKEN_ADDRESS,
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
                type: TokenERC.ETH,
                icon: ethIcon
              }
            } as EtherAmount;
            break;
          }

          case TokenERC.ERC20: {
            const erc20Tx = tx.token_transfers.find(
              (e) => e.token.type.toLowerCase() === TokenERC.ERC20
            );

            amount = {
              type: TokenERC.ERC20,
              value: tx.value,
              tokenInfo: {
                address: erc20Tx?.token.address,
                name: erc20Tx?.token.name,
                symbol: erc20Tx?.token.symbol,
                decimals: erc20Tx?.token.decimals
                  ? Number(erc20Tx?.token.decimals)
                  : 0,
                type: TokenERC.ERC20,
                icon: erc20Tx?.token.icon_url
              }
            } as ERC20Amount;
            break;
          }

          case TokenERC.ERC721: {
            const erc721Tx = tx.token_transfers.find(
              (e) => e.token.type.toLowerCase() === TokenERC.ERC721
            );
            const erc721TxTotal = erc721Tx?.total as BlockscoutTotalERC721;

            amount = {
              type: TokenERC.ERC721,
              tokenId: erc721TxTotal.token_id,
              instance: {
                id: erc721TxTotal.token_instance.id,
                isUnique: erc721TxTotal.token_instance.is_unique,
                owner: erc721TxTotal.token_instance.owner,
                tokenInfo: {
                  address: erc721Tx?.token.address,
                  name: erc721Tx?.token.name,
                  symbol: erc721Tx?.token.symbol,
                  decimals: erc721Tx?.token.decimals,
                  type: TokenERC.ERC721,
                  icon: erc721Tx?.token.icon_url
                }
              }
            } as unknown as ERC721Amount;
            break;
          }

          case TokenERC.ERC1155: {
            const erc1155Tx = tx.token_transfers.find(
              (e) => e.token.type.toLowerCase() === TokenERC.ERC1155
            );
            const erc1155TxTotal = erc1155Tx?.total as BlockscoutTotalERC1155;

            amount = {
              type: TokenERC.ERC1155,
              tokenId: erc1155TxTotal.token_id,
              value: erc1155TxTotal.value,
              instance: {
                id: erc1155TxTotal.token_instance.id,
                isUnique: erc1155TxTotal.token_instance.is_unique,
                owner: erc1155TxTotal.token_instance.owner,
                tokenInfo: {
                  address: erc1155Tx?.token.address,
                  name: erc1155Tx?.token.name,
                  symbol: erc1155Tx?.token.symbol,
                  decimals: erc1155Tx?.token.decimals,
                  type: TokenERC.ERC1155,
                  icon: erc1155Tx?.token.icon_url
                }
              }
            } as unknown as ERC1155Amount;
            break;
          }
        }

        const activity: Activity = {
          activityType,
          transactionID,
          amount,
          status
        };
        return activity;
      } catch (error) {
        return null;
      }
    })
    .filter((e) => e !== null);

  const metadata: ActivityMetadata = {
    count: activities.length,
    offset,
    limit,
    hasNextPage:
      nextPageParams != null || userTransactions.length >= offset + limit
  };

  const result: GetActivitiesByAddressResult = { activities, metadata };

  return result;
};

/**
 * Fill transactions with the token transfers details (when applicable) that are used to determine the user's activity details.
 * @param address The address corresponding which the token transfers need to be filled.
 * @param transactions The transactions list that need to be filled with the token transactions information.
 * @returns The input transaction objects filled with token transfers when applicable.
 */
export const fillTokenTransactions = async (
  address: string,
  chainID: number,
  transactions: BlockscoutTransaction[]
): Promise<BlockscoutTransaction[]> => {
  // Do not proceed (avoid unnecessary API calls) if there are no transactions
  if (transactions.length === 0) {
    return transactions;
  }

  const cacheKeyTokenTransferTxs = getCacheKey(
    address,
    chainID,
    'token_transfers'
  );
  const cacheKeyTokenTransferNextPageParams = getCacheKey(
    address,
    chainID,
    'token_transfers_next_params'
  );

  for (let tx of transactions) {
    // Set to empty array to ensure array functions on `token_transfers`
    // within getActivity do not throw error
    if (!Array.isArray(tx.token_transfers)) {
      tx.token_transfers = [];
    }

    if (
      tx.transaction_types.includes('contract_call') &&
      tx.transaction_types.find((e) => e.startsWith('token_'))
    ) {
      let shouldRetryAfterUpdatingTTCache: boolean = true;
      do {
        const userTokenTransfers: BlockscoutTokenTransfer[] =
          (activityCache.get(cacheKeyTokenTransferTxs) ||
            []) as BlockscoutTokenTransfer[];

        const nextPageParams = (() => {
          const val = activityCache.get(cacheKeyTokenTransferNextPageParams);
          if (val) {
            return val as BlockscoutNextPageParams;
          } else {
            return val;
          }
        })() as BlockscoutNextPageParams | null | undefined;

        const tokenTransferTxs = userTokenTransfers.filter(
          (e) => e.transaction_hash === tx.hash
        );

        if (
          nextPageParams !== null &&
          // no matching token transfer transactions exist in cache
          ((tokenTransferTxs.length === 0 && nextPageParams === undefined) ||
            // matching token transfer transactions partially exist in cache
            (nextPageParams !== undefined &&
              tx.block_number <= nextPageParams.block_number))
        ) {
          await updateTokenTransactionsCache(address, chainID);
          continue;
        }

        shouldRetryAfterUpdatingTTCache = false;
        tx.token_transfers.push(...tokenTransferTxs);

        // Evict the token transfers from the cache for the given transaction,
        // since they are already included (above) within the transaction itself
        activityCache.set(
          cacheKeyTokenTransferTxs,
          userTokenTransfers.filter((e) => e.transaction_hash != tx.hash)
        );
      } while (shouldRetryAfterUpdatingTTCache);
    }
  }

  return transactions;
};

/**
 * Update the cache for the given address with token transfer transactions (one page with one invocation), if exists.
 * @param address - The address for which to update the token transactions cache.
 * @param chainID - Chain identifier for which the token transfers are being cached.
 * @returns void
 * @throws Error if the external API call fails.
 */
export const updateTokenTransactionsCache = async (
  address: string,
  chainID: number
): Promise<void> => {
  const cacheKeyTokenTransferTxs = getCacheKey(
    address,
    chainID,
    'token_transfers'
  );
  const cacheKeyTokenTransferNextPageParams = getCacheKey(
    address,
    chainID,
    'token_transfers_next_params'
  );

  let userTokenTransfers: BlockscoutTokenTransfer[] = activityCache.has(
    cacheKeyTokenTransferTxs
  )
    ? (activityCache.get(cacheKeyTokenTransferTxs) as BlockscoutTokenTransfer[])
    : [];

  let nextPageParams: BlockscoutNextPageParams | null = activityCache.has(
    cacheKeyTokenTransferNextPageParams
  )
    ? (activityCache.get(
        cacheKeyTokenTransferNextPageParams
      ) as BlockscoutNextPageParams)
    : null;

  const baseRequestUrl = getBaseTokenTransferRequestUrl(address, chainID);
  const requestUrl =
    nextPageParams === null
      ? baseRequestUrl
      : `${baseRequestUrl}?block_number=${nextPageParams.block_number}&index=${nextPageParams.index}&items_count=${nextPageParams.items_count}`;

  const response = await httpUtils.request(requestUrl);

  const errResponse = response as PannaHttpErr;
  if ('code' in errResponse && 'message' in errResponse) {
    throw new Error(
      `Unable to fetch user token-transfers: ${errResponse.message}`
    );
  }

  const blockscoutRes = response as unknown as BlockscoutTokenTransfersResponse;
  userTokenTransfers.push(...blockscoutRes.items);
  activityCache.set(cacheKeyTokenTransferTxs, userTokenTransfers);

  activityCache.set(cacheKeyTokenTransferNextPageParams, nextPageParams);
};

/*
 * Get amount type (known ERC standards or ETH) for a given transaction.
 * @param address - User address.
 * @param tx - Valid BlockscoutTransaction type.
 * @returns The determined ETH/ERC standard for the transacted amount.
 * @throws Error if unknown transaction amount type.
 * @example
 * ```ts
 * const result = await getAmountType(userAddress, blockscoutTransaction);
 * // result: eth | erc-20 | erc-721 | erc-1155
 * ```
 */
export const getAmountType = (
  address: string,
  tx: BlockscoutTransaction
): TokenType => {
  if (
    tx.transaction_types.includes('contract_call') &&
    tx.transaction_types.find((e) => e.startsWith('token_'))
  ) {
    const tokenTransferTx = tx.token_transfers.find(
      (t) =>
        ['token_transfer', 'token_minting'].includes(t.type.toLowerCase()) &&
        (t.from.hash.toLowerCase() === address.toLowerCase() ||
          t.to.hash.toLowerCase() === address.toLowerCase())
    );

    if (!tokenTransferTx) {
      throw new Error('Unable to determine transaction amount type');
    }

    switch (tokenTransferTx.token.type.toLowerCase()) {
      case TokenERC.ERC20.toLowerCase():
        return TokenERC.ERC20;

      case TokenERC.ERC721.toLowerCase():
        return TokenERC.ERC721;

      case TokenERC.ERC1155.toLowerCase():
        return TokenERC.ERC1155;

      default:
        throw new Error('Unable to determine the amount ERC standard');
    }
  }

  // Assume default to be ETH
  return TokenERC.ETH;
};
