import { liskSepolia } from './lisk-sepolia';

describe('lisk chain definition', () => {
  describe('liskSepolia', () => {
    it('should define the Lisk chain with correct properties', () => {
      expect(liskSepolia.id).toBe(4202);
      expect(liskSepolia.name).toBe('Lisk Sepolia Testnet');
      expect(liskSepolia.nativeCurrency?.name).toBe('Lisk Sepolia Ether');
      expect(liskSepolia.blockExplorers?.[0].name).toBe(
        'Lisk Sepolia BlockScout'
      );
    });

    it('should have the correct RPC URL', () => {
      const rpcUrl = liskSepolia.rpc;
      expect(rpcUrl).toBe('https://rpc.sepolia-api.lisk.com');
    });

    it('should have the correct block explorer URL', () => {
      const blockExplorerUrl = liskSepolia.blockExplorers?.[0].url;
      expect(blockExplorerUrl).toBe('https://sepolia-blockscout.lisk.com/');
    });

    it('should have the correct native currency symbol', () => {
      const nativeCurrencySymbol = liskSepolia.nativeCurrency?.symbol;
      expect(nativeCurrencySymbol).toBe('ETH');
    });

    it('should have the correct native currency decimals', () => {
      const nativeCurrencyDecimals = liskSepolia.nativeCurrency?.decimals;
      expect(nativeCurrencyDecimals).toBe(18);
    });
  });
});
