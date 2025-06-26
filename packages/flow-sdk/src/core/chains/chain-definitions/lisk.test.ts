import { lisk } from './lisk';

describe('lisk chain definition', () => {
  describe('lisk', () => {
    it('should define the Lisk chain with correct properties', () => {
      const liskChain = lisk;
      expect(liskChain.id).toBe(1135);
      expect(liskChain.name).toBe('Lisk');
      expect(liskChain.nativeCurrency?.name).toBe('Ether');
      expect(liskChain.blockExplorers?.[0].name).toBe('Lisk BlockScout');
    });

    it('should have the correct RPC URL', () => {
      const rpcUrl = lisk.rpc;
      expect(rpcUrl).toBe('https://rpc.api.lisk.com');
    });

    it('should have the correct block explorer URL', () => {
      const blockExplorerUrl = lisk.blockExplorers?.[0].url;
      expect(blockExplorerUrl).toBe('https://blockscout.lisk.com/');
    });

    it('should have the correct native currency symbol', () => {
      const nativeCurrencySymbol = lisk.nativeCurrency?.symbol;
      expect(nativeCurrencySymbol).toBe('ETH');
    });

    it('should have the correct native currency decimals', () => {
      const nativeCurrencyDecimals = lisk.nativeCurrency?.decimals;
      expect(nativeCurrencyDecimals).toBe(18);
    });
  });
});
