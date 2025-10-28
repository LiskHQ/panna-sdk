/* eslint-disable @typescript-eslint/no-explicit-any */
import { EIP1193 } from 'thirdweb/wallets';
import type { EIP1193Provider } from '../types/external';
import {
  fromEIP1193Provider,
  toEIP1193Provider,
  isEIP1193Provider
} from './eip1193-provider';
import { WalletId } from './wallet-ids';

// Mock thirdweb/wallets
jest.mock('thirdweb/wallets', () => ({
  EIP1193: {
    fromProvider: jest.fn(),
    toProvider: jest.fn()
  }
}));

describe('EIP1193 Provider Extensions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fromEIP1193Provider', () => {
    it('should call EIP1193.fromProvider from thirdweb', () => {
      const mockProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      } as unknown as EIP1193Provider;

      const mockWallet = {
        connect: jest.fn(),
        disconnect: jest.fn()
      };

      (EIP1193.fromProvider as jest.Mock).mockReturnValue(mockWallet);

      const result = fromEIP1193Provider({
        provider: mockProvider,
        walletId: WalletId.MetaMask
      });

      expect(EIP1193.fromProvider).toHaveBeenCalledWith({
        provider: mockProvider,
        walletId: WalletId.MetaMask
      });
      expect(result).toBe(mockWallet);
    });

    it('should pass walletId option to thirdweb fromProvider', () => {
      const mockProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      } as unknown as EIP1193Provider;

      const mockWallet = {
        connect: jest.fn(),
        disconnect: jest.fn()
      };

      (EIP1193.fromProvider as jest.Mock).mockReturnValue(mockWallet);

      fromEIP1193Provider({
        provider: mockProvider,
        walletId: 'io.metamask'
      });

      expect(EIP1193.fromProvider).toHaveBeenCalledWith({
        provider: mockProvider,
        walletId: 'io.metamask'
      });
    });
  });

  describe('toEIP1193Provider', () => {
    it('should call EIP1193.toProvider from thirdweb', () => {
      const mockWallet = {
        id: 'test-wallet',
        connect: jest.fn(),
        disconnect: jest.fn()
      } as any;

      const mockClient = { clientId: 'test-client' } as any;
      const mockChain = {
        id: 1,
        name: 'Ethereum',
        rpc: 'http://localhost:8545'
      } as any;

      const mockProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      } as unknown as EIP1193Provider;

      (EIP1193.toProvider as jest.Mock).mockReturnValue(mockProvider);

      const result = toEIP1193Provider({
        wallet: mockWallet,
        chain: mockChain,
        client: mockClient
      });

      expect(EIP1193.toProvider).toHaveBeenCalledWith({
        wallet: mockWallet,
        chain: mockChain,
        client: mockClient
      });
      expect(result).toBe(mockProvider);
    });

    it('should pass all options to thirdweb toProvider', () => {
      const mockWallet = {
        id: 'test-wallet',
        connect: jest.fn()
      } as any;

      const mockClient = { clientId: 'test-client' } as any;
      const mockChain = {
        id: 1337,
        name: 'Test Chain',
        rpc: 'http://localhost:8545'
      } as any;

      (EIP1193.toProvider as jest.Mock).mockReturnValue({
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      });

      toEIP1193Provider({
        wallet: mockWallet,
        chain: mockChain,
        client: mockClient
      });

      expect(EIP1193.toProvider).toHaveBeenCalledWith({
        wallet: mockWallet,
        chain: mockChain,
        client: mockClient
      });
    });
  });

  describe('isEIP1193Provider', () => {
    it('should return true for valid EIP1193 provider', () => {
      const validProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      };

      expect(isEIP1193Provider(validProvider)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isEIP1193Provider(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isEIP1193Provider(undefined)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isEIP1193Provider('string')).toBe(false);
      expect(isEIP1193Provider(123)).toBe(false);
      expect(isEIP1193Provider(true)).toBe(false);
    });

    it('should return false for object without request method', () => {
      const invalidProvider = {
        on: jest.fn(),
        removeListener: jest.fn()
      };

      expect(isEIP1193Provider(invalidProvider)).toBe(false);
    });

    it('should return false for object with non-function request', () => {
      const invalidProvider = {
        request: 'not a function',
        on: jest.fn(),
        removeListener: jest.fn()
      };

      expect(isEIP1193Provider(invalidProvider)).toBe(false);
    });

    it('should return false for object without on method', () => {
      const invalidProvider = {
        request: jest.fn(),
        removeListener: jest.fn()
      };

      expect(isEIP1193Provider(invalidProvider)).toBe(false);
    });

    it('should return false for object with non-function on', () => {
      const invalidProvider = {
        request: jest.fn(),
        on: 'not a function',
        removeListener: jest.fn()
      };

      expect(isEIP1193Provider(invalidProvider)).toBe(false);
    });

    it('should return false for object without removeListener method', () => {
      const invalidProvider = {
        request: jest.fn(),
        on: jest.fn()
      };

      expect(isEIP1193Provider(invalidProvider)).toBe(false);
    });

    it('should return false for object with non-function removeListener', () => {
      const invalidProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: 'not a function'
      };

      expect(isEIP1193Provider(invalidProvider)).toBe(false);
    });

    it('should return true for provider with additional properties', () => {
      const validProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn(),
        // Additional properties that window.ethereum might have
        isMetaMask: true,
        chainId: '0x1',
        selectedAddress: '0x123...'
      };

      expect(isEIP1193Provider(validProvider)).toBe(true);
    });

    it('should work with window.ethereum-like objects', () => {
      // Mock window.ethereum structure
      const mockEthereum = {
        request: async () => {},
        on: () => {},
        removeListener: () => {},
        isMetaMask: true,
        selectedAddress: null,
        chainId: '0x1'
      };

      expect(isEIP1193Provider(mockEthereum)).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle fromEIP1193Provider and toEIP1193Provider roundtrip', () => {
      const originalProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      } as unknown as EIP1193Provider;

      const mockWallet = {
        id: 'test-wallet',
        connect: jest.fn()
      } as any;

      const mockClient = { clientId: 'test-client' } as any;
      const mockChain = {
        id: 1,
        name: 'Ethereum',
        rpc: 'http://localhost:8545'
      } as any;

      const convertedProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      } as unknown as EIP1193Provider;

      (EIP1193.fromProvider as jest.Mock).mockReturnValue(mockWallet);
      (EIP1193.toProvider as jest.Mock).mockReturnValue(convertedProvider);

      // Convert provider to wallet
      const wallet = fromEIP1193Provider({
        provider: originalProvider,
        walletId: WalletId.MetaMask
      });
      expect(wallet).toBe(mockWallet);

      // Convert wallet back to provider
      const provider = toEIP1193Provider({
        wallet,
        chain: mockChain,
        client: mockClient
      });
      expect(provider).toBe(convertedProvider);

      expect(EIP1193.fromProvider).toHaveBeenCalledTimes(1);
      expect(EIP1193.toProvider).toHaveBeenCalledTimes(1);
    });

    it('should validate provider before conversion', () => {
      const validProvider = {
        request: jest.fn(),
        on: jest.fn(),
        removeListener: jest.fn()
      };

      const mockWallet = {
        connect: jest.fn()
      };

      (EIP1193.fromProvider as jest.Mock).mockReturnValue(mockWallet);

      if (isEIP1193Provider(validProvider)) {
        const wallet = fromEIP1193Provider({
          provider: validProvider,
          walletId: WalletId.MetaMask
        });
        expect(wallet).toBe(mockWallet);
      }

      expect(EIP1193.fromProvider).toHaveBeenCalled();
    });

    it('should not call fromEIP1193Provider for invalid provider', () => {
      const invalidProvider = {
        request: jest.fn()
        // Missing on and removeListener
      };

      if (isEIP1193Provider(invalidProvider)) {
        fromEIP1193Provider({
          provider: invalidProvider as EIP1193Provider,
          walletId: WalletId.MetaMask
        });
      }

      expect(EIP1193.fromProvider).not.toHaveBeenCalled();
    });
  });
});
