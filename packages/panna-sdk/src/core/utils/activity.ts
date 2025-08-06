import { NATIVE_TOKEN_ADDRESS } from '../defaults';
import { newLruMemCache } from '../helpers/cache';
import * as httpUtils from '../helpers/http';
import {
  // const
  TokenERC,
  TransactionActivity,
  // type
  type GetActivityParams,
  type GetActivityResult,
  type Activity,
  type ActivityType,
  type TokenType,
  type TransactionAmount,
  type ActivityMetadata,
  type BlockscoutTransactionsResponse,
  type BlockscoutTransaction,
  type BlockscoutTokenTransfersResponse,
  type BlockscoutTokenTransfer,
  type BlockscoutNextPageParams,
  type BlockscoutTotalERC721,
  type BlockscoutTotalERC1155,
  type EtherAmount,
  type ERC20Amount,
  type ERC721Amount,
  type ERC1155Amount
} from './activity.types';
import { isValidAddress } from './common';

// Activity cache
const activityCache = newLruMemCache('activity');

// Default pagination params
export const DEFAULT_PAGINATION_OFFSET = 0;
export const DEFAULT_PAGINATION_LIMIT = 10;

/*
 * Get recent activities for an account
 * @param params - Parameters for getting account balance
 * @param params.address - The address for which to retrieve the balance.
 * @param params.offset - (Optional) The number of items to be skipped from the matching result. (Default: 0)
 * @param params.limit - (Optional) The number of items to be returned from the matching result. (Default: 10)
 * @returns Account activity information
 * @throws Error if address is invalid
 * @example
 * ```ts
 * // Get value for the specified user's native token balance in USD
 * const result = await getActivity({ address: userAddress, offset: 0, limit: 10 });
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
 * //   metadata: { count: 10, offset: 0, limit: 10 }
 * // }
 * ```
 */
export const getActivity = async function (
  params: GetActivityParams
): Promise<GetActivityResult> {
  if (!isValidAddress(params.address)) {
    throw new Error('Invalid address format');
  }

  // Set default pagination params
  const {
    address,
    offset = DEFAULT_PAGINATION_OFFSET,
    limit = DEFAULT_PAGINATION_LIMIT
  } = params;
  const baseTxRequestUrl = `https://blockscout.lisk.com/api/v2/addresses/${address}/transactions`;

  const cacheKeyTransactions = address;
  const cacheKeyNextPageParams = `${address}_params`;

  const userTransactions: BlockscoutTransaction[] = activityCache.has(
    cacheKeyTransactions
  )
    ? (activityCache.get(cacheKeyTransactions) as BlockscoutTransaction[])
    : [];

  let nextPageParams: BlockscoutNextPageParams | null = activityCache.has(
    cacheKeyNextPageParams
  )
    ? (activityCache.get(cacheKeyNextPageParams) as BlockscoutNextPageParams)
    : null;

  do {
    const requestUrl =
      nextPageParams === null
        ? baseTxRequestUrl
        : `${baseTxRequestUrl}?block_number=${nextPageParams.block_number}&index=${nextPageParams.index}&items_count=${nextPageParams.items_count}`;

    const response: BlockscoutTransactionsResponse =
      await httpUtils.request(requestUrl);

    if ('code' in response && 'message' in response) {
      throw new Error(`Cannot fetch user activities: ${response.message}`);
    }

    userTransactions.push(
      ...(await fillTokenTransactions(address, response.items))
    );
    nextPageParams = response.next_page_params;

    activityCache.set(cacheKeyTransactions, userTransactions);
    activityCache.set(cacheKeyNextPageParams, nextPageParams);

    // Continue the loop only if more pages exist
    // Second condition ensures handling of no existing activities
    if (
      nextPageParams === null &&
      userTransactions.length >= response.items.length
    ) {
      activityCache.delete(cacheKeyNextPageParams);
      break;
    }
  } while (userTransactions.length <= offset + limit);

  const activities: Activity[] = userTransactions
    .slice(offset, offset + limit)
    .map((tx) => {
      const transactionID = tx.hash;
      const status = tx.result;

      let activityType: ActivityType = TransactionActivity.SENT;

      if (tx.from.hash.toLowerCase() === address.toLowerCase()) {
        activityType = TransactionActivity.SENT;
      } else if (tx.to.hash.toLowerCase() === address.toLowerCase()) {
        activityType = TransactionActivity.RECEIVED;
      } else if (
        tx.to.is_contract &&
        tx.token_transfers.find((t) => t.type.toLowerCase() === 'token_minting')
      ) {
        activityType = TransactionActivity.MINTED;
      }

      var amount: TransactionAmount;
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
              type: TokenERC.ETH
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
              decimals: erc20Tx?.token.decimals,
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
    });

  const metadata: ActivityMetadata = {
    count: activities.length,
    offset,
    limit
  };

  const result: GetActivityResult = { activities, metadata };

  return result;
};

