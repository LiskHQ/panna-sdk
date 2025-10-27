import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { ImageType, TokenInstance } from 'src/core';
import { useDialogStepper } from '../ui/dialog-stepper';
import { SendCollectibleFormData } from './schema';
import { SummaryStep } from './summary-step';

jest.mock('../ui/dialog-stepper', () => ({
  useDialogStepper: jest.fn()
}));

jest.mock('../ui/dialog', () => ({
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  )
}));

jest.mock('./collectibles-list', () => ({
  ImageRenderer: ({ instance }: { instance: TokenInstance }) => (
    <img src={instance.image!} alt={instance.name} />
  )
}));

const mockNext = jest.fn();

describe('SummaryStep', () => {
  const mockCollectible = {
    id: '123',
    imageType: ImageType.URL,
    image: 'test-image.png',
    name: 'Test Collectible',
    value: '1'
  };

  const mockToken = {
    name: 'Test Token',
    symbol: 'TT',
    type: 'erc-721',
    address: '0x123',
    icon: null
  };

  const mockRecipientAddress = '0x456789abcdef';
  const mockAmount = '1';

  beforeEach(() => {
    jest.clearAllMocks();
    (useDialogStepper as jest.Mock).mockReturnValue({
      next: mockNext,
      previous: jest.fn(),
      goToStep: jest.fn()
    });
  });

  const TestWrapper = ({
    collectible = mockCollectible,
    token = mockToken,
    recipientAddress = mockRecipientAddress,
    amount = mockAmount
  }: Partial<SendCollectibleFormData> = {}) => {
    const form = useForm<SendCollectibleFormData>({
      defaultValues: {
        collectible,
        token,
        recipientAddress,
        amount
      }
    });

    return <SummaryStep form={form} />;
  };

  it('should render properly', () => {
    render(<TestWrapper />);

    expect(screen.getByText('Summary')).toBeInTheDocument();
    const image = screen.getByAltText('Test Collectible');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.png');
    expect(screen.getByText(/Test Token #123/i)).toBeVisible();
    expect(screen.getByText('Send to')).toBeVisible();
    expect(screen.getByText(mockRecipientAddress)).toBeVisible();
    expect(screen.getByText('Quantity')).toBeVisible();
    expect(screen.getByText(mockAmount)).toBeVisible();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should call next with hideBackButton when send button is clicked', () => {
    render(<TestWrapper />);

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith({ hideBackButton: true });
  });

  it('should handle ERC-1155 collectibles with multiple quantities', () => {
    const erc1155Token = {
      ...mockToken,
      type: 'erc-1155'
    };

    const erc1155Collectible = {
      ...mockCollectible,
      value: '10'
    };

    render(
      <TestWrapper
        collectible={erc1155Collectible}
        token={erc1155Token}
        amount="5"
      />
    );

    expect(screen.getByText('5')).toBeVisible();
  });

  it('should handle collectible with null image', () => {
    const collectibleNoImage = {
      ...mockCollectible,
      image: null
    };

    render(<TestWrapper collectible={collectibleNoImage} />);

    expect(screen.getByAltText('Test Collectible')).toBeInTheDocument();
  });
});
