import { DialogProps } from '@radix-ui/react-dialog';
import { render, screen, fireEvent } from '@testing-library/react';
import { useDialog } from '@/hooks/use-dialog';
import { LoginButton } from './login-button';

jest.mock('@/hooks/use-dialog', () => ({
  useDialog: jest.fn()
}));

jest.mock('../ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: DialogProps) => (
    <div
      data-testid="dialog"
      data-open={open}
      onClick={() => onOpenChange?.(!open)}
    >
      {children}
    </div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  )
}));

jest.mock('./auth-flow', () => ({
  AuthFlow: () => <div data-testid="auth-flow">Auth Flow</div>
}));

describe('LoginButton', () => {
  const mockSetIsOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDialog as jest.Mock).mockReturnValue({
      isOpen: false,
      setIsOpen: mockSetIsOpen
    });
  });

  it('renders with default title when no connectButton title provided', () => {
    render(<LoginButton connectButton={{}} connectDialog={{}} />);

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('renders with custom title when connectButton title provided', () => {
    const connectButton = { title: 'Custom Connect' };
    render(<LoginButton connectButton={connectButton} connectDialog={{}} />);

    expect(screen.getByText('Custom Connect')).toBeInTheDocument();
  });

  it('passes dialog state to Dialog component', () => {
    (useDialog as jest.Mock).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen
    });

    render(<LoginButton connectButton={{}} connectDialog={{}} />);

    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
  });

  it('renders AuthFlow component with connectDialog props', () => {
    const connectDialog = { title: 'dark' };
    render(<LoginButton connectButton={{}} connectDialog={connectDialog} />);

    expect(screen.getByTestId('auth-flow')).toBeInTheDocument();
  });

  it('handles dialog open/close state changes', () => {
    render(<LoginButton connectButton={{}} connectDialog={{}} />);

    fireEvent.click(screen.getByTestId('dialog'));

    expect(mockSetIsOpen).toHaveBeenCalled();
  });
});
