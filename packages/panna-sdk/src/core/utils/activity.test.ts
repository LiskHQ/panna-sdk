import { liskSepolia } from '../chains';
import * as httpUtils from '../helpers/http';
import * as activity from './activity';
import {
  getActivitiesByAddress,
  getAmountType,
  getBaseTokenTransferRequestUrl,
  getBaseTransactionsRequestUrl
} from './activity';
import * as fixture from './activity.fixture.test';
import { TokenERC, TokenType } from './activity.types';
import { BlockscoutTransaction } from './blockscout.types';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  REGEX_URL
} from './constants';

// Mock upstream modules
jest.mock('../helpers/cache', () => jest.requireActual('../helpers/cache'));
jest.mock('../helpers/http');
jest.mock('./activity', () => jest.requireActual('./activity'));

describe('getBaseTransactionsRequestUrl', () => {
  it('should return the transactions API endpoint for the given address', () => {
    const address = '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F';
    const url = getBaseTransactionsRequestUrl(address, liskSepolia.id);

    expect(typeof url).toBe('string');
    expect(url).toMatch(REGEX_URL);
    expect(url.startsWith('https')).toBeTruthy();
    expect(url.endsWith('transactions')).toBeTruthy();
    expect(url.includes(address)).toBeTruthy();
  });
});

describe('getBaseTokenTransferRequestUrl', () => {
  it('should return the token transfers API endpoint for the given address', () => {
    const address = '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F';
    const url = getBaseTokenTransferRequestUrl(address, liskSepolia.id);

    expect(typeof url).toBe('string');
    expect(url).toMatch(REGEX_URL);
    expect(url.startsWith('https')).toBeTruthy();
    expect(url.endsWith('token-transfers')).toBeTruthy();
    expect(url.includes(address)).toBeTruthy();
  });
});

describe('updateTokenTransactionsCache', () => {
  it.todo('implement test cases');
});

describe('fillTokenTransactions', () => {
  it.todo('implement test cases');
});

describe('getAmountType', () => {
  it(`should throw error for invalid transaction`, () => {
    const invalidTx = fixture.getAmountType
      .should_throw_error_for_invalid_transaction
      .invalidTx as unknown as BlockscoutTransaction;
    expect(() => getAmountType(invalidTx.from.hash, invalidTx)).toThrow(
      'Unable to determine transaction amount type'
    );
  });

  it(`should throw error for invalid transaction making a contract_call`, () => {
    const invalidContractCallTx = fixture.getAmountType
      .should_throw_error_for_invalid_transaction_making_a_contract_call
      .invalidContractCallTx as unknown as BlockscoutTransaction;
    expect(() =>
      getAmountType(invalidContractCallTx.from.hash, invalidContractCallTx)
    ).toThrow('Unable to determine the amount ERC standard');
  });

  it(`should return valid ERC type for a valid transaction making a contract_call`, () => {
    const validContractCallTx = fixture.getAmountType
      .should_return_valid_ERC_type_for_a_valid_transaction_making_a_contract_call
      .validContractCallTx as unknown as BlockscoutTransaction;
    expect(
      Object.values(TokenERC).includes(
        getAmountType(validContractCallTx.from.hash, validContractCallTx)
      )
    ).toBeTruthy();
  });

  it(`should return one of '${TokenERC.ERC20}', '${TokenERC.ERC721}' or '${TokenERC.ERC1155}' for a token_transfer transaction making a contract_call`, () => {
    const tokenTransferTx = fixture.getAmountType
      .should_return_one_of_erc_20_erc_721_or_erc_1155_for_a_token_transfer_transaction_making_a_contract_call
      .tokenTransferTx as unknown as BlockscoutTransaction;
    expect(
      [TokenERC.ERC20, TokenERC.ERC721, TokenERC.ERC1155].includes(
        getAmountType(
          tokenTransferTx.from.hash,
          tokenTransferTx
        ) as unknown as Exclude<TokenType, 'eth'>
      )
    ).toBeTruthy();
  });

  it(`should return one of '${TokenERC.ERC20}', '${TokenERC.ERC721}' or '${TokenERC.ERC1155}' for a token_minting transaction making a contract_call`, () => {
    const tokenMintingTx = fixture.getAmountType
      .should_return_one_of_erc_20_erc_721_or_erc_1155_for_a_token_minting_transaction_making_a_contract_call
      .tokenMintingTx as unknown as BlockscoutTransaction;
    expect(
      [TokenERC.ERC20, TokenERC.ERC721, TokenERC.ERC1155].includes(
        getAmountType(
          tokenMintingTx.from.hash,
          tokenMintingTx
        ) as unknown as Exclude<TokenType, 'eth'>
      )
    ).toBeTruthy();
  });

  it(`should return amount type '${TokenERC.ERC20}' for valid ERC-20 transaction`, () => {
    const erc20Tx = fixture.getAmountType
      .should_return_amount_type_erc_20_for_valid_ERC_20_transaction
      .erc20Tx as unknown as BlockscoutTransaction;
    expect(getAmountType(erc20Tx.from.hash, erc20Tx)).toBe(TokenERC.ERC20);
  });

  it(`should return amount type '${TokenERC.ERC721}' for valid ERC-721 transaction`, () => {
    const erc721Tx = fixture.getAmountType
      .should_return_amount_type_erc_721_for_valid_ERC_721_transaction
      .erc721Tx as unknown as BlockscoutTransaction;
    expect(getAmountType(erc721Tx.from.hash, erc721Tx)).toBe(TokenERC.ERC721);
  });

  it(`should return amount type '${TokenERC.ERC1155}' for valid ERC-1155 transaction`, () => {
    const erc1155Tx = fixture.getAmountType
      .should_return_amount_type_erc_1155_for_valid_ERC_1155_transaction
      .erc1155Tx as unknown as BlockscoutTransaction;
    expect(getAmountType(erc1155Tx.from.hash, erc1155Tx)).toBe(
      TokenERC.ERC1155
    );
  });

  it(`should return amount type '${TokenERC.ETH}' for valid ETH transaction`, () => {
    const ethTx = fixture.getAmountType
      .should_return_amount_type_eth_for_valid_ETH_transaction
      .ethTx as unknown as BlockscoutTransaction;
    expect(getAmountType(ethTx.from.hash, ethTx)).toBe(TokenERC.ETH);
  });
});

