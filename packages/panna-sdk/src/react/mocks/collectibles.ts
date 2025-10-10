import {
  GetCollectiblesByAddressResult,
  ImageType
} from 'src/core/util/collectible.types';

export const mockCollectibles: GetCollectiblesByAddressResult = {
  collectibles: [
    {
      numInstancesOwned: 2,
      token: {
        icon: 'https://assets.poap.xyz/chanel-poap-4c-2023-logo-1675083420470.png',
        name: 'Social Listening Committee #2 Attendees',
        symbol: 'SLC',
        address: '0x394c399dbA25B99Ab7708EdB505d755B3aa29997',
        type: 'ERC-721'
      },
      instances: [
        {
          id: '431',
          imageType: ImageType.URL,
          image:
            'https://assets.poap.xyz/chanel-poap-4c-2023-logo-1675083420470.png',
          name: 'Social Listening Committee #2 Attendees'
        },
        {
          id: '465',
          imageType: ImageType.URL,
          image:
            'https://assets.poap.xyz/chanel-poap-4c-2023-logo-1675083420470.png',
          name: 'Social Listening Committee #2 Attendees'
        }
      ]
    },
    {
      numInstancesOwned: 3,
      token: {
        name: 'Lisk of Life',
        symbol: 'LOL',
        type: 'ERC-721',
        address: '0x6da91ed1237ebf7f8c433659f13cc24e11e0de43',
        icon: 'https://drops-static.rarible.com/drops/image/Lisk%20of%20Life.jpg'
      },
      instances: [
        {
          id: '1234',
          imageType: ImageType.URL,
          image:
            'https://drops-static.rarible.com/drops/image/Lisk%20of%20Life.jpg',
          name: 'Lisk of Life # 1234'
        },
        {
          id: '12592',
          imageType: ImageType.URL,
          image:
            'https://drops-static.rarible.com/drops/image/Lisk%20of%20Life.jpg',
          name: 'Lisk of Life # 12592'
        },
        {
          id: '837',
          imageType: ImageType.URL,
          image:
            'https://drops-static.rarible.com/drops/image/Lisk%20of%20Life.jpg',
          name: 'Lisk of Life # 837'
        }
      ]
    }
  ],
  metadata: {
    count: 2,
    offset: 0,
    limit: 10,
    hasNextPage: false
  }
};
