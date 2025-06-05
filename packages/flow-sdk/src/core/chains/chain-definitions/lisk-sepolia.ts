import { describeChain } from '../chain';

/**
 * @chain
 */
export const liskSepolia = describeChain({
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: { name: 'Lisk Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpc: 'https://rpc.sepolia-api.lisk.com',
  blockExplorers: [
    {
      name: 'Lisk Sepolia BlockScout',
      url: 'https://sepolia-blockscout.lisk.com/'
    }
  ]
});
