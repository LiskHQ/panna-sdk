import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { getOnrampProviders } from '../../../core/onramp';
import { useOnrampQuotes, usePanna } from '../../hooks';
import type { QuoteData } from '../../types/onramp-quote.types';
import { useDialogStepper } from '../ui/dialog-stepper';
import type { BuyFormData } from './schema';
import { SelectBuyProviderStep } from './select-buy-provider-step';

jest.mock('../../hooks', () => ({
  useOnrampQuotes: jest.fn(),
  usePanna: jest.fn()
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

jest.mock('../../../core/onramp', () => ({
  getOnrampProviders: jest.fn()
}));

const mockUseOnrampQuotes = useOnrampQuotes as jest.Mock;
const mockUsePanna = usePanna as jest.Mock;
const mockUseDialogStepper = useDialogStepper as jest.Mock;
const mockGetOnrampProviders = getOnrampProviders as jest.Mock;

const mockQuote: QuoteData = {
  rate: 0.9985,
  crypto_quantity: 97.73,
  onramp_fee: 0.5,
  gas_fee: 2.27,
  total_fiat_amount: 102.27,
  quote_timestamp: '2024-05-01T12:00:00Z',
  quote_validity_mins: 15,
  provider_id: 'onrampmoney'
};

let formRef: UseFormReturn<BuyFormData> | null = null;

const TestWrapper = ({
  defaultValues
}: {
  defaultValues?: Partial<BuyFormData>;
}) => {
  const form = useForm<BuyFormData>({
    defaultValues: {
      country: { code: 'US', name: 'United States', flag: '🇺🇸' },
      token: {
        address: '0x123',
        symbol: 'USDC',
        name: 'USD Coin'
      },
      fiatAmount: 100,
      cryptoAmount: 97.73,
      ...defaultValues
    }
  });

  formRef = form;

  return <SelectBuyProviderStep form={form} />;
};

describe('SelectBuyProviderStep', () => {
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    formRef = null;
    mockUsePanna.mockReturnValue({ chainId: '1135' });
    mockUseDialogStepper.mockReturnValue({ next: mockNext });
    mockUseOnrampQuotes.mockReturnValue({
      data: mockQuote,
      isLoading: false,
      error: null
    });
    mockGetOnrampProviders.mockReturnValue([
      {
        id: 'onrampmoney',
        displayName: 'Onramp Money',
        description: 'Fast fiat onramp',
        logoUrl: 'https://onramp.money/logo.png'
      }
    ]);
  });

  it('sets provider data and advances when a provider is selected', async () => {
    render(<TestWrapper />);

    const providerButton = screen.getByRole('button', {
      name: /onramp money/i
    });

    fireEvent.click(providerButton);

    await waitFor(() => {
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    expect(formRef).not.toBeNull();

    const provider = formRef?.getValues('provider');

    expect(provider).toEqual({
      providerId: 'onrampmoney',
      providerName: 'Onramp Money',
      providerDescription: 'Fast fiat onramp',
      providerLogoUrl: 'https://onramp.money/logo.png',
      quote: mockQuote
    });
  });

  it('shows loading indicator while quotes are loading', () => {
    mockUseOnrampQuotes.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
      error: null
    }));

    render(<TestWrapper />);

    expect(screen.getByText('Generating quotes...')).toBeInTheDocument();
  });

  it('shows error message when quote fetching fails', () => {
    mockUseOnrampQuotes.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network issue')
    });

    render(<TestWrapper />);

    expect(
      screen.getByText('Failed to load quotes. Please try again.')
    ).toBeInTheDocument();
  });

  it('shows message when no providers are available', () => {
    mockGetOnrampProviders.mockReturnValue([]);

    render(<TestWrapper />);

    expect(
      screen.getByText('No providers available for this country')
    ).toBeInTheDocument();
  });

  it('shows message when no quote data is returned', () => {
    mockUseOnrampQuotes.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null
    });

    render(<TestWrapper />);

    expect(screen.getByText('No quote available')).toBeInTheDocument();
  });

  it('only renders providers that have quote data available', () => {
    mockGetOnrampProviders.mockReturnValue([
      {
        id: 'onrampmoney',
        displayName: 'Onramp Money',
        description: 'Fast fiat onramp',
        logoUrl: 'https://onramp.money/logo.png'
      },
      {
        id: 'transak',
        displayName: 'Transak',
        description: 'Other provider',
        logoUrl: 'https://transak.com/logo.png'
      }
    ]);

    render(<TestWrapper />);

    expect(
      screen.getAllByRole('button', { name: /onramp money/i })
    ).toHaveLength(1);
    expect(screen.queryByText('Transak')).not.toBeInTheDocument();
  });

  it('applies selection styles when provider already chosen', () => {
    render(
      <TestWrapper
        defaultValues={{
          provider: {
            providerId: 'onrampmoney',
            providerName: 'Onramp Money',
            providerDescription: 'Fast fiat onramp',
            providerLogoUrl: 'https://onramp.money/logo.png',
            quote: mockQuote
          }
        }}
      />
    );

    const providerButton = screen.getByRole('button', {
      name: /onramp money/i
    });

    expect(providerButton.className).toContain('ring-primary');
  });

  it('omits crypto amount display when token symbol is missing', () => {
    render(
      <TestWrapper
        defaultValues={{
          token: undefined
        }}
      />
    );

    expect(screen.queryByText(/USDC/i)).not.toBeInTheDocument();
  });

  it('calls quote hook with expected parameters', () => {
    render(<TestWrapper />);

    expect(mockUseOnrampQuotes).toHaveBeenCalledWith({
      tokenSymbol: 'USDC',
      network: 'lisk',
      fiatAmount: 100,
      fiatCurrency: 'USD'
    });
  });
});
