import { NATIVE_TOKEN_ADDRESS } from '../defaults';
import { lruMemCache } from '../helpers/cache';
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
const activityCache = lruMemCache('activity');

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
 * const result = await accountBalanceInFiat({ address: userAddress });
 * // result: {
 * //   activities: [{
 * //     // TODO: Add example
 * //   }, ...],
 * //   metadata: { count: 10, offset: 0, limit: 10 },
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
  const { address, offset = 0, limit = 10 } = params;
  const baseTxUrl = `https://blockscout.lisk.com/api/v2/addresses/${address}/transactions`;

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
        ? baseTxUrl
        : `${baseTxUrl}?block_number=${nextPageParams.block_number}&index=${nextPageParams.index}&items_count=${nextPageParams.items_count}`;

    const response: BlockscoutTransactionsResponse =
      await httpUtils.request(requestUrl);

    if ('code' in response && 'message' in response) {
      throw new Error(`Cannot fetch user activities: ${response.message}`);
    }

    userTransactions.push(...response.items);
    nextPageParams = response.next_page_params;

    activityCache.set(cacheKeyTransactions, userTransactions);
    activityCache.set(cacheKeyNextPageParams, nextPageParams);

    continue;
  } while (userTransactions.length <= offset + limit);

  const activities: Activity[] = userTransactions
    .slice(offset, limit)
    .map((tx) => {
      const transactionID = tx.hash;
      const status = tx.result;

      let activityType: ActivityType = TransactionActivity.SENT;

      if (tx.to.hash.toLowerCase() === address.toLowerCase()) {
        activityType = TransactionActivity.RECEIVED;
      } else if (
        tx.to.is_contract &&
        tx.token_transfers.find((t) => t.type.toLowerCase() === 'token_minting')
      ) {
        activityType = TransactionActivity.MINTED;
      }

      var amount: TransactionAmount;
      const amountType = getAmountType(tx);
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
            (e) => e.type.toLowerCase() === TokenERC.ERC20
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
            (e) => e.type.toLowerCase() === TokenERC.ERC721
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
            (e) => e.type.toLowerCase() === TokenERC.ERC1155
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

const getAmountType = (tx: BlockscoutTransaction): TokenType => {
  if (tx.transaction_types.includes('contract_call')) {
    const tokenTransferTx = tx.token_transfers.find((t) =>
      ['token_transfer', 'token_minting'].includes(t.type.toLowerCase())
    );

    if (!tokenTransferTx) {
      throw new Error('Cannot determine transaction amoount type');
    }

    switch (tokenTransferTx.type.toLowerCase()) {
      case TokenERC.ERC20.toLowerCase():
        return TokenERC.ERC20;

      case TokenERC.ERC721.toLowerCase():
        return TokenERC.ERC721;

      case TokenERC.ERC1155.toLowerCase():
        return TokenERC.ERC1155;
    }
  }

  // Assume default to be ETH
  return TokenERC.ETH;
};
