import { liskSepoliaTokenConfig, liskTokenConfig } from '../consts';
import { getSupportedTokens } from './utils';

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

    it('should return liskSepoliaTokenConfig when testing status is undefined', () => {
      const result = getSupportedTokens(undefined);

      expect(result).toEqual(liskTokenConfig);
      expect(result['1135']).toHaveLength(1);
    });
  });
});
