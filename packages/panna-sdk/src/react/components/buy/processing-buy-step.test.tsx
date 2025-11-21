import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import {
  OnrampMoneySessionStatusEnum,
  type SessionStatusResult
} from 'src/core';
import {
  useCreateOnrampSession,
  useOnrampSessionStatus,
  usePanna
} from '@/hooks';
import type { QuoteData } from '../../types/onramp-quote.types';
import { useDialogStepper } from '../ui/dialog-stepper';
import { ProcessingBuyStep } from './processing-buy-step';
import type { BuyFormData } from './schema';

jest.mock('@/hooks', () => ({
  useCreateOnrampSession: jest.fn(),
  useOnrampSessionStatus: jest.fn(),
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

const mockUseCreateOnrampSession = useCreateOnrampSession as jest.Mock;
const mockUseOnrampSessionStatus = useOnrampSessionStatus as jest.Mock;
const mockUsePanna = usePanna as jest.Mock;
const mockUseDialogStepper = useDialogStepper as jest.Mock;

const noop = () => {};

const mockQuote: QuoteData = {
  rate: 0.9985,
  crypto_quantity: 97.73,
  onramp_fee: 0.5,
  gas_fee: 2.27,
  total_fiat_amount: 102.27,
  quote_timestamp: '2024-05-01T12:00:00Z',
  quote_validity_mins: 15
};

const baseSession: SessionStatusResult = {
  session_id: 'session-123',
  status: OnrampMoneySessionStatusEnum.Completed,
  transaction_hash: '0xhash',
  quoted_crypto_amount: 97.73,
  actual_crypto_amount: 97.7,
  quoted_rate: 0.9985,
  completed_at: new Date().toISOString()
};

const TestWrapper = () => {
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
      provider: {
        providerId: 'onramp-money',
        providerName: 'Onramp Money',
        providerDescription: 'Fast fiat onramp',
        providerLogoUrl: 'https://onramp.money/logo.png',
        quote: mockQuote
      }
    }
  });

  return <ProcessingBuyStep onClose={noop} form={form} />;
};

const renderComponent = () => render(<TestWrapper />);

describe('ProcessingBuyStep', () => {
  const user = userEvent.setup();
  const mockMutateAsync = jest.fn();
  const mockNext = jest.fn();
  const mockPrev = jest.fn();
  const mockReset = jest.fn();
  const statusRefetch = jest.fn();
  const sessionStatusResponse = {
    data: undefined,
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: statusRefetch
  };

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      writable: true,
      value: jest.fn()
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePanna.mockReturnValue({ chainId: '1135' });
    mockUseCreateOnrampSession.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false
    });
    mockUseOnrampSessionStatus.mockImplementation(({ sessionId }) =>
      sessionId
        ? {
            ...sessionStatusResponse,
            data: {
              ...baseSession,
              session_id: sessionId,
              status: OnrampMoneySessionStatusEnum.Created
            }
          }
        : sessionStatusResponse
    );
    mockUseDialogStepper.mockReturnValue({
      next: mockNext,
      prev: mockPrev,
      reset: mockReset
    });
    mockMutateAsync.mockResolvedValue({
      session_id: 'session-123',
      redirect_url: 'https://onramp.money/session',
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    });
  });

  it('creates an onramp session on mount with expected params', async () => {
    renderComponent();

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: 100,
        fiatCurrency: 'USD',
        quoteData: mockQuote,
        redirectUrl: undefined
      });
    });

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        'https://onramp.money/session',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  it('advances to status step when terminal status is received', async () => {
    mockUseOnrampSessionStatus.mockImplementation(({ sessionId }) =>
      sessionId
        ? {
            ...sessionStatusResponse,
            data: {
              ...baseSession,
              session_id: sessionId,
              status: OnrampMoneySessionStatusEnum.Completed
            }
          }
        : sessionStatusResponse
    );

    renderComponent();

    await waitFor(() => {
      expect(mockNext).toHaveBeenCalledWith({
        status: OnrampMoneySessionStatusEnum.Completed,
        session: expect.objectContaining({
          status: OnrampMoneySessionStatusEnum.Completed
        })
      });
    });
  });

  it('shows retry UI when session creation fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockMutateAsync.mockRejectedValueOnce(new Error('Create failed'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Create failed')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(mockMutateAsync).toHaveBeenCalledTimes(2);
    consoleErrorSpy.mockRestore();
  });
});
