import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { prepareLogin } from 'src/core';
import { ecosystemWallet } from 'thirdweb/wallets';
import { useLogin, usePanna } from '@/hooks';
import { useCountdown } from '@/hooks/use-countdown';
import { InputOTPForm } from './input-otp-form';

// Mock dependencies
jest.mock('thirdweb/wallets');
jest.mock('@/hooks');
jest.mock('@/hooks/use-countdown');
jest.mock('src/core', () => ({
  ...jest.requireActual('src/core'),
  prepareLogin: jest.fn()
}));

// const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;
// const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;
// const mockUseCountdown = useCountdown as jest.MockedFunction<
//   typeof useCountdown
// >;
// const mockPrepareLogin = prepareLogin as jest.MockedFunction<
//   typeof prepareLogin
// >;
// const mockEcosystemWallet = ecosystemWallet as jest.MockedFunction<
//   typeof ecosystemWallet
// >;

const defaultProps = {
  data: { email: 'test@example.com' },
  reset: jest.fn(),
  onClose: jest.fn()
};

const mockConnect = jest.fn();

describe('InputOTPForm', () => {
  beforeAll(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
    document.elementFromPoint = jest.fn().mockReturnValue(null);
  });
  beforeEach(() => {
    jest.clearAllMocks();
    (usePanna as jest.Mock).mockReturnValue({
      client: {} as any,
      partnerId: 'test-partner',
      chainId: '1135'
    });
    (useLogin as jest.Mock).mockReturnValue({
      connect: mockConnect,
      error: null,
      isConnecting: false
    });
    (useCountdown as jest.Mock).mockReturnValue([0, jest.fn()]);
  });

  it('renders OTP input form correctly', () => {
    render(<InputOTPForm {...defaultProps} />);

    expect(
      screen.getByText('Enter the verification code sent to')
    ).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('login-code-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verify' })).toBeInTheDocument();
  });

  it('displays phone number when provided instead of email', () => {
    const props = {
      ...defaultProps,
      data: { phoneNumber: '+1234567890' }
    };

    render(<InputOTPForm {...props} />);

    expect(screen.getByText('+1234567890')).toBeInTheDocument();
  });

  it('displays error from previous step', () => {
    const props = {
      ...defaultProps,
      data: { email: 'test@example.com', error: 'Previous error' }
    };

    render(<InputOTPForm {...props} />);

    expect(screen.getByText('Previous error')).toBeInTheDocument();
  });

  it('disables submit button when code is incomplete', () => {
    render(<InputOTPForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when code is complete', async () => {
    render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    await act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    expect(submitButton).not.toBeDisabled();
  });

  it('shows countdown timer when resend timer is active', () => {
    (useCountdown as jest.Mock).mockReturnValue([30, jest.fn()]);

    render(<InputOTPForm {...defaultProps} />);

    expect(screen.getByText('Resend in 0:30')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Resend' })
    ).not.toBeInTheDocument();
  });

  it('shows resend button when countdown is finished', () => {
    (useCountdown as jest.Mock).mockReturnValue([0, jest.fn()]);

    render(<InputOTPForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Resend' })).toBeInTheDocument();
    expect(screen.queryByText(/Resend in/)).not.toBeInTheDocument();
  });

  it('handles resend functionality for email', async () => {
    const resetResendTimer = jest.fn();
    (useCountdown as jest.Mock).mockReturnValue([0, resetResendTimer]);

    render(<InputOTPForm {...defaultProps} />);

    const resendButton = screen.getByRole('button', { name: 'Resend' });
    await fireEvent.click(resendButton);

    expect(prepareLogin as jest.Mock).toHaveBeenCalledWith({
      client: {},
      ecosystem: {
        id: 'ecosystem.lisk',
        partnerId: 'test-partner'
      },
      strategy: 'email',
      email: 'test@example.com'
    });
    expect(resetResendTimer).toHaveBeenCalled();
  });

  it('handles resend functionality for phone', async () => {
    const resetResendTimer = jest.fn();
    (useCountdown as jest.Mock).mockReturnValue([0, resetResendTimer]);

    const props = {
      ...defaultProps,
      data: { phoneNumber: '+1234567890' }
    };

    render(<InputOTPForm {...props} />);

    const resendButton = screen.getByRole('button', { name: 'Resend' });
    await fireEvent.click(resendButton);

    expect(prepareLogin as jest.Mock).toHaveBeenCalledWith({
      client: {},
      ecosystem: {
        id: 'ecosystem.lisk',
        partnerId: 'test-partner'
      },
      strategy: 'phone',
      phoneNumber: '+1234567890'
    });
  });

  it('successfully submits OTP for email authentication', async () => {
    const mockWallet = {
      getAccount: () => ({ address: '0x123' }),
      connect: jest.fn()
    };
    const mockEcoWallet = {
      connect: jest.fn().mockResolvedValue(undefined)
    };

    mockConnect.mockImplementation(async (callback) => {
      await callback();
      return mockWallet;
    });
    (ecosystemWallet as jest.Mock).mockReturnValue(mockEcoWallet as any);

    render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    await act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockEcoWallet.connect).toHaveBeenCalledWith({
        client: {},
        strategy: 'email',
        email: 'test@example.com',
        verificationCode: '123456'
      });
      expect(defaultProps.reset).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('successfully submits OTP for phone authentication', async () => {
    const mockWallet = {
      getAccount: () => ({ address: '0x123' }),
      connect: jest.fn()
    };
    const mockEcoWallet = {
      connect: jest.fn().mockResolvedValue(undefined)
    };

    mockConnect.mockImplementation(async (callback) => {
      await callback();
      return mockWallet;
    });
    (ecosystemWallet as jest.Mock).mockReturnValue(mockEcoWallet as any);

    const props = {
      ...defaultProps,
      data: { phoneNumber: '+1234567890' }
    };

    render(<InputOTPForm {...props} />);

    const otpInput = screen.getByTestId('login-code-input');
    await act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockEcoWallet.connect).toHaveBeenCalledWith({
        client: {},
        strategy: 'phone',
        phoneNumber: '+1234567890',
        verificationCode: '123456'
      });
    });
  });

  it('displays error message on invalid OTP', async () => {
    const mockEcoWallet = {
      connect: jest.fn().mockRejectedValue(new Error('Invalid code'))
    };

    mockConnect.mockImplementation(async (callback) => {
      await callback();
    });
    (ecosystemWallet as jest.Mock).mockReturnValue(mockEcoWallet as any);

    render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    await act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Invalid verification code.')
      ).toBeInTheDocument();
    });
  });

  it('shows loading spinner during submission', async () => {
    let resolveConnect: () => void;
    const connectPromise = new Promise<void>((resolve) => {
      resolveConnect = resolve;
    });

    mockConnect.mockReturnValue(connectPromise);

    render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    await act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    await fireEvent.click(submitButton);

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

    resolveConnect!();
  });
});
