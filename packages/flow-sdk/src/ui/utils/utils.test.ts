import { Chain } from 'thirdweb';
import {
  getSupportedTokens,
  liskSepoliaTokenConfig,
  liskTokenConfig
} from './utils';

jest.mock('../../core', () => ({
  lisk: {
    id: 1135
  },
  liskSepolia: {
    id: 4202
  }
}));

describe('utils', () => {
  describe('getSupportedTokens', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return liskTokenConfig when chain id matches lisk.id', () => {
      const mockChain: Chain = {
        id: 1135,
        name: 'Lisk',
        rpc: 'https://rpc.lisk.com'
      };

      const result = getSupportedTokens(mockChain);

      expect(result).toEqual(liskTokenConfig);
    });

    it('should return liskSepoliaTokenConfig when chain id does not match lisk.id', () => {
      const mockChain: Chain = {
        id: 4202,
        name: 'Lisk Sepolia',
        rpc: 'https://rpc.lisk-sepolia.com'
      };

      const result = getSupportedTokens(mockChain);

      expect(result).toEqual(liskSepoliaTokenConfig);
    });

    it('should return liskSepoliaTokenConfig when chain is undefined', () => {
      const result = getSupportedTokens(undefined);

      expect(result).toEqual(liskSepoliaTokenConfig);
      expect(result['4202']).toHaveLength(2);
    });
  });
});
