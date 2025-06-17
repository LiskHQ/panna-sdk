import { Chain } from 'thirdweb';
import { getDefaultToken, SupportedTokens, TokenInfo } from 'thirdweb/react';
import { lisk, liskSepolia } from '../../core';

const liskTokenConfig: SupportedTokens = {
  [lisk.id]: [
    {
      address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
      name: 'Lisk',
      symbol: 'LSK',
      icon: 'ipfs://QmRBakJ259a4RPFkMayjmeG7oL6f1hWqYg4CUDFUSbttNx'
    }
  ]
};

const liskSepoliaTokenConfig: SupportedTokens = {
  [liskSepolia.id]: [
    {
      address: '0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D',
      name: 'Lisk',
      symbol: 'LSK',
      icon: 'ipfs://QmRBakJ259a4RPFkMayjmeG7oL6f1hWqYg4CUDFUSbttNx'
    },
    {
      address: '0xed875CABEE46D734F38B5ED453ED1569347c0da8',
      name: 'USDC',
      symbol: 'USDC',
      // The USDC token is part of the default tokens provided by thirdweb
      // So we intentionally specify the Ethereum network details in order
      // to get the correct icon for USDC
      icon: (
        getDefaultToken(
          {
            id: 1,
            rpc: 'https://cloudflare-eth.com'
          },
          'USDC'
        ) as TokenInfo
      ).icon
    }
  ]
};

export function getSupportedTokens(currentChain: Chain | undefined) {
  return currentChain?.id === lisk.id
    ? liskTokenConfig
    : liskSepoliaTokenConfig;
}
