import { EcosystemId, type EcosystemConfig } from './types';

describe('Client Types', () => {
  describe('EcosystemId enum', () => {
    it('should have LISK ecosystem with correct value', () => {
      expect(EcosystemId.LISK).toBe('ecosystem.lisk');
    });

    it('should only have LISK ecosystem', () => {
      const ecosystems = Object.values(EcosystemId);
      expect(ecosystems).toHaveLength(1);
      expect(ecosystems).toContain('ecosystem.lisk');
    });
  });

  describe('EcosystemConfig', () => {
    it('should accept valid configuration', () => {
      const config: EcosystemConfig = {
        id: EcosystemId.LISK,
        partnerId: 'test-partner-id'
      };

      expect(config.id).toBe(EcosystemId.LISK);
      expect(config.partnerId).toBe('test-partner-id');
    });

    it('should enforce required properties', () => {
      const validConfig: EcosystemConfig = {
        id: EcosystemId.LISK,
        partnerId: 'my-partner'
      };

      expect(validConfig).toHaveProperty('id');
      expect(validConfig).toHaveProperty('partnerId');
    });
  });
});
