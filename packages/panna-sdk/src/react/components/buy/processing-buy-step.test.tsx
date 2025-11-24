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
  quote_validity_mins: 15,
  provider_id: 'onrampmoney'
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

const defaultFormValues: BuyFormData = {
  country: { code: 'US', name: 'United States', flag: '🇺🇸' },
  token: {
    address: '0x123',
    symbol: 'USDC',
    name: 'USD Coin'
  },
  fiatAmount: 100,
  cryptoAmount: 97.73,
  provider: {
    providerId: 'onrampmoney',
    providerName: 'Onramp Money',
    providerDescription: 'Fast fiat onramp',
    providerLogoUrl: 'https://onramp.money/logo.png',
    quote: mockQuote
  }
};

const TestWrapper = ({
  defaultValues,
  onClose = noop
}: {
  defaultValues?: Partial<BuyFormData>;
  onClose?: () => void;
}) => {
  const form = useForm<BuyFormData>({
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues
    }
  });

  return <ProcessingBuyStep onClose={onClose} form={form} />;
};

const renderComponent = (options?: {
  defaultValues?: Partial<BuyFormData>;
  onClose?: () => void;
}) => render(<TestWrapper {...options} />);

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
    mockUseOnrampSessionStatus.mockImplementation(
      ({ sessionId }: { sessionId: string }) =>
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
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to create onramp session: ',
      'Create failed'
    );

    consoleErrorSpy.mockRestore();
  });

  it.each([
    [
      'missing provider',
      () => ({
        provider: undefined
      })
    ],
    [
      'missing token symbol',
      () => ({
        token: {
          ...defaultFormValues.token!,
          symbol: ''
        }
      })
    ],
    [
      'zero fiat amount',
      () => ({
        fiatAmount: 0
      })
    ],
    [
      'negative fiat amount',
      () => ({
        fiatAmount: -50
      })
    ],
    [
      'missing quote',
      () => ({
        provider: {
          ...defaultFormValues.provider!,
          quote: undefined as unknown as QuoteData
        }
      })
    ],
    [
      'missing country',
      () => ({
        country: undefined
      })
    ]
  ])(
    'shows missing purchase information UI when %s',
    async (_, getOverrides) => {
      renderComponent({
        defaultValues: getOverrides()
      });

      expect(
        screen.getByText(
          'Missing purchase information. Please go back and select a payment provider again.'
        )
      ).toBeInTheDocument();
      expect(mockMutateAsync).not.toHaveBeenCalled();
    }
  );

  it('allows navigation via Go back and Close actions when data is missing', async () => {
    const onClose = jest.fn();

    renderComponent({
      defaultValues: { provider: undefined },
      onClose
    });

    await user.click(screen.getByRole('button', { name: /go back/i }));
    expect(mockPrev).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /^close$/i }));
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each([
    OnrampMoneySessionStatusEnum.Failed,
    OnrampMoneySessionStatusEnum.Cancelled,
    OnrampMoneySessionStatusEnum.Expired
  ])('navigates to terminal step when status is %s', async (status) => {
    mockUseOnrampSessionStatus.mockImplementation(({ sessionId }) =>
      sessionId
        ? {
            ...sessionStatusResponse,
            data: {
              ...baseSession,
              session_id: sessionId,
              status
            }
          }
        : sessionStatusResponse
    );

    renderComponent();

    await waitFor(() => {
      expect(mockNext).toHaveBeenCalledWith({
        status,
        session: expect.objectContaining({
          status
        })
      });
    });

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('shows creating session label while session is being created', () => {
    mockMutateAsync.mockImplementation(() => new Promise(() => {}));

    const { unmount } = renderComponent();

    expect(screen.getByText('Creating payment session...')).toBeInTheDocument();

    unmount();
  });

  it.each([
    [OnrampMoneySessionStatusEnum.Created, 'Waiting for payment provider...'],
    [OnrampMoneySessionStatusEnum.Pending, 'Payment in progress...']
  ])('updates status label for %s', async (status, expectedLabel) => {
    mockUseOnrampSessionStatus.mockImplementation(({ sessionId }) =>
      sessionId
        ? {
            ...sessionStatusResponse,
            data: {
              ...baseSession,
              session_id: sessionId,
              status
            }
          }
        : sessionStatusResponse
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    });
  });

  it('displays polling error messaging and allows retrying status check', async () => {
    const refetch = jest.fn();
    mockUseOnrampSessionStatus.mockImplementation(({ sessionId }) =>
      sessionId
        ? {
            ...sessionStatusResponse,
            data: {
              ...baseSession,
              session_id: sessionId,
              status: OnrampMoneySessionStatusEnum.Created
            },
            error: new Error('Status failed'),
            refetch
          }
        : sessionStatusResponse
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Unable to fetch the latest status. Please retry below.'
        )
      ).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', {
      name: /retry status check/i
    });

    await user.click(retryButton);

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('disables retry button while status polling is in progress', async () => {
    const refetch = jest.fn();
    mockUseOnrampSessionStatus.mockImplementation(({ sessionId }) =>
      sessionId
        ? {
            ...sessionStatusResponse,
            data: {
              ...baseSession,
              session_id: sessionId,
              status: OnrampMoneySessionStatusEnum.Created
            },
            error: new Error('Status failed'),
            refetch,
            isFetching: true
          }
        : sessionStatusResponse
    );

    renderComponent();

    const retryButton = await screen.findByRole('button', {
      name: /retry status check/i
    });

    expect(retryButton).toBeDisabled();
  });

  it('renders manual provider open action with provider name', async () => {
    renderComponent();

    const openButton = await screen.findByRole('button', {
      name: /open onramp money/i
    });

    await user.click(openButton);

    expect(window.open).toHaveBeenLastCalledWith(
      'https://onramp.money/session',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
