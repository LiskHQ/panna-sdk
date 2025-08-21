import { GetActivitiesByAddressResult } from 'src/core';
import { ethIcon } from '../../react/consts';

export const mockActivities: GetActivitiesByAddressResult = {
  activities: [
    {
      activityType: 'sent',
      transactionID:
        '0x3dc796c0ac01958eccb6036c5690643e3730f03bc3f9416cc55051366d16f737',
      amount: {
        type: 'eth',
        value: '70000000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: 'eth',
          icon: ethIcon
        }
      },
      status: 'success'
    },
    {
      activityType: 'sent',
      transactionID:
        '0x97b41ed9540bdb247b0f52501c3990cf376874a05adff0a76cef23602cc580d5',
      amount: {
        type: 'eth',
        value: '8000000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: 'eth',
          icon: ethIcon
        }
      },
      status: 'success'
    },
    {
      activityType: 'sent',
      transactionID:
        '0x7957c0323b7fed9da521ab09ac0d4d81ff2ddeaa89a1a7b75738ed23a95769fd',
      amount: {
        type: 'eth',
        value: '1000310000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: 'eth',
          icon: ethIcon
        }
      },
      status: 'success'
    },
    {
      activityType: 'sent',
      transactionID:
        '0x3e50f83636069d59795f0604ed8f2983a1c8dd2ae0f563337486b2362258def8',
      amount: {
        type: 'eth',
        value: '1',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: 'eth',
          icon: ethIcon
        }
      },
      status: 'success'
    },
    {
      activityType: 'sent',
      transactionID:
        '0x2d2582e386500baaa828b823797e6e012675f675339c7330b9eb2fd2033c4cef',
      amount: {
        type: 'eth',
        value: '1000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: 'eth',
          icon: ethIcon
        }
      },
      status: 'success'
    }
  ],
  metadata: {
    count: 5,
    offset: 0,
    limit: 5,
    hasNextPage: true
  }
};
