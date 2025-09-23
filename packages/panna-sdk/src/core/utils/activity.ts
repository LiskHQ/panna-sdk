import { ethIcon } from '../../react/consts';
import { lisk } from '../chains';
import { NATIVE_TOKEN_ADDRESS } from '../defaults';
import { newLruMemCache } from '../helpers/cache';
import * as httpUtils from '../helpers/http';
import { PannaHttpErr } from '../helpers/http';
import {
  // const
  TokenERC,
  TransactionActivity,
  InternalTransactionType,
  // type
  type Activity,
  type ActivityMetadata,
  type ActivityType,
  type CachedBlockscoutNextPageParams,
  type ERC1155Amount,
  type ERC20Amount,
  type ERC721Amount,
  type EtherAmount,
  type GetActivitiesByAddressParams,
  type GetActivitiesByAddressResult,
  type PreProcessedActivity,
  type TokenType,
  type TransactionAmount
} from './activity.types';
import {
  type BlockscoutInternalTransaction,
  type BlockscoutInternalTransactionsResponse,
  type BlockscoutTokenTransfer,
  type BlockscoutTokenTransfersResponse,
  type BlockscoutTotalERC20,
  type BlockscoutTotalERC1155,
  type BlockscoutTotalERC721,
  type BlockscoutTransaction,
  type BlockscoutTransactionsResponse
} from './blockscout.types';
import {
  getBaseApiUrl,
  getCacheKey,
  isValidAddress,
  buildQueryString
} from './common';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET
} from './constants';

// Global constants
const ACTIVITY_CACHE_ID = 'activity';
export const LAST_PAGE_REACHED = 'last_page_reached';

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

/**
 * Get blockscout internal transactions endpoint.
 * @param address The address for which to return the internal transactions API endpoint.
 * @returns Blockscout internal transactions API endpoint for the supplied address.
 */
