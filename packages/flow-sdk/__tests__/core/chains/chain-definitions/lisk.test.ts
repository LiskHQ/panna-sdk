import { lisk } from '../../../../src/core/chains/chain-definitions/lisk';
import { liskSepolia } from '../../../../src/core/chains/chain-definitions/lisk-sepolia';

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
      expect(rpcUrl).toBe('https://rpc.lisk.com');
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
