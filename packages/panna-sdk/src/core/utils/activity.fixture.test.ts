import { ethIcon } from '../../react/consts';
import { TokenERC } from './activity.types';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET
} from './constants';

export const fillTokenTransactions = {
  should_assign_empty_array_to_token_transfers_for_each_transaction: {
    inputTransactions: [
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
        confirmations: 9676307,
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
        fee: { type: 'actual', value: '4381877876096' },
        actions: [],
        gas_limit: '27674',
        gas_price: '18816801',
        decoded_input: null,
        token_transfers: null,
        base_fee_per_gas: '17845080',
        timestamp: '2025-01-14T15:36:17.000000Z',
        nonce: 8,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 9676387,
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
        fee: { type: 'actual', value: '7011098170834' },
        actions: [],
        gas_limit: '27674',
        gas_price: '18241114',
        decoded_input: null,
        token_transfers: null,
        base_fee_per_gas: '17655284',
        timestamp: '2025-01-14T15:33:37.000000Z',
        nonce: 7,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 9676543,
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
        fee: { type: 'actual', value: '8371745612475' },
        actions: [],
        gas_limit: '27674',
        gas_price: '18479182',
        decoded_input: null,
        token_transfers: null,
        base_fee_per_gas: '17634847',
        timestamp: '2025-01-14T15:28:25.000000Z',
        nonce: 6,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 9677064,
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
        fee: { type: 'actual', value: '1910836024888' },
        actions: [],
        gas_limit: '27674',
        gas_price: '19792911',
        decoded_input: null,
        token_transfers: null,
        base_fee_per_gas: '19178662',
        timestamp: '2025-01-14T15:11:03.000000Z',
        nonce: 5,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 10636441,
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
        fee: { type: 'actual', value: '284740333951' },
        actions: [],
        gas_limit: '21000',
        gas_price: '381882',
        decoded_input: null,
        token_transfers: null,
        base_fee_per_gas: '4584',
        timestamp: '2024-12-23T10:11:49.000000Z',
        nonce: 4,
        historic_exchange_rate: '3418.24',
        transaction_types: ['coin_transfer'],
        exchange_rate: '4558.13',
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
        confirmations: 10636590,
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
        fee: { type: 'actual', value: '290174283421' },
        actions: [],
        gas_limit: '21000',
        gas_price: '548451',
        decoded_input: null,
        token_transfers: null,
        base_fee_per_gas: '4663',
        timestamp: '2024-12-23T10:06:51.000000Z',
        nonce: 3,
        historic_exchange_rate: '3418.24',
        transaction_types: ['coin_transfer'],
        exchange_rate: '4558.13',
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
        confirmations: 11457399,
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
        fee: { type: 'actual', value: '7298646070010' },
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
            { name: 'value', type: 'uint256', value: '0' },
            { name: 'data', type: 'bytes', value: '0x' },
            { name: 'operation', type: 'uint8', value: '0' },
            { name: 'safeTxGas', type: 'uint256', value: '0' },
            { name: 'baseGas', type: 'uint256', value: '0' },
            { name: 'gasPrice', type: 'uint256', value: '0' },
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
        historic_exchange_rate: '3845.15',
        transaction_types: ['contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 19927448,
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
        fee: { type: 'actual', value: '70601783286176' },
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
            { name: 'value', type: 'uint256', value: '2000000000000000000' }
          ]
        },
        token_transfers: null,
        base_fee_per_gas: '1030',
        timestamp: '2024-05-22T08:31:35.000000Z',
        nonce: 1,
        historic_exchange_rate: '3736.33',
        transaction_types: ['contract_call', 'token_transfer'],
        exchange_rate: '4558.13',
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
        confirmations: 19947412,
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
        fee: { type: 'actual', value: '619300400302550' },
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
            { name: '_amount', type: 'uint64', value: '200000000' },
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
        token_transfers: null,
        base_fee_per_gas: '1030',
        timestamp: '2024-05-21T21:26:07.000000Z',
        nonce: 0,
        historic_exchange_rate: '3789.36',
        transaction_types: ['contract_call', 'token_transfer'],
        exchange_rate: '4558.13',
        block_number: 798988,
        has_error_in_internal_transactions: false
      }
    ],
    mockHttpResponse: { items: [], next_page_params: null },
    wantResult: [
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
        confirmations: 9676307,
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
        fee: { type: 'actual', value: '4381877876096' },
        actions: [],
        gas_limit: '27674',
        gas_price: '18816801',
        decoded_input: null,
        token_transfers: [],
        base_fee_per_gas: '17845080',
        timestamp: '2025-01-14T15:36:17.000000Z',
        nonce: 8,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 9676387,
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
        fee: { type: 'actual', value: '7011098170834' },
        actions: [],
        gas_limit: '27674',
        gas_price: '18241114',
        decoded_input: null,
        token_transfers: [],
        base_fee_per_gas: '17655284',
        timestamp: '2025-01-14T15:33:37.000000Z',
        nonce: 7,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 9676543,
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
        fee: { type: 'actual', value: '8371745612475' },
        actions: [],
        gas_limit: '27674',
        gas_price: '18479182',
        decoded_input: null,
        token_transfers: [],
        base_fee_per_gas: '17634847',
        timestamp: '2025-01-14T15:28:25.000000Z',
        nonce: 6,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 9677064,
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
        fee: { type: 'actual', value: '1910836024888' },
        actions: [],
        gas_limit: '27674',
        gas_price: '19792911',
        decoded_input: null,
        token_transfers: [],
        base_fee_per_gas: '19178662',
        timestamp: '2025-01-14T15:11:03.000000Z',
        nonce: 5,
        historic_exchange_rate: '3224.35',
        transaction_types: ['coin_transfer', 'contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 10636441,
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
        fee: { type: 'actual', value: '284740333951' },
        actions: [],
        gas_limit: '21000',
        gas_price: '381882',
        decoded_input: null,
        token_transfers: [],
        base_fee_per_gas: '4584',
        timestamp: '2024-12-23T10:11:49.000000Z',
        nonce: 4,
        historic_exchange_rate: '3418.24',
        transaction_types: ['coin_transfer'],
        exchange_rate: '4558.13',
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
        confirmations: 10636590,
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
        fee: { type: 'actual', value: '290174283421' },
        actions: [],
        gas_limit: '21000',
        gas_price: '548451',
        decoded_input: null,
        token_transfers: [],
        base_fee_per_gas: '4663',
        timestamp: '2024-12-23T10:06:51.000000Z',
        nonce: 3,
        historic_exchange_rate: '3418.24',
        transaction_types: ['coin_transfer'],
        exchange_rate: '4558.13',
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
        confirmations: 11457399,
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
        fee: { type: 'actual', value: '7298646070010' },
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
            { name: 'value', type: 'uint256', value: '0' },
            { name: 'data', type: 'bytes', value: '0x' },
            { name: 'operation', type: 'uint8', value: '0' },
            { name: 'safeTxGas', type: 'uint256', value: '0' },
            { name: 'baseGas', type: 'uint256', value: '0' },
            { name: 'gasPrice', type: 'uint256', value: '0' },
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
        token_transfers: [],
        base_fee_per_gas: '1030',
        timestamp: '2024-12-04T10:06:33.000000Z',
        nonce: 2,
        historic_exchange_rate: '3845.15',
        transaction_types: ['contract_call'],
        exchange_rate: '4558.13',
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
        confirmations: 19927448,
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
        fee: { type: 'actual', value: '70601783286176' },
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
            { name: 'value', type: 'uint256', value: '2000000000000000000' }
          ]
        },
        token_transfers: [],
        base_fee_per_gas: '1030',
        timestamp: '2024-05-22T08:31:35.000000Z',
        nonce: 1,
        historic_exchange_rate: '3736.33',
        transaction_types: ['contract_call', 'token_transfer'],
        exchange_rate: '4558.13',
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
        confirmations: 19947412,
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
        fee: { type: 'actual', value: '619300400302550' },
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
            { name: '_amount', type: 'uint64', value: '200000000' },
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
        token_transfers: [],
        base_fee_per_gas: '1030',
        timestamp: '2024-05-21T21:26:07.000000Z',
        nonce: 0,
        historic_exchange_rate: '3789.36',
        transaction_types: ['contract_call', 'token_transfer'],
        exchange_rate: '4558.13',
        block_number: 798988,
        has_error_in_internal_transactions: false
      }
    ]
  },
  should_invoke_updateTokenTransactionsCache_only_for_eligible_contract_calls_and_token_activity_types:
    {
      inputTransactions: [
        {
          priority_fee: '2100000000',
          raw_input: '0x',
          result: 'success',
          hash: '0xc24ea39fd33d18ee0c0e1d93683cdb24a520fe024b9dd7c9ed6039d16fb0c1bd',
          max_fee_per_gas: '103042',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '21294000',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5022017,
          position: 2,
          max_priority_fee_per_gas: '100000',
          transaction_tag: null,
          created_contract: null,
          value: '100000000000000',
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
          method: null,
          fee: { type: 'actual', value: '172208471247' },
          actions: [],
          gas_limit: '21000',
          gas_price: '101014',
          decoded_input: null,
          token_transfers: null,
          base_fee_per_gas: '1014',
          timestamp: '2025-05-02T09:38:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '1842.84',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4536.99',
          block_number: 15724953,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '5733500000',
          raw_input:
            '0xa9059cbb000000000000000000000000361866ed8a0ec23347881f33cf2eca75975746550000000000000000000000000000000000000000000000000000000000000001',
          result: 'success',
          hash: '0xa982021ab58a91adde49f778fb13034d13168d0b470f945cb689f5f2f93162a9',
          max_fee_per_gas: '103042',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '58137690',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5022107,
          position: 3,
          max_priority_fee_per_gas: '100000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '57335',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0xF242275d3a6527d877f2c927a82D9b057609cc71',
            implementations: [
              {
                address_hash: '0xfc102D4807A92B08080D4d969Dfda59C3C01B02F',
                name: 'FiatTokenV2_2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'Bridged USDC (Lisk)',
            private_tags: [],
            proxy_type: 'eip1967',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'transfer',
          fee: { type: 'actual', value: '154548934402' },
          actions: [],
          gas_limit: '94377',
          gas_price: '101014',
          decoded_input: {
            method_call: 'transfer(address to, uint256 value)',
            method_id: 'a9059cbb',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x361866eD8a0Ec23347881F33Cf2eCa7597574655'
              },
              { name: 'value', type: 'uint256', value: '1' }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1014',
          timestamp: '2025-05-02T09:35:17.000000Z',
          nonce: 7,
          historic_exchange_rate: '1842.84',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '4536.99',
          block_number: 15724863,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '43054400000',
          raw_input:
            '0x24856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020b080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000652e53c6a4fe39b6b30426d9c96376a105c89a95000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000004200000000000000000000000000000000000006000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a2400000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000f242275d3a6527d877f2c927a82d9b057609cc710000000000000000000000000000000000000000000000000000000000000001',
          result: 'success',
          hash: '0x851c7da365d68bdfc143305563109b1d84c393f57a17f608182af47247aa90c8',
          max_fee_per_gas: '103042',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '436571616',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5022150,
          position: 1,
          max_priority_fee_per_gas: '100000',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
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
          gas_used: '430544',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x652e53C6a4FE39B6B30426d9c96376a105C89A95',
            implementations: [],
            is_contract: true,
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
          method: 'execute',
          fee: { type: 'actual', value: '401346749809' },
          actions: [],
          gas_limit: '466212',
          gas_price: '101014',
          decoded_input: {
            method_call: 'execute(bytes commands, bytes[] inputs)',
            method_id: '24856bc3',
            parameters: [
              { name: 'commands', type: 'bytes', value: '0x0b08' },
              {
                name: 'inputs',
                type: 'bytes[]',
                value: [
                  '0x000000000000000000000000652e53c6a4fe39b6b30426d9c96376a105c89a95000000000000000000000000000000000000000000000000000000003b9aca00',
                  '0x0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000004200000000000000000000000000000000000006000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a2400000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000f242275d3a6527d877f2c927a82d9b057609cc710000000000000000000000000000000000000000000000000000000000000001'
                ]
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1014',
          timestamp: '2025-05-02T09:33:51.000000Z',
          nonce: 6,
          historic_exchange_rate: '1842.84',
          transaction_types: [
            'coin_transfer',
            'contract_call',
            'token_transfer'
          ],
          exchange_rate: '4536.99',
          block_number: 15724820,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '97557000000',
          raw_input:
            '0x6a7612020000000000000000000000009dfb58ef2032b7ed6c62ed4218774b65e0d3ab830000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000440d582f13000000000000000000000000985de9b7003a313c8166880f43112cb56a5924a700000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000821f039337e650e51b2b090109a4c85dff205173f3ea0637bb49bf9e9625407887319ae241823e11eeec62c4c71db2563834912f3c2b63accc9351826f94a74c201c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x1f17779a1c267a9cc581a523acb2486261d74fefdfed9236a25a5b2d97f2ae9b',
          max_fee_per_gas: '1001014',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '98922798',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5970177,
          position: 1,
          max_priority_fee_per_gas: '1001014',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '97557',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '156962437277' },
          actions: [],
          gas_limit: '99499',
          gas_price: '1001014',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83'
              },
              { name: 'value', type: 'uint256', value: '0' },
              {
                name: 'data',
                type: 'bytes',
                value:
                  '0x0d582f13000000000000000000000000985de9b7003a313c8166880f43112cb56a5924a70000000000000000000000000000000000000000000000000000000000000002'
              },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x1f039337e650e51b2b090109a4c85dff205173f3ea0637bb49bf9e9625407887319ae241823e11eeec62c4c71db2563834912f3c2b63accc9351826f94a74c201c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1014',
          timestamp: '2025-04-10T10:52:57.000000Z',
          nonce: 5,
          historic_exchange_rate: '1521.51',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 14776793,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '70258000000',
          raw_input:
            '0x6a761202000000000000000000000000413bc872d9e424a5683643d3a75343dc85a4b8ea0000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008299dc98516e72616e296efb7d087d0eada75119b4c5a99825d3d20fd0a26ac6a61509d142b52ce2a4c5d64c5015ead76123e225e6dce640bf2a82a519775b6c721c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x31b703877d9f2f66099199a1d986bcbd885d0e2bbb74dcbd34a2f1d5ca33fe05',
          max_fee_per_gas: '1001014',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '71241612',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 7297328,
          position: 1,
          max_priority_fee_per_gas: '1001014',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '70258',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '15826993338495' },
          actions: [],
          gas_limit: '71983',
          gas_price: '1001014',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x413bc872D9e424A5683643d3A75343dC85A4b8EA'
              },
              { name: 'value', type: 'uint256', value: '500000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x99dc98516e72616e296efb7d087d0eada75119b4c5a99825d3d20fd0a26ac6a61509d142b52ce2a4c5d64c5015ead76123e225e6dce640bf2a82a519775b6c721c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1014',
          timestamp: '2025-03-10T17:34:35.000000Z',
          nonce: 4,
          historic_exchange_rate: '1864.38',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 13449642,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '69580923654',
          raw_input:
            '0x6a761202000000000000000000000000b96e135e9dea0bea3cf5610f2a9289ff2f8bf2690000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008271d4e7b1825fbd01328db3776a75144b071140f2144bae839a2e40f5d30ce6f0641c96d2efb743b26d4c5723fc38d224825ba6a7d3a44a7522c5cbcfd46c8cb51c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0xc1496e4a154998b14e808b221cf5a586252213978761c1f80b141a1b8eeebc33',
          max_fee_per_gas: '3927228',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '206338261170',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8122044,
          position: 9,
          max_priority_fee_per_gas: '3927228',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '70258',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '377089110549' },
          actions: [],
          gas_limit: '71983',
          gas_price: '3927228',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0xB96e135e9DeA0bea3CF5610F2a9289FF2f8bF269'
              },
              { name: 'value', type: 'uint256', value: '500000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x71d4e7b1825fbd01328db3776a75144b071140f2144bae839a2e40f5d30ce6f0641c96d2efb743b26d4c5723fc38d224825ba6a7d3a44a7522c5cbcfd46c8cb51c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '2936865',
          timestamp: '2025-02-19T15:24:03.000000Z',
          nonce: 3,
          historic_exchange_rate: '2715.47',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 12624926,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '70245648770',
          raw_input:
            '0x6a761202000000000000000000000000bb6e024b9cffacb947a71991e386681b1cd1477d000000000000000000000000000000000000000000000000000002ba7def30000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082c55f10d846bcf0ed2969418e532683c95b6d64dc4b729e80d8785c89c32e348147127e3175c40d481cba83c7910565da1ba3a55a9de8841991bdd0eb9e5dfe391c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x305854fd50f12f4bad9702e62691e924f6612df85f49fe743a2b221a14e5fad9',
          max_fee_per_gas: '1002233',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '157210548',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9425673,
          position: 6,
          max_priority_fee_per_gas: '1002233',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '70246',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '1803458343391' },
          actions: [],
          gas_limit: '71971',
          gas_price: '1002233',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0xBb6e024b9cFFACB947A71991E386681B1Cd1477D'
              },
              { name: 'value', type: 'uint256', value: '3000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0xc55f10d846bcf0ed2969418e532683c95b6d64dc4b729e80d8785c89c32e348147127e3175c40d481cba83c7910565da1ba3a55a9de8841991bdd0eb9e5dfe391c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '2238',
          timestamp: '2025-01-20T11:09:45.000000Z',
          nonce: 2,
          historic_exchange_rate: '3280.4',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 11321297,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '95257618968',
          raw_input:
            '0x6a761202000000000000000000000000bb6e024b9cffacb947a71991e386681b1cd1477d0000000000000000000000000000000000000000000000000057c084e5f3c00000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000827f701e0fa671db25216b3d89cc8bcab343daca8f29983964cb885bc5f8ba87db373a7d3f98fbee550e129fa6335ac1a5a57ea8844cf9bda493b6274a389ec7241b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x6f692d0478a1a13a2e5855f3b55518be5ccf5f6a877a6ee7bd4d6b310831edeb',
          max_fee_per_gas: '1001557',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '148697738',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9429840,
          position: 4,
          max_priority_fee_per_gas: '1001557',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '95258',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '2461745690130' },
          actions: [],
          gas_limit: '97181',
          gas_price: '1001557',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0xBb6e024b9cFFACB947A71991E386681B1Cd1477D'
              },
              { name: 'value', type: 'uint256', value: '24700000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x7f701e0fa671db25216b3d89cc8bcab343daca8f29983964cb885bc5f8ba87db373a7d3f98fbee550e129fa6335ac1a5a57ea8844cf9bda493b6274a389ec7241b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1561',
          timestamp: '2025-01-20T08:50:51.000000Z',
          nonce: 1,
          historic_exchange_rate: '3280.4',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 11317130,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '75116849766',
          raw_input:
            '0x6a76120200000000000000000000000042000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000000242e1a7d4d000000000000000000000000000000000000000000000000006a8e5f86b045ad00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008288c5a27e1af592b1b8e40255196ffd1479190a6d529ae1d38f3625b16fac4e996698084405874209d619df2a5e5ea185d6fc2dba6f876768871c4e998daac2141b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0xeb3058ae52ba4c3eb7b443142b3e49e76a9afa3b372d9471e752cb6b55adcb6f',
          max_fee_per_gas: '1001535',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '115454829',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9429985,
          position: 11,
          max_priority_fee_per_gas: '1001535',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '75117',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '2698804712453' },
          actions: [],
          gas_limit: '81420',
          gas_price: '1001535',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x4200000000000000000000000000000000000006'
              },
              { name: 'value', type: 'uint256', value: '0' },
              {
                name: 'data',
                type: 'bytes',
                value:
                  '0x2e1a7d4d000000000000000000000000000000000000000000000000006a8e5f86b045ad'
              },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x88c5a27e1af592b1b8e40255196ffd1479190a6d529ae1d38f3625b16fac4e996698084405874209d619df2a5e5ea185d6fc2dba6f876768871c4e998daac2141b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: null,
          base_fee_per_gas: '1537',
          timestamp: '2025-01-20T08:46:01.000000Z',
          nonce: 0,
          historic_exchange_rate: '3280.4',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '4536.99',
          block_number: 11316985,
          has_error_in_internal_transactions: false
        }
      ],
      mockHttpResponse: {
        items: [
          {
            block_hash:
              '0x6ecc5fc0537cf4681443f521bc064047f9fd7342c78f4a50a98d898ce7cf21ed',
            block_number: 15724863,
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
            log_index: 2,
            method: 'transfer',
            timestamp: '2025-05-02T09:35:17.000000Z',
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
            token: {
              address_hash: '0xF242275d3a6527d877f2c927a82D9b057609cc71',
              circulating_market_cap: '1745022.5050258099',
              decimals: '6',
              exchange_rate: '1.0',
              holders_count: '153760',
              icon_url: null,
              name: 'Bridged USDC (Lisk)',
              symbol: 'USDC.e',
              total_supply: '1707737162134',
              type: 'ERC-20',
              volume_24h: '14564.6983454596'
            },
            total: { decimals: '6', value: '1' },
            transaction_hash:
              '0xa982021ab58a91adde49f778fb13034d13168d0b470f945cb689f5f2f93162a9',
            type: 'token_transfer'
          },
          {
            block_hash:
              '0x7dd32da653e6b7c2188c082af70c0448ba420ebbcf86a250575d66b1b531d516',
            block_number: 15724820,
            from: {
              ens_domain_name: null,
              hash: '0xe36926807aa151C89125057742656AF8669d4cB1',
              implementations: [
                {
                  address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                  name: 'Pool'
                }
              ],
              is_contract: true,
              is_scam: false,
              is_verified: true,
              metadata: null,
              name: 'StableV2 AMM - USDT/USDC.e',
              private_tags: [],
              proxy_type: 'eip1167',
              public_tags: [],
              watchlist_names: []
            },
            log_index: 12,
            method: 'execute',
            timestamp: '2025-05-02T09:33:51.000000Z',
            to: {
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
            token: {
              address_hash: '0xF242275d3a6527d877f2c927a82D9b057609cc71',
              circulating_market_cap: '1745022.5050258099',
              decimals: '6',
              exchange_rate: '1.0',
              holders_count: '153760',
              icon_url: null,
              name: 'Bridged USDC (Lisk)',
              symbol: 'USDC.e',
              total_supply: '1707737162134',
              type: 'ERC-20',
              volume_24h: '14564.6983454596'
            },
            total: { decimals: '6', value: '1' },
            transaction_hash:
              '0x851c7da365d68bdfc143305563109b1d84c393f57a17f608182af47247aa90c8',
            type: 'token_transfer'
          }
        ],
        next_page_params: null
      },
      wantResult: [
        {
          priority_fee: '2100000000',
          raw_input: '0x',
          result: 'success',
          hash: '0xc24ea39fd33d18ee0c0e1d93683cdb24a520fe024b9dd7c9ed6039d16fb0c1bd',
          max_fee_per_gas: '103042',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '21294000',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5022017,
          position: 2,
          max_priority_fee_per_gas: '100000',
          transaction_tag: null,
          created_contract: null,
          value: '100000000000000',
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
          method: null,
          fee: { type: 'actual', value: '172208471247' },
          actions: [],
          gas_limit: '21000',
          gas_price: '101014',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '1014',
          timestamp: '2025-05-02T09:38:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '1842.84',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4536.99',
          block_number: 15724953,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '5733500000',
          raw_input:
            '0xa9059cbb000000000000000000000000361866ed8a0ec23347881f33cf2eca75975746550000000000000000000000000000000000000000000000000000000000000001',
          result: 'success',
          hash: '0xa982021ab58a91adde49f778fb13034d13168d0b470f945cb689f5f2f93162a9',
          max_fee_per_gas: '103042',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '58137690',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5022107,
          position: 3,
          max_priority_fee_per_gas: '100000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '57335',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0xF242275d3a6527d877f2c927a82D9b057609cc71',
            implementations: [
              {
                address_hash: '0xfc102D4807A92B08080D4d969Dfda59C3C01B02F',
                name: 'FiatTokenV2_2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'Bridged USDC (Lisk)',
            private_tags: [],
            proxy_type: 'eip1967',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'transfer',
          fee: { type: 'actual', value: '154548934402' },
          actions: [],
          gas_limit: '94377',
          gas_price: '101014',
          decoded_input: {
            method_call: 'transfer(address to, uint256 value)',
            method_id: 'a9059cbb',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x361866eD8a0Ec23347881F33Cf2eCa7597574655'
              },
              { name: 'value', type: 'uint256', value: '1' }
            ]
          },
          token_transfers: [
            {
              block_hash:
                '0x6ecc5fc0537cf4681443f521bc064047f9fd7342c78f4a50a98d898ce7cf21ed',
              block_number: 15724863,
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
              log_index: 2,
              method: 'transfer',
              timestamp: '2025-05-02T09:35:17.000000Z',
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
              token: {
                address_hash: '0xF242275d3a6527d877f2c927a82D9b057609cc71',
                circulating_market_cap: '1745022.5050258099',
                decimals: '6',
                exchange_rate: '1.0',
                holders_count: '153760',
                icon_url: null,
                name: 'Bridged USDC (Lisk)',
                symbol: 'USDC.e',
                total_supply: '1707737162134',
                type: 'ERC-20',
                volume_24h: '14564.6983454596'
              },
              total: {
                decimals: '6',
                value: '1'
              },
              transaction_hash:
                '0xa982021ab58a91adde49f778fb13034d13168d0b470f945cb689f5f2f93162a9',
              type: 'token_transfer'
            }
          ],
          base_fee_per_gas: '1014',
          timestamp: '2025-05-02T09:35:17.000000Z',
          nonce: 7,
          historic_exchange_rate: '1842.84',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '4536.99',
          block_number: 15724863,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '43054400000',
          raw_input:
            '0x24856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020b080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000652e53c6a4fe39b6b30426d9c96376a105c89a95000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000004200000000000000000000000000000000000006000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a2400000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000f242275d3a6527d877f2c927a82d9b057609cc710000000000000000000000000000000000000000000000000000000000000001',
          result: 'success',
          hash: '0x851c7da365d68bdfc143305563109b1d84c393f57a17f608182af47247aa90c8',
          max_fee_per_gas: '103042',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '436571616',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5022150,
          position: 1,
          max_priority_fee_per_gas: '100000',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
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
          gas_used: '430544',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x652e53C6a4FE39B6B30426d9c96376a105C89A95',
            implementations: [],
            is_contract: true,
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
          method: 'execute',
          fee: { type: 'actual', value: '401346749809' },
          actions: [],
          gas_limit: '466212',
          gas_price: '101014',
          decoded_input: {
            method_call: 'execute(bytes commands, bytes[] inputs)',
            method_id: '24856bc3',
            parameters: [
              { name: 'commands', type: 'bytes', value: '0x0b08' },
              {
                name: 'inputs',
                type: 'bytes[]',
                value: [
                  '0x000000000000000000000000652e53c6a4fe39b6b30426d9c96376a105c89a95000000000000000000000000000000000000000000000000000000003b9aca00',
                  '0x0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000003b9aca00000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000004200000000000000000000000000000000000006000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac485391eb2d7d88253a7f1ef18c37f4242d1a2400000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005d032ac25d322df992303dca074ee7392c117b9000000000000000000000000f242275d3a6527d877f2c927a82d9b057609cc710000000000000000000000000000000000000000000000000000000000000001'
                ]
              }
            ]
          },
          token_transfers: [
            {
              block_hash:
                '0x7dd32da653e6b7c2188c082af70c0448ba420ebbcf86a250575d66b1b531d516',
              block_number: 15724820,
              from: {
                ens_domain_name: null,
                hash: '0xe36926807aa151C89125057742656AF8669d4cB1',
                implementations: [
                  {
                    address_hash: '0x10499d88Bd32AF443Fc936F67DE32bE1c8Bb374C',
                    name: 'Pool'
                  }
                ],
                is_contract: true,
                is_scam: false,
                is_verified: true,
                metadata: null,
                name: 'StableV2 AMM - USDT/USDC.e',
                private_tags: [],
                proxy_type: 'eip1167',
                public_tags: [],
                watchlist_names: []
              },
              log_index: 12,
              method: 'execute',
              timestamp: '2025-05-02T09:33:51.000000Z',
              to: {
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
              token: {
                address_hash: '0xF242275d3a6527d877f2c927a82D9b057609cc71',
                circulating_market_cap: '1745022.5050258099',
                decimals: '6',
                exchange_rate: '1.0',
                holders_count: '153760',
                icon_url: null,
                name: 'Bridged USDC (Lisk)',
                symbol: 'USDC.e',
                total_supply: '1707737162134',
                type: 'ERC-20',
                volume_24h: '14564.6983454596'
              },
              total: {
                decimals: '6',
                value: '1'
              },
              transaction_hash:
                '0x851c7da365d68bdfc143305563109b1d84c393f57a17f608182af47247aa90c8',
              type: 'token_transfer'
            }
          ],
          base_fee_per_gas: '1014',
          timestamp: '2025-05-02T09:33:51.000000Z',
          nonce: 6,
          historic_exchange_rate: '1842.84',
          transaction_types: [
            'coin_transfer',
            'contract_call',
            'token_transfer'
          ],
          exchange_rate: '4536.99',
          block_number: 15724820,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '97557000000',
          raw_input:
            '0x6a7612020000000000000000000000009dfb58ef2032b7ed6c62ed4218774b65e0d3ab830000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000440d582f13000000000000000000000000985de9b7003a313c8166880f43112cb56a5924a700000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000821f039337e650e51b2b090109a4c85dff205173f3ea0637bb49bf9e9625407887319ae241823e11eeec62c4c71db2563834912f3c2b63accc9351826f94a74c201c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x1f17779a1c267a9cc581a523acb2486261d74fefdfed9236a25a5b2d97f2ae9b',
          max_fee_per_gas: '1001014',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '98922798',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 5970177,
          position: 1,
          max_priority_fee_per_gas: '1001014',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '97557',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '156962437277' },
          actions: [],
          gas_limit: '99499',
          gas_price: '1001014',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83'
              },
              { name: 'value', type: 'uint256', value: '0' },
              {
                name: 'data',
                type: 'bytes',
                value:
                  '0x0d582f13000000000000000000000000985de9b7003a313c8166880f43112cb56a5924a70000000000000000000000000000000000000000000000000000000000000002'
              },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x1f039337e650e51b2b090109a4c85dff205173f3ea0637bb49bf9e9625407887319ae241823e11eeec62c4c71db2563834912f3c2b63accc9351826f94a74c201c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: [],
          base_fee_per_gas: '1014',
          timestamp: '2025-04-10T10:52:57.000000Z',
          nonce: 5,
          historic_exchange_rate: '1521.51',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 14776793,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '70258000000',
          raw_input:
            '0x6a761202000000000000000000000000413bc872d9e424a5683643d3a75343dc85a4b8ea0000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008299dc98516e72616e296efb7d087d0eada75119b4c5a99825d3d20fd0a26ac6a61509d142b52ce2a4c5d64c5015ead76123e225e6dce640bf2a82a519775b6c721c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x31b703877d9f2f66099199a1d986bcbd885d0e2bbb74dcbd34a2f1d5ca33fe05',
          max_fee_per_gas: '1001014',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '71241612',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 7297328,
          position: 1,
          max_priority_fee_per_gas: '1001014',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '70258',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '15826993338495' },
          actions: [],
          gas_limit: '71983',
          gas_price: '1001014',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x413bc872D9e424A5683643d3A75343dC85A4b8EA'
              },
              { name: 'value', type: 'uint256', value: '500000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x99dc98516e72616e296efb7d087d0eada75119b4c5a99825d3d20fd0a26ac6a61509d142b52ce2a4c5d64c5015ead76123e225e6dce640bf2a82a519775b6c721c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: [],
          base_fee_per_gas: '1014',
          timestamp: '2025-03-10T17:34:35.000000Z',
          nonce: 4,
          historic_exchange_rate: '1864.38',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 13449642,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '69580923654',
          raw_input:
            '0x6a761202000000000000000000000000b96e135e9dea0bea3cf5610f2a9289ff2f8bf2690000000000000000000000000000000000000000000000000001c6bf52634000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008271d4e7b1825fbd01328db3776a75144b071140f2144bae839a2e40f5d30ce6f0641c96d2efb743b26d4c5723fc38d224825ba6a7d3a44a7522c5cbcfd46c8cb51c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0xc1496e4a154998b14e808b221cf5a586252213978761c1f80b141a1b8eeebc33',
          max_fee_per_gas: '3927228',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '206338261170',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 8122044,
          position: 9,
          max_priority_fee_per_gas: '3927228',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '70258',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '377089110549' },
          actions: [],
          gas_limit: '71983',
          gas_price: '3927228',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0xB96e135e9DeA0bea3CF5610F2a9289FF2f8bF269'
              },
              { name: 'value', type: 'uint256', value: '500000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x71d4e7b1825fbd01328db3776a75144b071140f2144bae839a2e40f5d30ce6f0641c96d2efb743b26d4c5723fc38d224825ba6a7d3a44a7522c5cbcfd46c8cb51c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: [],
          base_fee_per_gas: '2936865',
          timestamp: '2025-02-19T15:24:03.000000Z',
          nonce: 3,
          historic_exchange_rate: '2715.47',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 12624926,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '70245648770',
          raw_input:
            '0x6a761202000000000000000000000000bb6e024b9cffacb947a71991e386681b1cd1477d000000000000000000000000000000000000000000000000000002ba7def30000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000082c55f10d846bcf0ed2969418e532683c95b6d64dc4b729e80d8785c89c32e348147127e3175c40d481cba83c7910565da1ba3a55a9de8841991bdd0eb9e5dfe391c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x305854fd50f12f4bad9702e62691e924f6612df85f49fe743a2b221a14e5fad9',
          max_fee_per_gas: '1002233',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '157210548',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9425673,
          position: 6,
          max_priority_fee_per_gas: '1002233',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '70246',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '1803458343391' },
          actions: [],
          gas_limit: '71971',
          gas_price: '1002233',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0xBb6e024b9cFFACB947A71991E386681B1Cd1477D'
              },
              { name: 'value', type: 'uint256', value: '3000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0xc55f10d846bcf0ed2969418e532683c95b6d64dc4b729e80d8785c89c32e348147127e3175c40d481cba83c7910565da1ba3a55a9de8841991bdd0eb9e5dfe391c0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: [],
          base_fee_per_gas: '2238',
          timestamp: '2025-01-20T11:09:45.000000Z',
          nonce: 2,
          historic_exchange_rate: '3280.4',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 11321297,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '95257618968',
          raw_input:
            '0x6a761202000000000000000000000000bb6e024b9cffacb947a71991e386681b1cd1477d0000000000000000000000000000000000000000000000000057c084e5f3c00000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000827f701e0fa671db25216b3d89cc8bcab343daca8f29983964cb885bc5f8ba87db373a7d3f98fbee550e129fa6335ac1a5a57ea8844cf9bda493b6274a389ec7241b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0x6f692d0478a1a13a2e5855f3b55518be5ccf5f6a877a6ee7bd4d6b310831edeb',
          max_fee_per_gas: '1001557',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '148697738',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9429840,
          position: 4,
          max_priority_fee_per_gas: '1001557',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '95258',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '2461745690130' },
          actions: [],
          gas_limit: '97181',
          gas_price: '1001557',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0xBb6e024b9cFFACB947A71991E386681B1Cd1477D'
              },
              { name: 'value', type: 'uint256', value: '24700000000000000' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x7f701e0fa671db25216b3d89cc8bcab343daca8f29983964cb885bc5f8ba87db373a7d3f98fbee550e129fa6335ac1a5a57ea8844cf9bda493b6274a389ec7241b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: [],
          base_fee_per_gas: '1561',
          timestamp: '2025-01-20T08:50:51.000000Z',
          nonce: 1,
          historic_exchange_rate: '3280.4',
          transaction_types: ['contract_call'],
          exchange_rate: '4536.99',
          block_number: 11317130,
          has_error_in_internal_transactions: false
        },
        {
          priority_fee: '75116849766',
          raw_input:
            '0x6a76120200000000000000000000000042000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000000242e1a7d4d000000000000000000000000000000000000000000000000006a8e5f86b045ad00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008288c5a27e1af592b1b8e40255196ffd1479190a6d529ae1d38f3625b16fac4e996698084405874209d619df2a5e5ea185d6fc2dba6f876768871c4e998daac2141b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
          result: 'success',
          hash: '0xeb3058ae52ba4c3eb7b443142b3e49e76a9afa3b372d9471e752cb6b55adcb6f',
          max_fee_per_gas: '1001535',
          revert_reason: null,
          confirmation_duration: [0, 2.0e3],
          transaction_burnt_fee: '115454829',
          type: 2,
          token_transfers_overflow: null,
          confirmations: 9429985,
          position: 11,
          max_priority_fee_per_gas: '1001535',
          transaction_tag: null,
          created_contract: null,
          value: '0',
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
          gas_used: '75117',
          status: 'ok',
          to: {
            ens_domain_name: null,
            hash: '0x9dFb58ef2032B7ED6c62ED4218774B65E0D3aB83',
            implementations: [
              {
                address_hash: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
                name: 'SafeL2'
              }
            ],
            is_contract: true,
            is_scam: false,
            is_verified: true,
            metadata: null,
            name: 'SafeProxy',
            private_tags: [],
            proxy_type: 'master_copy',
            public_tags: [],
            watchlist_names: []
          },
          authorization_list: [],
          method: 'execTransaction',
          fee: { type: 'actual', value: '2698804712453' },
          actions: [],
          gas_limit: '81420',
          gas_price: '1001535',
          decoded_input: {
            method_call:
              'execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
            method_id: '6a761202',
            parameters: [
              {
                name: 'to',
                type: 'address',
                value: '0x4200000000000000000000000000000000000006'
              },
              { name: 'value', type: 'uint256', value: '0' },
              {
                name: 'data',
                type: 'bytes',
                value:
                  '0x2e1a7d4d000000000000000000000000000000000000000000000000006a8e5f86b045ad'
              },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
                  '0x88c5a27e1af592b1b8e40255196ffd1479190a6d529ae1d38f3625b16fac4e996698084405874209d619df2a5e5ea185d6fc2dba6f876768871c4e998daac2141b0000000000000000000000007e0bcc78e317fa28f73a44567d854b081004622d000000000000000000000000000000000000000000000000000000000000000001'
              }
            ]
          },
          token_transfers: [],
          base_fee_per_gas: '1537',
          timestamp: '2025-01-20T08:46:01.000000Z',
          nonce: 0,
          historic_exchange_rate: '3280.4',
          transaction_types: ['contract_call', 'token_transfer'],
          exchange_rate: '4536.99',
          block_number: 11316985,
          has_error_in_internal_transactions: false
        }
      ]
    }
};

