import { fireEvent, render, screen } from '@testing-library/react';
import { FiatCurrency } from 'src/core';
import { useTotalFiatBalance } from '../../hooks';
import { BuyFormProps, StepperRefProvider } from '../buy/buy-form';
import { SendCollectibleFormProps } from '../collectibles/send-collectible-form';
import { SendFormProps, StepperContextProvider } from '../send/send-form';
import { AccountDialog } from './account-dialog';
import { AccountViewProvider } from './account-view-provider';

jest.mock('../../hooks');
jest.mock('@/utils/address');
jest.mock('../activity/activity-list', () => ({
  ActivityList: () => <div data-testid="activity-list">Activity List</div>
}));
jest.mock('../balance/tokens-list', () => ({
  TokensList: () => <div data-testid="tokens-list">Tokens List</div>
}));
jest.mock('../buy/buy-form', () => ({
  StepperRefProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  BuyForm: ({ onClose, stepperRef }: BuyFormProps) => (
    <div data-testid="buy-form">
      <StepperRefProvider stepperRef={stepperRef}>
        <button onClick={onClose}>Close Buy</button>
      </StepperRefProvider>
    </div>
  )
}));
jest.mock('../send/send-form', () => ({
  StepperContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SendForm: ({ onClose, onStepperChange }: SendFormProps) => (
    <div data-testid="send-form">
      <StepperContextProvider onStepperChange={onStepperChange}>
        <button onClick={onClose}>Close Send</button>
      </StepperContextProvider>
    </div>
  )
}));
jest.mock('../collectibles/collectibles-list', () => ({
  CollectiblesList: () => (
    <div data-testid="collectibles-list">Collectibles List</div>
  )
}));
jest.mock('../collectibles/send-collectible-form', () => ({
  SendCollectibleForm: ({
    onClose,
    onStepperChange
  }: SendCollectibleFormProps) => (
    <div data-testid="send-collectible-form">
      <StepperContextProvider onStepperChange={onStepperChange}>
        <button onClick={onClose}>Close Send Collectible</button>
      </StepperContextProvider>
    </div>
  )
}));
jest.mock('./account-settings-view', () => ({
  AccountSettingsView: () => (
    <div data-testid="account-settings-view">Settings View</div>
  )
}));
jest.mock('./account-screens-provider', () => ({
  AccountScreensProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

jest.mock('@dicebear/collection', () => ({
  glass: {}
}));
jest.mock('@dicebear/core', () => ({
  createAvatar: jest.fn().mockReturnValue({
    toDataUri: jest.fn().mockResolvedValue('data:image/png;base64,avatar')
  })
}));

const AccountDialogWrapper = ({ address }: { address: string }) => (
  <AccountViewProvider>
    <AccountDialog address={address} />
  </AccountViewProvider>
);

describe('AccountDialog', () => {
  const mockAddress = '0x1234567890abcdef';

  beforeEach(() => {
    (useTotalFiatBalance as jest.Mock).mockReturnValue({
      data: 1234.56,
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog trigger with account avatar', () => {
    render(<AccountDialogWrapper address={mockAddress} />);
    expect(screen.getByAltText('User Avatar')).toBeInTheDocument();
  });

  it('displays total balance in USD when dialog is opened', () => {
    render(<AccountDialogWrapper address={mockAddress} />);

    fireEvent.click(screen.getByAltText('User Avatar'));

    expect(screen.getByText('$1234.56')).toBeInTheDocument();
    expect(screen.getByText('Total value')).toBeInTheDocument();
  });

  it('displays loading state for balance', () => {
    (useTotalFiatBalance as jest.Mock).mockReturnValue({
      data: 0,
      isLoading: true
    });

    render(<AccountDialogWrapper address={mockAddress} />);

    fireEvent.click(screen.getByAltText('User Avatar'));

    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('navigates to settings view when settings icon is clicked', () => {
    render(<AccountDialogWrapper address={mockAddress} />);

    fireEvent.click(screen.getByAltText('User Avatar'));

    const settingsButton = screen.getByTestId('open-settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('account-settings-view')).toBeInTheDocument();
  });

  it('navigates back from settings to main view', () => {
    render(<AccountDialogWrapper address={mockAddress} />);

    fireEvent.click(screen.getByAltText('User Avatar'));

    // Go to settings
    const settingsButton = screen.getByTestId('open-settings');
    fireEvent.click(settingsButton);

    // Go back to main
    const backButton = screen.getByTestId('back-to-main');
    fireEvent.click(backButton);

    expect(screen.getByText('$1234.56')).toBeInTheDocument();
  });

  it('navigates to send form when send button is clicked', async () => {
    render(<AccountDialogWrapper address={mockAddress} />);

    fireEvent.click(screen.getByAltText('User Avatar'));

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByTestId('send-form')).toBeInTheDocument();
  });

  it('closes send form and returns to main view', () => {
    render(<AccountDialogWrapper address={mockAddress} />);

    fireEvent.click(screen.getByAltText('User Avatar'));
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    fireEvent.click(screen.getByRole('button', { name: 'Close Send' }));

    expect(screen.getByText('$1234.56')).toBeInTheDocument();
  });

  it('calls useTotalFiatBalance with correct parameters', () => {
    render(<AccountDialogWrapper address={mockAddress} />);

    expect(useTotalFiatBalance).toHaveBeenCalledWith({
      address: mockAddress,
      currency: FiatCurrency.USD
    });
  });

  it('renders accessibility description', () => {
    render(<AccountDialogWrapper address={mockAddress} />);

    fireEvent.click(screen.getByAltText('User Avatar'));

    expect(
      screen.getByText('Select account views and manage your account settings.')
    ).toBeInTheDocument();
  });
});