export const fillTokenTransactions = async (
  address: string,
  transactions: BlockscoutTransaction[],
  recursionTxHash?: string
): Promise<BlockscoutTransaction[]> => {
  const isRecursion: boolean = !!recursionTxHash;

  const cacheKeyTokenTransferTxs = `${address}_tt`;
  const cacheKeyTokenTransferNextPageParams = `${address}_tt_params`;

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

  if (isRecursion && nextPageParams === null) {
    // On recurred invocation, when no more pages (token-transfers) are available to check through,
    // return all the transactions in their current state
    return transactions;
  }

  const baseRequestUrl = `https://blockscout.lisk.com/api/v2/addresses/${address}/token-transfers`;

  const requestUrl =
    nextPageParams === null
      ? baseRequestUrl
      : `${baseRequestUrl}?block_number=${nextPageParams.block_number}&index=${nextPageParams.index}&items_count=${nextPageParams.items_count}`;

  const response: BlockscoutTokenTransfersResponse =
    await httpUtils.request(requestUrl);

  if ('code' in response && 'message' in response) {
    throw new Error(`Cannot fetch user token-transfers: ${response.message}`);
  }

  userTokenTransfers.push(...response.items);
  activityCache.set(cacheKeyTokenTransferTxs, userTokenTransfers);

  if (response.next_page_params) {
    activityCache.set(cacheKeyTokenTransferNextPageParams, nextPageParams);
  } else {
    activityCache.delete(cacheKeyTokenTransferNextPageParams);
  }

  let isRecursionTxEncountered: boolean = false;

  for (let tx of transactions) {
    if (tx.hash === recursionTxHash) isRecursionTxEncountered = true;
    if (isRecursion && !isRecursionTxEncountered) continue;

    if (
      tx.token_transfers === null &&
      tx.transaction_types.includes('contract_call') &&
      tx.transaction_types.find((e) => e.startsWith('token_'))
    ) {
      if (!tx.token_transfers) {
        tx.token_transfers = [];
      }

      const tokenTransferTxs = userTokenTransfers.filter(
        (e) => e.transaction_hash === tx.hash
      );

      if (tokenTransferTxs.length) {
        tx.token_transfers.push(...tokenTransferTxs);

        userTokenTransfers = userTokenTransfers.filter(
          (e) => e.transaction_hash != tx.hash
        );
        activityCache.set(cacheKeyTokenTransferTxs, userTokenTransfers);
      } else {
        // Invoke the method recursively to fetch new set of token transfers
        // and, continue filling token transfers for the remaining transactions
        return fillTokenTransactions(address, transactions, tx.hash);
      }
    }
  }

  return transactions;
};

/*
 * Get amount type (known ERC standards or ETH) for a given transaction
 * @param address - User address
 * @param tx - Valid BlockscoutTransaction type
 * @returns The determined ETH/ERC standard for the transacted amount
 * @throws Error if unknown transaction amount type
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
      throw new Error('Cannot determine transaction amount type');
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
