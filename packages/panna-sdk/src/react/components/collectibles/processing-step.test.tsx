import { render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  ImageType,
  prepareContractCall,
  sendTransaction,
  TokenERC
} from 'src/core';
import { useActiveAccount } from '@/hooks';
import { getEnvironmentChain } from '@/utils';
import { useDialogStepper } from '../ui/dialog-stepper';
import { ProcessingStep } from './processing-step';
import { SendCollectibleFormData } from './schema';

const mockClient = {};
const mockChainId = '1135';

jest.mock('@/hooks', () => ({
  useActiveAccount: jest.fn(),
  usePanna: jest.fn(() => ({
    client: mockClient,
    chainId: mockChainId
  }))
}));

jest.mock('../ui/dialog-stepper', () => ({
  useDialogStepper: jest.fn()
}));

jest.mock('src/core', () => ({
  ...jest.requireActual('src/core'),
  sendTransaction: jest.fn(),
  prepareContractCall: jest.fn()
}));

jest.mock('@/utils', () => ({
  getEnvironmentChain: jest.fn(),
  cn: jest.fn()
}));

jest.mock('../ui/dialog', () => ({
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  )
}));

const mockNext = jest.fn();
const mockGoToStep = jest.fn();
const mockSendTransaction = sendTransaction as jest.Mock;
const mockPrepareContractCall = prepareContractCall as jest.Mock;

describe('ProcessingStep', () => {
  const mockCollectible = {
    id: '1',
    imageType: ImageType.URL,
    image: 'test.png',
    name: 'Test Collectible',
    value: '1'
  };

  const mockTokenERC721 = {
    name: 'Test Token',
    symbol: 'TT',
    type: TokenERC.ERC721,
    address: '0x123',
    icon: null
  };

  const mockTokenERC1155 = {
    name: 'Test Token',
    symbol: 'TT',
    type: TokenERC.ERC1155,
    address: '0x123',
    icon: null
  };

  const mockAccount = {
    address: '0xabc'
  };

  const mockChain = { id: 1135 };

  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveAccount as jest.Mock).mockReturnValue(mockAccount);
    (useDialogStepper as jest.Mock).mockReturnValue({
      next: mockNext,
      goToStep: mockGoToStep,
      lastStep: 5
    });
    (getEnvironmentChain as jest.Mock).mockReturnValue(mockChain);
    mockPrepareContractCall.mockReturnValue({
      method: 'safeTransferFrom',
      params: []
    });
  });

  const TestWrapper = ({
    collectible = mockCollectible,
    token = mockTokenERC721,
    recipientAddress = '0x456',
    amount = '1'
  }: Partial<SendCollectibleFormData> = {}) => {
    const form = useForm<SendCollectibleFormData>({
      defaultValues: {
        collectible,
        token,
        recipientAddress,
        amount
      }
    });

    return <ProcessingStep form={form} />;
  };

  it('should render properly', () => {
    mockSendTransaction.mockResolvedValue({ transactionHash: '0xhash' });

    render(<TestWrapper />);

    expect(screen.getByText('Sending')).toBeInTheDocument();
    const loader = screen.getByTestId('loader-icon');
    expect(loader).toBeInTheDocument();
    expect(screen.getByText('Processing your transfer...')).toBeVisible();
  });

  it('should prepare ERC721 transaction with correct parameters', async () => {
    mockSendTransaction.mockResolvedValue({ transactionHash: '0xhash' });

    render(<TestWrapper token={mockTokenERC721} />);

    await waitFor(() => {
      expect(mockPrepareContractCall).toHaveBeenCalledWith({
        client: mockClient,
        chain: mockChain,
        method:
          'function safeTransferFrom(address from, address to, uint256 tokenId)',
        params: [mockAccount.address, '0x456', BigInt('1')],
        address: mockTokenERC721.address
      });
    });
  });

  it('should prepare ERC1155 transaction with correct parameters', async () => {
    mockSendTransaction.mockResolvedValue({ transactionHash: '0xhash' });

    render(
      <TestWrapper
        token={mockTokenERC1155}
        collectible={{ ...mockCollectible, value: '5' }}
        amount="3"
      />
    );

    await waitFor(() => {
      expect(mockPrepareContractCall).toHaveBeenCalledWith({
        client: mockClient,
        chain: mockChain,
        method:
          'function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)',
        params: [mockAccount.address, '0x456', BigInt('1'), '3', '0x'],
        address: mockTokenERC1155.address
      });
    });
  });

  it('should call sendTransaction with prepared transaction', async () => {
    const mockTransaction = { method: 'safeTransferFrom', params: [] };
    mockPrepareContractCall.mockReturnValue(mockTransaction);
    mockSendTransaction.mockResolvedValue({ transactionHash: '0xhash' });

    render(<TestWrapper />);

    await waitFor(() => {
      expect(mockSendTransaction).toHaveBeenCalledWith({
        account: mockAccount,
        transaction: mockTransaction
      });
    });
  });

  it('should call next on successful transaction', async () => {
    mockSendTransaction.mockResolvedValue({ transactionHash: '0xhash' });

    render(<TestWrapper />);

    await waitFor(() => {
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle generic transaction error', async () => {
    mockSendTransaction.mockRejectedValue(new Error('Network error'));

    render(<TestWrapper />);

    await waitFor(() => {
      expect(mockGoToStep).toHaveBeenCalledWith(5, { hideBackButton: true });
    });
  });

  it('should only send transaction once on mount', async () => {
    mockSendTransaction.mockResolvedValue({ transactionHash: '0xhash' });

    const { rerender } = render(<TestWrapper />);
    rerender(<TestWrapper />);

    await waitFor(() => {
      expect(mockSendTransaction).toHaveBeenCalledTimes(1);
    });
  });
});
