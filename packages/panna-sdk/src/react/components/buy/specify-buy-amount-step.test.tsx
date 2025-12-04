import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useFiatToCrypto, useSupportedTokens } from '@/hooks';
import { useDialogStepper } from '../ui/dialog-stepper';
import type { BuyFormData } from './schema';
import { SpecifyBuyAmountStep } from './specify-buy-amount-step';

// Mock cn utility used by all UI components
jest.mock('@/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' ')
}));

jest.mock('@/hooks', () => ({
  useFiatToCrypto: jest.fn(),
  useSupportedTokens: jest.fn()
}));

jest.mock('../ui/dialog-stepper', () => ({
  useDialogStepper: jest.fn()
}));

jest.mock('../ui/dialog', () => ({
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>
}));

// Mock form components to avoid cn() dependency issues
jest.mock('../ui/form', () => {
  const { Controller } = jest.requireActual('react-hook-form');
  return {
    FormField: Controller,
    FormItem: ({ children }: { children: ReactNode }) => (
      <div data-testid="form-item">{children}</div>
    ),
    FormControl: ({ children }: { children: ReactNode }) => <>{children}</>,
    FormMessage: () => null
  };
});

// Mock Typography component
jest.mock('../ui/typography', () => ({
  Typography: ({
    children,
    variant
  }: {
    children: ReactNode;
    variant?: string;
  }) => <span data-variant={variant}>{children}</span>
}));

// Mock Button component
jest.mock('../ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    className,
    variant
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: string;
    className?: string;
    variant?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type as 'button' | 'submit' | 'reset' | undefined}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  )
}));

jest.mock('../../utils', () => ({
  getEnvironmentChain: jest.fn(() => 'lisk'),
  getCurrencyForCountry: jest.fn(() => 'USD'),
  getCurrencySymbol: jest.fn(() => '$')
}));

const mockUseFiatToCrypto = useFiatToCrypto as jest.Mock;
const mockUseSupportedTokens = useSupportedTokens as jest.Mock;
const mockUseDialogStepper = useDialogStepper as jest.Mock;

const defaultFormValues: Partial<BuyFormData> = {
  country: { code: 'US', name: 'United States', flag: '🇺🇸' },
  token: {
    address: '0x123',
    symbol: 'USDC',
    name: 'USD Coin'
  }
};

const TestWrapper = ({
  defaultValues,
  onFiatAmountChange
}: {
  defaultValues?: Partial<BuyFormData>;
  onFiatAmountChange?: (value: number | undefined) => void;
}) => {
  const form = useForm<BuyFormData>({
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues
    }
  });

  // Track fiatAmount changes for testing
  const fiatAmount = form.watch('fiatAmount');
  if (onFiatAmountChange) {
    onFiatAmountChange(fiatAmount);
  }

  return <SpecifyBuyAmountStep form={form} />;
};

const renderComponent = (options?: {
  defaultValues?: Partial<BuyFormData>;
  onFiatAmountChange?: (value: number | undefined) => void;
}) => render(<TestWrapper {...options} />);

