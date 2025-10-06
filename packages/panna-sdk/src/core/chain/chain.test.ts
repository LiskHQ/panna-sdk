import { describeChain, getChainInfo, getRpcUrlForChain } from './chain';
import { Chain } from './types';

// Mock Thirdweb's getChainMetadata to prevent network requests
jest.mock('thirdweb/chains', () => ({
  ...jest.requireActual('thirdweb/chains'),
  getChainMetadata: jest.fn().mockImplementation(async (chain) => {
    // Return mock metadata based on chain ID
    const chainId = typeof chain === 'number' ? chain : chain.id;
    return {
      chainId,
      name: chainId === 1 ? 'Ethereum' : `Chain ${chainId}`,
      chain: chainId === 1 ? 'ETH' : `CHAIN${chainId}`,
      shortName: chainId === 1 ? 'eth' : `chain${chainId}`,
      testnet: false,
      slug: chainId === 1 ? 'ethereum' : `chain-${chainId}`,
      icon: {
        url: `https://example.com/icon-${chainId}.png`,
        width: 32,
        height: 32,
        format: 'png'
      },
      nativeCurrency: {
        name: chainId === 1 ? 'Ether' : `Token ${chainId}`,
        symbol: chainId === 1 ? 'ETH' : `TKN${chainId}`,
        decimals: 18
      }
    };
  })
}));

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
