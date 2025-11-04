import { lisk, liskSepolia } from '../../core';
import { getPannaApiUrl } from './panna-api';

describe('getPannaApiUrl', () => {
  // Store original console.warn to restore later
  const originalWarn = console.warn;

  beforeEach(() => {
    // Mock console.warn to avoid cluttering test output
    console.warn = jest.fn();
  });

  afterEach(() => {
    // Restore original console.warn
    console.warn = originalWarn;
  });

  describe('Production chains', () => {
    it('should return mainnet URL for Lisk mainnet chain', () => {
      const url = getPannaApiUrl(String(lisk.id), false);
      expect(url).toBe('https://panna-app.lisk.com/v1');
    });

    it('should return sepolia URL for Lisk Sepolia chain', () => {
      const url = getPannaApiUrl(String(liskSepolia.id), false);
      expect(url).toBe('https://stg-panna-app.lisk.com/v1');
    });
  });

  describe('Development mode', () => {
    it('should return localhost URL when dev mode is enabled for mainnet chain', () => {
      const url = getPannaApiUrl(String(lisk.id), true);
      expect(url).toBe('http://localhost:8080/v1');
    });

    it('should return localhost URL when dev mode is enabled for sepolia chain', () => {
      const url = getPannaApiUrl(String(liskSepolia.id), true);
      expect(url).toBe('http://localhost:8080/v1');
    });

    it('should return localhost URL when dev mode is enabled for any chain ID', () => {
      const url = getPannaApiUrl('999999', true);
      expect(url).toBe('http://localhost:8080/v1');
    });
  });

  describe('Unsupported chains', () => {
    it('should throw error for unsupported chain ID', () => {
      expect(() => getPannaApiUrl('999999', false)).toThrow(
        'Unsupported chain ID: 999999'
      );
    });

    it('should log warning for unsupported chain ID', () => {
      const consoleSpy = jest.spyOn(console, 'warn');

      try {
        getPannaApiUrl('999999', false);
      } catch {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported chain ID: 999999')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Lisk Mainnet: ${lisk.id}`)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Lisk Sepolia: ${liskSepolia.id}`)
      );
    });

    it('should include helpful tip in error message', () => {
      try {
        getPannaApiUrl('123456', false);
        fail('Expected function to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('enableDevMode=true');
      }
    });

    it('should include supported chains in error message', () => {
      try {
        getPannaApiUrl('123456', false);
        fail('Expected function to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain(`Lisk Mainnet (${lisk.id})`);
        expect((error as Error).message).toContain(
          `Lisk Sepolia (${liskSepolia.id})`
        );
      }
    });
  });

  describe('URL format', () => {
    it('should include version in URL path', () => {
      const url = getPannaApiUrl(String(lisk.id), false);
      expect(url).toContain('/v1');
    });

    it('should return properly formatted URLs without trailing slash', () => {
      const mainnetUrl = getPannaApiUrl(String(lisk.id), false);
      const sepoliaUrl = getPannaApiUrl(String(liskSepolia.id), false);
      const devUrl = getPannaApiUrl(String(lisk.id), true);

      expect(mainnetUrl.endsWith('/')).toBe(false);
      expect(sepoliaUrl.endsWith('/')).toBe(false);
      expect(devUrl.endsWith('/')).toBe(false);
    });

    it('should return HTTPS URLs for production chains', () => {
      const mainnetUrl = getPannaApiUrl(String(lisk.id), false);
      const sepoliaUrl = getPannaApiUrl(String(liskSepolia.id), false);

      expect(mainnetUrl).toMatch(/^https:\/\//);
      expect(sepoliaUrl).toMatch(/^https:\/\//);
    });

    it('should return HTTP URL for development mode', () => {
      const devUrl = getPannaApiUrl(String(lisk.id), true);
      expect(devUrl).toMatch(/^http:\/\//);
    });
  });

  describe('Chain ID type handling', () => {
    it('should handle numeric chain ID as string', () => {
      const url = getPannaApiUrl(String(lisk.id), false);
      expect(url).toBeDefined();
      expect(typeof url).toBe('string');
    });

    it('should handle string chain IDs', () => {
      const url = getPannaApiUrl(String(lisk.id), false);
      expect(url).toBe('https://panna-app.lisk.com/v1');
    });
  });

  describe('Boolean parameter handling', () => {
    it('should handle explicit true for dev mode', () => {
      const url = getPannaApiUrl(String(lisk.id), true);
      expect(url).toBe('http://localhost:8080/v1');
    });

    it('should handle explicit false for dev mode', () => {
      const url = getPannaApiUrl(String(lisk.id), false);
      expect(url).toBe('https://panna-app.lisk.com/v1');
    });
  });
});
