import { CollectiblesResponse } from '@/types/collectibles.types';

export const mockCollectibles: CollectiblesResponse = {
  collectibles: {
    items: [
      {
        token: {
          circulating_market_cap: '83606435600.3635',
          icon_url:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
          name: 'Tether USD',
          decimals: '6',
          symbol: 'USDT',
          address: '0x394c399dbA25B99Ab7708EdB505d755B3aa29997',
          type: 'ERC-20',
          holders: '837494234523',
          exchange_rate: '0.99',
          total_supply: '10000000'
        },
        amount: '1',
        token_instances: [
          {
            is_unique: true,
            id: '431',
            holder_address_hash: '0x394c399dbA25B99Ab7708EdB505d755B3aa29997',
            image_url: 'example.com/picture.png',
            animation_url: 'example.com/video.mp4',
            external_app_url: 'd-app.com',
            metadata: {
              year: 2023,
              tags: ['poap', 'event'],
              name: 'Social Listening Committee #2 Attendees',
              image_url:
                'https://assets.poap.xyz/chanel-poap-4c-2023-logo-1675083420470.png',
              home_url: 'https://app.poap.xyz/token/6292128',
              external_url: 'https://api.poap.tech/metadata/99010/6292128',
              description:
                'This is the POAP for attendees of the second Social Listening Committee.',
              attributes: [
                {
                  value: '01-Feb-2023',
                  trait_type: 'startDate'
                },
                {
                  value: '01-Feb-2023',
                  trait_type: 'endDate'
                },
                {
                  value: 'false',
                  trait_type: 'virtualEvent'
                },
                {
                  value: 'Paris',
                  trait_type: 'city'
                },
                {
                  value: 'France',
                  trait_type: 'country'
                },
                {
                  value: 'https://www.chanel.com',
                  trait_type: 'eventURL'
                }
              ]
            },
            owner: {
              hash: '0xEb533ee5687044E622C69c58B1B12329F56eD9ad',
              implementation_name: 'implementationName',
              name: 'contractName',
              ens_domain_name: 'domain.eth',
              metadata: {
                slug: 'tag_slug',
                name: 'Tag name',
                tagType: 'name',
                ordinal: 0,
                meta: {}
              },
              is_contract: true,
              private_tags: [
                {
                  address_hash: '0xEb533ee5687044E622C69c58B1B12329F56eD9ad',
                  display_name: 'name to show',
                  label: 'label'
                }
              ],
              watchlist_names: [
                {
                  display_name: 'name to show',
                  label: 'label'
                }
              ],
              public_tags: [
                {
                  address_hash: '0xEb533ee5687044E622C69c58B1B12329F56eD9ad',
                  display_name: 'name to show',
                  label: 'label'
                }
              ],
              is_verified: true
            },
            token: null,
            token_type: 'ERC-721',
            value: '1'
          },
          {
            is_unique: true,
            id: '465',
            holder_address_hash: '0x394c399dbA25B99Ab7708EdB505d755B3aa29997',
            image_url: 'example.com/picture.png',
            animation_url: 'example.com/video.mp4',
            external_app_url: 'd-app.com',
            metadata: {
              year: 2023,
              tags: ['poap', 'event'],
              name: 'Social Listening Committee #2 Attendees',
              image_url:
                'https://assets.poap.xyz/chanel-poap-4c-2023-logo-1675083420470.png',
              home_url: 'https://app.poap.xyz/token/6283705',
              external_url: 'https://api.poap.tech/metadata/99010/6283705',
              description:
                'This is the POAP for attendees of the second Social Listening Committee.',
              attributes: [
                {
                  value: '01-Feb-2023',
                  trait_type: 'startDate'
                },
                {
                  value: '01-Feb-2023',
                  trait_type: 'endDate'
                },
                {
                  value: 'false',
                  trait_type: 'virtualEvent'
                },
                {
                  value: 'Paris',
                  trait_type: 'city'
                },
                {
                  value: 'France',
                  trait_type: 'country'
                },
                {
                  value: 'https://www.chanel.com',
                  trait_type: 'eventURL'
                }
              ]
            },
            owner: {
              hash: '0xEb533ee5687044E622C69c58B1B12329F56eD9ad',
              implementation_name: 'implementationName',
              name: 'contractName',
              ens_domain_name: 'domain.eth',
              metadata: {
                slug: 'tag_slug',
                name: 'Tag name',
                tagType: 'name',
                ordinal: 0,
                meta: {}
              },
              is_contract: true,
              private_tags: [
                {
                  address_hash: '0xEb533ee5687044E622C69c58B1B12329F56eD9ad',
                  display_name: 'name to show',
                  label: 'label'
                }
              ],
              watchlist_names: [
                {
                  display_name: 'name to show',
                  label: 'label'
                }
              ],
              public_tags: [
                {
                  address_hash: '0xEb533ee5687044E622C69c58B1B12329F56eD9ad',
                  display_name: 'name to show',
                  label: 'label'
                }
              ],
              is_verified: true
            },
            token: null,
            token_type: 'ERC-721',
            value: '1'
          }
        ]
      }
    ],
    next_page_params: {
      token_contract_address_hash: '0xb81afe27c103bcd42f4026cf719af6d802928765',
      token_type: 'ERC-721'
    }
  },
  metadata: {
    count: 2,
    offset: 0,
    limit: 10
  }
};
