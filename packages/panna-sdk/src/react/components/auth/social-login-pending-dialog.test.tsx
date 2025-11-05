import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useDialog, useLogin, usePanna } from '@/hooks';
import { handleSiweAuth } from '@/utils/auth';
import { getErrorMessage } from '@/utils/get-error-message';
import { Dialog } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { SocialLoginPendingDialog } from './social-login-pending-dialog';

jest.mock('@/hooks');
jest.mock('../ui/dialog-stepper');
jest.mock('@/utils/auth');
jest.mock('@/utils/get-error-message');
jest.mock('thirdweb/wallets');

const mockUseDialog = useDialog as jest.MockedFunction<typeof useDialog>;
const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;
const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;
const mockUseDialogStepper = useDialogStepper as jest.MockedFunction<
  typeof useDialogStepper
>;
const mockHandleSiweAuth = handleSiweAuth as jest.MockedFunction<
  typeof handleSiweAuth
>;
const mockGetErrorMessage = getErrorMessage as jest.MockedFunction<
  typeof getErrorMessage
>;

const mockConnect = jest.fn();
const mockNext = jest.fn();
const mockGoToStep = jest.fn();
const mockReset = jest.fn();
const mockOnClose = jest.fn();

const mockSiweAuth = {
  generatePayload: jest.fn(),
  login: jest.fn(),
  isLoggedIn: jest.fn(),
  isTokenExpired: jest.fn(),
  getUser: jest.fn(),
  getAuthToken: jest.fn(),
  getValidAuthToken: jest.fn(),
  getTokenExpiry: jest.fn(),
  logout: jest.fn()
};

describe('SocialLoginPendingDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (mockUseDialog as jest.Mock).mockReturnValue({
      onClose: mockOnClose
    });

    (mockUsePanna as jest.Mock).mockReturnValue({
      client: 'mock-client',
      partnerId: 'mock-partner-id',
      chainId: 1155,
      apiService: {},
      siweAuth: mockSiweAuth
    });

    (mockUseDialogStepper as jest.Mock).mockReturnValue({
      next: mockNext,
      goToStep: mockGoToStep,
      reset: mockReset
    });

    (mockUseLogin as jest.Mock).mockReturnValue({
      connect: mockConnect,
      error: null
    });

    mockGetErrorMessage.mockReturnValue('Mock error message');
  });

  it('renders the dialog with correct elements', () => {
    render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(
      screen.getByText('Sign into your account in the pop-up')
    ).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('initiates Google login on mount', async () => {
    const mockWallet = { address: '0x123' };
    mockConnect.mockResolvedValue(mockWallet);

    render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  it('handles successful Google login and SIWE auth', async () => {
    const mockWallet = { address: '0x123' };
    mockConnect.mockResolvedValue(mockWallet);
    mockHandleSiweAuth.mockResolvedValue(true);

    render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    await waitFor(() => {
      expect(mockHandleSiweAuth).toHaveBeenCalledWith(
        mockSiweAuth,
        mockWallet,
        {
          chainId: 1135
        }
      );
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles login error', async () => {
    const mockError = new Error('Login failed');
    (mockUseLogin as jest.Mock).mockReturnValue({
      connect: mockConnect,
      error: mockError
    });

    render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    await waitFor(() => {
      expect(mockGetErrorMessage).toHaveBeenCalledWith(mockError);
      expect(mockNext).toHaveBeenCalledWith({ error: 'Mock error message' });
    });
  });

  it('handles close button click', async () => {
    render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    const closeButton = screen.getByTestId('close-icon');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
  });

  it('handles back button click', async () => {
    render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    const backButton = screen.getByTestId('back-icon');
    fireEvent.click(backButton);

    expect(mockGoToStep).toHaveBeenCalledWith(0);
  });

  it('does not reinitialize Google login after first render', async () => {
    const { rerender } = render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    rerender(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('handles wallet connection failure gracefully', async () => {
    mockConnect.mockResolvedValue(null);

    render(
      <Dialog open>
        <SocialLoginPendingDialog />
      </Dialog>
    );

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalled();
    });

    expect(mockHandleSiweAuth).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
