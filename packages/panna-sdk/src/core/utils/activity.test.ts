import * as httpUtils from '../helpers/http';
import * as activity from './activity';
import {
  getActivitiesByAddress,
  getAmountType,
  getBaseTransactionsRequestUrl,
  getBaseTokenTransferRequestUrl
} from './activity';
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
    const url = getBaseTransactionsRequestUrl(address);

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
    const url = getBaseTokenTransferRequestUrl(address);

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
    const invalidTx: BlockscoutTransaction = {
      l1_gas_used: '2624',
      priority_fee: '232966000000',
      raw_input:
        '0xf41766d800000000000000000000000000000000000000000000000000000000177bf680000000000000000000000000000000000000000000000000000000043f6312a100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e7d1ff4730d4a575947a993a53d1c4f78138cc700000000000000000000000000000000000000000000000000000000673c7d1100000000000000000000000000000000000000000000000000000000000000010000000000000000000000004900900a850153ea6eb7d172362a37354ad0482800000000000000000000000003b8dc577b89a94b86eaa32249f86b1bf792959f0000000000000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
      max_fee_per_gas: '1002060',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '239954980',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 11184762,
      position: 1,
      max_priority_fee_per_gas: '1000000',
      transaction_tag: null,
      created_contract: null,
      value: '0',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '232966',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45',
        implementations: [],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'Router',
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '1153683741394',
      method: 'swapExactTokensForTokens',
      fee: {
        type: 'actual',
        value: '1386889696374'
      },
      actions: [],
      gas_limit: '248648',
      gas_price: '1001030',
      decoded_input: {
        method_call:
          'swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (address,address,bool)[] routes, address to, uint256 deadline)',
        method_id: 'f41766d8',
        parameters: [
          {
            name: 'amountIn',
            type: 'uint256',
            value: '394000000'
          },
          {
            name: 'amountOutMin',
            type: 'uint256',
            value: '18243326625'
          },
          {
            name: 'routes',
            type: '(address,address,bool)[]',
            value: [
              [
                '0x4900900a850153eA6eB7d172362A37354Ad04828',
                '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
                'false'
              ]
            ]
          },
          {
            name: 'to',
            type: 'address',
            value: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7'
          },
          {
            name: 'deadline',
            type: 'uint256',
            value: '1732017425'
          }
        ]
      },
      l1_gas_price: '10324105268',
      token_transfers: [
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          log_index: 0,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '394000000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'coin_transfer'
        }
      ],
      base_fee_per_gas: '1030',
      timestamp: '2024-11-19T11:38:51.000000Z',
      nonce: 28,
      historic_exchange_rate: '3112.1',
      transaction_types: ['contract_call', 'coin_transfer', 'token_transfer'],
      exchange_rate: '3639.48',
      block_number: 8643770,
      has_error_in_internal_transactions: false
    };
    expect(() => getAmountType(invalidTx.from.hash, invalidTx)).toThrow(
      'Cannot determine transaction amount type'
    );
  });

  it(`should throw error for invalid transaction making a contract_call`, () => {
    const invalidContractCallTx: BlockscoutTransaction = {
      l1_gas_used: '2624',
      priority_fee: '232966000000',
      raw_input:
        '0xf41766d800000000000000000000000000000000000000000000000000000000177bf680000000000000000000000000000000000000000000000000000000043f6312a100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e7d1ff4730d4a575947a993a53d1c4f78138cc700000000000000000000000000000000000000000000000000000000673c7d1100000000000000000000000000000000000000000000000000000000000000010000000000000000000000004900900a850153ea6eb7d172362a37354ad0482800000000000000000000000003b8dc577b89a94b86eaa32249f86b1bf792959f0000000000000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
      max_fee_per_gas: '1002060',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '239954980',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 11184762,
      position: 1,
      max_priority_fee_per_gas: '1000000',
      transaction_tag: null,
      created_contract: null,
      value: '0',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '232966',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45',
        implementations: [],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'Router',
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '1153683741394',
      method: 'swapExactTokensForTokens',
      fee: {
        type: 'actual',
        value: '1386889696374'
      },
      actions: [],
      gas_limit: '248648',
      gas_price: '1001030',
      decoded_input: {
        method_call:
          'swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (address,address,bool)[] routes, address to, uint256 deadline)',
        method_id: 'f41766d8',
        parameters: [
          {
            name: 'amountIn',
            type: 'uint256',
            value: '394000000'
          },
          {
            name: 'amountOutMin',
            type: 'uint256',
            value: '18243326625'
          },
          {
            name: 'routes',
            type: '(address,address,bool)[]',
            value: [
              [
                '0x4900900a850153eA6eB7d172362A37354Ad04828',
                '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
                'false'
              ]
            ]
          },
          {
            name: 'to',
            type: 'address',
            value: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7'
          },
          {
            name: 'deadline',
            type: 'uint256',
            value: '1732017425'
          }
        ]
      },
      l1_gas_price: '10324105268',
      token_transfers: [
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          log_index: 0,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'garbageString1',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '394000000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 1,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            address_hash: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '14',
            holders_count: '14',
            icon_url: null,
            name: 'NTEST',
            symbol: 'NTEST',
            total_supply: '100000000000000',
            type: 'garbageString2',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '20270362917'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 2,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x70F4072F07A67b26b532a92f0c3E9928F8452Ea6',
            implementations: [],
            is_contract: true,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'garbageString3',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '1182000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        }
      ],
      base_fee_per_gas: '1030',
      timestamp: '2024-11-19T11:38:51.000000Z',
      nonce: 28,
      historic_exchange_rate: '3112.1',
      transaction_types: ['contract_call', 'token_transfer'],
      exchange_rate: '3639.48',
      block_number: 8643770,
      has_error_in_internal_transactions: false
    };
    expect(() =>
      getAmountType(invalidContractCallTx.from.hash, invalidContractCallTx)
    ).toThrow('Unable to determine the amount ERC standard');
  });

  it(`should return valid ERC type for a valid transaction making a contract_call`, () => {
    const validContractCallTx: BlockscoutTransaction = {
      l1_gas_used: '2624',
      priority_fee: '232966000000',
      raw_input:
        '0xf41766d800000000000000000000000000000000000000000000000000000000177bf680000000000000000000000000000000000000000000000000000000043f6312a100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e7d1ff4730d4a575947a993a53d1c4f78138cc700000000000000000000000000000000000000000000000000000000673c7d1100000000000000000000000000000000000000000000000000000000000000010000000000000000000000004900900a850153ea6eb7d172362a37354ad0482800000000000000000000000003b8dc577b89a94b86eaa32249f86b1bf792959f0000000000000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
      max_fee_per_gas: '1002060',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '239954980',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 11184762,
      position: 1,
      max_priority_fee_per_gas: '1000000',
      transaction_tag: null,
      created_contract: null,
      value: '0',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '232966',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45',
        implementations: [],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'Router',
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '1153683741394',
      method: 'swapExactTokensForTokens',
      fee: {
        type: 'actual',
        value: '1386889696374'
      },
      actions: [],
      gas_limit: '248648',
      gas_price: '1001030',
      decoded_input: {
        method_call:
          'swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (address,address,bool)[] routes, address to, uint256 deadline)',
        method_id: 'f41766d8',
        parameters: [
          {
            name: 'amountIn',
            type: 'uint256',
            value: '394000000'
          },
          {
            name: 'amountOutMin',
            type: 'uint256',
            value: '18243326625'
          },
          {
            name: 'routes',
            type: '(address,address,bool)[]',
            value: [
              [
                '0x4900900a850153eA6eB7d172362A37354Ad04828',
                '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
                'false'
              ]
            ]
          },
          {
            name: 'to',
            type: 'address',
            value: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7'
          },
          {
            name: 'deadline',
            type: 'uint256',
            value: '1732017425'
          }
        ]
      },
      l1_gas_price: '10324105268',
      token_transfers: [
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          log_index: 0,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '394000000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 1,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            address_hash: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '14',
            holders_count: '14',
            icon_url: null,
            name: 'NTEST',
            symbol: 'NTEST',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '20270362917'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 2,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x70F4072F07A67b26b532a92f0c3E9928F8452Ea6',
            implementations: [],
            is_contract: true,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '1182000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        }
      ],
      base_fee_per_gas: '1030',
      timestamp: '2024-11-19T11:38:51.000000Z',
      nonce: 28,
      historic_exchange_rate: '3112.1',
      transaction_types: ['contract_call', 'token_transfer'],
      exchange_rate: '3639.48',
      block_number: 8643770,
      has_error_in_internal_transactions: false
    };
    expect(
      Object.values(TokenERC).includes(
        getAmountType(validContractCallTx.from.hash, validContractCallTx)
      )
    ).toBeTruthy();
  });

  it(`should return one of '${TokenERC.ERC20}', '${TokenERC.ERC721}' or '${TokenERC.ERC1155}' for a token_transfer transaction making a contract_call`, () => {
    const tokenTransferTx: BlockscoutTransaction = {
      l1_gas_used: '2624',
      priority_fee: '232966000000',
      raw_input:
        '0xf41766d800000000000000000000000000000000000000000000000000000000177bf680000000000000000000000000000000000000000000000000000000043f6312a100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e7d1ff4730d4a575947a993a53d1c4f78138cc700000000000000000000000000000000000000000000000000000000673c7d1100000000000000000000000000000000000000000000000000000000000000010000000000000000000000004900900a850153ea6eb7d172362a37354ad0482800000000000000000000000003b8dc577b89a94b86eaa32249f86b1bf792959f0000000000000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
      max_fee_per_gas: '1002060',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '239954980',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 11184762,
      position: 1,
      max_priority_fee_per_gas: '1000000',
      transaction_tag: null,
      created_contract: null,
      value: '0',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '232966',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45',
        implementations: [],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'Router',
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '1153683741394',
      method: 'swapExactTokensForTokens',
      fee: {
        type: 'actual',
        value: '1386889696374'
      },
      actions: [],
      gas_limit: '248648',
      gas_price: '1001030',
      decoded_input: {
        method_call:
          'swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (address,address,bool)[] routes, address to, uint256 deadline)',
        method_id: 'f41766d8',
        parameters: [
          {
            name: 'amountIn',
            type: 'uint256',
            value: '394000000'
          },
          {
            name: 'amountOutMin',
            type: 'uint256',
            value: '18243326625'
          },
          {
            name: 'routes',
            type: '(address,address,bool)[]',
            value: [
              [
                '0x4900900a850153eA6eB7d172362A37354Ad04828',
                '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
                'false'
              ]
            ]
          },
          {
            name: 'to',
            type: 'address',
            value: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7'
          },
          {
            name: 'deadline',
            type: 'uint256',
            value: '1732017425'
          }
        ]
      },
      l1_gas_price: '10324105268',
      token_transfers: [
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          log_index: 0,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '394000000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 1,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            address_hash: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '14',
            holders_count: '14',
            icon_url: null,
            name: 'NTEST',
            symbol: 'NTEST',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '20270362917'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 2,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x70F4072F07A67b26b532a92f0c3E9928F8452Ea6',
            implementations: [],
            is_contract: true,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '1182000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        }
      ],
      base_fee_per_gas: '1030',
      timestamp: '2024-11-19T11:38:51.000000Z',
      nonce: 28,
      historic_exchange_rate: '3112.1',
      transaction_types: ['contract_call', 'token_transfer'],
      exchange_rate: '3639.48',
      block_number: 8643770,
      has_error_in_internal_transactions: false
    };
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
    const tokenMintingTx: BlockscoutTransaction = {
      l1_gas_used: '2624',
      priority_fee: '232966000000',
      raw_input:
        '0xf41766d800000000000000000000000000000000000000000000000000000000177bf680000000000000000000000000000000000000000000000000000000043f6312a100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e7d1ff4730d4a575947a993a53d1c4f78138cc700000000000000000000000000000000000000000000000000000000673c7d1100000000000000000000000000000000000000000000000000000000000000010000000000000000000000004900900a850153ea6eb7d172362a37354ad0482800000000000000000000000003b8dc577b89a94b86eaa32249f86b1bf792959f0000000000000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
      max_fee_per_gas: '1002060',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '239954980',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 11184762,
      position: 1,
      max_priority_fee_per_gas: '1000000',
      transaction_tag: null,
      created_contract: null,
      value: '0',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '232966',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45',
        implementations: [],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'Router',
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '1153683741394',
      method: 'swapExactTokensForTokens',
      fee: {
        type: 'actual',
        value: '1386889696374'
      },
      actions: [],
      gas_limit: '248648',
      gas_price: '1001030',
      decoded_input: {
        method_call:
          'swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (address,address,bool)[] routes, address to, uint256 deadline)',
        method_id: 'f41766d8',
        parameters: [
          {
            name: 'amountIn',
            type: 'uint256',
            value: '394000000'
          },
          {
            name: 'amountOutMin',
            type: 'uint256',
            value: '18243326625'
          },
          {
            name: 'routes',
            type: '(address,address,bool)[]',
            value: [
              [
                '0x4900900a850153eA6eB7d172362A37354Ad04828',
                '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
                'false'
              ]
            ]
          },
          {
            name: 'to',
            type: 'address',
            value: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7'
          },
          {
            name: 'deadline',
            type: 'uint256',
            value: '1732017425'
          }
        ]
      },
      l1_gas_price: '10324105268',
      token_transfers: [
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          log_index: 0,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '394000000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_minting'
        }
      ],
      base_fee_per_gas: '1030',
      timestamp: '2024-11-19T11:38:51.000000Z',
      nonce: 28,
      historic_exchange_rate: '3112.1',
      transaction_types: ['contract_call', 'token_transfer'],
      exchange_rate: '3639.48',
      block_number: 8643770,
      has_error_in_internal_transactions: false
    };
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
    const erc20Tx: BlockscoutTransaction = {
      l1_gas_used: '2624',
      priority_fee: '232966000000',
      raw_input:
        '0xf41766d800000000000000000000000000000000000000000000000000000000177bf680000000000000000000000000000000000000000000000000000000043f6312a100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e7d1ff4730d4a575947a993a53d1c4f78138cc700000000000000000000000000000000000000000000000000000000673c7d1100000000000000000000000000000000000000000000000000000000000000010000000000000000000000004900900a850153ea6eb7d172362a37354ad0482800000000000000000000000003b8dc577b89a94b86eaa32249f86b1bf792959f0000000000000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
      max_fee_per_gas: '1002060',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '239954980',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 11184762,
      position: 1,
      max_priority_fee_per_gas: '1000000',
      transaction_tag: null,
      created_contract: null,
      value: '0',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '232966',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x3a63171DD9BebF4D07BC782FECC7eb0b890C2A45',
        implementations: [],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'Router',
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '1153683741394',
      method: 'swapExactTokensForTokens',
      fee: {
        type: 'actual',
        value: '1386889696374'
      },
      actions: [],
      gas_limit: '248648',
      gas_price: '1001030',
      decoded_input: {
        method_call:
          'swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (address,address,bool)[] routes, address to, uint256 deadline)',
        method_id: 'f41766d8',
        parameters: [
          {
            name: 'amountIn',
            type: 'uint256',
            value: '394000000'
          },
          {
            name: 'amountOutMin',
            type: 'uint256',
            value: '18243326625'
          },
          {
            name: 'routes',
            type: '(address,address,bool)[]',
            value: [
              [
                '0x4900900a850153eA6eB7d172362A37354Ad04828',
                '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
                'false'
              ]
            ]
          },
          {
            name: 'to',
            type: 'address',
            value: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7'
          },
          {
            name: 'deadline',
            type: 'uint256',
            value: '1732017425'
          }
        ]
      },
      l1_gas_price: '10324105268',
      token_transfers: [
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          log_index: 0,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '394000000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 1,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x6E7d1fF4730d4a575947a993a53D1C4F78138Cc7',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            address_hash: '0x03B8dc577B89A94B86EAA32249f86B1Bf792959f',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '14',
            holders_count: '14',
            icon_url: null,
            name: 'NTEST',
            symbol: 'NTEST',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '20270362917'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        },
        {
          block_hash:
            '0xc586fc61267e93b0dbd731c16f454498cbcb72c8f3bb182ea1e6b1b06d1440de',
          block_number: 8643770,
          from: {
            ens_domain_name: null,
            hash: '0x689fC0669547BFDcc84014f236B825aBaF6f09B1',
            implementations: [
              {
                address: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                name: 'Pool'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'VolatileV2 AMM - NTEST/USDN',
            private_tags: [],
            proxy_type: 'eip1167',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 2,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x70F4072F07A67b26b532a92f0c3E9928F8452Ea6',
            implementations: [],
            is_contract: true,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            address_hash: '0x4900900a850153eA6eB7d172362A37354Ad04828',
            circulating_market_cap: null,
            decimals: '6',
            exchange_rate: null,
            holders: '9',
            holders_count: '9',
            icon_url: null,
            name: 'USDN',
            symbol: 'USDN',
            total_supply: '100000000000000',
            type: 'ERC-20',
            volume_24h: null
          },
          total: {
            decimals: '6',
            value: '1182000'
          },
          transaction_hash:
            '0x84251446e1c202e7e59de9d03f89e8fee8e829d42c053ab31e579ba25115bffa',
          type: 'token_transfer'
        }
      ],
      base_fee_per_gas: '1030',
      timestamp: '2024-11-19T11:38:51.000000Z',
      nonce: 28,
      historic_exchange_rate: '3112.1',
      transaction_types: ['contract_call', 'token_transfer'],
      exchange_rate: '3639.48',
      block_number: 8643770,
      has_error_in_internal_transactions: false
    };
    expect(getAmountType(erc20Tx.from.hash, erc20Tx)).toBe(TokenERC.ERC20);
  });

  it(`should return amount type '${TokenERC.ERC721}' for valid ERC-721 transaction`, () => {
    const erc721Tx: BlockscoutTransaction = {
      l1_gas_used: '5354',
      priority_fee: '356621514662',
      raw_input:
        '0x0f25b1370000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000113c000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000001954bf2423600000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000046f000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041dc9e56cac412fcaff90616148d98f1f0ea692edf0f09bd918e22b4dffade766029c283bc7c52d4a6fbed78909e77f2ad8af0a11f8634640b4dd3c5d4cb8552971c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008768747470733a2f2f697066732d312e6e6f6d69732e63632f62632d312f3078353144663636443441363932363466456644313532443435374335304138453232633034356162345f313133355f436f6d6d6f6e56335f46696e616e63655f34346435313366362d373135622d346364622d623862302d3964643262663433663463652e6a736f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a69484e44424467636c4b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046e756c6c00000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0x595f133e285b50bd1fffc21ea817dd69124d30a4d5f46b48e3b81722a4195f02',
      max_fee_per_gas: '32908385',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '5846743660334',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 6868113,
      position: 8,
      max_priority_fee_per_gas: '661913',
      transaction_tag: null,
      created_contract: null,
      value: '2000000000000000',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x51Df66D4A69264fEfD152D457C50A8E22c045ab4',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '538774',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x46874eDd92d5A33216fe2e151759Ead76Ff43747',
        implementations: [
          {
            address: '0x2A286045F801a8CC38841559C9C22d97038a204a',
            address_hash: '0x2A286045F801a8CC38841559C9C22d97038a204a',
            name: 'NomisScore'
          }
        ],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'NomisScore',
        private_tags: [],
        proxy_type: 'eip1967',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '433269747326',
      method: 'setScore',
      fee: {
        type: 'actual',
        value: '6636634922322'
      },
      actions: [],
      gas_limit: '549662',
      gas_price: '11513854',
      decoded_input: {
        method_call:
          'setScore(bytes signature, uint16 score, uint16 calculationModel, uint256 deadline, string metadataUrl, uint256 chainId, string referralCode, string referrerCode, uint256 discountedMintFee)',
        method_id: '0f25b137',
        parameters: [
          {
            name: 'signature',
            type: 'bytes',
            value:
              '0xdc9e56cac412fcaff90616148d98f1f0ea692edf0f09bd918e22b4dffade766029c283bc7c52d4a6fbed78909e77f2ad8af0a11f8634640b4dd3c5d4cb8552971c'
          },
          {
            name: 'score',
            type: 'uint16',
            value: '4412'
          },
          {
            name: 'calculationModel',
            type: 'uint16',
            value: '11'
          },
          {
            name: 'deadline',
            type: 'uint256',
            value: '1740735922742'
          },
          {
            name: 'metadataUrl',
            type: 'string',
            value:
              'https://ipfs-1.nomis.cc/bc-1/0x51Df66D4A69264fEfD152D457C50A8E22c045ab4_1135_CommonV3_Finance_44d513f6-715b-4cdb-b8b0-9dd2bf43f4ce.json'
          },
          {
            name: 'chainId',
            type: 'uint256',
            value: '1135'
          },
          {
            name: 'referralCode',
            type: 'string',
            value: 'iHNDBDgclK'
          },
          {
            name: 'referrerCode',
            type: 'string',
            value: 'null'
          },
          {
            name: 'discountedMintFee',
            type: 'uint256',
            value: '0'
          }
        ]
      },
      l1_gas_price: '691564116',
      token_transfers: [
        {
          block_hash:
            '0x36bce1a21b4caa5473d67b684c7afdabfaef5d3dec234c2624754f489e5f1a92',
          block_number: 12960380,
          from: {
            ens_domain_name: null,
            hash: '0x0000000000000000000000000000000000000000',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: {
              tags: [
                {
                  meta: {},
                  name: 'Null: 0x000...000',
                  ordinal: 10,
                  slug: 'null-0x000000',
                  tagType: 'name'
                },
                {
                  meta: {},
                  name: 'Imtoken User',
                  ordinal: 0,
                  slug: 'imtoken-user',
                  tagType: 'generic'
                },
                {
                  meta: {},
                  name: 'Metamask User',
                  ordinal: 0,
                  slug: 'metamask-user',
                  tagType: 'generic'
                },
                {
                  meta: {},
                  name: 'Miner',
                  ordinal: 0,
                  slug: 'miner',
                  tagType: 'generic'
                }
              ]
            },
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 23,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x51Df66D4A69264fEfD152D457C50A8E22c045ab4',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0x46874eDd92d5A33216fe2e151759Ead76Ff43747',
            address_hash: '0x46874eDd92d5A33216fe2e151759Ead76Ff43747',
            circulating_market_cap: null,
            decimals: null,
            exchange_rate: null,
            holders: '47735',
            holders_count: '47735',
            icon_url: null,
            name: 'NomisScore',
            symbol: 'NMSS',
            total_supply: null,
            type: 'ERC-721',
            volume_24h: null
          },
          total: {
            token_id: '22741',
            token_instance: {
              animation_url: null,
              external_app_url: 'https://nomis.cc/tokens/',
              id: '22741',
              image_url:
                'https://ipfs-1.nomis.cc/bc-1/0x51Df66D4A69264fEfD152D457C50A8E22c045ab4_1135_CommonV3_Finance_44d513f6-715b-4cdb-b8b0-9dd2bf43f4ce.png',
              is_unique: null,
              media_type: null,
              media_url:
                'https://ipfs-1.nomis.cc/bc-1/0x51Df66D4A69264fEfD152D457C50A8E22c045ab4_1135_CommonV3_Finance_44d513f6-715b-4cdb-b8b0-9dd2bf43f4ce.png',
              metadata: {
                attributes: [
                  {
                    trait_type: 'Blockchain',
                    value: 'Lisk'
                  },
                  {
                    display_type: 'number',
                    trait_type: 'Chain id',
                    value: 1135
                  },
                  {
                    display_type: 'boost_percentage',
                    trait_type: 'Score',
                    value: 44.128004999999995
                  },
                  {
                    trait_type: 'Calculation model',
                    value: 'CommonV3'
                  },
                  {
                    trait_type: 'Score type',
                    value: 'Finance'
                  },
                  {
                    display_type: 'date',
                    trait_type: 'Timestamp',
                    value: 1740649531
                  }
                ],
                description:
                  'Nomis helps end users to build, manage and leverage their transaction history as an onchain reputation.',
                external_url: 'https://nomis.cc/tokens/',
                image:
                  'https://ipfs-1.nomis.cc/bc-1/0x51Df66D4A69264fEfD152D457C50A8E22c045ab4_1135_CommonV3_Finance_44d513f6-715b-4cdb-b8b0-9dd2bf43f4ce.png',
                name: 'Nomis Score'
              },
              owner: null,
              thumbnails: null,
              token: {
                address: '0x46874eDd92d5A33216fe2e151759Ead76Ff43747',
                address_hash: '0x46874eDd92d5A33216fe2e151759Ead76Ff43747',
                circulating_market_cap: null,
                decimals: null,
                exchange_rate: null,
                holders: '47735',
                holders_count: '47735',
                icon_url: null,
                name: 'NomisScore',
                symbol: 'NMSS',
                total_supply: null,
                type: 'ERC-721',
                volume_24h: null
              }
            }
          },
          transaction_hash:
            '0x595f133e285b50bd1fffc21ea817d96d124d30a4d5f46b48e3b81722a4195f02',
          type: 'token_minting'
        }
      ],
      base_fee_per_gas: '10851941',
      timestamp: '2025-02-27T09:45:51.000000Z',
      nonce: 410,
      historic_exchange_rate: '2339.19',
      transaction_types: ['coin_transfer', 'contract_call', 'token_transfer'],
      exchange_rate: '3638.05',
      block_number: 12960380,
      has_error_in_internal_transactions: false
    };
    expect(getAmountType(erc721Tx.from.hash, erc721Tx)).toBe(TokenERC.ERC721);
  });

  it(`should return amount type '${TokenERC.ERC1155}' for valid ERC-1155 transaction`, () => {
    const erc1155Tx: BlockscoutTransaction = {
      l1_gas_used: '3708',
      priority_fee: '305967000000',
      raw_input:
        '0x0eaead670000000000000000000000000000000000000000000000000000000000000060000000000000000000000000421b0d8cce6f38fc8c4344a29e643da6cb85e4ef000000000000000000000000000000000000000000000000000000000000006f421b0d8cce6f38fc8c4344a29e643da6cb85e4ef00000000000000000000000200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000006f000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000412f697066732f6261666b7265696461636c3662627a37666835626c7077323662346d77667177686a7074716e6769643776746f333774617a6b63696a646b6f6279000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000421b0d8cce6f38fc8c4344a29e643da6cb85e4ef00000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000000001000000000000000000000000421b0d8cce6f38fc8c4344a29e643da6cb85e4ef00000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000',
      op_withdrawals: [],
      result: 'success',
      hash: '0xa7c222b69c0e324da6e14f0c96ffb2b47921cc5f727f4ee25a4e4e831f99f851',
      max_fee_per_gas: '1002030',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '310556505',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 800807,
      position: 2,
      max_priority_fee_per_gas: '1000000',
      transaction_tag: null,
      created_contract: null,
      value: '0',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x421B0d8CCE6F38FC8c4344a29E643Da6cB85E4eF',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '305967',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0xEee33Da7B13B96921DB9dc6d62F45f534c6B7937',
        implementations: [
          {
            address: '0x9847154Ec2d4009c2F067926d554F0d3986e1f64',
            address_hash: '0x9847154Ec2d4009c2F067926d554F0d3986e1f64',
            name: 'ERC1155RaribleMeta'
          }
        ],
        is_contract: true,
        is_scam: false,
        is_verified: true,
        metadata: null,
        name: 'TransparentUpgradeableProxy',
        private_tags: [],
        proxy_type: 'eip1967',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '535390870017',
      method: 'mintAndTransfer',
      fee: { type: 'actual', value: '841668426522' },
      actions: [],
      gas_limit: '313160',
      gas_price: '1001015',
      decoded_input: {
        method_call:
          'mintAndTransfer((uint256,string,uint256,(address,uint96)[],(address,uint96)[],bytes[]) data, address to, uint256 _amount)',
        method_id: '0eaead67',
        parameters: [
          {
            name: 'data',
            type: '(uint256,string,uint256,(address,uint96)[],(address,uint96)[],bytes[])',
            value: [
              '29900446396079726096944744274725619604774076161166955200309514255816401616898',
              '/ipfs/bafkreidacl6bbz7fh5blpw26b4mwfqwhjptqngid7vto37tazkcijdkoby',
              '111',
              [['0x421B0d8CCE6F38FC8c4344a29E643Da6cB85E4eF', '10000']],
              [['0x421B0d8CCE6F38FC8c4344a29E643Da6cB85E4eF', '1000']],
              ['0x']
            ]
          },
          {
            name: 'to',
            type: 'address',
            value: '0x421B0d8CCE6F38FC8c4344a29E643Da6cB85E4eF'
          },
          { name: '_amount', type: 'uint256', value: '111' }
        ]
      },
      l1_gas_price: '3890201289',
      token_transfers: [
        {
          block_hash:
            '0x8034016c9aab05aeb4f0bd66ba1a4c4288fd65820eda3c4277685de2d8d20450',
          block_number: 19031816,
          from: {
            ens_domain_name: null,
            hash: '0x0000000000000000000000000000000000000000',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: {
              tags: [
                {
                  meta: {},
                  name: 'Miner',
                  ordinal: 0,
                  slug: 'miner',
                  tagType: 'generic'
                },
                {
                  meta: {},
                  name: 'Null: 0x000...000',
                  ordinal: 10,
                  slug: 'null-0x000000',
                  tagType: 'name'
                },
                {
                  meta: {},
                  name: 'Imtoken User',
                  ordinal: 0,
                  slug: 'imtoken-user',
                  tagType: 'generic'
                },
                {
                  meta: {},
                  name: 'Metamask User',
                  ordinal: 0,
                  slug: 'metamask-user',
                  tagType: 'generic'
                }
              ]
            },
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          log_index: 5,
          method: null,
          timestamp: null,
          to: {
            ens_domain_name: null,
            hash: '0x421B0d8CCE6F38FC8c4344a29E643Da6cB85E4eF',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: null,
            public_tags: [],
            watchlist_names: []
          },
          token: {
            address: '0xEee33Da7B13B96921DB9dc6d62F45f534c6B7937',
            address_hash: '0xEee33Da7B13B96921DB9dc6d62F45f534c6B7937',
            circulating_market_cap: null,
            decimals: null,
            exchange_rate: null,
            holders: '343',
            holders_count: '343',
            icon_url: null,
            name: 'Rarible',
            symbol: 'RARI',
            total_supply: null,
            type: 'ERC-1155',
            volume_24h: null
          },
          total: {
            decimals: null,
            token_id:
              '29900446396079726096944744274725619604774076161166955200309514255816401616898',
            token_instance: {
              animation_url: null,
              external_app_url:
                'https://rarible.com/token/lisk/0xeee33da7b13b96921db9dc6d62f45f534c6b7937:29900446396079726096944744274725619604774076161166955200309514255816401616898',
              id: '29900446396079726096944744274725619604774076161166955200309514255816401616898',
              image_url:
                'https://dweb.link/ipfs/bafybeieoczikjbzcahvwfdvnlygjtensrp7ebn3rwej3jrinbq45tvmjwq/image.png',
              is_unique: null,
              media_type: null,
              media_url:
                'ipfs://ipfs/bafybeieoczikjbzcahvwfdvnlygjtensrp7ebn3rwej3jrinbq45tvmjwq/image.png',
              metadata: {
                attributes: [],
                description: 'LA',
                external_url:
                  'https://rarible.com/token/lisk/0xeee33da7b13b96921db9dc6d62f45f534c6b7937:29900446396079726096944744274725619604774076161166955200309514255816401616898',
                image:
                  'ipfs://ipfs/bafybeieoczikjbzcahvwfdvnlygjtensrp7ebn3rwej3jrinbq45tvmjwq/image.png',
                name: "Lisk's Angels Vol.2"
              },
              owner: null,
              thumbnails: null,
              token: {
                address: '0xEee33Da7B13B96921DB9dc6d62F45f534c6B7937',
                address_hash: '0xEee33Da7B13B96921DB9dc6d62F45f534c6B7937',
                circulating_market_cap: null,
                decimals: null,
                exchange_rate: null,
                holders: '343',
                holders_count: '343',
                icon_url: null,
                name: 'Rarible',
                symbol: 'RARI',
                total_supply: null,
                type: 'ERC-1155',
                volume_24h: null
              }
            },
            value: '111'
          },
          transaction_hash:
            '0xa7c222b69c0e324da6e14f0c96ffb2b47921cc5f727f4ee25a4e4e831f99f851',
          type: 'token_minting'
        }
      ],
      base_fee_per_gas: '1015',
      timestamp: '2025-07-17T22:47:03.000000Z',
      nonce: 9,
      historic_exchange_rate: '3394.24',
      transaction_types: ['contract_call', 'token_transfer'],
      exchange_rate: '3676.72',
      block_number: 19031816,
      has_error_in_internal_transactions: false
    };
    expect(getAmountType(erc1155Tx.from.hash, erc1155Tx)).toBe(
      TokenERC.ERC1155
    );
  });

  it(`should return amount type '${TokenERC.ETH}' for valid ETH transaction`, () => {
    const ethTx: BlockscoutTransaction = {
      l1_gas_used: '1600',
      priority_fee: '2100000000',
      raw_input: '0x',
      op_withdrawals: [],
      result: 'success',
      hash: '0xc24ea39fd33d18ee0c0e1d93683cdb24a520fe024b9dd7c9ed6039d16fb0c1bd',
      max_fee_per_gas: '103042',
      revert_reason: null,
      confirmation_duration: [0, 2.0e3],
      transaction_burnt_fee: '21294000',
      type: 2,
      token_transfers_overflow: false,
      confirmations: 4107583,
      position: 2,
      max_priority_fee_per_gas: '100000',
      transaction_tag: null,
      created_contract: null,
      value: '100000000000000',
      l1_fee_scalar: '0',
      from: {
        ens_domain_name: null,
        hash: '0x7e0bCc78E317Fa28f73a44567d854b081004622d',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: null,
        public_tags: [],
        watchlist_names: []
      },
      gas_used: '21000',
      status: 'ok',
      to: {
        ens_domain_name: null,
        hash: '0x361866eD8a0Ec23347881F33Cf2eCa7597574655',
        implementations: [],
        is_contract: false,
        is_scam: false,
        is_verified: false,
        metadata: null,
        name: null,
        private_tags: [],
        proxy_type: 'unknown',
        public_tags: [],
        watchlist_names: []
      },
      authorization_list: [],
      l1_fee: '170087177247',
      method: null,
      fee: {
        type: 'actual',
        value: '172208471247'
      },
      actions: [],
      gas_limit: '21000',
      gas_price: '101014',
      decoded_input: null,
      l1_gas_price: '324951941',
      token_transfers: [],
      base_fee_per_gas: '1014',
      timestamp: '2025-05-02T09:38:17.000000Z',
      nonce: 8,
      historic_exchange_rate: '1842.3',
      transaction_types: ['coin_transfer'],
      exchange_rate: '3676.72',
      block_number: 15724953,
      has_error_in_internal_transactions: false
    };
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
    const mockRequestResponse = {
      items: [
        {
          priority_fee: '26556163209',
          raw_input: '0x',
          result: 'success',
          hash: '0x3dc796c0ac01958eccb6036c5690643e3730f03bc3f9416cc55051366d16f737',
          max_fee_per_gas: '72579481',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '487688191320',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806108,
          position: 10,
          max_priority_fee_per_gas: '971721',
          transaction_tag: null,
          created_contract: null,
          value: '70000000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '4381877876096'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '18816801',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '17845080',
          timestamp: '2025-01-14T15:36:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11070093,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '16010148070',
          raw_input: '0x',
          result: 'success',
          hash: '0x97b41ed9540bdb247b0f52501c3990cf376874a05adff0a76cef23602cc580d5',
          max_fee_per_gas: '71116530',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '482501256436',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806188,
          position: 9,
          max_priority_fee_per_gas: '585830',
          transaction_tag: null,
          created_contract: null,
          value: '8000000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '7011098170834'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '18241114',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '17655284',
          timestamp: '2025-01-14T15:33:37.000000Z',
          nonce: 7,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11070013,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '23074831215',
          raw_input: '0x',
          result: 'success',
          hash: '0x7957c0323b7fed9da521ab09ac0d4d81ff2ddeaa89a1a7b75738ed23a95769fd',
          max_fee_per_gas: '71120151',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '481942733663',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806344,
          position: 9,
          max_priority_fee_per_gas: '844335',
          transaction_tag: null,
          created_contract: null,
          value: '1000310000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '8371745612475'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '18479182',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '17634847',
          timestamp: '2025-01-14T15:28:25.000000Z',
          nonce: 6,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11069857,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '16786810921',
          raw_input: '0x',
          result: 'success',
          hash: '0x3e50f83636069d59795f0604ed8f2983a1c8dd2ae0f563337486b2362258def8',
          max_fee_per_gas: '77543941',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '524133653798',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806865,
          position: 6,
          max_priority_fee_per_gas: '614249',
          transaction_tag: null,
          created_contract: null,
          value: '1',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '1910836024888'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '19792911',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '19178662',
          timestamp: '2025-01-14T15:11:03.000000Z',
          nonce: 5,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11069336,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '7923258000',
          raw_input: '0x',
          result: 'success',
          hash: '0x2d2582e386500baaa828b823797e6e012675f675339c7330b9eb2fd2033c4cef',
          max_fee_per_gas: '395642',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '96264000',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9766242,
          position: 15,
          max_priority_fee_per_gas: '377298',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '21000',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '284740333951'
          },
          actions: [],
          gas_limit: '21000',
          gas_price: '381882',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '4584',
          timestamp: '2024-12-23T10:11:49.000000Z',
          nonce: 4,
          historic_exchange_rate: '3252.75',
          transaction_types: ['coin_transfer'],
          exchange_rate: '3623.51',
          block_number: 10109959,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '11419548000',
          raw_input: '0x',
          result: 'success',
          hash: '0x210b5c866acf8e2fa873cb6d678b5dbb7c08f1a3e0c188b11f284fa16996fe16',
          max_fee_per_gas: '562472',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '97923000',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9766391,
          position: 8,
          max_priority_fee_per_gas: '543788',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '21000',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '290174283421'
          },
          actions: [],
          gas_limit: '21000',
          gas_price: '548451',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '4663',
          timestamp: '2024-12-23T10:06:51.000000Z',
          nonce: 3,
          historic_exchange_rate: '3252.75',
          transaction_types: ['coin_transfer'],
          exchange_rate: '3623.51',
          block_number: 10109810,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '62713000000',
          raw_input:
            '0x6a7612020000000000000000000000003238f7abda9e6cd9b47d8910822fa792a6c6fa1c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000820000000000000000000000001ac80ce05cd1775bfbb7ceb2d42ed7874810eb3f000000000000000000000000000000000000000000000000000000000000000001a49512d815066cb4ce6a1d124bfe0fed8d02ce317b0aa2f90f960e240a28c76d0861a6e33c6f69c90ee4dbef73411bcf75fa48364e92de7613bf9dfb43d591df1c000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x055ab631e36bae1c152edb323351f3cc217e465939eb25504675d8201196782e',
          max_fee_per_gas: '1001030',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '64594390',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 10587200,
          position: 2,
          max_priority_fee_per_gas: '1001030',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '62713',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: {
            type: 'actual',
            value: '7298646070010'
          },
          actions: [],
          gas_limit: '64378',
          gas_price: '1001030',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C'
              },
              {
                name: 'value',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'data',
                type: 'bytes',
                value: '0x'
              },
              {
                name: 'operation',
                type: 'uint8',
                value: '0'
              },
              {
                name: 'safeTxGas',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'baseGas',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'gasPrice',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'gasToken',
                type: 'address',
                value: '0x0000000000000000000000000000000000000000'
              },
              {
                name: 'refundReceiver',
                type: 'address',
                value: '0x0000000000000000000000000000000000000000'
              },
              {
                name: 'signatures',
                type: 'bytes',
                value:
                  '0x0000000000000000000000001ac80ce05cd1775bfbb7ceb2d42ed7874810eb3f000000000000000000000000000000000000000000000000000000000000000001a49512d815066cb4ce6a1d124bfe0fed8d02ce317b0aa2f90f960e240a28c76d0861a6e33c6f69c90ee4dbef73411bcf75fa48364e92de7613bf9dfb43d591df1c'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1030',
          timestamp: '2024-12-04T10:06:33.000000Z',
          nonce: 2,
          historic_exchange_rate: '3630.27',
          transaction_types: ['contract_call'],
          exchange_rate: '3623.51',
          block_number: 9289001,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '70281000000000',
          raw_input:
            '0xa9059cbb0000000000000000000000001d2b7dd040e3fa75c74637076522b512f5f0b5ca0000000000000000000000000000000000000000000000001bc16d674ec80000',
          result: 'success',
          hash: '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e',
          max_fee_per_gas: '1500001236',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '48259620',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 19057249,
          position: 1,
          max_priority_fee_per_gas: '1500000000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '46854',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
            implementations: [],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'Lisk',
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'transfer',
          fee: {
            type: 'actual',
            value: '70601783286176'
          },
          actions: [],
          gas_limit: '77737',
          gas_price: '1500001030',
          decoded_input: {
            method_call: 'transfer(address to, uint256 value)',
            method_id: 'a9059cbb',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x1D2b7DD040e3fA75c74637076522B512f5f0B5cA'
              },
              {
                name: 'value',
                type: 'uint256',
                value: '2000000000000000000'
              }
            ]
          },
          token_transfers: [
            {
              block_hash:
                '0x67f26a03889948aeb1e04135c3ba8ca5e766b1a9905c735af55b85cbb6196b50',
              block_number: 818952,
              from: {
                ens_domain_name: null,
                hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
                implementations: [],
                is_contract: false,
                is_scam: false,
                is_verified: false,
                metadata: null,
                name: null,
                private_tags: [],
                proxy_type: 'unknown',
                public_tags: [],
                watchlist_names: []
              },
              log_index: 0,
              method: null,
              timestamp: null,
              to: {
                ens_domain_name: null,
                hash: '0x1D2b7DD040e3fA75c74637076522B512f5f0B5cA',
                implementations: [],
                is_contract: false,
                is_scam: false,
                is_verified: false,
                metadata: null,
                name: null,
                private_tags: [],
                proxy_type: 'unknown',
                public_tags: [],
                watchlist_names: []
              },
              token: {
                address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '79818427.94293702',
                decimals: '18',
                exchange_rate: '0.399021',
                holders: '170191',
                holders_count: '170191',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295399861843975131663381838',
                type: 'ERC-20',
                volume_24h: '3278827.6491881176'
              },
              total: {
                decimals: '18',
                value: '2000000000000000000'
              },
              transaction_hash:
                '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e',
              type: 'token_transfer'
            }
          ],
          base_fee_per_gas: '1030',
          timestamp: '2024-05-22T08:31:35.000000Z',
          nonce: 1,
          historic_exchange_rate: '3736.33',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '3623.51',
          block_number: 818952,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '617173500000000',
          raw_input:
            '0xf6de242d00000000000000000000000000000000000000000000000000000000000000c022fcb77f652e11626e9920146fe1a9748622464cc7d4fd97ffd8810f4b3fd4ca000000000000000000000000000000000000000000000000000000000bebc2000000000000000000000000001ac80ce05cd1775bfbb7ceb2d42ed7874810eb3fc0cef39ef40c2e9a87e9a3a1284e79fdad2b43de5bccfb97294d476eda2c63f12600088a07c0797106b4021778779fcc2cbac470f01c67a333fb3fc5d016180d0000000000000000000000000000000000000000000000000000000000000010dcebc9aea23b826cea4698e05c7cad9f88ae83c9cb93196c54f578ef57874596ec362fd65a90197c4e0dbe5bb7d004bcb70aa92eb564e2ed103de9d52aeecb0b86d667c4023763be00d64f61f5f99a7fe686d7d7b85929f8b9d90e32d33d22368c0fc329230f8ce8429e7aeb1bcfedfe97952ad174c7d2614b76a49ed343207bcabc98bbe9e66ce8630649adbca00423bd1002f3ccc75da6b02d185737c65afae1c2212271fe8c937be90f95e7e8f6aee737db35215d72a59b8b0dd38dd03d3aa84d1fbd9c848d68823ffb44bf66adb8f306405dce3c6b724fa9a26bfd6bd7f5e62db724e5ab2538ec0143d7b561fdc6d51af193fb5fbec57db2ca78bad09d04dc84a2530cd0661b51832dd2db8365e2d67ddfd6a144ffb3092cd58b17015c38a05b8589a7b3ab89df513770b7abc31e9e72b7bbbcf831157ac4b17622b8a0739ae6f60dd7465340a65228ccac254f6e5941a8ac816d18282395407a0b06ad13587d4ead96715e50d3088743c1b323a1cd3eaf52cd809b5d5bf2acafee81d4bbf67363bd776dabb68406b6b9a1141aa8a4b09bdfef05da8627689224142527abc92260666097b12fbbae9fe5437b9e7946977d085bf2386c2aef8565f371dd3fa80edbcd9ae9214258b9f93adef63f69642433f8320e700b89254c5c112fe59a140b2b114065bf5a7e40295bcd5132e7e9a3b4e079ba68d28429c9b728212ed4',
          result: 'success',
          hash: '0xa23002e5f8a63d472dc364e470f2092f93da70f5631adbbaef758666e9052412',
          max_fee_per_gas: '1500001236',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '423792470',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 19077213,
          position: 1,
          max_priority_fee_per_gas: '1500000000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '411449',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0xD7BE2Fd98BfD64c1dfCf6c013fC593eF09219994',
            implementations: [
              {
                address: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                address_hash: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                name: 'L2Claim'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'ERC1967Proxy',
            private_tags: [],
            proxy_type: 'eip1967',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'claimRegularAccount',
          fee: {
            type: 'actual',
            value: '619300400302550'
          },
          actions: [],
          gas_limit: '420316',
          gas_price: '1500001030',
          decoded_input: {
            method_call:
              'claimRegularAccount(bytes32[] _proof, bytes32 _pubKey, uint64 _amount, address _recipient, (bytes32,bytes32) _sig)',
            method_id: 'f6de242d',
            parameters: [
              {
                name: '_proof',
                type: 'bytes32[]',
                value: [
                  '0xdcebc9aea23b826cea4698e05c7cad9f88ae83c9cb93196c54f578ef57874596',
                  '0xec362fd65a90197c4e0dbe5bb7d004bcb70aa92eb564e2ed103de9d52aeecb0b',
                  '0x86d667c4023763be00d64f61f5f99a7fe686d7d7b85929f8b9d90e32d33d2236',
                  '0x8c0fc329230f8ce8429e7aeb1bcfedfe97952ad174c7d2614b76a49ed343207b',
                  '0xcabc98bbe9e66ce8630649adbca00423bd1002f3ccc75da6b02d185737c65afa',
                  '0xe1c2212271fe8c937be90f95e7e8f6aee737db35215d72a59b8b0dd38dd03d3a',
                  '0xa84d1fbd9c848d68823ffb44bf66adb8f306405dce3c6b724fa9a26bfd6bd7f5',
                  '0xe62db724e5ab2538ec0143d7b561fdc6d51af193fb5fbec57db2ca78bad09d04',
                  '0xdc84a2530cd0661b51832dd2db8365e2d67ddfd6a144ffb3092cd58b17015c38',
                  '0xa05b8589a7b3ab89df513770b7abc31e9e72b7bbbcf831157ac4b17622b8a073',
                  '0x9ae6f60dd7465340a65228ccac254f6e5941a8ac816d18282395407a0b06ad13',
                  '0x587d4ead96715e50d3088743c1b323a1cd3eaf52cd809b5d5bf2acafee81d4bb',
                  '0xf67363bd776dabb68406b6b9a1141aa8a4b09bdfef05da8627689224142527ab',
                  '0xc92260666097b12fbbae9fe5437b9e7946977d085bf2386c2aef8565f371dd3f',
                  '0xa80edbcd9ae9214258b9f93adef63f69642433f8320e700b89254c5c112fe59a',
                  '0x140b2b114065bf5a7e40295bcd5132e7e9a3b4e079ba68d28429c9b728212ed4'
                ]
              },
              {
                name: '_pubKey',
                type: 'bytes32',
                value:
                  '0x22fcb77f652e11626e9920146fe1a9748622464cc7d4fd97ffd8810f4b3fd4ca'
              },
              {
                name: '_amount',
                type: 'uint64',
                value: '200000000'
              },
              {
                name: '_recipient',
                type: 'address',
                value: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F'
              },
              {
                name: '_sig',
                type: '(bytes32,bytes32)',
                value: [
                  '0xc0cef39ef40c2e9a87e9a3a1284e79fdad2b43de5bccfb97294d476eda2c63f1',
                  '0x2600088a07c0797106b4021778779fcc2cbac470f01c67a333fb3fc5d016180d'
                ]
              }
            ]
          },
          token_transfers: [
            {
              block_hash:
                '0xe3e1a35f1c58c9927bb1259921cd9922eb341c652f815769fa76a26fe7f99ca3',
              block_number: 798988,
              from: {
                ens_domain_name: null,
                hash: '0xD7BE2Fd98BfD64c1dfCf6c013fC593eF09219994',
                implementations: [
                  {
                    address: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                    address_hash: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                    name: 'L2Claim'
                  }
                ],
                is_contract: true,
                is_scam: false,
                is_verified: true,
                metadata: null,
                name: 'ERC1967Proxy',
                private_tags: [],
                proxy_type: 'eip1967',
                public_tags: [],
                watchlist_names: []
              },
              log_index: 0,
              method: null,
              timestamp: null,
              to: {
                ens_domain_name: null,
                hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
                implementations: [],
                is_contract: false,
                is_scam: false,
                is_verified: false,
                metadata: null,
                name: null,
                private_tags: [],
                proxy_type: 'unknown',
                public_tags: [],
                watchlist_names: []
              },
              token: {
                address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '79818427.94293702',
                decimals: '18',
                exchange_rate: '0.399021',
                holders: '170187',
                holders_count: '170187',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295399861843975131663381838',
                type: 'ERC-20',
                volume_24h: '3278827.6491881176'
              },
              total: {
                decimals: '18',
                value: '2000000000000000000'
              },
              transaction_hash:
                '0xa23002e5f8a63d472dc364e470f2092f93da70f5631adbbaef758666e9052412',
              type: 'token_transfer'
            }
          ],
          base_fee_per_gas: '1030',
          timestamp: '2024-05-21T21:26:07.000000Z',
          nonce: 0,
          historic_exchange_rate: '3789.36',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '3623.51',
          block_number: 798988,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: null
    };
    (httpUtils.request as jest.Mock).mockResolvedValue(mockRequestResponse);
    (activity.fillTokenTransactions as jest.Mock).mockResolvedValue(
      mockRequestResponse
    );

    const params = { address: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F' };
    const result = await getActivitiesByAddress(params);

    expect(httpUtils.request).toHaveBeenCalledTimes(2);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      1,
      getBaseTransactionsRequestUrl(params.address)
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      2,
      `https://blockscout.lisk.com/api/v2/addresses/${params.address}/token-transfers`
    );
    expect(result).toStrictEqual({
      activities: [
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '70000000000000'
          },
          status: 'success',
          transactionID:
            '0x3dc796c0ac01958eccb6036c5690643e3730f03bc3f9416cc55051366d16f737'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '8000000000000'
          },
          status: 'success',
          transactionID:
            '0x97b41ed9540bdb247b0f52501c3990cf376874a05adff0a76cef23602cc580d5'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '1000310000000000'
          },
          status: 'success',
          transactionID:
            '0x7957c0323b7fed9da521ab09ac0d4d81ff2ddeaa89a1a7b75738ed23a95769fd'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '1'
          },
          status: 'success',
          transactionID:
            '0x3e50f83636069d59795f0604ed8f2983a1c8dd2ae0f563337486b2362258def8'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x2d2582e386500baaa828b823797e6e012675f675339c7330b9eb2fd2033c4cef'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x210b5c866acf8e2fa873cb6d678b5dbb7c08f1a3e0c188b11f284fa16996fe16'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '0'
          },
          status: 'success',
          transactionID:
            '0x055ab631e36bae1c152edb323351f3cc217e465939eb25504675d8201196782e'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
              decimals: '18',
              icon: null,
              name: 'Lisk',
              symbol: 'LSK',
              type: 'erc-20'
            },
            type: 'erc-20',
            value: '0'
          },
          status: 'success',
          transactionID:
            '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
              decimals: '18',
              icon: null,
              name: 'Lisk',
              symbol: 'LSK',
              type: 'erc-20'
            },
            type: 'erc-20',
            value: '0'
          },
          status: 'success',
          transactionID:
            '0xa23002e5f8a63d472dc364e470f2092f93da70f5631adbbaef758666e9052412'
        }
      ],
      metadata: {
        count: mockRequestResponse.items.length,
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: DEFAULT_PAGINATION_LIMIT,
        hasNextPage: false
      }
    });
  });

  xit('should return list of activities (multiple API requests)', async () => {
    const mockRequestResponse1 = {
      items: [
        {
          priority_fee: '26556163209',
          raw_input: '0x',
          result: 'success',
          hash: '0x3dc796c0ac01958eccb6036c5690643e3730f03bc3f9416cc55051366d16f737',
          max_fee_per_gas: '72579481',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '487688191320',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806108,
          position: 10,
          max_priority_fee_per_gas: '971721',
          transaction_tag: null,
          created_contract: null,
          value: '70000000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '4381877876096'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '18816801',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '17845080',
          timestamp: '2025-01-14T15:36:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11070093,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '16010148070',
          raw_input: '0x',
          result: 'success',
          hash: '0x97b41ed9540bdb247b0f52501c3990cf376874a05adff0a76cef23602cc580d5',
          max_fee_per_gas: '71116530',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '482501256436',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806188,
          position: 9,
          max_priority_fee_per_gas: '585830',
          transaction_tag: null,
          created_contract: null,
          value: '8000000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '7011098170834'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '18241114',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '17655284',
          timestamp: '2025-01-14T15:33:37.000000Z',
          nonce: 7,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11070013,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '23074831215',
          raw_input: '0x',
          result: 'success',
          hash: '0x7957c0323b7fed9da521ab09ac0d4d81ff2ddeaa89a1a7b75738ed23a95769fd',
          max_fee_per_gas: '71120151',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '481942733663',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806344,
          position: 9,
          max_priority_fee_per_gas: '844335',
          transaction_tag: null,
          created_contract: null,
          value: '1000310000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '8371745612475'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '18479182',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '17634847',
          timestamp: '2025-01-14T15:28:25.000000Z',
          nonce: 6,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11069857,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: { block_number: 123, index: 1, items_count: 3 }
    };
    const mockRequestResponse2 = {
      items: [
        {
          priority_fee: '16786810921',
          raw_input: '0x',
          result: 'success',
          hash: '0x3e50f83636069d59795f0604ed8f2983a1c8dd2ae0f563337486b2362258def8',
          max_fee_per_gas: '77543941',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '524133653798',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8806865,
          position: 6,
          max_priority_fee_per_gas: '614249',
          transaction_tag: null,
          created_contract: null,
          value: '1',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '27329',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '1910836024888'
          },
          actions: [],
          gas_limit: '27674',
          gas_price: '19792911',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '19178662',
          timestamp: '2025-01-14T15:11:03.000000Z',
          nonce: 5,
          historic_exchange_rate: '3135.77',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '3623.51',
          block_number: 11069336,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '7923258000',
          raw_input: '0x',
          result: 'success',
          hash: '0x2d2582e386500baaa828b823797e6e012675f675339c7330b9eb2fd2033c4cef',
          max_fee_per_gas: '395642',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '96264000',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9766242,
          position: 15,
          max_priority_fee_per_gas: '377298',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '21000',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '284740333951'
          },
          actions: [],
          gas_limit: '21000',
          gas_price: '381882',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '4584',
          timestamp: '2024-12-23T10:11:49.000000Z',
          nonce: 4,
          historic_exchange_rate: '3252.75',
          transaction_types: ['coin_transfer'],
          exchange_rate: '3623.51',
          block_number: 10109959,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '11419548000',
          raw_input: '0x',
          result: 'success',
          hash: '0x210b5c866acf8e2fa873cb6d678b5dbb7c08f1a3e0c188b11f284fa16996fe16',
          max_fee_per_gas: '562472',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '97923000',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9766391,
          position: 8,
          max_priority_fee_per_gas: '543788',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '21000',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: null,
          fee: {
            type: 'actual',
            value: '290174283421'
          },
          actions: [],
          gas_limit: '21000',
          gas_price: '548451',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '4663',
          timestamp: '2024-12-23T10:06:51.000000Z',
          nonce: 3,
          historic_exchange_rate: '3252.75',
          transaction_types: ['coin_transfer'],
          exchange_rate: '3623.51',
          block_number: 10109810,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: { block_number: 456, index: 3, items_count: 5 }
    };
    const mockRequestResponse3 = {
      items: [
        {
          priority_fee: '62713000000',
          raw_input:
            '0x6a7612020000000000000000000000003238f7abda9e6cd9b47d8910822fa792a6c6fa1c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000820000000000000000000000001ac80ce05cd1775bfbb7ceb2d42ed7874810eb3f000000000000000000000000000000000000000000000000000000000000000001a49512d815066cb4ce6a1d124bfe0fed8d02ce317b0aa2f90f960e240a28c76d0861a6e33c6f69c90ee4dbef73411bcf75fa48364e92de7613bf9dfb43d591df1c000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x055ab631e36bae1c152edb323351f3cc217e465939eb25504675d8201196782e',
          max_fee_per_gas: '1001030',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '64594390',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 10587200,
          position: 2,
          max_priority_fee_per_gas: '1001030',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '62713',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C',
            implementations: [
              {
                address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                address_hash: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
                name: 'GnosisSafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'GnosisSafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: {
            type: 'actual',
            value: '7298646070010'
          },
          actions: [],
          gas_limit: '64378',
          gas_price: '1001030',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x3238f7abdA9e6Cd9B47D8910822Fa792a6C6Fa1C'
              },
              {
                name: 'value',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'data',
                type: 'bytes',
                value: '0x'
              },
              {
                name: 'operation',
                type: 'uint8',
                value: '0'
              },
              {
                name: 'safeTxGas',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'baseGas',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'gasPrice',
                type: 'uint256',
                value: '0'
              },
              {
                name: 'gasToken',
                type: 'address',
                value: '0x0000000000000000000000000000000000000000'
              },
              {
                name: 'refundReceiver',
                type: 'address',
                value: '0x0000000000000000000000000000000000000000'
              },
              {
                name: 'signatures',
                type: 'bytes',
                value:
                  '0x0000000000000000000000001ac80ce05cd1775bfbb7ceb2d42ed7874810eb3f000000000000000000000000000000000000000000000000000000000000000001a49512d815066cb4ce6a1d124bfe0fed8d02ce317b0aa2f90f960e240a28c76d0861a6e33c6f69c90ee4dbef73411bcf75fa48364e92de7613bf9dfb43d591df1c'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1030',
          timestamp: '2024-12-04T10:06:33.000000Z',
          nonce: 2,
          historic_exchange_rate: '3630.27',
          transaction_types: ['contract_call'],
          exchange_rate: '3623.51',
          block_number: 9289001,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '70281000000000',
          raw_input:
            '0xa9059cbb0000000000000000000000001d2b7dd040e3fa75c74637076522b512f5f0b5ca0000000000000000000000000000000000000000000000001bc16d674ec80000',
          result: 'success',
          hash: '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e',
          max_fee_per_gas: '1500001236',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '48259620',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 19057249,
          position: 1,
          max_priority_fee_per_gas: '1500000000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '46854',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
            implementations: [],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'Lisk',
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'transfer',
          fee: {
            type: 'actual',
            value: '70601783286176'
          },
          actions: [],
          gas_limit: '77737',
          gas_price: '1500001030',
          decoded_input: {
            method_call: 'transfer(address to, uint256 value)',
            method_id: 'a9059cbb',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x1D2b7DD040e3fA75c74637076522B512f5f0B5cA'
              },
              {
                name: 'value',
                type: 'uint256',
                value: '2000000000000000000'
              }
            ]
          },
          token_transfers: [
            {
              block_hash:
                '0x67f26a03889948aeb1e04135c3ba8ca5e766b1a9905c735af55b85cbb6196b50',
              block_number: 818952,
              from: {
                ens_domain_name: null,
                hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
                implementations: [],
                is_contract: false,
                is_scam: false,
                is_verified: false,
                metadata: null,
                name: null,
                private_tags: [],
                proxy_type: 'unknown',
                public_tags: [],
                watchlist_names: []
              },
              log_index: 0,
              method: null,
              timestamp: null,
              to: {
                ens_domain_name: null,
                hash: '0x1D2b7DD040e3fA75c74637076522B512f5f0B5cA',
                implementations: [],
                is_contract: false,
                is_scam: false,
                is_verified: false,
                metadata: null,
                name: null,
                private_tags: [],
                proxy_type: 'unknown',
                public_tags: [],
                watchlist_names: []
              },
              token: {
                address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '79818427.94293702',
                decimals: '18',
                exchange_rate: '0.399021',
                holders: '170191',
                holders_count: '170191',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295399861843975131663381838',
                type: 'ERC-20',
                volume_24h: '3278827.6491881176'
              },
              total: {
                decimals: '18',
                value: '2000000000000000000'
              },
              transaction_hash:
                '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e',
              type: 'token_transfer'
            }
          ],
          base_fee_per_gas: '1030',
          timestamp: '2024-05-22T08:31:35.000000Z',
          nonce: 1,
          historic_exchange_rate: '3736.33',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '3623.51',
          block_number: 818952,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '617173500000000',
          raw_input:
            '0xf6de242d00000000000000000000000000000000000000000000000000000000000000c022fcb77f652e11626e9920146fe1a9748622464cc7d4fd97ffd8810f4b3fd4ca000000000000000000000000000000000000000000000000000000000bebc2000000000000000000000000001ac80ce05cd1775bfbb7ceb2d42ed7874810eb3fc0cef39ef40c2e9a87e9a3a1284e79fdad2b43de5bccfb97294d476eda2c63f12600088a07c0797106b4021778779fcc2cbac470f01c67a333fb3fc5d016180d0000000000000000000000000000000000000000000000000000000000000010dcebc9aea23b826cea4698e05c7cad9f88ae83c9cb93196c54f578ef57874596ec362fd65a90197c4e0dbe5bb7d004bcb70aa92eb564e2ed103de9d52aeecb0b86d667c4023763be00d64f61f5f99a7fe686d7d7b85929f8b9d90e32d33d22368c0fc329230f8ce8429e7aeb1bcfedfe97952ad174c7d2614b76a49ed343207bcabc98bbe9e66ce8630649adbca00423bd1002f3ccc75da6b02d185737c65afae1c2212271fe8c937be90f95e7e8f6aee737db35215d72a59b8b0dd38dd03d3aa84d1fbd9c848d68823ffb44bf66adb8f306405dce3c6b724fa9a26bfd6bd7f5e62db724e5ab2538ec0143d7b561fdc6d51af193fb5fbec57db2ca78bad09d04dc84a2530cd0661b51832dd2db8365e2d67ddfd6a144ffb3092cd58b17015c38a05b8589a7b3ab89df513770b7abc31e9e72b7bbbcf831157ac4b17622b8a0739ae6f60dd7465340a65228ccac254f6e5941a8ac816d18282395407a0b06ad13587d4ead96715e50d3088743c1b323a1cd3eaf52cd809b5d5bf2acafee81d4bbf67363bd776dabb68406b6b9a1141aa8a4b09bdfef05da8627689224142527abc92260666097b12fbbae9fe5437b9e7946977d085bf2386c2aef8565f371dd3fa80edbcd9ae9214258b9f93adef63f69642433f8320e700b89254c5c112fe59a140b2b114065bf5a7e40295bcd5132e7e9a3b4e079ba68d28429c9b728212ed4',
          result: 'success',
          hash: '0xa23002e5f8a63d472dc364e470f2092f93da70f5631adbbaef758666e9052412',
          max_fee_per_gas: '1500001236',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '423792470',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 19077213,
          position: 1,
          max_priority_fee_per_gas: '1500000000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
            implementations: [],
            is_contract: false,
            is_scam: false,
            is_verified: false,
            metadata: null,
            name: null,
            private_tags: [],
            proxy_type: 'unknown',
            public_tags: [],
            watchlist_names: []
          },
          gas_used: '411449',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0xD7BE2Fd98BfD64c1dfCf6c013fC593eF09219994',
            implementations: [
              {
                address: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                address_hash: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                name: 'L2Claim'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'ERC1967Proxy',
            private_tags: [],
            proxy_type: 'eip1967',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'claimRegularAccount',
          fee: {
            type: 'actual',
            value: '619300400302550'
          },
          actions: [],
          gas_limit: '420316',
          gas_price: '1500001030',
          decoded_input: {
            method_call:
              'claimRegularAccount(bytes32[] _proof, bytes32 _pubKey, uint64 _amount, address _recipient, (bytes32,bytes32) _sig)',
            method_id: 'f6de242d',
            parameters: [
              {
                name: '_proof',
                type: 'bytes32[]',
                value: [
                  '0xdcebc9aea23b826cea4698e05c7cad9f88ae83c9cb93196c54f578ef57874596',
                  '0xec362fd65a90197c4e0dbe5bb7d004bcb70aa92eb564e2ed103de9d52aeecb0b',
                  '0x86d667c4023763be00d64f61f5f99a7fe686d7d7b85929f8b9d90e32d33d2236',
                  '0x8c0fc329230f8ce8429e7aeb1bcfedfe97952ad174c7d2614b76a49ed343207b',
                  '0xcabc98bbe9e66ce8630649adbca00423bd1002f3ccc75da6b02d185737c65afa',
                  '0xe1c2212271fe8c937be90f95e7e8f6aee737db35215d72a59b8b0dd38dd03d3a',
                  '0xa84d1fbd9c848d68823ffb44bf66adb8f306405dce3c6b724fa9a26bfd6bd7f5',
                  '0xe62db724e5ab2538ec0143d7b561fdc6d51af193fb5fbec57db2ca78bad09d04',
                  '0xdc84a2530cd0661b51832dd2db8365e2d67ddfd6a144ffb3092cd58b17015c38',
                  '0xa05b8589a7b3ab89df513770b7abc31e9e72b7bbbcf831157ac4b17622b8a073',
                  '0x9ae6f60dd7465340a65228ccac254f6e5941a8ac816d18282395407a0b06ad13',
                  '0x587d4ead96715e50d3088743c1b323a1cd3eaf52cd809b5d5bf2acafee81d4bb',
                  '0xf67363bd776dabb68406b6b9a1141aa8a4b09bdfef05da8627689224142527ab',
                  '0xc92260666097b12fbbae9fe5437b9e7946977d085bf2386c2aef8565f371dd3f',
                  '0xa80edbcd9ae9214258b9f93adef63f69642433f8320e700b89254c5c112fe59a',
                  '0x140b2b114065bf5a7e40295bcd5132e7e9a3b4e079ba68d28429c9b728212ed4'
                ]
              },
              {
                name: '_pubKey',
                type: 'bytes32',
                value:
                  '0x22fcb77f652e11626e9920146fe1a9748622464cc7d4fd97ffd8810f4b3fd4ca'
              },
              {
                name: '_amount',
                type: 'uint64',
                value: '200000000'
              },
              {
                name: '_recipient',
                type: 'address',
                value: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F'
              },
              {
                name: '_sig',
                type: '(bytes32,bytes32)',
                value: [
                  '0xc0cef39ef40c2e9a87e9a3a1284e79fdad2b43de5bccfb97294d476eda2c63f1',
                  '0x2600088a07c0797106b4021778779fcc2cbac470f01c67a333fb3fc5d016180d'
                ]
              }
            ]
          },
          token_transfers: [
            {
              block_hash:
                '0xe3e1a35f1c58c9927bb1259921cd9922eb341c652f815769fa76a26fe7f99ca3',
              block_number: 798988,
              from: {
                ens_domain_name: null,
                hash: '0xD7BE2Fd98BfD64c1dfCf6c013fC593eF09219994',
                implementations: [
                  {
                    address: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                    address_hash: '0x60790Dc2d45BaA8B36282889569BbB301F4D0c41',
                    name: 'L2Claim'
                  }
                ],
                is_contract: true,
                is_scam: false,
                is_verified: true,
                metadata: null,
                name: 'ERC1967Proxy',
                private_tags: [],
                proxy_type: 'eip1967',
                public_tags: [],
                watchlist_names: []
              },
              log_index: 0,
              method: null,
              timestamp: null,
              to: {
                ens_domain_name: null,
                hash: '0x1AC80cE05cd1775BfBb7cEB2D42ed7874810EB3F',
                implementations: [],
                is_contract: false,
                is_scam: false,
                is_verified: false,
                metadata: null,
                name: null,
                private_tags: [],
                proxy_type: 'unknown',
                public_tags: [],
                watchlist_names: []
              },
              token: {
                address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '79818427.94293702',
                decimals: '18',
                exchange_rate: '0.399021',
                holders: '170187',
                holders_count: '170187',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295399861843975131663381838',
                type: 'ERC-20',
                volume_24h: '3278827.6491881176'
              },
              total: {
                decimals: '18',
                value: '2000000000000000000'
              },
              transaction_hash:
                '0xa23002e5f8a63d472dc364e470f2092f93da70f5631adbbaef758666e9052412',
              type: 'token_transfer'
            }
          ],
          base_fee_per_gas: '1030',
          timestamp: '2024-05-21T21:26:07.000000Z',
          nonce: 0,
          historic_exchange_rate: '3789.36',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '3623.51',
          block_number: 798988,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: null
    };

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
      offset: 4,
      limit: 4
    };
    const result = await getActivitiesByAddress(params);
    expect(httpUtils.request).toHaveBeenCalledTimes(3);

    const baseRequestUrl = getBaseTransactionsRequestUrl(params.address);
    expect(httpUtils.request).toHaveBeenNthCalledWith(1, baseRequestUrl);
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      2,
      `${baseRequestUrl}?block_number=${mockRequestResponse1.next_page_params.block_number}&index=${mockRequestResponse1.next_page_params.index}&items_count=${mockRequestResponse1.next_page_params.items_count}`
    );
    expect(httpUtils.request).toHaveBeenNthCalledWith(
      3,
      `${baseRequestUrl}?block_number=${mockRequestResponse2.next_page_params.block_number}&index=${mockRequestResponse2.next_page_params.index}&items_count=${mockRequestResponse2.next_page_params.items_count}`
    );
    expect(result).toStrictEqual({
      activities: [
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x2d2582e386500baaa828b823797e6e012675f675339c7330b9eb2fd2033c4cef'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x210b5c866acf8e2fa873cb6d678b5dbb7c08f1a3e0c188b11f284fa16996fe16'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: 'eth'
            },
            type: 'eth',
            value: '0'
          },
          status: 'success',
          transactionID:
            '0x055ab631e36bae1c152edb323351f3cc217e465939eb25504675d8201196782e'
        },
        {
          activityType: 'sent',
          amount: {
            tokenInfo: {
              address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
              decimals: '18',
              icon: null,
              name: 'Lisk',
              symbol: 'LSK',
              type: 'erc-20'
            },
            type: 'erc-20',
            value: '0'
          },
          status: 'success',
          transactionID:
            '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e'
        }
      ],
      metadata: { count: 4, offset: 4, limit: 4, hasNextPage: true }
    });
  });

  it('should throw error when address in params is invalid', async () => {
    const params = { address: 'invalidAddress' };
    expect(async () => getActivitiesByAddress(params)).rejects.toThrow(
      'Invalid address format'
    );
  });
});
