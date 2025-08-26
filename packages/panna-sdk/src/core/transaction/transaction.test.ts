import * as thirdweb from 'thirdweb';
import type { Chain } from '../chains/types';
import type { PannaClient } from '../client';
import {
  prepareTransaction,
  prepareContractCall,
  getContract,
  sendTransaction
} from './transaction';
import * as transaction from './transaction';

// Mock thirdweb module
jest.mock('thirdweb', () => ({
  prepareTransaction: jest.fn(),
  prepareContractCall: jest.fn(),
  getContract: jest.fn(),
  sendTransaction: jest.fn()
}));
jest.mock('./transaction', () => jest.requireActual('./transaction'));

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
      jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

      const params = {
        ...mockContract,
        method: 'function transfer(address to, uint256 amount)',
        params: ['0x123456789', BigInt('1000000000000000000')]
      };

      const result = prepareContractCall(params);

      expect(transaction.getContract).toHaveBeenCalledTimes(1);
      expect(transaction.getContract).toHaveBeenCalledWith({ ...mockContract });
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
      jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

      const params = {
        ...mockContract,
        method: 'function mint(address to)',
        params: ['0x123456789'],
        value: BigInt('100000000000000000')
      };

      const result = prepareContractCall(params);

      expect(transaction.getContract).toHaveBeenCalledTimes(1);
      expect(transaction.getContract).toHaveBeenCalledWith({ ...mockContract });
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
      jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

      const params = {
        ...mockContract,
        method: 'function totalSupply()'
      };

      const result = prepareContractCall(params);

      expect(transaction.getContract).toHaveBeenCalledTimes(1);
      expect(transaction.getContract).toHaveBeenCalledWith({ ...mockContract });
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
      jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

      const params = {
        ...mockContract,
        method: mockAbiFunction,
        params: ['0x123456789', BigInt('1000000000000000000')]
      };

      const result = prepareContractCall(params);

      expect(transaction.getContract).toHaveBeenCalledTimes(1);
      expect(transaction.getContract).toHaveBeenCalledWith({ ...mockContract });
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

    describe('negative scenarios', () => {
      it('should throw error when contract does not contain the provided method', () => {
        const mockError = new Error(
          'Contract does not contain method: nonExistentFunction'
        );
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: 'function nonExistentFunction()',
          params: []
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Contract does not contain method: nonExistentFunction'
        );

        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: 'function nonExistentFunction()',
          params: []
        });
      });

      it('should throw error when method signature is malformed', () => {
        const mockError = new Error('Invalid method signature: malformed');
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: 'malformed method signature',
          params: []
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Invalid method signature: malformed'
        );
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: 'malformed method signature',
          params: []
        });
      });

      it('should throw error when too few parameters are provided', () => {
        const mockError = new Error('Expected 2 parameters but got 1');
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: 'function transfer(address to, uint256 amount)',
          params: ['0x123456789'] // Missing amount parameter
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Expected 2 parameters but got 1'
        );
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: 'function transfer(address to, uint256 amount)',
          params: ['0x123456789']
        });
      });

      it('should throw error when too many parameters are provided', () => {
        const mockError = new Error('Expected 2 parameters but got 3');
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: 'function transfer(address to, uint256 amount)',
          params: ['0x123456789', BigInt('1000000000000000000'), 'extraParam']
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Expected 2 parameters but got 3'
        );
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: 'function transfer(address to, uint256 amount)',
          params: ['0x123456789', BigInt('1000000000000000000'), 'extraParam']
        });
      });

      it('should throw error when parameter types do not match method signature', () => {
        const mockError = new Error(
          'Parameter type mismatch: expected uint256 but got string'
        );
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: 'function transfer(address to, uint256 amount)',
          params: ['0x123456789', 'invalidAmount'] // Should be BigInt, not string
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Parameter type mismatch: expected uint256 but got string'
        );
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: 'function transfer(address to, uint256 amount)',
          params: ['0x123456789', 'invalidAmount']
        });
      });

      it('should throw error for empty method name', () => {
        const mockError = new Error('Method cannot be empty');
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: '',
          params: []
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Method cannot be empty'
        );
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: '',
          params: []
        });
      });

      it('should throw error when method is undefined', () => {
        const mockError = new Error('Method is required');
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: undefined as unknown as string,
          params: []
        };

        expect(() => prepareContractCall(params)).toThrow('Method is required');
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: undefined,
          params: []
        });
      });

      it('should throw error for ABI function object with non-existent function', () => {
        const nonExistentAbiFunction = {
          type: 'function',
          name: 'nonExistentFunction',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable'
        };

        const mockError = new Error(
          'Function nonExistentFunction not found in contract ABI'
        );
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: nonExistentAbiFunction,
          params: []
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Function nonExistentFunction not found in contract ABI'
        );
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: nonExistentAbiFunction,
          params: []
        });
      });

      it('should throw error when ABI function requires parameters but none provided', () => {
        const transferAbiFunction = {
          type: 'function',
          name: 'transfer',
          inputs: [
            { type: 'address', name: 'to' },
            { type: 'uint256', name: 'amount' }
          ],
          outputs: [],
          stateMutability: 'nonpayable'
        };

        const mockError = new Error(
          'Function transfer requires 2 parameters but 0 provided'
        );
        (thirdweb.prepareContractCall as jest.Mock).mockImplementation(() => {
          throw mockError;
        });
        jest.spyOn(transaction, 'getContract').mockReturnValue(mockContract);

        const params = {
          ...mockContract,
          method: transferAbiFunction,
          params: [] // Should have 2 parameters
        };

        expect(() => prepareContractCall(params)).toThrow(
          'Function transfer requires 2 parameters but 0 provided'
        );
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledWith({
          contract: mockContract,
          method: transferAbiFunction,
          params: []
        });
      });

      it('should throw error when getContract invocation fails', () => {
        jest.spyOn(transaction, 'getContract').mockImplementation(() => {
          throw new Error('Invalid input');
        });

        const params = {
          ...mockContract,
          address: '0xinvalidAddress' as `0x${string}`,
          method: 'function transfer(address to, uint256 amount)',
          params: ['0x123456789', BigInt('1000000000000000000')]
        };

        expect(() => prepareContractCall(params)).toThrow('Invalid input');
        expect(transaction.getContract).toHaveBeenCalledTimes(1);
        expect(transaction.getContract).toHaveBeenCalledWith({
          ...mockContract,
          address: params.address
        });
        expect(thirdweb.prepareContractCall).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('sendTransaction', () => {
    const mockAccount = {
      address: '0x123456789abcdef123456789abcdef123456789ab' as `0x${string}`,
      signTransaction: jest.fn(),
      signMessage: jest.fn(),
      sendTransaction: jest.fn(),
      signTypedData: jest.fn()
    };

    const mockPreparedTransaction = {
      client: mockClient,
      chain: mockChain,
      to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
      value: BigInt('1000000000000000000')
    };

    it('should send a prepared transaction successfully', async () => {
      const mockTransactionHash =
        '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef12' as `0x${string}`;
      const mockResult = {
        transactionHash: mockTransactionHash
      };

      (thirdweb.sendTransaction as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        account: mockAccount,
        transaction: mockPreparedTransaction
      };

      const result = await sendTransaction(params);

      expect(thirdweb.sendTransaction).toHaveBeenCalledWith({
        account: mockAccount,
        transaction: mockPreparedTransaction
      });
      expect(result).toEqual(mockResult);
    });

    it('should send a prepared contract call transaction successfully', async () => {
      const mockDataFunction = jest.fn().mockResolvedValue('0xa9059cbb');
      const mockPreparedContractCall = {
        client: mockClient,
        chain: mockChain,
        to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e' as `0x${string}`,
        data: mockDataFunction,
        value: BigInt('100000000000000000')
      };

      const mockTransactionHash =
        '0xdef123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234' as `0x${string}`;
      const mockResult = {
        transactionHash: mockTransactionHash
      };

      (thirdweb.sendTransaction as jest.Mock).mockResolvedValue(mockResult);

      const params = {
        account: mockAccount,
        transaction: mockPreparedContractCall
      };

      const result = await sendTransaction(params);

      expect(thirdweb.sendTransaction).toHaveBeenCalledWith({
        account: mockAccount,
        transaction: mockPreparedContractCall
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw error with context when thirdweb sendTransaction fails', async () => {
      const mockError = new Error('insufficient funds for gas * price + value');
      (thirdweb.sendTransaction as jest.Mock).mockRejectedValue(mockError);

      const params = {
        account: mockAccount,
        transaction: mockPreparedTransaction
      };

      await expect(sendTransaction(params)).rejects.toThrow(
        'Failed to send transaction: insufficient funds for gas * price + value'
      );

      expect(thirdweb.sendTransaction).toHaveBeenCalledWith({
        account: mockAccount,
        transaction: mockPreparedTransaction
      });
    });

    it('should throw error with context when thirdweb sendTransaction fails with unknown error', async () => {
      const mockError = 'Unknown error object';
      (thirdweb.sendTransaction as jest.Mock).mockRejectedValue(mockError);

      const params = {
        account: mockAccount,
        transaction: mockPreparedTransaction
      };

      await expect(sendTransaction(params)).rejects.toThrow(
        'Failed to send transaction: Unknown error'
      );

      expect(thirdweb.sendTransaction).toHaveBeenCalledWith({
        account: mockAccount,
        transaction: mockPreparedTransaction
      });
    });

    it('should handle user rejection error', async () => {
      const mockError = new Error('User rejected the transaction');
      (thirdweb.sendTransaction as jest.Mock).mockRejectedValue(mockError);

      const params = {
        account: mockAccount,
        transaction: mockPreparedTransaction
      };

      await expect(sendTransaction(params)).rejects.toThrow(
        'Failed to send transaction: User rejected the transaction'
      );
    });

    it('should handle network error', async () => {
      const mockError = new Error('Network request failed');
      (thirdweb.sendTransaction as jest.Mock).mockRejectedValue(mockError);

      const params = {
        account: mockAccount,
        transaction: mockPreparedTransaction
      };

      await expect(sendTransaction(params)).rejects.toThrow(
        'Failed to send transaction: Network request failed'
      );
    });
  });
});