export const getAmountType = {
  should_throw_error_for_invalid_transaction: {
    invalidTx: {
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
    }
  },
  should_throw_error_for_invalid_transaction_making_a_contract_call: {
    invalidContractCallTx: {
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
    }
  },
  should_return_valid_ERC_type_for_a_valid_transaction_making_a_contract_call: {
    validContractCallTx: {
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
    }
  },
  should_return_one_of_erc_20_erc_721_or_erc_1155_for_a_token_transfer_transaction_making_a_contract_call:
    {
      tokenTransferTx: {
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
      }
    },
  should_return_one_of_erc_20_erc_721_or_erc_1155_for_a_token_minting_transaction_making_a_contract_call:
    {
      tokenMintingTx: {
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
      }
    },
  should_return_amount_type_erc_20_for_valid_ERC_20_transaction: {
    erc20Tx: {
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
    }
  },
  should_return_amount_type_erc_721_for_valid_ERC_721_transaction: {
    erc721Tx: {
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
    }
  },
  should_return_amount_type_erc_1155_for_valid_ERC_1155_transaction: {
    erc1155Tx: {
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
    }
  },
  should_return_amount_type_eth_for_valid_ETH_transaction: {
    ethTx: {
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
    }
  }
};

export const getActivitiesByAddress = {
  should_return_list_of_activities_lower_than_default_limit: {
    mockRequestResponse: {
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
          confirmations: 9668384,
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
          fee: { type: 'actual', value: '4381877876096' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18816801',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17845080',
          timestamp: '2025-01-14T15:36:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668464,
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
          fee: { type: 'actual', value: '7011098170834' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18241114',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17655284',
          timestamp: '2025-01-14T15:33:37.000000Z',
          nonce: 7,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668620,
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
          fee: { type: 'actual', value: '8371745612475' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18479182',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17634847',
          timestamp: '2025-01-14T15:28:25.000000Z',
          nonce: 6,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9669141,
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
          fee: { type: 'actual', value: '1910836024888' },
          actions: [],
          gas_limit: '27674',
          gas_price: '19792911',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '19178662',
          timestamp: '2025-01-14T15:11:03.000000Z',
          nonce: 5,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 10628518,
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
          fee: { type: 'actual', value: '284740333951' },
          actions: [],
          gas_limit: '21000',
          gas_price: '381882',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4584',
          timestamp: '2024-12-23T10:11:49.000000Z',
          nonce: 4,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 10628667,
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
          fee: { type: 'actual', value: '290174283421' },
          actions: [],
          gas_limit: '21000',
          gas_price: '548451',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4663',
          timestamp: '2024-12-23T10:06:51.000000Z',
          nonce: 3,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 11449476,
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
          fee: { type: 'actual', value: '7298646070010' },
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
              { name: 'value', type: 'uint256', value: '0' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
          token_transfers: [],
          base_fee_per_gas: '1030',
          timestamp: '2024-12-04T10:06:33.000000Z',
          nonce: 2,
          historic_exchange_rate: '3845.15',
          transaction_types: ['contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 19919525,
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
          fee: { type: 'actual', value: '70601783286176' },
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
              { name: 'value', type: 'uint256', value: '2000000000000000000' }
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
              method: 'transfer',
              timestamp: '2024-05-22T08:31:35.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
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
          confirmations: 19939489,
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
          fee: { type: 'actual', value: '619300400302550' },
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
              { name: '_amount', type: 'uint64', value: '200000000' },
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
              method: 'claimRegularAccount',
              timestamp: '2024-05-21T21:26:07.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
          block_number: 798988,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: null
    },
    wantResult: {
      activities: [
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '70000000000000'
          },
          status: 'success',
          transactionID:
            '0x3dc796c0ac01958eccb6036c5690643e3730f03bc3f9416cc55051366d16f737'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '8000000000000'
          },
          status: 'success',
          transactionID:
            '0x97b41ed9540bdb247b0f52501c3990cf376874a05adff0a76cef23602cc580d5'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '1000310000000000'
          },
          status: 'success',
          transactionID:
            '0x7957c0323b7fed9da521ab09ac0d4d81ff2ddeaa89a1a7b75738ed23a95769fd'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '1'
          },
          status: 'success',
          transactionID:
            '0x3e50f83636069d59795f0604ed8f2983a1c8dd2ae0f563337486b2362258def8'
        },
        {
          activityType: 'Self transfer',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x2d2582e386500baaa828b823797e6e012675f675339c7330b9eb2fd2033c4cef'
        },
        {
          activityType: 'Self transfer',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x210b5c866acf8e2fa873cb6d678b5dbb7c08f1a3e0c188b11f284fa16996fe16'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '0'
          },
          status: 'success',
          transactionID:
            '0x055ab631e36bae1c152edb323351f3cc217e465939eb25504675d8201196782e'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
              decimals: 18,
              icon: null,
              name: 'Lisk',
              symbol: 'LSK',
              type: TokenERC.ERC20
            },
            type: TokenERC.ERC20,
            value: '2000000000000000000'
          },
          status: 'success',
          transactionID:
            '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
              decimals: 18,
              icon: null,
              name: 'Lisk',
              symbol: 'LSK',
              type: TokenERC.ERC20
            },
            type: TokenERC.ERC20,
            value: '2000000000000000000'
          },
          status: 'success',
          transactionID:
            '0xa23002e5f8a63d472dc364e470f2092f93da70f5631adbbaef758666e9052412'
        }
      ],
      metadata: {
        count: 9,
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: DEFAULT_PAGINATION_LIMIT,
        hasNextPage: false
      }
    }
  },
  should_return_list_of_activities_multiple_API_requests: {
    mockRequestResponse1: {
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
          confirmations: 9668384,
          position: 10,
          max_priority_fee_per_gas: '971721',
          transaction_tag: null,
          created_contract: null,
          value: '70000000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '4381877876096' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18816801',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17845080',
          timestamp: '2025-01-14T15:36:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668464,
          position: 9,
          max_priority_fee_per_gas: '585830',
          transaction_tag: null,
          created_contract: null,
          value: '8000000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '7011098170834' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18241114',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17655284',
          timestamp: '2025-01-14T15:33:37.000000Z',
          nonce: 7,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668620,
          position: 9,
          max_priority_fee_per_gas: '844335',
          transaction_tag: null,
          created_contract: null,
          value: '1000310000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '8371745612475' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18479182',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17634847',
          timestamp: '2025-01-14T15:28:25.000000Z',
          nonce: 6,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
          block_number: 11069857,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: { block_number: 123, index: 1, items_count: 3 }
    },
    mockRequestResponse2: {
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
          confirmations: 9669141,
          position: 6,
          max_priority_fee_per_gas: '614249',
          transaction_tag: null,
          created_contract: null,
          value: '1',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '1910836024888' },
          actions: [],
          gas_limit: '27674',
          gas_price: '19792911',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '19178662',
          timestamp: '2025-01-14T15:11:03.000000Z',
          nonce: 5,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 10628518,
          position: 15,
          max_priority_fee_per_gas: '377298',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '284740333951' },
          actions: [],
          gas_limit: '21000',
          gas_price: '381882',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4584',
          timestamp: '2024-12-23T10:11:49.000000Z',
          nonce: 4,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 10628667,
          position: 8,
          max_priority_fee_per_gas: '543788',
          transaction_tag: null,
          created_contract: null,
          value: '1000000000',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '290174283421' },
          actions: [],
          gas_limit: '21000',
          gas_price: '548451',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4663',
          timestamp: '2024-12-23T10:06:51.000000Z',
          nonce: 3,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
          block_number: 10109810,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: { block_number: 456, index: 3, items_count: 5 }
    },
    mockRequestResponse3: {
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
          confirmations: 11449476,
          position: 2,
          max_priority_fee_per_gas: '1001030',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '7298646070010' },
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
              { name: 'value', type: 'uint256', value: '0' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
          token_transfers: [],
          base_fee_per_gas: '1030',
          timestamp: '2024-12-04T10:06:33.000000Z',
          nonce: 2,
          historic_exchange_rate: '3845.15',
          transaction_types: ['contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 19919525,
          position: 1,
          max_priority_fee_per_gas: '1500000000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '70601783286176' },
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
              { name: 'value', type: 'uint256', value: '2000000000000000000' }
            ]
          },
          token_transfers: [
            {
              block_hash:
                '0x67f26a03889948aeb1e04135c3ba8ca5e766b1a9905c735af55b85cbb6196b50',
              block_number: 818952,
              from: {
                ens_domain_name: null,
                hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
              method: 'transfer',
              timestamp: '2024-05-22T08:31:35.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
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
          confirmations: 19939489,
          position: 1,
          max_priority_fee_per_gas: '1500000000',
          transaction_tag: null,
          created_contract: null,
          value: '0',
          from: {
            ens_domain_name: null,
            hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
          fee: { type: 'actual', value: '619300400302550' },
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
              { name: '_amount', type: 'uint64', value: '200000000' },
              {
                name: '_recipient',
                type: 'address',
                value: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F'
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
              method: 'claimRegularAccount',
              timestamp: '2024-05-21T21:26:07.000000Z',
              to: {
                ens_domain_name: null,
                hash: '0x1AC80cE05cd7715BfBb7cEB2D42ed7874810EB3F',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
          block_number: 798988,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: null
    },
    wantResult: {
      activities: [
        {
          activityType: 'Self transfer',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x2d2582e386500baaa828b823797e6e012675f675339c7330b9eb2fd2033c4cef'
        },
        {
          activityType: 'Self transfer',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '1000000000'
          },
          status: 'success',
          transactionID:
            '0x210b5c866acf8e2fa873cb6d678b5dbb7c08f1a3e0c188b11f284fa16996fe16'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
              type: TokenERC.ETH,
              icon: ethIcon
            },
            type: TokenERC.ETH,
            value: '0'
          },
          status: 'success',
          transactionID:
            '0x055ab631e36bae1c152edb323351f3cc217e465939eb25504675d8201196782e'
        },
        {
          activityType: 'Sent',
          amount: {
            tokenInfo: {
              address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
              decimals: 18,
              icon: null,
              name: 'Lisk',
              symbol: 'LSK',
              type: TokenERC.ERC20
            },
            type: TokenERC.ERC20,
            value: '2000000000000000000'
          },
          status: 'success',
          transactionID:
            '0x426e9555a435cef173103d817b63a86cf8a96888bcc6fc47e405fff608e08d1e'
        }
      ],
      metadata: { count: 4, offset: 4, limit: 4, hasNextPage: true }
    }
  }
};

