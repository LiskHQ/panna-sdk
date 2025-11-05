import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { FiatCurrency } from 'src/core';
import { truncateAddress } from '@/utils/address';
import {
  useAccountAvatar,
  useActiveAccount,
  useExternalWallet,
  usePanna,
  useTokenBalances
} from '../../../hooks';
import { Dialog, DialogContent, DialogDescription } from '../../ui/dialog';
import { useDialogStepper } from '../../ui/dialog-stepper';
import { Form } from '../../ui/form';
import { type TransferFormData } from './schema';
import { TransferAmountStep } from './transfer-amount-step';

jest.mock('../../../hooks');
jest.mock('../../ui/dialog-stepper');

const mockUseAccountAvatar = useAccountAvatar as jest.MockedFunction<
  typeof useAccountAvatar
>;
const mockUseActiveAccount = useActiveAccount as jest.MockedFunction<
  typeof useActiveAccount
>;
const mockUseExternalWallet = useExternalWallet as jest.MockedFunction<
  typeof useExternalWallet
>;
const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;
const mockUseTokenBalances = useTokenBalances as jest.MockedFunction<
  typeof useTokenBalances
>;
const mockUseDialogStepper = useDialogStepper as jest.MockedFunction<
  typeof useDialogStepper
>;

const externalWalletAddress = '0x1234567890abcdef1234567890abcdef12345678';
const destinationAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

const defaultTokenInfo: TransferFormData['tokenInfo'] = {
  token: {
    address: '0xTokenAddress',
    decimals: 6,
    icon: 'https://example.com/token.png',
    name: 'USD Coin',
    symbol: 'USDC'
  },
  tokenBalance: {
    value: 1_000_000n,
    displayValue: '12.34'
  },
  fiatBalance: {
    amount: 456.78,
    currency: FiatCurrency.USD
  }
};

const destinationBalance = {
  token: defaultTokenInfo.token,
  tokenBalance: defaultTokenInfo.tokenBalance,
  fiatBalance: defaultTokenInfo.fiatBalance
};

type RenderOptions = {
  walletImage?: string | null;
  triggerMock?: jest.Mock;
  formDefaults?: Partial<TransferFormData>;
  isDestinationLoading?: boolean;
};

const renderComponent = (options: RenderOptions = {}) => {
  const nextMock = jest.fn();
  mockUseDialogStepper.mockReturnValue({
    next: nextMock,
    prev: jest.fn(),
    reset: jest.fn(),
    stepData: {},
    currentStep: 0,
    goToStep: jest.fn(),
    lastStep: 3,
    canGoBack: false
  });

  const avatarData =
    options.walletImage === null ? undefined : (options.walletImage ?? '');

  mockUseAccountAvatar.mockReturnValue({
    data: avatarData,
    isLoading: false,
    isError: false
  } as unknown as ReturnType<typeof useAccountAvatar>);
  mockUseActiveAccount.mockReturnValue({
    address: destinationAddress
  } as unknown as ReturnType<typeof useActiveAccount>);
  mockUseExternalWallet.mockReturnValue({
    externalWallet: {
      id: 'io.metamask',
      getAccount: () => ({
        address: externalWalletAddress
      })
    },
    hasExternalWallet: true,
    externalAddress: externalWalletAddress,
    hasLinkedExternalWallet: true,
    linkedExternalAddress: externalWalletAddress,
    isLinkedExternalWalletLoading: false
  } as unknown as ReturnType<typeof useExternalWallet>);
  mockUsePanna.mockReturnValue({
    chainId: '1135'
  } as unknown as ReturnType<typeof usePanna>);
  mockUseTokenBalances.mockReturnValue({
    data: options.isDestinationLoading ? [] : [destinationBalance],
    isLoading: Boolean(options.isDestinationLoading),
    isError: false,
    error: null
  } as unknown as ReturnType<typeof useTokenBalances>);

  const triggerMock =
    options.triggerMock ?? jest.fn().mockResolvedValue(true as const);

  let capturedForm: UseFormReturn<TransferFormData> | undefined;

  const Wrapper = () => {
    const form = useForm<TransferFormData>({
      defaultValues: {
        fromAddress: externalWalletAddress,
        toAddress: '',
        tokenInfo: defaultTokenInfo,
        amount: '10',
        fiatAmount: '10',
        cryptoAmount: '0.1',
        primaryAmountInput: 'fiat',
        ...options.formDefaults
      }
    });

    (form as unknown as { trigger: jest.Mock }).trigger = triggerMock;
    capturedForm = form;

    return (
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogDescription>Transfer assets</DialogDescription>
          <Form {...form}>
            <TransferAmountStep form={form} />
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  const utils = render(<Wrapper />);
  return {
    ...utils,
    nextMock,
    triggerMock,
    getForm: () => capturedForm as UseFormReturn<TransferFormData>
  };
};

describe('TransferAmountStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders external wallet information with avatar image', async () => {
    renderComponent({ walletImage: 'https://example.com/avatar' });

    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.getByAltText('MetaMask logo')).toBeInTheDocument();
    expect(
      screen.getByText(truncateAddress(externalWalletAddress))
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(truncateAddress(destinationAddress))
      ).toBeInTheDocument();
    });

    expect(screen.getAllByText('$456.78')).toHaveLength(2);
    expect(screen.getAllByText('12.34 USDC')).toHaveLength(2);
  });

  it('falls back to wallet initial when avatar is unavailable', () => {
    renderComponent({ walletImage: null });

    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.queryByAltText('MetaMask logo')).not.toBeInTheDocument();
  });

  it('sets the destination address on mount', async () => {
    const { getForm } = renderComponent();

    await waitFor(() => {
      expect(getForm().getValues('toAddress')).toBe(destinationAddress);
    });
  });

  it('submits the form and advances to the next step when validation passes', async () => {
    const { nextMock, triggerMock } = renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }));

    await waitFor(() => {
      expect(triggerMock).toHaveBeenCalled();
      expect(nextMock).toHaveBeenCalled();
    });
  });

  it('does not advance when validation fails', async () => {
    const failingTrigger = jest.fn().mockResolvedValue(false);
    const { nextMock } = renderComponent({ triggerMock: failingTrigger });

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }));

    await waitFor(() => {
      expect(failingTrigger).toHaveBeenCalled();
      expect(nextMock).not.toHaveBeenCalled();
    });
  });

  it('calls useTokenBalances with the embedded wallet address', () => {
    renderComponent();

    expect(mockUseTokenBalances).toHaveBeenCalledWith(
      { address: destinationAddress },
      { enabled: true }
    );
  });
});
