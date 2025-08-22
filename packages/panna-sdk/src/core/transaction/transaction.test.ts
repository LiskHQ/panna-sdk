import * as thirdweb from 'thirdweb';
import type { Chain } from '../chains/types';
import type { PannaClient } from '../client';
import {
  prepareTransaction,
  prepareContractCall,
  getContract
} from './transaction';

// Mock thirdweb module
jest.mock('thirdweb', () => ({
  prepareTransaction: jest.fn(),
  prepareContractCall: jest.fn(),
  getContract: jest.fn()
}));

describe('Transaction Functions', () => {
  const mockClient = { clientId: 'test-client' } as PannaClient;
  const mockChain = { id: 1, name: 'Ethereum' } as Chain;
  const mockContract = {
    client: mockClient,
    address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
    chain: mockChain
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('prepareTransaction', () => {
    it('should prepare a basic transaction', () => {
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        value: BigInt('1000000000000000000')
      };

      (thirdweb.prepareTransaction as jest.Mock).mockReturnValue(mockResult);

      const params = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        value: BigInt('1000000000000000000')
      };

      const result = prepareTransaction(params);

      expect(thirdweb.prepareTransaction).toHaveBeenCalledWith({
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        value: BigInt('1000000000000000000')
      });
      expect(result).toEqual(mockResult);
    });

    it('should prepare a transaction with custom data', () => {
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: '0x123456' as `0x${string}`
      };

      (thirdweb.prepareTransaction as jest.Mock).mockReturnValue(mockResult);

      const params = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: '0x123456' as `0x${string}`
      };

      const result = prepareTransaction(params);

      expect(thirdweb.prepareTransaction).toHaveBeenCalledWith({
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: '0x123456' as `0x${string}`
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle minimal required parameters', () => {
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e'
      };

      (thirdweb.prepareTransaction as jest.Mock).mockReturnValue(mockResult);

      const params = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`
      };

      const result = prepareTransaction(params);

      expect(thirdweb.prepareTransaction).toHaveBeenCalledWith({
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e'
      });
      expect(result).toEqual(mockResult);
    });

    it('should prepare a transaction with gas parameters', () => {
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        value: BigInt('1000000000000000000'),
        gasPrice: BigInt('20000000000'),
        gas: BigInt('21000')
      };

      (thirdweb.prepareTransaction as jest.Mock).mockReturnValue(mockResult);

      const params = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        value: BigInt('1000000000000000000'),
        gasPrice: BigInt('20000000000'),
        gas: BigInt('21000'),
        nonce: 42
      };

      const result = prepareTransaction(params);

      expect(thirdweb.prepareTransaction).toHaveBeenCalledWith({
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        value: BigInt('1000000000000000000'),
        gasPrice: BigInt('20000000000'),
        gas: BigInt('21000'),
        nonce: 42
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('prepareContractCall', () => {
    it('should prepare a basic contract call', () => {
      const mockDataFunction = jest
        .fn()
        .mockResolvedValue('0xa9059cbb' as `0x${string}`);
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction
      };

      (thirdweb.prepareContractCall as jest.Mock).mockReturnValue(mockResult);

      const params = {
        contract: mockContract,
        method: 'function transfer(address to, uint256 amount)',
        params: ['0x123456789', BigInt('1000000000000000000')]
      };

      const result = prepareContractCall(params);

      expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
        contract: mockContract,
        method: 'function transfer(address to, uint256 amount)',
        params: ['0x123456789', BigInt('1000000000000000000')]
      });
      expect(result).toEqual({
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction
      });
    });

    it('should prepare a payable contract call', () => {
      const mockDataFunction = jest
        .fn()
        .mockResolvedValue('0x40c10f19' as `0x${string}`);
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction,
        value: BigInt('100000000000000000')
      };

      (thirdweb.prepareContractCall as jest.Mock).mockReturnValue(mockResult);

      const params = {
        contract: mockContract,
        method: 'function mint(address to)',
        params: ['0x123456789'],
        value: BigInt('100000000000000000')
      };

      const result = prepareContractCall(params);

      expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
        contract: mockContract,
        method: 'function mint(address to)',
        params: ['0x123456789'],
        value: BigInt('100000000000000000')
      });
      expect(result).toEqual({
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction,
        value: BigInt('100000000000000000')
      });
    });

    it('should prepare a contract call without parameters', () => {
      const mockDataFunction = jest
        .fn()
        .mockResolvedValue('0x18160ddd' as `0x${string}`);
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction
      };

      (thirdweb.prepareContractCall as jest.Mock).mockReturnValue(mockResult);

      const params = {
        contract: mockContract,
        method: 'function totalSupply()'
      };

      const result = prepareContractCall(params);

      expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
        contract: mockContract,
        method: 'function totalSupply()',
        params: []
      });
      expect(result).toEqual({
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction
      });
    });

    it('should handle ABI function objects', () => {
      const mockAbiFunction = {
        type: 'function',
        name: 'transfer',
        inputs: [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'amount' }
        ],
        outputs: [],
        stateMutability: 'nonpayable'
      };

      const mockDataFunction = jest
        .fn()
        .mockResolvedValue('0xa9059cbb' as `0x${string}`);
      const mockResult = {
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction
      };

      (thirdweb.prepareContractCall as jest.Mock).mockReturnValue(mockResult);

      const params = {
        contract: mockContract,
        method: mockAbiFunction,
        params: ['0x123456789', BigInt('1000000000000000000')]
      };

      const result = prepareContractCall(params);

      expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
        contract: mockContract,
        method: mockAbiFunction,
        params: ['0x123456789', BigInt('1000000000000000000')]
      });
      expect(result).toEqual({
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction
      });
    });
  });

  describe('getContract', () => {
    it('should get a contract instance with minimal parameters', () => {
      const mockResult = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        chain: mockChain
      };

      (thirdweb.getContract as jest.Mock).mockReturnValue(mockResult);

      const params = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        chain: mockChain
      };

      const result = getContract(params);

      expect(thirdweb.getContract).toHaveBeenCalledWith({
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        chain: mockChain
      });
      expect(result).toEqual(mockResult);
    });

    it('should get a contract instance with ABI', () => {
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

      const mockResult = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        abi: mockAbi,
        chain: mockChain
      };

      (thirdweb.getContract as jest.Mock).mockReturnValue(mockResult);

      const params = {
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        abi: mockAbi,
        chain: mockChain
      };

      const result = getContract(params);

      expect(thirdweb.getContract).toHaveBeenCalledWith({
        client: mockClient,
        address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        abi: mockAbi,
        chain: mockChain
      });
      expect(result).toEqual(mockResult);
    });
  });
});
