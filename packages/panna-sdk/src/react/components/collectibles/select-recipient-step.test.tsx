import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { ImageType, TokenERC } from 'src/core';
import { useDialogStepper } from '../ui/dialog-stepper';
import { SendCollectibleFormData } from './schema';
import { SelectRecipientStep } from './select-recipient-step';

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

jest.mock('../ui/form', () => ({
  FormField: ({ render }: { render: (props: unknown) => React.ReactNode }) =>
    render({
      field: {
        onChange: jest.fn(),
        value: '',
        name: 'test'
      }
    }),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormMessage: () => <span data-testid="form-message" />
}));

const mockNext = jest.fn();

describe('SelectRecipientStep', () => {
  const mockCollectible = {
    id: '1',
    imageType: ImageType.URL,
    image: 'test.png',
    name: 'Test Collectible',
    value: '5'
  };

  const mockToken = {
    name: 'Test Token',
    symbol: 'TT',
    type: TokenERC.ERC1155,
    address: '0x123',
    icon: null
  };

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
    recipientAddress = '',
    amount = '1'
  }: Partial<SendCollectibleFormData> = {}) => {
    const form = useForm<SendCollectibleFormData>({
      defaultValues: {
        collectible,
        token: mockToken,
        recipientAddress,
        amount
      }
    });

    return <SelectRecipientStep form={form} />;
  };

  it('should render ERC-721 collectible display properly', () => {
    const erc721Token = {
      ...mockToken,
      type: TokenERC.ERC721
    };
    render(
      <TestWrapper
        collectible={{ ...mockCollectible, value: null }}
        token={erc721Token}
      />
    );

    expect(screen.getByText('Send collectible')).toBeInTheDocument();
    expect(screen.getByText('Send to')).toBeVisible();
    expect(
      screen.getByPlaceholderText("Recipient's address")
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /max/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('should render ERC-1155 collectible display properly', () => {
    render(<TestWrapper />);

    expect(screen.getByText('Send collectible')).toBeInTheDocument();
    expect(screen.getByText('Send to')).toBeVisible();
    expect(
      screen.getByPlaceholderText("Recipient's address")
    ).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeVisible();
    expect(screen.getByPlaceholderText('Quantity')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /max/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByText(/Max 5 available/i)).toBeVisible();
  });

  it('should disable next button when recipient address is empty', () => {
    render(<TestWrapper recipientAddress="" />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should enable next button when recipient address is provided', () => {
    render(<TestWrapper recipientAddress="0x123" />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('should handle ERC-1155 collectibles with higher values', () => {
    const erc1155Collectible = {
      ...mockCollectible,
      value: '100'
    };

    render(<TestWrapper collectible={erc1155Collectible} />);

    expect(screen.getByText(/Max 100 available/i)).toBeVisible();
  });

  it('should handle collectible with value of 1', () => {
    const collectibleValueOne = {
      ...mockCollectible,
      value: '1'
    };

    render(<TestWrapper collectible={collectibleValueOne} />);

    expect(screen.getByText(/Max 1 available/i)).toBeVisible();
  });
});
