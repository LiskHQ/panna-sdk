import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { ImageType, TokenInstance } from 'src/core';
import { useDialogStepper } from '../ui/dialog-stepper';
import { SendCollectibleFormData } from './schema';
import { SelectCollectibleStep } from './select-collectible-step';

jest.mock('../ui/dialog-stepper', () => ({
  useDialogStepper: jest.fn()
}));

jest.mock('./collectibles-list', () => ({
  ImageRenderer: ({ instance }: { instance: TokenInstance }) => (
    <img src={instance.image!} alt={instance.name} />
  )
}));

jest.mock('@radix-ui/react-dialog', () => ({
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

const mockNext = jest.fn();

describe('SelectCollectibleStep', () => {
  const mockCollectible = {
    id: '1',
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

  beforeEach(() => {
    jest.clearAllMocks();
    (useDialogStepper as jest.Mock).mockReturnValue({
      next: mockNext,
      previous: jest.fn(),
      goToStep: jest.fn()
    });
  });

  const TestWrapper = () => {
    const form = useForm<SendCollectibleFormData>({
      defaultValues: {
        collectible: mockCollectible,
        token: mockToken,
        recipientAddress: '',
        amount: '1'
      }
    });

    return <SelectCollectibleStep form={form} />;
  };

  it('should render properly', () => {
    render(<TestWrapper />);

    const image = screen.getByAltText('Test Collectible');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.png');
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByText('Test Token')).toBeVisible();
  });

  it('should call next when send button is clicked', () => {
    render(<TestWrapper />);

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should render dialog description for accessibility', () => {
    render(<TestWrapper />);

    const description = screen.getByText(/send test token/i);
    expect(description).toBeInTheDocument();
  });

  it('should handle collectible with null image', () => {
    const TestWrapperNullImage = () => {
      const form = useForm<SendCollectibleFormData>({
        defaultValues: {
          collectible: { ...mockCollectible, image: null },
          token: mockToken,
          recipientAddress: '',
          amount: '1'
        }
      });

      return <SelectCollectibleStep form={form} />;
    };

    render(<TestWrapperNullImage />);

    const image = screen.getByAltText('Test Collectible');
    expect(image).toBeInTheDocument();
  });

  it('should handle ERC-1155 token with multiple values', () => {
    const erc1155Token = {
      ...mockToken,
      type: 'erc-1155'
    };

    const erc1155Collectible = {
      ...mockCollectible,
      value: '5'
    };

    const TestWrapperERC1155 = () => {
      const form = useForm<SendCollectibleFormData>({
        defaultValues: {
          collectible: erc1155Collectible,
          token: erc1155Token,
          recipientAddress: '',
          amount: '1'
        }
      });

      return <SelectCollectibleStep form={form} />;
    };

    render(<TestWrapperERC1155 />);

    expect(screen.getByText('Test Token')).toBeVisible();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});
