import { fireEvent, render, screen } from '@testing-library/react';
import { useDialog } from '@/hooks';
import { createDialogWrapper } from '@/utils/test-utils';
import { useDialogStepper } from '../ui/dialog-stepper';
import ChooseWalletDialog from './choose-wallet-dialog';

jest.mock('@/hooks');
jest.mock('../ui/dialog-stepper');

describe('ChooseWalletDialog', () => {
  const mockOnClose = jest.fn();
  const mockNext = jest.fn();
  const mockPrev = jest.fn();
  const mockReset = jest.fn();

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

    it('should call next step on wallet selection', () => {
      render(<ChooseWalletDialog />, { wrapper: createDialogWrapper() });

      const metamaskOption = screen.getByText('MetaMask');
      fireEvent.click(metamaskOption);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith({
        wallet: expect.objectContaining({
          id: 'metamask',
          name: 'MetaMask'
        })
      });
    });
  });
});
