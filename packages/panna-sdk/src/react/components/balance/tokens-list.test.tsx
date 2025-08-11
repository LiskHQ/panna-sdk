import { render, screen } from '@testing-library/react';
import { useActiveAccount } from '@/hooks';
import { useTokenBalances } from '../../hooks/use-token-balances';
import { TokensList } from './tokens-list';

jest.mock('../../hooks/use-token-balances');
jest.mock('@/hooks', () => ({
  useActiveAccount: jest.fn()
}));

describe('TokensList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveAccount as jest.Mock).mockReturnValue({ address: '0x123' });
  });

  it('renders loading skeletons when loading', () => {
    (useTokenBalances as jest.Mock).mockReturnValue({
      isLoading: true,
      data: undefined,
      isError: false
    });

    render(<TokensList />);
    expect(screen.getByTestId('token-list-loading')).toBeInTheDocument();
  });

  it('renders error message on error', () => {
    (useTokenBalances as jest.Mock).mockReturnValue({
      isLoading: false,
      data: undefined,
      isError: true
    });

    render(<TokensList />);
    expect(screen.getByText(/error loading tokens/i)).toBeInTheDocument();
  });

  it('renders empty state when no tokens', () => {
    (useTokenBalances as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
      isError: false
    });

    render(<TokensList />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/when you receive digital money/i)
    ).toBeInTheDocument();
  });

  it('renders tokens list when tokens are present', () => {
    (useTokenBalances as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          token: {
            name: 'Bridged USDC',
            symbol: 'USDC.e',
            icon: 'icon-url'
          },
          tokenBalance: {
            displayValue: '123.456789'
          },
          fiatBalance: {
            currency: 'USD',
            amount: 100.12
          }
        }
      ]
    });

    render(<TokensList />);
    expect(screen.getByText('Bridged USDC')).toBeInTheDocument();
    expect(screen.getByText('USDC.e')).toBeInTheDocument();
    expect(screen.getByText('123.456789')).toBeInTheDocument();
    expect(screen.getByText('$100.12')).toBeInTheDocument();
    expect(screen.getByAltText('Bridged USDC')).toHaveAttribute(
      'src',
      'icon-url'
    );
  });

  it('applies className prop to section', () => {
    (useTokenBalances as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [],
      isError: false
    });

    render(<TokensList className="custom-class" />);
    expect(screen.getByText(/nothing here yet/i).parentElement).toHaveClass(
      'custom-class'
    );
  });
});
