import { lisk, liskSepolia } from '../../core';
import { liskSepoliaTokenConfig, liskTokenConfig } from '../consts';
import { getAAChain, getChain, getSupportedTokens } from './utils';

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

    it('should return liskSepoliaTokenConfig when testing status is true', () => {
      const result = getSupportedTokens(true);

      expect(result).toEqual(liskSepoliaTokenConfig);
    });

    it('should return liskTokenConfig when testing status is false', () => {
      const result = getSupportedTokens(false);

      expect(result).toEqual(liskTokenConfig);
    });

    it('should return liskTokenConfig when testing status is undefined', () => {
      const result = getSupportedTokens(undefined);

      expect(result).toEqual(liskTokenConfig);
      expect(result['1135']).toHaveLength(liskTokenConfig[lisk.id].length);
    });
  });

  describe('getChain', () => {
    it('should return liskSepolia when testing status is true', () => {
      const result = getChain(true);

      expect(result).toEqual(liskSepolia);
    });

    it('should return lisk when testing status is false', () => {
      const result = getChain(false);

      expect(result).toEqual(lisk);
    });

    it('should return lisk when testing status is undefined', () => {
      const result = getChain(undefined);

      expect(result).toEqual(lisk);
    });
  });

  describe('getAAChain', () => {
    it('should return liskSepolia when testing status is true', () => {
      const result = getAAChain(true);

      expect(result).toEqual(liskSepolia);
    });

    it('should return lisk when testing status is false', () => {
      const result = getAAChain(false);

      expect(result).toEqual(lisk);
    });

    it('should return lisk when testing status is undefined', () => {
      const result = getAAChain(undefined);

      expect(result).toEqual(lisk);
    });
  });
});
