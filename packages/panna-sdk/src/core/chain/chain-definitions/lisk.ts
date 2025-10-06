import { describeChain } from '../chain';

/**
 * @chain
 */
export const lisk = describeChain({
  id: 1135,
  name: 'Lisk',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpc: 'https://rpc.api.lisk.com',
  blockExplorers: [
    {
      name: 'Lisk BlockScout',
      url: 'https://blockscout.lisk.com/'
    }
  ]
});
