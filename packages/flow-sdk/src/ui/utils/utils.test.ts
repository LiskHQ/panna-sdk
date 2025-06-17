import { Chain } from 'thirdweb';
import { getDefaultToken } from 'thirdweb/react';
import { getSupportedTokens } from './utils';

jest.mock('thirdweb/react', () => ({
  getDefaultToken: jest.fn(() => ({
    icon: 'mocked-icon-url'
  }))
}));

jest.mock('../../core', () => ({
  lisk: {
    id: 1135
  }
}));

describe('utils', () => {
  describe('getSupportedTokens', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (getDefaultToken as jest.Mock).mockReturnValue({
        icon: 'mocked-icon-url'
      });
    });

    it('should return liskTokenConfig when chain id matches lisk.id', () => {
      const mockChain: Chain = {
        id: 1135,
        name: 'Lisk',
        rpc: 'https://rpc.lisk.com'
      };

      const result = getSupportedTokens(mockChain);

      expect(result).toEqual({
        '1135': [
          {
            address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24',
            name: 'Lisk',
            symbol: 'LSK',
            icon: 'ipfs://QmRBakJ259a4RPFkMayjmeG7oL6f1hWqYg4CUDFUSbttNx'
          }
        ]
      });
    });

    it('should return liskSepoliaTokenConfig when chain id does not match lisk.id', () => {
      const mockChain: Chain = {
        id: 4202,
        name: 'Lisk Sepolia',
        rpc: 'https://rpc.lisk-sepolia.com'
      };

      const result = getSupportedTokens(mockChain);

      expect(result).toEqual({
        '4202': [
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
            icon: 'mocked-icon-url'
          }
        ]
      });
    });

    it('should return liskSepoliaTokenConfig when chain is undefined', () => {
      const result = getSupportedTokens(undefined);

      expect(result['4202']).toHaveLength(2);
    });
  });
});
