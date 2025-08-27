import type { Chain } from '../chains/types';
import type { PannaClient } from '../client';
import type { Address } from '../types/external';
import type {
  PrepareTransactionParams,
  PrepareTransactionResult,
  PrepareContractCallParams,
  PrepareContractCallResult,
  GetContractParams,
  GetContractResult
} from './types';

describe('Transaction Types', () => {
  const mockClient = { clientId: 'test-client' } as PannaClient;
  const mockChain = { id: 1, name: 'Ethereum' } as Chain;
  const mockContract = {
    client: mockClient,
    address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as Address,
    chain: mockChain
  };

  describe('PrepareTransactionParams', () => {
    it('should accept valid minimal parameters', () => {
      const params: PrepareTransactionParams = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e'
      };

      expect(params).toBeDefined();
      expect(params.client).toBe(mockClient);
      expect(params.chain).toBe(mockChain);
      expect(params.to).toBe('0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e');
    });

    it('should accept all optional parameters', () => {
      const params: PrepareTransactionParams = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        value: BigInt('1000000000000000000'),
        data: '0x123456',
        gas: BigInt('21000'),
        gasPrice: BigInt('20000000000'),
        maxFeePerGas: BigInt('30000000000'),
        maxPriorityFeePerGas: BigInt('2000000000'),
        nonce: 42,
        extraGas: BigInt('5000'),
        accessList: [
          {
            address: '0x123456789',
            storageKeys: ['0xabc', '0xdef']
          }
        ]
      };

      expect(params).toBeDefined();
      expect(params.chain).toBe(mockChain);
      expect(params.value).toBe(BigInt('1000000000000000000'));
      expect(params.data).toBe('0x123456');
      expect(params.gas).toBe(BigInt('21000'));
      expect(params.gasPrice).toBe(BigInt('20000000000'));
      expect(params.maxFeePerGas).toBe(BigInt('30000000000'));
      expect(params.maxPriorityFeePerGas).toBe(BigInt('2000000000'));
      expect(params.nonce).toBe(42);
      expect(params.extraGas).toBe(BigInt('5000'));
      expect(params.accessList).toEqual([
        {
          address: '0x123456789',
          storageKeys: ['0xabc', '0xdef']
        }
      ]);
    });
  });

  describe('PrepareTransactionResult', () => {
    it('should match expected structure', () => {
      const result: PrepareTransactionResult = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        value: BigInt('1000000000000000000'),
        data: '0x123456',
        gasPrice: BigInt('20000000000')
      };

      expect(result).toBeDefined();
      expect(result.client).toBe(mockClient);
      expect(result.chain).toBe(mockChain);
      expect(result.to).toBe('0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e');
      expect(result.value).toBe(BigInt('1000000000000000000'));
      expect(result.data).toBe('0x123456');
      expect(result.gasPrice).toBe(BigInt('20000000000'));
    });

    it('should handle minimal result', () => {
      const result: PrepareTransactionResult = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e'
      };

      expect(result.client).toBe(mockClient);
      expect(result.chain).toBe(mockChain);
      expect(result.to).toBe('0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e');
      expect(result.value).toBeUndefined();
      expect(result.data).toBeUndefined();
      expect(result.gasPrice).toBeUndefined();
    });
  });

  describe('PrepareContractCallParams', () => {
    it('should accept valid minimal parameters', () => {
      const params: PrepareContractCallParams = {
        ...mockContract,
        method: 'function totalSupply()'
      };

      expect(params).toBeDefined();
      expect(params.client).toBe(mockContract.client);
      expect(params.chain).toBe(mockContract.chain);
      expect(params.address).toBe(mockContract.address);
      expect(params.method).toBe('function totalSupply()');
    });

    it('should accept gas parameters', () => {
      const params: PrepareContractCallParams = {
        ...mockContract,
        method: 'function transfer(address to, uint256 amount)',
        params: ['0x123456789', BigInt('1000000000000000000')],
        value: BigInt('100000000000000000'),
        gas: BigInt('21000'),
        gasPrice: BigInt('20000000000'),
        maxFeePerGas: BigInt('30000000000'),
        maxPriorityFeePerGas: BigInt('2000000000'),
        nonce: 42
      };

      expect(params.gas).toBe(BigInt('21000'));
      expect(params.gasPrice).toBe(BigInt('20000000000'));
      expect(params.maxFeePerGas).toBe(BigInt('30000000000'));
      expect(params.nonce).toBe(42);
    });

    it('should accept method with parameters', () => {
      const params: PrepareContractCallParams = {
        ...mockContract,
        method: 'function transfer(address to, uint256 amount)',
        params: ['0x123456789', BigInt('1000000000000000000')]
      };

      expect(params.params).toEqual([
        '0x123456789',
        BigInt('1000000000000000000')
      ]);
    });

    it('should accept value for payable methods', () => {
      const params: PrepareContractCallParams = {
        ...mockContract,
        method: 'function mint(address to)',
        params: ['0x123456789'],
        value: BigInt('100000000000000000')
      };

      expect(params.value).toBe(BigInt('100000000000000000'));
    });

    it('should accept ABI function object', () => {
      const abiFunction = {
        type: 'function' as const,
        name: 'transfer',
        inputs: [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'amount' }
        ]
      };

      const params: PrepareContractCallParams = {
        ...mockContract,
        method: abiFunction,
        params: ['0x123456789', BigInt('1000000000000000000')]
      };

      expect(params.method).toBe(abiFunction);
    });
  });

  describe('PrepareContractCallResult', () => {
    it('should match expected structure', () => {
      const mockDataFunction = async () =>
        '0xa9059cbb000000000000000000000000123456789000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000';

      const result: PrepareContractCallResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        data: mockDataFunction,
        value: BigInt('100000000000000000'),
        chain: mockChain
      };

      expect(result).toBeDefined();
      expect(result.to).toBe('0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e');
      expect(typeof result.data).toBe('function');
      expect(result.value).toBe(BigInt('100000000000000000'));
      expect(result.chain).toBe(mockChain);
    });

    it('should handle minimal result', () => {
      const mockDataFunction = async () => '0x18160ddd';

      const result: PrepareContractCallResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        data: mockDataFunction
      };

      expect(result.to).toBe('0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e');
      expect(typeof result.data).toBe('function');
      expect(result.value).toBeUndefined();
      expect(result.chain).toBeUndefined();
    });
  });

  describe('GetContractParams', () => {
    it('should accept valid minimal parameters', () => {
      const params: GetContractParams = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        chain: mockChain
      };

      expect(params).toBeDefined();
      expect(params.client).toBe(mockClient);
      expect(params.address).toBe('0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e');
      expect(params.chain).toBe(mockChain);
    });

    it('should accept all optional parameters', () => {
      const mockAbi = [
        {
          type: 'function' as const,
          name: 'transfer',
          inputs: [
            { type: 'address', name: 'to' },
            { type: 'uint256', name: 'amount' }
          ],
          outputs: [],
          stateMutability: 'nonpayable' as const
        }
      ];

      const params: GetContractParams = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        chain: mockChain,
        abi: mockAbi
      };

      expect(params.abi).toBe(mockAbi);
      expect(params.chain).toBe(mockChain);
    });
  });

  describe('GetContractResult', () => {
    it('should have correct structure', () => {
      const result: GetContractResult = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        chain: mockChain
      };

      expect(result).toBeDefined();
      expect(result.client).toBe(mockClient);
      expect(result.address).toBe('0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e');
      expect(result.chain).toBe(mockChain);
    });

    it('should handle optional ABI', () => {
      const mockAbi = [
        {
          type: 'function' as const,
          name: 'transfer',
          inputs: [
            { type: 'address', name: 'to' },
            { type: 'uint256', name: 'amount' }
          ],
          outputs: [],
          stateMutability: 'nonpayable' as const
        }
      ];

      const result: GetContractResult = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
        abi: mockAbi,
        chain: mockChain
      };

      expect(result.abi).toBe(mockAbi);
    });
  });

  describe('Type Exports', () => {
    it('should export all parameter types', () => {
      // This test ensures all types are properly exported and can be imported
      const testTypes = {
        PrepareTransactionParams: {} as PrepareTransactionParams,
        PrepareTransactionResult: {} as PrepareTransactionResult,
        PrepareContractCallParams: {} as PrepareContractCallParams,
        PrepareContractCallResult: {} as PrepareContractCallResult,
        GetContractParams: {} as GetContractParams,
        GetContractResult: {} as GetContractResult
      };

      expect(testTypes).toBeDefined();
    });
  });

  describe('Type Compatibility', () => {
    it('should be compatible with thirdweb types', () => {
      // Test that our types are compatible with thirdweb types
      const mockThirdwebParams = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as Address,
        value: BigInt('1000000000000000000'),
        gasPrice: BigInt('20000000000')
      };

      // Should be assignable to our PrepareTransactionParams
      const ourParams: PrepareTransactionParams = mockThirdwebParams;
      expect(ourParams).toBeDefined();
    });

    it('should handle bigint values correctly', () => {
      const bigintValue: PrepareTransactionParams['value'] = BigInt(
        '1000000000000000000'
      );

      expect(typeof bigintValue).toBe('bigint');
    });
  });
});