export const updateTransactionsCache = {
  should_make_initial_cache_fill_if_no_information_exists_in_cache: {
    mockRequestResponse: {
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
          confirmations: 9668384,
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
          fee: { type: 'actual', value: '4381877876096' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18816801',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17845080',
          timestamp: '2025-01-14T15:36:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668464,
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
          fee: { type: 'actual', value: '7011098170834' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18241114',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17655284',
          timestamp: '2025-01-14T15:33:37.000000Z',
          nonce: 7,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668620,
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
          fee: { type: 'actual', value: '8371745612475' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18479182',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17634847',
          timestamp: '2025-01-14T15:28:25.000000Z',
          nonce: 6,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9669141,
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
          fee: { type: 'actual', value: '1910836024888' },
          actions: [],
          gas_limit: '27674',
          gas_price: '19792911',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '19178662',
          timestamp: '2025-01-14T15:11:03.000000Z',
          nonce: 5,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 10628518,
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
          fee: { type: 'actual', value: '284740333951' },
          actions: [],
          gas_limit: '21000',
          gas_price: '381882',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4584',
          timestamp: '2024-12-23T10:11:49.000000Z',
          nonce: 4,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 10628667,
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
          fee: { type: 'actual', value: '290174283421' },
          actions: [],
          gas_limit: '21000',
          gas_price: '548451',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4663',
          timestamp: '2024-12-23T10:06:51.000000Z',
          nonce: 3,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 11449476,
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
          fee: { type: 'actual', value: '7298646070010' },
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
              { name: 'value', type: 'uint256', value: '0' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
          token_transfers: [],
          base_fee_per_gas: '1030',
          timestamp: '2024-12-04T10:06:33.000000Z',
          nonce: 2,
          historic_exchange_rate: '3845.15',
          transaction_types: ['contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 19919525,
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
          fee: { type: 'actual', value: '70601783286176' },
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
              { name: 'value', type: 'uint256', value: '2000000000000000000' }
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
              method: 'transfer',
              timestamp: '2024-05-22T08:31:35.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
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
          confirmations: 19939489,
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
          fee: { type: 'actual', value: '619300400302550' },
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
              { name: '_amount', type: 'uint64', value: '200000000' },
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
              method: 'claimRegularAccount',
              timestamp: '2024-05-21T21:26:07.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
          block_number: 798988,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: null
    }
  },
  should_update_cache_with_next_page_information_if_previous_page_exists: {
    mockRequestResponse: {
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
          confirmations: 9668384,
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
          fee: { type: 'actual', value: '4381877876096' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18816801',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17845080',
          timestamp: '2025-01-14T15:36:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668464,
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
          fee: { type: 'actual', value: '7011098170834' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18241114',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17655284',
          timestamp: '2025-01-14T15:33:37.000000Z',
          nonce: 7,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668620,
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
          fee: { type: 'actual', value: '8371745612475' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18479182',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17634847',
          timestamp: '2025-01-14T15:28:25.000000Z',
          nonce: 6,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9669141,
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
          fee: { type: 'actual', value: '1910836024888' },
          actions: [],
          gas_limit: '27674',
          gas_price: '19792911',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '19178662',
          timestamp: '2025-01-14T15:11:03.000000Z',
          nonce: 5,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 10628518,
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
          fee: { type: 'actual', value: '284740333951' },
          actions: [],
          gas_limit: '21000',
          gas_price: '381882',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4584',
          timestamp: '2024-12-23T10:11:49.000000Z',
          nonce: 4,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 10628667,
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
          fee: { type: 'actual', value: '290174283421' },
          actions: [],
          gas_limit: '21000',
          gas_price: '548451',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4663',
          timestamp: '2024-12-23T10:06:51.000000Z',
          nonce: 3,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 11449476,
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
          fee: { type: 'actual', value: '7298646070010' },
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
              { name: 'value', type: 'uint256', value: '0' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
          token_transfers: [],
          base_fee_per_gas: '1030',
          timestamp: '2024-12-04T10:06:33.000000Z',
          nonce: 2,
          historic_exchange_rate: '3845.15',
          transaction_types: ['contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 19919525,
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
          fee: { type: 'actual', value: '70601783286176' },
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
              { name: 'value', type: 'uint256', value: '2000000000000000000' }
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
              method: 'transfer',
              timestamp: '2024-05-22T08:31:35.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
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
          confirmations: 19939489,
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
          fee: { type: 'actual', value: '619300400302550' },
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
              { name: '_amount', type: 'uint64', value: '200000000' },
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
              method: 'claimRegularAccount',
              timestamp: '2024-05-21T21:26:07.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
          block_number: 798988,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: { block_number: 123, index: 1, items_count: 3 }
    }
  },
  should_update_cache_with_end_of_page_information_if_last_page_is_returned: {
    mockRequestResponse: {
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
          confirmations: 9668384,
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
          fee: { type: 'actual', value: '4381877876096' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18816801',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17845080',
          timestamp: '2025-01-14T15:36:17.000000Z',
          nonce: 8,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668464,
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
          fee: { type: 'actual', value: '7011098170834' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18241114',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17655284',
          timestamp: '2025-01-14T15:33:37.000000Z',
          nonce: 7,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9668620,
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
          fee: { type: 'actual', value: '8371745612475' },
          actions: [],
          gas_limit: '27674',
          gas_price: '18479182',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '17634847',
          timestamp: '2025-01-14T15:28:25.000000Z',
          nonce: 6,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 9669141,
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
          fee: { type: 'actual', value: '1910836024888' },
          actions: [],
          gas_limit: '27674',
          gas_price: '19792911',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '19178662',
          timestamp: '2025-01-14T15:11:03.000000Z',
          nonce: 5,
          historic_exchange_rate: '3224.35',
          transaction_types: ['coin_transfer', 'contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 10628518,
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
          fee: { type: 'actual', value: '284740333951' },
          actions: [],
          gas_limit: '21000',
          gas_price: '381882',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4584',
          timestamp: '2024-12-23T10:11:49.000000Z',
          nonce: 4,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 10628667,
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
          fee: { type: 'actual', value: '290174283421' },
          actions: [],
          gas_limit: '21000',
          gas_price: '548451',
          decoded_input: null,
          token_transfers: [],
          base_fee_per_gas: '4663',
          timestamp: '2024-12-23T10:06:51.000000Z',
          nonce: 3,
          historic_exchange_rate: '3418.24',
          transaction_types: ['coin_transfer'],
          exchange_rate: '4435.25',
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
          confirmations: 11449476,
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
          fee: { type: 'actual', value: '7298646070010' },
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
              { name: 'value', type: 'uint256', value: '0' },
              { name: 'data', type: 'bytes', value: '0x' },
              { name: 'operation', type: 'uint8', value: '0' },
              { name: 'safeTxGas', type: 'uint256', value: '0' },
              { name: 'baseGas', type: 'uint256', value: '0' },
              { name: 'gasPrice', type: 'uint256', value: '0' },
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
          token_transfers: [],
          base_fee_per_gas: '1030',
          timestamp: '2024-12-04T10:06:33.000000Z',
          nonce: 2,
          historic_exchange_rate: '3845.15',
          transaction_types: ['contract_call'],
          exchange_rate: '4435.25',
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
          confirmations: 19919525,
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
          fee: { type: 'actual', value: '70601783286176' },
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
              { name: 'value', type: 'uint256', value: '2000000000000000000' }
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
              method: 'transfer',
              timestamp: '2024-05-22T08:31:35.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
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
          confirmations: 19939489,
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
          fee: { type: 'actual', value: '619300400302550' },
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
              { name: '_amount', type: 'uint64', value: '200000000' },
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
              method: 'claimRegularAccount',
              timestamp: '2024-05-21T21:26:07.000000Z',
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
                address_hash: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
                circulating_market_cap: '75145676.00226921',
                decimals: '18',
                exchange_rate: '0.37586',
                holders_count: '174300',
                icon_url: null,
                name: 'Lisk',
                symbol: 'LSK',
                total_supply: '295688673125341245118683682',
                type: 'ERC-20',
                volume_24h: '5274682.2219159035'
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
          exchange_rate: '4435.25',
          block_number: 798988,
          has_error_in_internal_transactions: false
        }
      ],
      next_page_params: null
    }
  }
};
