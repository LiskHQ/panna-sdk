import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';

jest.mock('@/hooks/use-panna', () => ({
  usePanna: () => ({
    client: {},
    partnerId: 'test-partner'
  })
}));
jest.mock('@/hooks', () => ({
  useLogin: () => ({
    connect: jest.fn().mockResolvedValue({
      getAccount: () => ({ address: '0x123' })
    })
  })
}));
jest.mock('src/core', () => ({
  EcosystemId: { LISK: 'lisk' },
  LoginStrategy: { EMAIL: 'email', PHONE: 'phone' },
  prepareLogin: jest.fn(),
  lisk: {},
  liskSepolia: {}
}));
jest.mock('thirdweb/wallets', () => ({
  ecosystemWallet: jest.fn(() => ({
    connect: jest.fn(),
    getAccount: jest.fn(() => ({ address: '0x123' }))
  }))
}));
jest.mock('../../utils', () => ({
  getEnvironmentChain: jest.fn(() => ({ id: 4202 })),
  handleSiweAuth: jest.fn().mockResolvedValue(true),
  cn: jest.fn()
}));

describe('LoginForm', () => {
  const nextMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders Google login button', () => {
    render(<LoginForm next={nextMock} />);
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
  });

  it('renders email and phone input fields', () => {
    render(<LoginForm next={nextMock} />);
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Phone number/i)).toBeInTheDocument();
  });

  it('submits with valid email only', async () => {
    render(<LoginForm next={nextMock} />);
    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByTestId('email-submit-button'));
    await waitFor(() => {
      expect(nextMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error for invalid email', async () => {
    render(<LoginForm next={nextMock} />);
    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: 'invalid' }
    });
    fireEvent.click(screen.getByTestId('email-submit-button'));
    await waitFor(() => {
      expect(
        screen.getByText(/This is not a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it('submits with valid phone only', async () => {
    render(<LoginForm next={nextMock} />);
    fireEvent.change(screen.getByPlaceholderText(/Phone number/i), {
      target: { value: '+12345678901' }
    });
    fireEvent.click(screen.getByTestId('phone-submit-button'));
    await waitFor(() => {
      expect(nextMock).toHaveBeenCalledWith({ phoneNumber: '+12345678901' });
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error for invalid phone', async () => {
    render(<LoginForm next={nextMock} />);
    fireEvent.change(screen.getByPlaceholderText(/Phone number/i), {
      target: { value: '123' }
    });
    fireEvent.click(screen.getByTestId('phone-submit-button'));
    await waitFor(() => {
      expect(
        screen.getByText(/Phone number must be at least 10 digits/i)
      ).toBeInTheDocument();
    });
  });

  it('calls onClose after successful Google login', async () => {
    render(<LoginForm next={nextMock} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText(/Continue with Google/i));
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
