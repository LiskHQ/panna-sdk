import { Bridge } from 'thirdweb';
import { ethIcon } from '../../react/consts';
import { lisk, liskSepolia } from '../chain';
import { DEFAULT_CURRENCY, NATIVE_TOKEN_ADDRESS } from '../defaults';
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
  type FiatValue,
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
  type BlockscoutTransactionsResponse,
  type BlockscoutNextPageParams,
  type BlockscoutInternalTransactionNextPageParams
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
 * Calculate fiat value for a token amount
 * @param symbol - Token symbol
 * @param value - Token amount as string
 * @param decimals - Token decimals
 * @param tokenPrices - Array of token prices
 * @param currency - Target fiat currency
 * @returns Fiat value object or undefined if price not found
 */
const calculateFiatValue = (
  symbol: string,
  value: string,
  decimals: number,
  tokenPrices: Array<{ symbol: string; prices: Record<string, number> }>,
  currency: FiatValue['currency']
): FiatValue | undefined => {
  // Special case for mapping Lisk Bridged USDC.e to USDC
  const tokenPrice = tokenPrices.find((token) => {
    if (symbol === 'USDC.e' && token.symbol === 'USDC') {
      return true;
    }
    return token.symbol === symbol;
  });

  if (!tokenPrice || !tokenPrice.prices[currency]) {
    return undefined;
  }

  const fiatAmount =
    (Number(value) * tokenPrice.prices[currency]) / 10 ** decimals;

  return {
    amount: fiatAmount,
    currency
  };
};

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
 * Get recent activities for an account with fiat price information.
 * @param params - Parameters for fetching the account activities.
 * @param params.address - The address for which to retrieve the activities.
 * @param params.client - The Panna client to use for the request.
 * @param params.chain - (Optional) Chain object type. (Default: lisk)
 * @param params.offset - (Optional) The number of items to be skipped from the matching result. (Default: 0)
 * @param params.limit - (Optional) The number of items to be returned from the matching result. (Default: 10)
 * @param params.currency - (Optional) The currency in which the fiat values are determined. (Default: USD)
 * @returns Account activity information with fiat prices.
 * @throws Error if address is invalid.
 * @example
 * ```ts
 * import { getActivitiesByAddress } from 'panna-sdk';
 *
 * // Get list of recent activities with fiat prices in USD (default)
 * const result = await getActivitiesByAddress({
 *   address: userAddress,
 *   client: pannaClient,
 *   offset: 0,
 *   limit: 10
 * });
 *
 * // Get activities with fiat prices in EUR
 * const resultEUR = await getActivitiesByAddress({
 *   address: userAddress,
 *   client: pannaClient,
 *   currency: 'EUR'
 * });
 *
 * // result: {
 * //   activities: [{
 * //     activityType: 'Sent',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'eth',
 * //       value: '1000000000000000000',
 * //       tokenInfo: {
 * //         address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
 * //         name: 'Ether',
 * //         symbol: 'ETH',
 * //         decimals: 18,
 * //         type: 'eth',
 * //         icon: 'https://...'
 * //       },
 * //       fiatValue: {
 * //         amount: 3000.50,
 * //         currency: 'USD'
 * //       }
 * //     },
 * //     status: 'ok'
 * //   }, {
 * //     activityType: 'Received',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'erc-20',
 * //       value: '100000000000',
 * //       tokenInfo: {
 * //         address: '0x...',
 * //         name: 'Lisk',
 * //         symbol: 'LSK',
 * //         decimals: 18,
 * //         type: 'erc-20',
 * //         icon: null
 * //       },
 * //       fiatValue: {
 * //         amount: 100.00,
 * //         currency: 'USD'
 * //       }
 * //     },
 * //     status: 'ok'
 * //   }, {
 * //     activityType: 'Received',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'erc-721',
 * //       tokenId: '9500',
 * //       instance: {
 * //         id: '9500',
 * //         isUnique: true,
 * //         owner: { address: '0x...', isContract: false },
 * //         tokenInfo: {
 * //           address: '0x...',
 * //           name: 'Lisk of Life',
 * //           symbol: 'LOL',
 * //           decimals: 0,
 * //           type: 'erc-721',
 * //           icon: null
 * //         }
 * //       }
 * //     },
 * //     status: 'ok'
 * //   }, {
 * //     activityType: 'Minted',
 * //     transactionID: '0x...',
 * //     amount: {
 * //       type: 'erc-1155',
 * //       tokenId: '29900446396079726096...',
 * //       value: '5',
 * //       instance: {
 * //         id: '29900446396079726096...',
 * //         isUnique: false,
 * //         owner: { address: '0x...', isContract: false },
 * //         tokenInfo: {
 * //           address: '0x...',
 * //           name: 'Rarible',
 * //           symbol: 'RARI',
 * //           decimals: 0,
 * //           type: 'erc-1155',
 * //           icon: null
 * //         }
 * //       }
 * //     },
 * //     status: 'ok'
 * //   }],
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
    client,
    chain = lisk,
    offset = DEFAULT_PAGINATION_OFFSET,
    limit = DEFAULT_PAGINATION_LIMIT,
    currency = DEFAULT_CURRENCY
  } = params;

  const ckActivities = getCacheKey(address, chain.id, 'activities');
  const ckInternalTxs = getCacheKey(address, chain.id, 'internal_transactions');
  const ckTransactions = getCacheKey(address, chain.id, 'transactions');
  const ckTokenTransferTxs = getCacheKey(address, chain.id, 'token_transfers');
  const ckActivitiesLoadingStatus = getCacheKey(
    address,
    chain.id,
    'activities_next_page_params'
  );

  const preProcessedActivities: PreProcessedActivity[] = (activityCache.get(
    ckActivities
  ) || []) as PreProcessedActivity[];
  for (; preProcessedActivities.length <= offset + limit; ) {
    if (activityCache.get(ckActivitiesLoadingStatus) === LAST_PAGE_REACHED) {
      // Break the loop to avoid unnecessary API calls if all user activities are available in cache
      break;
    }

    const userInternalTxs = (activityCache.get(ckInternalTxs) ||
      []) as BlockscoutInternalTransaction[];
    const userTransactions = (activityCache.get(ckTransactions) ||
      []) as BlockscoutTransaction[];
    const userTokenTransfers = (activityCache.get(ckTokenTransferTxs) ||
      []) as BlockscoutTokenTransfer[];

    if (
      userInternalTxs.length +
        userTransactions.length +
        userTokenTransfers.length <=
      offset + limit
    ) {
      if (await updateRequiredCache(address, chain.id)) {
        activityCache.set(ckActivitiesLoadingStatus, LAST_PAGE_REACHED);
      } else {
        continue; // To avoid duplication of entries in preProcessedActivities
      }
    }

    const preProcessedActivitiesDup = [] as PreProcessedActivity[];

    preProcessedActivitiesDup.push(...userTransactions);
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

      preProcessedActivitiesDup.push(mockedTx);
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

      preProcessedActivitiesDup.push(mockedTx);
    });
    preProcessedActivities.push(
      ...preProcessedActivitiesDup
        .sort((a, b) => b.block_number - a.block_number)
        .filter(
          (currentEntry, currentIndex, originalSortedArray) =>
            currentIndex ===
            originalSortedArray.findIndex((t) => t.hash === currentEntry.hash)
        )
    ); // Sort by block number in descending order and remove duplicates

    activityCache.set(ckActivities, preProcessedActivities);
  }

  // Fetch token prices for fiat value calculations
  let tokenPrices: Array<{ symbol: string; prices: Record<string, number> }> =
    [];
  try {
    tokenPrices = await Bridge.tokens({
      chainId: chain.id === liskSepolia.id ? lisk.id : chain.id,
      client
    });
  } catch (error) {
    console.warn('Failed to fetch token prices:', error);
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
            const ethAmount: EtherAmount = {
              type: TokenERC.ETH,
              value: tx.value || '0',
              tokenInfo: {
                address: NATIVE_TOKEN_ADDRESS,
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
                type: TokenERC.ETH,
                icon: ethIcon
              }
            };

            if (tokenPrices.length > 0 && tx.value) {
              const fiatValue = calculateFiatValue(
                'ETH',
                tx.value,
                18,
                tokenPrices,
                currency
              );
              if (fiatValue !== undefined) {
                ethAmount.fiatValue = fiatValue;
              }
            }

            amount = ethAmount;
            break;
          }

          case TokenERC.ERC20: {
            const erc20Tx = tx.token_transfers.find(
              (e) => e.token.type.toLowerCase() === TokenERC.ERC20
            );
            const erc20TxTotal = erc20Tx?.total as BlockscoutTotalERC20;
            const decimals = erc20Tx?.token.decimals
              ? Number(erc20Tx?.token.decimals)
              : 0;

            const erc20Amount: ERC20Amount = {
              type: TokenERC.ERC20,
              value: erc20TxTotal.value,
              tokenInfo: {
                address:
                  (erc20Tx?.token.address_hash || erc20Tx?.token.address) ?? '',
                name: erc20Tx?.token.name ?? '',
                symbol: erc20Tx?.token.symbol ?? '',
                decimals,
                type: TokenERC.ERC20,
                icon: erc20Tx?.token.icon_url ?? null
              }
            };

            if (tokenPrices.length > 0 && erc20Tx?.token.symbol) {
              const fiatValue = calculateFiatValue(
                erc20Tx.token.symbol,
                erc20TxTotal.value,
                decimals,
                tokenPrices,
                currency
              );
              if (fiatValue !== undefined) {
                erc20Amount.fiatValue = fiatValue;
              }
            }

            amount = erc20Amount;
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
            const decimals = erc1155Tx?.token.decimals
              ? typeof erc1155Tx.token.decimals === 'string'
                ? Number(erc1155Tx.token.decimals)
                : erc1155Tx.token.decimals
              : 0;

            const erc1155Amount: ERC1155Amount = {
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
                  decimals,
                  type: TokenERC.ERC1155,
                  icon: erc1155Tx?.token.icon_url
                }
              }
            } as unknown as ERC1155Amount;

            if (tokenPrices.length > 0 && erc1155Tx?.token.symbol) {
              const fiatValue = calculateFiatValue(
                erc1155Tx.token.symbol,
                erc1155TxTotal.value,
                decimals,
                tokenPrices,
                currency
              );
              if (fiatValue !== undefined) {
                erc1155Amount.fiatValue = fiatValue;
              }
            }

            amount = erc1155Amount;
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

  const ckTransactions = getCacheKey(address, chainID, 'transactions');
  const ckTransactionsNPP = getCacheKey(
    address,
    chainID,
    'transactions_next_params'
  );

  let nextPageParams: CachedBlockscoutNextPageParams = (activityCache.get(
    ckTransactionsNPP
  ) || null) as CachedBlockscoutNextPageParams;

  if ((nextPageParams as unknown as string) === LAST_PAGE_REACHED) {
    return; // No more pages to fetch
  }

  let userTransactions: BlockscoutTransaction[] = (activityCache.get(
    ckTransactions
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
  activityCache.set(ckTransactions, userTransactions);

  if (blockscoutRes.next_page_params) {
    activityCache.set(ckTransactionsNPP, blockscoutRes.next_page_params);
  } else {
    // Explicitly set flag when the last page has been reached
    activityCache.set(ckTransactionsNPP, LAST_PAGE_REACHED);
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

  const ckTokenTransferTxs = getCacheKey(address, chainID, 'token_transfers');
  const ckTokenTransferNPP = getCacheKey(
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
          (activityCache.get(ckTokenTransferTxs) ||
            []) as BlockscoutTokenTransfer[];

        const nextPageParams: CachedBlockscoutNextPageParams =
          (activityCache.get(ckTokenTransferNPP) ||
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
          ckTokenTransferTxs,
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

  const ckTokenTransferTxs = getCacheKey(address, chainID, 'token_transfers');
  const ckTokenTransferNPP = getCacheKey(
    address,
    chainID,
    'token_transfers_next_params'
  );

  let nextPageParams: CachedBlockscoutNextPageParams = (activityCache.get(
    ckTokenTransferNPP
  ) || null) as CachedBlockscoutNextPageParams;

  if ((nextPageParams as unknown as string) === LAST_PAGE_REACHED) {
    return; // No more pages to fetch
  }

  let userTokenTransfers: BlockscoutTokenTransfer[] = (activityCache.get(
    ckTokenTransferTxs
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
  activityCache.set(ckTokenTransferTxs, userTokenTransfers);

  if (blockscoutRes.next_page_params) {
    activityCache.set(ckTokenTransferNPP, blockscoutRes.next_page_params);
  } else {
    // Explicitly set flag when the last page has been reached
    activityCache.set(ckTokenTransferNPP, LAST_PAGE_REACHED);
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

  const ckInternalTxs = getCacheKey(address, chainID, 'internal_transactions');
  const ckInternalTxsNPP = getCacheKey(
    address,
    chainID,
    'internal_transactions_next_params'
  );

  let nextPageParams: CachedBlockscoutNextPageParams = (activityCache.get(
    ckInternalTxsNPP
  ) || null) as CachedBlockscoutNextPageParams;

  if ((nextPageParams as unknown as string) === LAST_PAGE_REACHED) {
    return; // No more pages to fetch
  }

  let userInternalTxs: BlockscoutInternalTransaction[] = (activityCache.get(
    ckInternalTxs
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
  activityCache.set(ckInternalTxs, userInternalTxs);

  if (blockscoutRes.next_page_params) {
    activityCache.set(ckInternalTxsNPP, blockscoutRes.next_page_params);
  } else {
    // Explicitly set flag when the last page has been reached
    activityCache.set(ckInternalTxsNPP, LAST_PAGE_REACHED);
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

/**
 * Update the necessary caches to build activity history for the given address (one page with one invocation, per cache, as applicable).
 * @param address - The address for which the caches are to be updated.
 * @param chainID - Chain identifier for which the caches are to be updated.
 * @returns boolean - true if all pages have been fetched, false otherwise.
 */
export const updateRequiredCache = async (
  address: string,
  chainID: number
): Promise<boolean> => {
  const activityCache = newLruMemCache(ACTIVITY_CACHE_ID);

  const ckInternalTxsNPP = getCacheKey(
    address,
    chainID,
    'internal_transactions_next_params'
  );
  const ckTransactionsNPP = getCacheKey(
    address,
    chainID,
    'transactions_next_params'
  );
  const ckTokenTransferNPP = getCacheKey(
    address,
    chainID,
    'token_transfers_next_params'
  );

  const userInternalTxsNPP: CachedBlockscoutNextPageParams = (activityCache.get(
    ckInternalTxsNPP
  ) || null) as CachedBlockscoutNextPageParams;
  const userTxsNPP: CachedBlockscoutNextPageParams = (activityCache.get(
    ckTransactionsNPP
  ) || null) as CachedBlockscoutNextPageParams;
  const userTTxsNPP: CachedBlockscoutNextPageParams = (activityCache.get(
    ckTokenTransferNPP
  ) || null) as CachedBlockscoutNextPageParams;

  // No more pages to fetch, return immediately
  if (
    userInternalTxsNPP === LAST_PAGE_REACHED &&
    userTxsNPP === LAST_PAGE_REACHED &&
    userTTxsNPP === LAST_PAGE_REACHED
  ) {
    return true;
  }

  // No cache exists, initialize cache and return immediately
  if (
    userInternalTxsNPP === null ||
    userTxsNPP === null ||
    userTTxsNPP === null
  ) {
    await Promise.allSettled([
      updateInternalTransactionsCache(address, chainID),
      updateTransactionsCache(address, chainID),
      updateTokenTransactionsCache(address, chainID)
    ]);
    return false;
  }

  // Determine the highest block height among the next page params of all 3 transaction types
  // and update the cache for that transaction type only to optimize the number of API calls being made
  // (assuming that the activities are being fetched in descending order of block height)
  // If any of the next page params is Number.NEGATIVE_INFINITY, it indicates that there are no more pages to fetch
  const lastBNInternalTxns =
    (
      userInternalTxsNPP as unknown as BlockscoutInternalTransactionNextPageParams
    )?.block_number || Number.NEGATIVE_INFINITY;
  const lastBNTransactions =
    (userTxsNPP as unknown as BlockscoutNextPageParams)?.block_number ||
    Number.NEGATIVE_INFINITY;
  const lastBNTokenTransferTxns =
    (userTTxsNPP as unknown as BlockscoutNextPageParams)?.block_number ||
    Number.NEGATIVE_INFINITY;

  const maxBlockNumber = Math.max(
    lastBNInternalTxns,
    lastBNTransactions,
    lastBNTokenTransferTxns
  );

  switch (maxBlockNumber) {
    case lastBNInternalTxns:
      await updateInternalTransactionsCache(address, chainID);
      break;

    case lastBNTransactions:
      await updateTransactionsCache(address, chainID);
      break;

    case lastBNTokenTransferTxns:
      await updateTokenTransactionsCache(address, chainID);
      break;
  }
  return false;
};