export const getBaseInternalTransactionsRequestUrl = (
  address: string,
  chainID: number
): string => {
  const BASE_API_URL = getBaseApiUrl(chainID);
  return `${BASE_API_URL}/addresses/${address}/internal-transactions`;
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

  // Activity cache
  const activityCache = newLruMemCache(ACTIVITY_CACHE_ID);

  // Set default request params
  const {
    address,
    chain = lisk,
    offset = DEFAULT_PAGINATION_OFFSET,
    limit = DEFAULT_PAGINATION_LIMIT
  } = params;

  const cacheKeyActivities = getCacheKey(address, chain.id, 'activities');
  const cacheKeyInternalTxs = getCacheKey(
    address,
    chain.id,
    'internal_transactions'
  );
  const cacheKeyTransactions = getCacheKey(address, chain.id, 'transactions');
  const cacheKeyTokenTransferTxs = getCacheKey(
    address,
    chain.id,
    'token_transfers'
  );
  const cacheKeyActivitiesLoadingStatus = getCacheKey(
    address,
    chain.id,
    'activities_next_page_params'
  );
  const cacheKeyInternalTxsNextPageParams = getCacheKey(
    address,
    chain.id,
    'internal_transactions_next_params'
  );
  const cacheKeyTransactionsNextPageParams = getCacheKey(
    address,
    chain.id,
    'transactions_next_params'
  );
  const cacheKeyTokenTransferNextPageParams = getCacheKey(
    address,
    chain.id,
    'token_transfers_next_params'
  );

  const preProcessedActivities: PreProcessedActivity[] = (activityCache.get(
    cacheKeyActivities
  ) || []) as PreProcessedActivity[];
  for (; preProcessedActivities.length <= offset + limit; ) {
    if (
      activityCache.get(cacheKeyActivitiesLoadingStatus) === LAST_PAGE_REACHED
    ) {
      // Break the loop to avoid unnecessary API calls if all user activities are available in cache
      break;
    }

    const userInternalTxs = (activityCache.get(cacheKeyInternalTxs) ||
      []) as BlockscoutInternalTransaction[];
    const userTransactions = (activityCache.get(cacheKeyTransactions) ||
      []) as BlockscoutTransaction[];
    const userTokenTransfers = (activityCache.get(cacheKeyTokenTransferTxs) ||
      []) as BlockscoutTokenTransfer[];

    if (
      userInternalTxs.length +
        userTransactions.length +
        userTokenTransfers.length <=
      offset + limit
    ) {
      //TODO: Optimize the below logic to call only one of the update* functions based on the least block height
      const userInternalTxsNextPageParams: CachedBlockscoutNextPageParams =
        (activityCache.get(cacheKeyInternalTxsNextPageParams) ||
          null) as CachedBlockscoutNextPageParams;
      if (
        (userInternalTxsNextPageParams as unknown as string) !==
        LAST_PAGE_REACHED
      ) {
        await updateInternalTransactionsCache(address, chain.id);
      }

      const userTxsNextPageParams: CachedBlockscoutNextPageParams =
        (activityCache.get(cacheKeyTransactionsNextPageParams) ||
          null) as CachedBlockscoutNextPageParams;
      if ((userTxsNextPageParams as unknown as string) !== LAST_PAGE_REACHED) {
        await updateTransactionsCache(address, chain.id);
      }

      const userTTxsNextPageParams: CachedBlockscoutNextPageParams =
        (activityCache.get(cacheKeyTokenTransferNextPageParams) ||
          null) as CachedBlockscoutNextPageParams;
      if ((userTTxsNextPageParams as unknown as string) !== LAST_PAGE_REACHED) {
        await updateTokenTransactionsCache(address, chain.id);
      }

      if (
        (userInternalTxsNextPageParams as unknown as string) ===
          LAST_PAGE_REACHED &&
        (userTxsNextPageParams as unknown as string) === LAST_PAGE_REACHED &&
        (userTTxsNextPageParams as unknown as string) === LAST_PAGE_REACHED
      ) {
        activityCache.set(cacheKeyActivitiesLoadingStatus, LAST_PAGE_REACHED);
      } else {
        continue; // To avoid duplication of entries in preProcessedActivities
      }
    }

    preProcessedActivities.push(...userTransactions);
    userInternalTxs.forEach((itx) => {
      const mockedTx = {
        block_number: itx.block_number,
        timestamp: itx.timestamp,
        from: itx.from,
        to: itx.to,
        hash: itx.transaction_hash,
        value: itx.value,
        token_transfers: [],
        transaction_types: [
          'contract_call',
          'internal_transaction',
          'coin_transfer'
        ],
        result: itx.success ? 'success' : 'error',
        status: itx.success ? 'ok' : 'error',
        internal_tx_type: itx.type
      } as PreProcessedActivity;

      preProcessedActivities.push(mockedTx);
    });
    userTokenTransfers.forEach((tt) => {
      const mockedTx = {
        block_number: tt.block_number,
        timestamp: tt.timestamp,
        from: tt.from,
        to: tt.to,
        hash: tt.transaction_hash,
        token_transfers: [tt],
        transaction_types: ['contract_call', tt.type],
        result: 'success',
        status: 'ok'
      } as PreProcessedActivity;

      preProcessedActivities.push(mockedTx);
    });
    preProcessedActivities.sort((a, b) => b.block_number - a.block_number);

    activityCache.set(cacheKeyActivities, preProcessedActivities);
  }

  const activities: Activity[] = preProcessedActivities
    .map((tx) => {
      const transactionID = tx.hash;
      const status = tx.result;

      let activityType: ActivityType = TransactionActivity.UNKNOWN;

      if (
        tx.from.hash === '0x0000000000000000000000000000000000000000' &&
        tx.to.hash.toLowerCase() === address.toLowerCase() &&
        tx.token_transfers.find((t) => t.type.toLowerCase() === 'token_minting')
      ) {
        activityType = TransactionActivity.MINTED;
      } else if (
        tx.from.hash.toLowerCase() === tx.to.hash.toLowerCase() &&
        tx.from.hash.toLowerCase() === address.toLowerCase()
      ) {
        activityType = TransactionActivity.SELF_TRANSFER;
      } else if (
        tx.to.hash.toLowerCase() === address.toLowerCase() ||
        // Also tag ETH received on smart contract wallet via internal transactions
        // Conditions:: from: address, internal transaction type: delegatecall
        (tx.from.hash.toLowerCase() === address.toLowerCase() &&
          tx?.internal_tx_type === InternalTransactionType.DELEGATECALL)
      ) {
        activityType = TransactionActivity.RECEIVED;
      } else if (tx.from.hash.toLowerCase() === address.toLowerCase()) {
        activityType = TransactionActivity.SENT;
      }

      if (activityType === TransactionActivity.UNKNOWN) {
        console.warn(
          `Unable to determine transaction activity type for tx: ${transactionID}, skipping...`
        );
        return null; // Skip unidentified transactions gracefully
      }

      let amount: TransactionAmount;
      try {
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
            const erc20TxTotal = erc20Tx?.total as BlockscoutTotalERC20;

            amount = {
              type: TokenERC.ERC20,
              value: erc20TxTotal.value,
              tokenInfo: {
                address: erc20Tx?.token.address_hash || erc20Tx?.token.address,
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
                id: erc721TxTotal.token_instance?.id,
                isUnique: erc721TxTotal.token_instance?.is_unique,
                owner: erc721TxTotal.token_instance?.owner,
                tokenInfo: {
                  address:
                    erc721Tx?.token.address_hash || erc721Tx?.token.address,
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
                id: erc1155TxTotal.token_instance?.id,
                isUnique: erc1155TxTotal.token_instance?.is_unique,
                owner: erc1155TxTotal.token_instance?.owner,
                tokenInfo: {
                  address:
                    erc1155Tx?.token.address_hash || erc1155Tx?.token.address,
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
      } catch (err) {
        console.warn(
          `Skipping transaction ${transactionID} due to: ${(err as Error).message}`
        );
        return null;
      }
    })
    .filter((e) => e !== null)
    .slice(offset, offset + limit);

  const metadata: ActivityMetadata = {
    count: activities.length,
    offset,
    limit,
    hasNextPage: preProcessedActivities.length >= offset + limit
  };

  const result: GetActivitiesByAddressResult = { activities, metadata };

  return result;
};

/**
 * Update the cache for the given address with transactions (one page with one invocation), if exists.
 * @param address - The address for which to update the transactions cache.
 * @param chainID - Chain identifier for which the transactions are being cached.
 * @returns void
 * @throws Error if the external API call fails.
 */
export const updateTransactionsCache = async (
  address: string,
  chainID: number
): Promise<void> => {
  // Activity cache
  const activityCache = newLruMemCache(ACTIVITY_CACHE_ID);

  const cacheKeyTransactions = getCacheKey(address, chainID, 'transactions');
  const cacheKeyTransactionsNextPageParams = getCacheKey(
    address,
    chainID,
    'transactions_next_params'
  );

  let nextPageParams: CachedBlockscoutNextPageParams = (activityCache.get(
    cacheKeyTransactionsNextPageParams
  ) || null) as CachedBlockscoutNextPageParams;

  if ((nextPageParams as unknown as string) === LAST_PAGE_REACHED) {
    return; // No more pages to fetch
  }

  let userTransactions: BlockscoutTransaction[] = (activityCache.get(
    cacheKeyTransactions
  ) || []) as BlockscoutTransaction[];

  const baseRequestUrl = getBaseTransactionsRequestUrl(address, chainID);
  const requestUrl = baseRequestUrl.concat(buildQueryString(nextPageParams));
  const response = await httpUtils.request(requestUrl);

  const errResponse = response as PannaHttpErr;
  if ('code' in errResponse && 'message' in errResponse) {
    throw new Error(
      `Unable to fetch user transactions: ${errResponse.message}`
    );
  }

  const blockscoutRes = response as unknown as BlockscoutTransactionsResponse;
  userTransactions.push(
    ...(await fillTokenTransactions(address, chainID, blockscoutRes.items))
  );
  activityCache.set(cacheKeyTransactions, userTransactions);

  if (blockscoutRes.next_page_params) {
    activityCache.set(
      cacheKeyTransactionsNextPageParams,
      blockscoutRes.next_page_params
    );
  } else {
    // Explicitly set flag when the last page has been reached
    activityCache.set(cacheKeyTransactionsNextPageParams, LAST_PAGE_REACHED);
  }
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

  // Activity cache
  const activityCache = newLruMemCache(ACTIVITY_CACHE_ID);

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

        const nextPageParams: CachedBlockscoutNextPageParams =
          (activityCache.get(cacheKeyTokenTransferNextPageParams) ||
            null) as CachedBlockscoutNextPageParams;

        const tokenTransferTxs = userTokenTransfers.filter(
          (e) => e.transaction_hash === tx.hash
        );

        if (
          nextPageParams !== LAST_PAGE_REACHED &&
          // matching token transfer transactions partially exist in cache
          ((nextPageParams && tx.block_number <= nextPageParams.block_number) ||
            // no matching token transfer transactions exist in cache
            (tokenTransferTxs.length === 0 && nextPageParams === null))
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
  // Activity cache
  const activityCache = newLruMemCache(ACTIVITY_CACHE_ID);

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

  let nextPageParams: CachedBlockscoutNextPageParams = (activityCache.get(
    cacheKeyTokenTransferNextPageParams
  ) || null) as CachedBlockscoutNextPageParams;

  if ((nextPageParams as unknown as string) === LAST_PAGE_REACHED) {
    return; // No more pages to fetch
  }

  let userTokenTransfers: BlockscoutTokenTransfer[] = (activityCache.get(
    cacheKeyTokenTransferTxs
  ) || []) as BlockscoutTokenTransfer[];

  const baseRequestUrl = getBaseTokenTransferRequestUrl(address, chainID);
  const requestUrl = baseRequestUrl.concat(buildQueryString(nextPageParams));
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

  if (blockscoutRes.next_page_params) {
    activityCache.set(
      cacheKeyTokenTransferNextPageParams,
      blockscoutRes.next_page_params
    );
  } else {
    // Explicitly set flag when the last page has been reached
    activityCache.set(cacheKeyTokenTransferNextPageParams, LAST_PAGE_REACHED);
  }
};

/**
 * Update the cache for the given address with internal transactions (one page with one invocation), if exists.
 * @param address - The address for which to update the internal transactions cache.
 * @param chainID - Chain identifier for which the internal transactions are being cached.
 * @returns void
 * @throws Error if the external API call fails.
 */
export const updateInternalTransactionsCache = async (
  address: string,
  chainID: number
): Promise<void> => {
  // Activity cache
  const activityCache = newLruMemCache(ACTIVITY_CACHE_ID);

  const cacheKeyInternalTxs = getCacheKey(
    address,
    chainID,
    'internal_transactions'
  );
  const cacheKeyInternalTxsNextPageParams = getCacheKey(
    address,
    chainID,
    'internal_transactions_next_params'
  );

  let nextPageParams: CachedBlockscoutNextPageParams = (activityCache.get(
    cacheKeyInternalTxsNextPageParams
  ) || null) as CachedBlockscoutNextPageParams;

  if ((nextPageParams as unknown as string) === LAST_PAGE_REACHED) {
    return; // No more pages to fetch
  }

  let userInternalTxs: BlockscoutInternalTransaction[] = (activityCache.get(
    cacheKeyInternalTxs
  ) || []) as BlockscoutInternalTransaction[];

  const baseRequestUrl = getBaseInternalTransactionsRequestUrl(
    address,
    chainID
  );
  const requestUrl = baseRequestUrl.concat(buildQueryString(nextPageParams));
  const response = await httpUtils.request(requestUrl);

  const errResponse = response as PannaHttpErr;
  if ('code' in errResponse && 'message' in errResponse) {
    throw new Error(
      `Unable to fetch user internal-transactions: ${errResponse.message}`
    );
  }

  const blockscoutRes =
    response as unknown as BlockscoutInternalTransactionsResponse;
  blockscoutRes.items.forEach((itx) => {
    // Include only ETH received/sent via internal transactions for smart contract wallets
    // Received conditions::  value: not "0", from: address, type: delegatecall
    // Sent conditions::      value: not "0", from: address, type: call
    if (
      Number(itx.value) !== 0 &&
      (itx.from.hash.toLowerCase() === address.toLowerCase() ||
        itx.to.hash.toLowerCase() === address.toLowerCase()) &&
      [
        InternalTransactionType.CALL,
        InternalTransactionType.DELEGATECALL
      ].includes(itx.type.toLowerCase())
    ) {
      userInternalTxs.push(itx);
    }
  });
  activityCache.set(cacheKeyInternalTxs, userInternalTxs);

  if (blockscoutRes.next_page_params) {
    activityCache.set(
      cacheKeyInternalTxsNextPageParams,
      blockscoutRes.next_page_params
    );
  } else {
    // Explicitly set flag when the last page has been reached
    activityCache.set(cacheKeyInternalTxsNextPageParams, LAST_PAGE_REACHED);
  }
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
  tx: BlockscoutTransaction | PreProcessedActivity
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
