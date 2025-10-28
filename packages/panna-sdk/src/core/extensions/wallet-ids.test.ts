import { WalletId, isWalletId, getWalletName } from './wallet-ids';

describe('WalletId', () => {
  describe('enum values', () => {
    it('should have correct rDNS format for MetaMask', () => {
      expect(WalletId.MetaMask).toBe('io.metamask');
    });

    it('should have correct rDNS format for Coinbase', () => {
      expect(WalletId.Coinbase).toBe('com.coinbase.wallet');
    });

    it('should have correct rDNS format for Trust', () => {
      expect(WalletId.Trust).toBe('com.trustwallet.app');
    });

    it('should have correct rDNS format for Rainbow', () => {
      expect(WalletId.Rainbow).toBe('me.rainbow');
    });

    it('should have correct rDNS format for Phantom', () => {
      expect(WalletId.Phantom).toBe('app.phantom');
    });

    it('should have correct identifier for WalletConnect', () => {
      expect(WalletId.WalletConnect).toBe('walletconnect');
    });
  });

  describe('isWalletId', () => {
    it('should return true for valid WalletId strings', () => {
      expect(isWalletId('io.metamask')).toBe(true);
      expect(isWalletId('com.coinbase.wallet')).toBe(true);
      expect(isWalletId('com.trustwallet.app')).toBe(true);
      expect(isWalletId('me.rainbow')).toBe(true);
      expect(isWalletId('app.phantom')).toBe(true);
      expect(isWalletId('walletconnect')).toBe(true);
    });

    it('should return false for invalid WalletId strings', () => {
      expect(isWalletId('invalid.wallet')).toBe(false);
      expect(isWalletId('random-string')).toBe(false);
      expect(isWalletId('')).toBe(false);
    });

    it('should work with all enum values', () => {
      Object.values(WalletId).forEach((id) => {
        expect(isWalletId(id)).toBe(true);
      });
    });

    it('should handle edge cases', () => {
      expect(isWalletId('io.metamask.extra')).toBe(false);
      expect(isWalletId('IO.METAMASK')).toBe(false);
      expect(isWalletId('io.metamask ')).toBe(false); // with trailing space
    });
  });

  describe('getWalletName', () => {
    it('should return correct name for MetaMask', () => {
      expect(getWalletName(WalletId.MetaMask)).toBe('MetaMask');
    });

    it('should return correct name for Coinbase', () => {
      expect(getWalletName(WalletId.Coinbase)).toBe('Coinbase Wallet');
    });

    it('should return correct name for Trust', () => {
      expect(getWalletName(WalletId.Trust)).toBe('Trust Wallet');
    });

    it('should return correct name for Rainbow', () => {
      expect(getWalletName(WalletId.Rainbow)).toBe('Rainbow');
    });

    it('should return correct name for Phantom', () => {
      expect(getWalletName(WalletId.Phantom)).toBe('Phantom');
    });

    it('should return correct name for WalletConnect', () => {
      expect(getWalletName(WalletId.WalletConnect)).toBe('WalletConnect');
    });

    it('should return all names for all wallet IDs', () => {
      Object.values(WalletId).forEach((id) => {
        const name = getWalletName(id);
        expect(name).toBeTruthy();
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('type safety', () => {
    it('should work with TypeScript string literal types', () => {
      const walletId: 'io.metamask' = WalletId.MetaMask;
      expect(walletId).toBe('io.metamask');
    });

    it('should allow enum values to be used as strings', () => {
      const wallets: string[] = [
        WalletId.MetaMask,
        WalletId.Coinbase,
        WalletId.Rainbow
      ];
      expect(wallets).toContain('io.metamask');
      expect(wallets).toContain('com.coinbase.wallet');
      expect(wallets).toContain('me.rainbow');
    });
  });

  describe('EIP-6963 compliance', () => {
    it('should follow reverse DNS format (domain.tld.subdomain)', () => {
      const reverseDomainsRegex = /^[a-z0-9]+(\.[a-z0-9]+)+$/;

      // All supported wallets should follow rDNS format (except WalletConnect which uses a simple identifier)
      expect(WalletId.MetaMask).toMatch(reverseDomainsRegex);
      expect(WalletId.Coinbase).toMatch(reverseDomainsRegex);
      expect(WalletId.Trust).toMatch(reverseDomainsRegex);
      expect(WalletId.Rainbow).toMatch(reverseDomainsRegex);
      expect(WalletId.Phantom).toMatch(reverseDomainsRegex);
      // WalletConnect uses a simple identifier instead of rDNS format
      expect(WalletId.WalletConnect).toBe('walletconnect');
    });

    it('should have unique identifiers for each wallet', () => {
      const walletIds = Object.values(WalletId);
      const uniqueIds = new Set(walletIds);
      expect(uniqueIds.size).toBe(walletIds.length);
    });

    it('should not have duplicate rDNS identifiers', () => {
      const walletIds = Object.values(WalletId);
      const counts = new Map<string, number>();

      walletIds.forEach((id) => {
        counts.set(id, (counts.get(id) || 0) + 1);
      });

      counts.forEach((count) => {
        expect(count).toBe(1);
      });
    });
  });
});