describe('getActivitiesByAddress', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return empty list of activities if none exist', async () => {
    const mockRequestResponse = {
      items: [],
      next_page_params: null
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);

    const params = { address: '0xe1287E785D424cd3d0998957388C4770488ed841' };
    const result = await getActivitiesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(1);
    expect(httpUtils.request).toHaveBeenCalledWith(
      `https://blockscout.lisk.com/api/v2/addresses/${params.address}/transactions`
    );
    expect(result).toStrictEqual({
      activities: [],
      metadata: {
        count: mockRequestResponse.items.length,
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: DEFAULT_PAGINATION_LIMIT,
        hasNextPage: false
      }
    });
  });

  xit('should return list of activities (lower than default limit)', async () => {
    const mockRequestResponse =
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_lower_than_default_limit
        .mockRequestResponse;
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);
    (activity.fillTokenTransactions as jest.Mock).mockResolvedValue(
      mockRequestResponse
    );

    const params = {
      address: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
      chain: liskSepolia
    };
    const result = await getActivitiesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(2);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTransactionsRequestUrl(params.address, liskSepolia.id)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      2,
      `https://blockscout.lisk.com/api/v2/addresses/${params.address}/token-transfers`
    );
    expect(result).toStrictEqual(
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_lower_than_default_limit.wantResult
    );
  });

  xit('should return list of activities (multiple API requests)', async () => {
    const mockRequestResponse1 =
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_multiple_API_requests
        .mockRequestResponse1;
    const mockRequestResponse2 =
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_multiple_API_requests
        .mockRequestResponse2;
    const mockRequestResponse3 =
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_multiple_API_requests
        .mockRequestResponse3;

    (httpUtils.request as jest.Mock)
      .mockResolvedValueOnce(mockRequestResponse1)
      .mockResolvedValueOnce(mockRequestResponse2)
      .mockResolvedValueOnce(mockRequestResponse3);

    (activity.fillTokenTransactions as jest.Mock)
      .mockResolvedValueOnce(mockRequestResponse1)
      .mockResolvedValueOnce(mockRequestResponse2)
      .mockResolvedValueOnce(mockRequestResponse3);

    const params = {
      address: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
      chain: liskSepolia,
      offset: 4,
      limit: 4
    };
    const result = await getActivitiesByAddress(params);
    expect(httpUtils.request).toHaveBeenCalledTimes(3);

    const baseRequestUrl = getBaseTransactionsRequestUrl(
      params.address,
      liskSepolia.id
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(1, baseRequestUrl);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      2,
      `${baseRequestUrl}?block_number=${mockRequestResponse1.next_page_params.block_number}&index=${mockRequestResponse1.next_page_params.index}`
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      3,
      `${baseRequestUrl}?block_number=${mockRequestResponse2.next_page_params.block_number}&index=${mockRequestResponse2.next_page_params.index}`
    );
    expect(result).toStrictEqual(
      fixture.getActivitiesByAddress
        .should_return_list_of_activities_multiple_API_requests.wantResult
    );
  });

  it('should throw error when address in params is invalid', async () => {
    const params = { address: 'invalidAddress' };
    expect(async () => getActivitiesByAddress(params)).rejects.toThrow(
      'Invalid address format'
    );
  });
});
