import { render, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { connect, EcosystemId } from 'src/core';
import { useDialog, useLogin, usePanna } from '@/hooks';
import { handleSiweAuth } from '@/utils/auth';
import { createDialogWrapper } from '@/utils/test-utils';
import { useDialogStepper } from '../ui/dialog-stepper';
import WalletConfirmationDialog from './wallet-confirmation-dialog';

jest.mock('react-toastify');
jest.mock('src/core', () => ({
  ...jest.requireActual('src/core'),
  EcosystemId: { LISK: 'lisk' },
  connect: jest.fn()
}));
jest.mock('@/utils/auth');
jest.mock('@/hooks');
jest.mock('../ui/dialog-stepper');

describe('WalletConfirmationDialog', () => {
  const mockClient = { clientId: 'test-client' };
  const mockPartnerId = 'test-partner-id';
  const mockChainId = '4202';
  const mockOnClose = jest.fn();
  const mockNext = jest.fn();
  const mockPrev = jest.fn();
  const mockStepData = {
    wallet: { id: 'metamask', name: 'MetaMask', rdns: 'io.metamask' }
  };
  const mockReset = jest.fn();
  const mockConnectWallet = jest.fn();
  const mockSiweAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useDialog as jest.Mock).mockReturnValue({
      onClose: mockOnClose
    });

    (useDialogStepper as jest.Mock).mockReturnValue({
      next: mockNext,
      prev: mockPrev,
      stepData: mockStepData,
      reset: mockReset
    });

    (usePanna as jest.Mock).mockReturnValue({
      client: mockClient,
      partnerId: mockPartnerId,
      chainId: mockChainId,
      siweAuth: mockSiweAuth
    });

    (useLogin as jest.Mock).mockReturnValue({
      connect: mockConnectWallet,
      error: null
    });

    mockConnectWallet.mockImplementation(async (fn) => await fn());
  });

  describe('Wallet Selection', () => {
    it('should connect with MetaMask when selected', async () => {
      const mockWallet = { address: '0x123' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(connect).toHaveBeenCalledWith({
          client: mockClient,
          ecosystem: {
            id: EcosystemId.LISK,
            partnerId: mockPartnerId
          },
          strategy: 'wallet',
          walletId: 'io.metamask',
          chain: expect.objectContaining({ id: 4202 })
        });
      });

      expect(handleSiweAuth).toHaveBeenCalledWith(mockSiweAuth, mockWallet, {
        chainId: Number(mockChainId)
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should connect with Coinbase Wallet when selected', async () => {
      (useDialogStepper as jest.Mock).mockReturnValue({
        next: mockNext,
        prev: mockPrev,
        stepData: {
          wallet: {
            id: 'coinbase-wallet',
            name: 'Coinbase Wallet',
            rdns: 'com.coinbase.wallet'
          }
        },
        reset: mockReset
      });

      const mockWallet = { address: '0x456' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(connect).toHaveBeenCalledWith({
          client: mockClient,
          ecosystem: {
            id: EcosystemId.LISK,
            partnerId: mockPartnerId
          },
          strategy: 'wallet',
          walletId: 'com.coinbase.wallet',
          chain: expect.objectContaining({ id: 4202 })
        });
      });

      expect(handleSiweAuth).toHaveBeenCalledWith(mockSiweAuth, mockWallet, {
        chainId: Number(mockChainId)
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call connectWallet wrapper during connection', async () => {
      const mockWallet = { address: '0xabc' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(mockConnectWallet).toHaveBeenCalled();
      });
    });

    it('should not call next if wallet connection returns null', async () => {
      mockConnectWallet.mockResolvedValue(null);

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(mockConnectWallet).toHaveBeenCalled();
      });

      expect(handleSiweAuth).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should show error toast when wallet connection fails', async () => {
      const errorMessage = 'Wallet not installed';
      (connect as jest.Mock).mockRejectedValue(new Error(errorMessage));

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle string errors', async () => {
      const errorMessage = 'Connection failed';
      (connect as jest.Mock).mockRejectedValue(errorMessage);

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should display error from useLogin hook', () => {
      const loginError = new Error('Login hook error');
      (useLogin as jest.Mock).mockReturnValue({
        connect: mockConnectWallet,
        error: loginError
      });

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      expect(toast.error).toHaveBeenCalledWith('Login hook error');
    });
  });

  describe('SIWE Authentication', () => {
    it('should perform SIWE authentication after successful wallet connection', async () => {
      const mockWallet = { address: '0xdef' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(handleSiweAuth).toHaveBeenCalledWith(mockSiweAuth, mockWallet, {
          chainId: 4202
        });
      });
    });

    it('should pass correct chainId to SIWE auth', async () => {
      const customChainId = '1';
      (usePanna as jest.Mock).mockReturnValue({
        client: mockClient,
        partnerId: mockPartnerId,
        chainId: customChainId,
        siweAuth: mockSiweAuth
      });

      const mockWallet = { address: '0xghi' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<WalletConfirmationDialog />, { wrapper: createDialogWrapper() });

      await waitFor(() => {
        expect(handleSiweAuth).toHaveBeenCalledWith(mockSiweAuth, mockWallet, {
          chainId: 1
        });
      });
    });
  });
});
