import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { connect, EcosystemId } from 'src/core';
import { useDialog, useLogin, usePanna } from '@/hooks';
import { handleSiweAuth } from '@/utils/auth';
import { createDialogWrapper } from '@/utils/test-utils';
import { useDialogStepper } from '../ui/dialog-stepper';
import ChooseWalletDialog from './choose-wallet-dialog';

jest.mock('react-toastify');
jest.mock('src/core', () => ({
  ...jest.requireActual('src/core'),
  EcosystemId: { LISK: 'lisk' },
  connect: jest.fn()
}));
jest.mock('@/utils/auth');
jest.mock('@/hooks');
jest.mock('../ui/dialog-stepper');

describe('ChooseWalletDialog', () => {
  const mockClient = { clientId: 'test-client' };
  const mockPartnerId = 'test-partner-id';
  const mockChainId = '4202';
  const mockOnClose = jest.fn();
  const mockNext = jest.fn();
  const mockPrev = jest.fn();
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

    // Mock connect to return a wallet-like object
    mockConnectWallet.mockImplementation(async (fn) => await fn());
  });

  describe('Rendering', () => {
    it('should render properly', () => {
      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      expect(screen.getByText('Choose Wallet')).toBeInTheDocument();
      expect(screen.getByText('MetaMask')).toBeInTheDocument();
      expect(screen.getByText('Phantom')).toBeInTheDocument();
      expect(screen.getByText('WalletConnect')).toBeInTheDocument();
      expect(screen.getByText('Coinbase Wallet')).toBeInTheDocument();
      expect(screen.getByText('Binance Wallet')).toBeInTheDocument();
    });
  });

  describe('Wallet Selection', () => {
    it('should connect with MetaMask when selected', async () => {
      const mockWallet = { address: '0x123' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskButton = screen.getByText('MetaMask').closest('button');
      await fireEvent.click(metamaskButton!);

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
      const mockWallet = { address: '0x456' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const coinbaseButton = screen
        .getByText('Coinbase Wallet')
        .closest('button');
      await fireEvent.click(coinbaseButton!);

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

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskButton = screen.getByText('MetaMask').closest('button');
      await fireEvent.click(metamaskButton!);

      await waitFor(() => {
        expect(mockConnectWallet).toHaveBeenCalled();
      });
    });

    it('should not call next if wallet connection returns null', async () => {
      mockConnectWallet.mockResolvedValue(null);

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskButton = screen.getByText('MetaMask').closest('button');
      await fireEvent.click(metamaskButton!);

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

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskButton = screen.getByText('MetaMask').closest('button');
      await fireEvent.click(metamaskButton!);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle string errors', async () => {
      const errorMessage = 'Connection failed';
      (connect as jest.Mock).mockRejectedValue(errorMessage);

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskButton = screen.getByText('MetaMask').closest('button');
      await fireEvent.click(metamaskButton!);

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

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      expect(toast.error).toHaveBeenCalledWith('Login hook error');
    });
  });

  describe('SIWE Authentication', () => {
    it('should perform SIWE authentication after successful wallet connection', async () => {
      const mockWallet = { address: '0xdef' };
      (connect as jest.Mock).mockResolvedValue(mockWallet);
      (handleSiweAuth as jest.Mock).mockResolvedValue(true);

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskButton = screen.getByText('MetaMask').closest('button');
      await fireEvent.click(metamaskButton!);

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

      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskButton = screen.getByText('MetaMask').closest('button');
      await fireEvent.click(metamaskButton!);

      await waitFor(() => {
        expect(handleSiweAuth).toHaveBeenCalledWith(mockSiweAuth, mockWallet, {
          chainId: 1
        });
      });
    });
  });
});
