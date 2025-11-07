import { fireEvent, render, screen } from '@testing-library/react';
import { useDialog } from '@/hooks';
import { createDialogWrapper } from '@/utils/test-utils';
import { useDialogStepper } from '../ui/dialog-stepper';
import { LinkWalletSuccessStep } from './link-wallet-success-step';

jest.mock('@/hooks');
jest.mock('../ui/dialog-stepper');

describe('LinkWalletSuccessStep', () => {
  const mockOnClose = jest.fn();
  const mockReset = jest.fn();
  const mockGoToStep = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useDialog as jest.Mock).mockReturnValue({
      onClose: mockOnClose
    });

    (useDialogStepper as jest.Mock).mockReturnValue({
      reset: mockReset,
      goToStep: mockGoToStep
    });
  });

  describe('Rendering', () => {
    it('should render properly', () => {
      render(<LinkWalletSuccessStep />, { wrapper: createDialogWrapper() });

      expect(
        screen.getByText('Secure your account', { selector: 'h4' })
      ).toBeVisible();
      expect(
        screen.getByText(/Link another account for added protection/i)
      ).toBeVisible();
      expect(
        screen.getByText(/make sure you can always get back into your account/i)
      ).toBeVisible();
      const linkButton = screen.getByRole('button', {
        name: /link another account/i
      });
      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(linkButton).toBeVisible();
      expect(continueButton).toBeVisible();
    });

    it('should navigate to step 0 when "Link another account" is clicked', async () => {
      render(<LinkWalletSuccessStep />, { wrapper: createDialogWrapper() });

      const linkButton = screen.getByRole('button', {
        name: /link another account/i
      });
      await fireEvent.click(linkButton);

      expect(mockGoToStep).toHaveBeenCalledWith(0);
      expect(mockReset).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should reset and close dialog when "Continue" is clicked', async () => {
      render(<LinkWalletSuccessStep />, { wrapper: createDialogWrapper() });

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await fireEvent.click(continueButton);

      expect(mockReset).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockGoToStep).not.toHaveBeenCalled();
    });
  });
});
