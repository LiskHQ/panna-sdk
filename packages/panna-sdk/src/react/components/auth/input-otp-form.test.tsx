import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { PannaClient, prepareLogin } from 'src/core';
import { ecosystemWallet } from 'thirdweb/wallets';
import { useLogin, usePanna } from '@/hooks';
import { useCountdown } from '@/hooks/use-countdown';
import { InputOTPForm } from './input-otp-form';

jest.mock('thirdweb/wallets');
jest.mock('@/hooks');
jest.mock('@/hooks/use-countdown');
jest.mock('src/core', () => ({
  ...jest.requireActual('src/core'),
  prepareLogin: jest.fn()
}));

const defaultProps = {
  data: { email: 'test@example.com' },
  reset: jest.fn(),
  onClose: jest.fn()
};

const mockPannaClient = { clientId: 'test-client-id' } as PannaClient;
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
      client: mockPannaClient,
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

  it('enables submit button when code is complete', () => {
    render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    act(() => {
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
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(prepareLogin as jest.Mock).toHaveBeenCalledWith({
        client: mockPannaClient,
        ecosystem: {
          id: 'ecosystem.lisk',
          partnerId: 'test-partner'
        },
        strategy: 'email',
        email: 'test@example.com'
      });
      expect(resetResendTimer).toHaveBeenCalled();
    });
  });

  it('handles resend functionality for phone', () => {
    const resetResendTimer = jest.fn();
    (useCountdown as jest.Mock).mockReturnValue([0, resetResendTimer]);

    const props = {
      ...defaultProps,
      data: { phoneNumber: '+1234567890' }
    };

    render(<InputOTPForm {...props} />);

    const resendButton = screen.getByRole('button', { name: 'Resend' });
    fireEvent.click(resendButton);

    expect(prepareLogin as jest.Mock).toHaveBeenCalledWith({
      client: mockPannaClient,
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
    (ecosystemWallet as jest.Mock).mockReturnValue(mockEcoWallet);

    render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockEcoWallet.connect).toHaveBeenCalledWith({
        client: mockPannaClient,
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
    (ecosystemWallet as jest.Mock).mockReturnValue(mockEcoWallet);

    const props = {
      ...defaultProps,
      data: { phoneNumber: '+1234567890' }
    };

    render(<InputOTPForm {...props} />);

    const otpInput = screen.getByTestId('login-code-input');
    act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockEcoWallet.connect).toHaveBeenCalledWith({
        client: mockPannaClient,
        strategy: 'phone',
        phoneNumber: '+1234567890',
        verificationCode: '123456'
      });
    });
  });

  it('displays error message on invalid OTP', async () => {
    const connectError = new Error('Invalid code');
    const mockEcoWallet = {
      connect: jest.fn().mockRejectedValue(connectError)
    };

    // Create a mutable state object that useLogin will reference
    const mockLoginState = { error: null as Error | null };

    // Make useLogin return a getter that references the mutable state
    (useLogin as jest.Mock).mockImplementation(() => ({
      connect: mockConnect,
      get error() {
        return mockLoginState.error;
      },
      isConnecting: false
    }));

    // Mock connect to throw error and update the state
    mockConnect.mockImplementation(async (callback) => {
      try {
        await callback(); // This will throw from mockEcoWallet.connect
      } catch (error) {
        console.log('Caught error in mockConnect:', error);
        // Update the mutable state to simulate what useConnect does
        mockLoginState.error = connectError;
        // Don't rethrow - let the component handle it
      }
    });

    (ecosystemWallet as jest.Mock).mockReturnValue(mockEcoWallet);

    const { rerender } = render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    fireEvent.click(submitButton);

    // Wait for the connection attempt
    await waitFor(() => {
      expect(mockEcoWallet.connect).toHaveBeenCalled();
    });

    // Trigger a rerender to pick up the error state change
    rerender(<InputOTPForm {...defaultProps} />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText('Invalid verification code.')
      ).toBeInTheDocument();
    });
  });

  it('shows loading spinner during submission', () => {
    let resolveConnect: () => void;
    const connectPromise = new Promise<void>((resolve) => {
      resolveConnect = resolve;
    });

    mockConnect.mockReturnValue(connectPromise);

    render(<InputOTPForm {...defaultProps} />);

    const otpInput = screen.getByTestId('login-code-input');
    act(() => {
      fireEvent.change(otpInput, { target: { value: '123456' } });
    });

    const submitButton = screen.getByRole('button', { name: 'Verify' });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

    resolveConnect!();
  });
});
