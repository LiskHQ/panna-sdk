import {
  describeChain,
  getChainInfo,
  getRpcUrlForChain
} from '../../../src/core/chains/chain';
import { Chain } from '../../../src/core/chains/types';

describe('chains', () => {
  describe('describeChain', () => {
    it('should define a chain with basic options', () => {
      const chain = describeChain({
        id: 1,
        name: 'Ethereum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
      });

      expect(chain.id).toBe(1);
      expect(chain.name).toBe('Ethereum');
      expect(chain.nativeCurrency?.name).toBe('Ether');
    });

    it('should define a chain with custom RPC URL', () => {
      const chain = describeChain({
        id: 1,
        rpc: 'https://my-rpc.com',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
      });

      expect(chain.rpc).toBe('https://my-rpc.com');
    });

    it('should handle numeric chain ID', () => {
      const chain = describeChain(1);
      expect(chain.id).toBe(1);
    });
  });

  describe('getRPCUrlForChain', () => {
    it('should return custom RPC URL if defined', () => {
      const chain = {
        id: 1,
        rpc: 'https://my-rpc.com',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
      };
      const rpcUrl = getRpcUrlForChain(chain);
      expect(rpcUrl).toBe('https://my-rpc.com');
    });

    it('should construct thirdweb RPC URL if no custom RPC is defined', () => {
      const chain: Chain = {
        id: 1,
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpc: 'https://my-rpc.com'
      };
      const rpcUrl = getRpcUrlForChain(chain);
      expect(rpcUrl).toBe('https://my-rpc.com');
    });
  });

  describe('getChainInfo', () => {
    it('should return metadata for a defined chain', async () => {
      const chain = describeChain({
        id: 1,
        name: 'Ethereum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
      });
      const metadata = await getChainInfo(chain);
      expect(metadata.chainId).toBe(1);
      expect(metadata.name).toBe('Ethereum');
    });

    it('should return metadata with default values for numeric chain ID', async () => {
      const chain = describeChain(1);
      const metadata = await getChainInfo(chain);
      expect(metadata.chainId).toBe(1);
      expect(metadata.name).toBe('Ethereum');
    });
  });
});
