import { render, screen, fireEvent } from '@testing-library/react';
import { useDialog } from '@/hooks/use-dialog';
import { Dialog } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { SocialLoginErrorDialog } from './social-login-error-dialog';

jest.mock('@/hooks/use-dialog', () => ({
  useDialog: jest.fn()
}));

jest.mock('../ui/dialog-stepper', () => ({
  useDialogStepper: jest.fn()
}));

describe('SocialLoginErrorDialog', () => {
  beforeEach(() => {
    (useDialog as jest.Mock).mockReturnValue({
      onClose: jest.fn()
    });

    (useDialogStepper as jest.Mock).mockReturnValue({
      next: jest.fn(),
      goToStep: jest.fn(),
      reset: jest.fn()
    });
  });

  it('renders with default error message', () => {
    render(
      <Dialog open>
        <SocialLoginErrorDialog />
      </Dialog>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Login window closed')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('renders with custom error message from stepData', () => {
    (useDialogStepper as jest.Mock).mockReturnValue({
      goToStep: jest.fn(),
      prev: jest.fn(),
      reset: jest.fn(),
      stepData: { error: 'Custom error message' }
    });

    render(
      <Dialog open>
        <SocialLoginErrorDialog />
      </Dialog>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('calls goToStep(0) when back chevron is clicked', () => {
    const mockGoToStep = jest.fn();

    (useDialogStepper as jest.Mock).mockReturnValue({
      goToStep: mockGoToStep,
      prev: jest.fn(),
      reset: jest.fn(),
      stepData: null
    });

    render(
      <Dialog open>
        <SocialLoginErrorDialog />
      </Dialog>
    );

    const chevronIcon = screen.getByTestId('back-icon');
    fireEvent.click(chevronIcon);

    expect(mockGoToStep).toHaveBeenCalledWith(0);
  });

  it('calls prev() when Try again button is clicked', () => {
    const mockPrev = jest.fn();

    (useDialogStepper as jest.Mock).mockReturnValue({
      goToStep: jest.fn(),
      prev: mockPrev,
      reset: jest.fn(),
      stepData: null
    });

    render(
      <Dialog open>
        <SocialLoginErrorDialog />
      </Dialog>
    );

    const tryAgainButton = screen.getByText('Try again');
    fireEvent.click(tryAgainButton);

    expect(mockPrev).toHaveBeenCalled();
  });

  it('calls onClose and reset when close icon is clicked', () => {
    const mockOnClose = jest.fn();
    const mockReset = jest.fn();

    (useDialog as jest.Mock).mockReturnValue({
      onClose: mockOnClose
    });

    (useDialogStepper as jest.Mock).mockReturnValue({
      goToStep: jest.fn(),
      prev: jest.fn(),
      reset: mockReset,
      stepData: null
    });

    render(
      <Dialog open>
        <SocialLoginErrorDialog />
      </Dialog>
    );

    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.click(closeIcon);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
  });

  it('renders AccountDialogFooter component', () => {
    render(
      <Dialog open>
        <SocialLoginErrorDialog />
      </Dialog>
    );

    expect(screen.getByText('Powered by Panna')).toBeInTheDocument();
  });
});
