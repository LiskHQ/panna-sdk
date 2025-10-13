import { render, screen, fireEvent } from '@testing-library/react';
import { useDialog } from '@/hooks/use-dialog';
import { Dialog } from '../ui/dialog';
import {
  DialogStepperContextValue,
  useDialogStepper
} from '../ui/dialog-stepper';
import { AuthFlow } from './auth-flow';

jest.mock('@/hooks/use-dialog');
jest.mock('../ui/dialog-stepper', () => ({
  ...jest.requireActual('../ui/dialog-stepper'),
  useDialogStepper: jest.fn()
}));
jest.mock('./login-form', () => ({
  LoginForm: ({ next, onClose }: { next: () => void; onClose: () => void }) => (
    <div data-testid="login-form">
      <button onClick={next}>Next</button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));
jest.mock('./input-otp-form', () => ({
  InputOTPForm: ({
    reset,
    onClose
  }: {
    reset: () => void;
    onClose: () => void;
  }) => (
    <div data-testid="otp-form">
      <button onClick={reset}>Reset</button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

const mockUseDialog = useDialog as jest.MockedFunction<typeof useDialog>;
const mockUseDialogStepper = useDialogStepper as jest.MockedFunction<
  typeof useDialogStepper
>;

describe('AuthFlow', () => {
  const mockNext = jest.fn();
  const mockPrev = jest.fn();
  const mockReset = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockUseDialog.mockReturnValue({
      isOpen: true,
      onOpen: jest.fn(),
      onClose: mockOnClose,
      setIsOpen: jest.fn()
    });
    mockUseDialogStepper.mockReturnValue({
      next: mockNext,
      prev: mockPrev,
      reset: mockReset,
      stepData: {},
      goToStep: jest.fn(),
      currentStep: 0,
      lastStep: 1,
      canGoBack: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <Dialog open>
        <AuthFlow />
      </Dialog>
    );
    expect(screen.getByText('Welcome to Connectify')).toBeInTheDocument();
  });

  it('renders with custom dialog props', () => {
    const connectDialog = {
      title: 'Custom Title',
      description: 'Custom Description'
    };

    render(
      <Dialog open>
        <AuthFlow connectDialog={connectDialog} />
      </Dialog>
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('calls next function when next button is clicked in login form', () => {
    render(
      <Dialog open>
        <AuthFlow />
      </Dialog>
    );
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked in login form', () => {
    render(
      <Dialog open>
        <AuthFlow />
      </Dialog>
    );
    const closeButton = screen.getAllByText('Close')[0];
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it.skip('calls prev function when back button is clicked in OTP form', () => {
    render(
      <Dialog open>
        <AuthFlow />
      </Dialog>
    );
    const backButton = screen.getByRole('button', { name: /chevronleft/i });
    fireEvent.click(backButton);
    expect(mockPrev).toHaveBeenCalledTimes(1);
  });

  it.skip('calls reset and onClose when X button is clicked in OTP form', () => {
    render(
      <Dialog open>
        <AuthFlow />
      </Dialog>
    );
    const xButton = screen.getByRole('button', { name: /x/i });
    fireEvent.click(xButton);
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders "Powered by Panna" footer', () => {
    render(
      <Dialog open>
        <AuthFlow />
      </Dialog>
    );
    expect(screen.getByText('Powered by Panna')).toBeInTheDocument();
  });
});
