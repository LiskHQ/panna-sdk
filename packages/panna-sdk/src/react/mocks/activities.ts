import {
  GetActivitiesByAddressResult,
  TransactionActivity,
  TokenERC
} from 'src/core';
import { ethIcon } from '@/consts';

export const mockActivities: GetActivitiesByAddressResult = {
  activities: [
    {
      activityType: TransactionActivity.SENT,
      transactionID:
        '0x9f51a8f56c361a037f8a5e8682b487b609b22ab170f06dcd28cf06367b973922',
      amount: {
        type: TokenERC.ERC1155,
        tokenId:
          '55620505239025097228050051289873976430608305407475021989257970763632826384414',
        value: '333',
        instance: {
          id: '55620505239025097228050051289873976430608305407475021989257970763632826384414',
          isUnique: false,
          owner: {
            address: '0x7aF817215E8Cf558d70eDBc20526c48019086b3E',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Rarible',
            symbol: 'RARI',
            decimals: 18,
            type: TokenERC.ERC1155,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-10T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.RECEIVED,
      transactionID:
        '0x4113374aa601d1667077edd29b0cca6be95d89490668bc1c665e45e4c5ddf089',
      amount: {
        type: TokenERC.ERC1155,
        tokenId:
          '55620505239025097228050051289873976430608305407475021989257970763632826384413',
        value: '5000',
        instance: {
          id: '55620505239025097228050051289873976430608305407475021989257970763632826384413',
          isUnique: false,
          owner: {
            address: '0x7aF817215E8Cf558d70eDBc20526c48019086b3E',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Rarible',
            symbol: 'RARI',
            decimals: 18,
            type: TokenERC.ERC1155,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-09T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.SENT,
      transactionID:
        '0xaff2a2f00c72321ba6e676ff21a5d54b646724658d9f4a71a39b63d1655916a4',
      amount: {
        type: TokenERC.ETH,
        value: '0',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: TokenERC.ETH,
          icon: ethIcon
        }
      },
      status: 'success',
      timestamp: '2024-01-08T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.MINTED,
      transactionID:
        '0xdf7c37e0169f1caa6106b74763cd0214c9d4fa8712cd2f9ccd5bc1dbc1ada77e',
      amount: {
        type: TokenERC.ERC721,
        tokenId: '100',
        instance: {
          id: '100',
          isUnique: false,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Pyramid',
            symbol: 'PYR',
            decimals: 0,
            type: TokenERC.ERC721,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-07T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.SENT,
      transactionID:
        '0x0a740b3ee08df746b8dc63d6c060c5f0e7c782e8f3ea51ad0acadc23b75bce87',
      amount: {
        type: TokenERC.ERC721,
        tokenId: '882305629317027560547596986660631652820569949575',
        instance: {
          id: '882305629317027560547596986660631652820569949575',
          isUnique: false,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'NFTs2Me Owners',
            symbol: 'N2MOwners',
            decimals: 0,
            type: TokenERC.ERC721,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-06T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.RECEIVED,
      transactionID:
        '0xf266e15c0be51e07083a1d0aa15817abc26987a95df969c400e884df25e67303',
      amount: {
        type: TokenERC.ERC721,
        tokenId:
          '55620505239025097228050051289873976430608305407475021989257970763632826384385',
        instance: {
          id: '55620505239025097228050051289873976430608305407475021989257970763632826384385',
          isUnique: false,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Cat of Lisk',
            symbol: 'COL',
            decimals: 18,
            type: TokenERC.ERC721,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-05T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.SENT,
      transactionID:
        '0x940e07bae85119de51814c6a6be5be896d2e985a049bb5278bac73d4f9c08b66',
      amount: {
        type: TokenERC.ETH,
        value: '0',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: TokenERC.ETH,
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjI1MDAiIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzYyN0VFQSIvPjxnIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbC1vcGFjaXR5PSIuNjAyIiBkPSJNMTYuNDk4IDR2OC44N2w3LjQ5NyAzLjM1eiIvPjxwYXRoIGQ9Ik0xNi40OTggNEw5IDE2LjIybDcuNDk4LTMuMzV6Ii8+PHBhdGggZmlsbC1vcGFjaXR5PSIuNjAyIiBkPSJNMTYuNDk4IDIxLjk2OHY2LjAyN0wyNCAxNy42MTZ6Ii8+PHBhdGggZD0iTTE2LjQ5OCAyNy45OTV2LTYuMDI4TDkgMTcuNjE2eiIvPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjIiIGQ9Ik0xNi40OTggMjAuNTczbDcuNDk3LTQuMzUzLTcuNDk3LTMuMzQ4eiIvPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjYwMiIgZD0iTTkgMTYuMjJsNy40OTggNC4zNTN2LTcuNzAxeiIvPjwvZz48L2c+PC9zdmc+'
        }
      },
      status: 'success',
      timestamp: '2024-01-04T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.MINTED,
      transactionID:
        '0xd0e171ae59455af9b6dce6e35aaaa63815d36260287d91a451d73901a79cc903',
      amount: {
        type: TokenERC.ERC721,
        tokenId:
          '55620505239025097228050051289873976430608305407475021989257970763632826384424',
        instance: {
          id: '55620505239025097228050051289873976430608305407475021989257970763632826384424',
          isUnique: false,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Rarible',
            symbol: 'RARI',
            decimals: 18,
            type: TokenERC.ERC721,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-03T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.SENT,
      transactionID:
        '0x269545177832adeaae38766015e8d462eb63f3542896b860506e24bfe401bfb4',
      amount: {
        type: TokenERC.ERC1155,
        tokenId:
          '55620505239025097228050051289873976430608305407475021989257970763632826384412',
        value: '5000',
        instance: {
          id: '55620505239025097228050051289873976430608305407475021989257970763632826384412',
          isUnique: false,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Rarible',
            symbol: 'RARI',
            decimals: 18,
            type: TokenERC.ERC1155,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-02T10:00:00.000000Z'
    },
    {
      activityType: TransactionActivity.MINTED,
      transactionID:
        '0x0401d1aee29b795e8027dc379f1c8646fa2ceea27dba2a257308885dc97ad596',
      amount: {
        type: TokenERC.ERC721,
        tokenId:
          '55620505239025097228050051289873976430608305407475021989257970763632826384423',
        instance: {
          id: '55620505239025097228050051289873976430608305407475021989257970763632826384423',
          isUnique: false,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Rarible',
            symbol: 'RARI',
            decimals: 18,
            type: TokenERC.ERC721,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-01T10:00:00.000000Z'
    }
  ],
  metadata: {
    count: 5,
    offset: 0,
    limit: 5,
    hasNextPage: true
  }
};