describe('SpecifyBuyAmountStep', () => {
  const user = userEvent.setup();
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSupportedTokens.mockReturnValue({
      data: [{ address: '0x123', symbol: 'USDC', name: 'USD Coin' }]
    });
    mockUseFiatToCrypto.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false
    });
    mockUseDialogStepper.mockReturnValue({
      next: mockNext,
      prev: jest.fn(),
      reset: jest.fn()
    });
  });

  it('renders with token symbol in title', () => {
    renderComponent();
    expect(screen.getByText('Buy USDC')).toBeInTheDocument();
  });

  it('renders currency symbol', () => {
    renderComponent();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders preset amount buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: '$25' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$50' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$100' })).toBeInTheDocument();
  });

  describe('decimal input handling', () => {
    it('allows typing trailing decimal (e.g., "25.")', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, '25.');

      expect(input).toHaveValue('25.');
    });

    it('allows typing leading decimal (e.g., ".5")', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, '.5');

      expect(input).toHaveValue('.5');
    });

    it('allows typing leading zeros (e.g., "00025")', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, '00025');

      expect(input).toHaveValue('00025');
    });

    it('preserves form value when typing lone decimal point', async () => {
      let lastFiatAmount: number | undefined;
      renderComponent({
        defaultValues: { fiatAmount: 50 },
        onFiatAmountChange: (value) => {
          lastFiatAmount = value;
        }
      });
      const input = screen.getByRole('textbox');

      // Clear the input and type just a decimal point
      await user.clear(input);
      await user.type(input, '.');

      // Display should show "." but form value should be undefined (cleared)
      expect(input).toHaveValue('.');
      expect(lastFiatAmount).toBeUndefined();
    });

    it('updates form value when completing decimal input (e.g., ".5" -> 0.5)', async () => {
      let lastFiatAmount: number | undefined;
      renderComponent({
        onFiatAmountChange: (value) => {
          lastFiatAmount = value;
        }
      });
      const input = screen.getByRole('textbox');

      await user.type(input, '.5');

      expect(input).toHaveValue('.5');
      expect(lastFiatAmount).toBe(0.5);
    });

    it('rejects non-numeric input', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, 'abc');

      expect(input).toHaveValue('');
    });

    it('rejects second decimal point but allows subsequent digits', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, '12.34.56');

      // Second decimal point is rejected, but subsequent digits "56" are valid
      expect(input).toHaveValue('12.3456');
    });
  });

  describe('preset button interactions', () => {
    it('updates input value when preset button is clicked', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.click(screen.getByRole('button', { name: '$50' }));

      await waitFor(() => {
        expect(input).toHaveValue('50');
      });
    });

    it('updates input when preset clicked while input has trailing decimal', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      // Type a value with trailing decimal
      await user.type(input, '25.');
      expect(input).toHaveValue('25.');

      // Click preset button
      await user.click(screen.getByRole('button', { name: '$100' }));

      // Input should update to preset value
      await waitFor(() => {
        expect(input).toHaveValue('100');
      });
    });

    it('highlights selected preset button', async () => {
      renderComponent({ defaultValues: { fiatAmount: 50 } });

      const button50 = screen.getByRole('button', { name: '$50' });
      const button25 = screen.getByRole('button', { name: '$25' });

      // Check that button50 has default variant (selected)
      // and button25 has secondary variant (not selected)
      expect(button50).toHaveAttribute('data-variant', 'default');
      expect(button25).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('focus/blur synchronization', () => {
    it('normalizes trailing decimal on blur', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, '25.');
      expect(input).toHaveValue('25.');

      // Blur the input (click somewhere else)
      await user.tab();

      await waitFor(() => {
        expect(input).toHaveValue('25');
      });
    });

    it('normalizes leading zeros on blur', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, '00025');
      expect(input).toHaveValue('00025');

      await user.tab();

      await waitFor(() => {
        expect(input).toHaveValue('25');
      });
    });

    it('normalizes leading decimal on blur (e.g., ".5" -> "0.5")', async () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      await user.type(input, '.5');
      expect(input).toHaveValue('.5');

      await user.tab();

      await waitFor(() => {
        expect(input).toHaveValue('0.5');
      });
    });
  });

  describe('crypto conversion display', () => {
    it('shows loading state while fetching conversion', () => {
      mockUseFiatToCrypto.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false
      });

      renderComponent({ defaultValues: { fiatAmount: 100 } });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error state when conversion fails', () => {
      mockUseFiatToCrypto.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true
      });

      renderComponent({ defaultValues: { fiatAmount: 100 } });

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('displays converted crypto amount', () => {
      mockUseFiatToCrypto.mockReturnValue({
        data: { amount: 99.123456 },
        isLoading: false,
        isError: false
      });

      renderComponent({ defaultValues: { fiatAmount: 100 } });

      expect(screen.getByText('≈ 99.123456 USDC')).toBeInTheDocument();
    });

    it('shows zero when no conversion data', () => {
      mockUseFiatToCrypto.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false
      });

      renderComponent();

      expect(screen.getByText('0 USDC')).toBeInTheDocument();
    });
  });

  describe('next button', () => {
    it('is disabled when fiatAmount is empty', () => {
      renderComponent();

      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeDisabled();
    });

    it('is disabled when fiatAmount is 0', () => {
      renderComponent({ defaultValues: { fiatAmount: 0 } });

      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeDisabled();
    });

    it('is enabled when fiatAmount is valid', () => {
      renderComponent({ defaultValues: { fiatAmount: 50 } });

      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).not.toBeDisabled();
    });

    it('calls next() when clicked', async () => {
      renderComponent({ defaultValues: { fiatAmount: 50 } });

      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
