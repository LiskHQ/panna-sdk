import { getAmountType } from './activity';
import { TokenERC, BlockscoutTransaction, TokenType } from './activity.types';

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
      transaction_types: ['contract_call', 'coin_transfer'],
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
      transaction_types: ['contract_call'],
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
