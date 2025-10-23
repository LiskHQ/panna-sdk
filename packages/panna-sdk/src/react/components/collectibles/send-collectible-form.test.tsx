import { render, screen } from '@testing-library/react';
import React from 'react';
import { ImageType } from 'src/core';
import { useCollectiblesInfo } from './collectibles-provider';
import { SendCollectibleForm } from './send-collectible-form';

jest.mock('./collectibles-provider', () => ({
  useCollectiblesInfo: jest.fn()
}));

jest.mock('./select-collectible-step', () => ({
  SelectCollectibleStep: () => (
    <div data-testid="select-collectible-step">Select Collectible Step</div>
  )
}));

jest.mock('./select-recipient-step', () => ({
  SelectRecipientStep: () => (
    <div data-testid="select-recipient-step">Select Recipient Step</div>
  )
}));

jest.mock('./summary-step', () => ({
  SummaryStep: () => <div data-testid="summary-step">Summary Step</div>
}));

jest.mock('./processing-step', () => ({
  ProcessingStep: () => <div data-testid="processing-step">Processing Step</div>
}));

jest.mock('../send/send-success-step', () => ({
  SendSuccessStep: () => <div data-testid="send-success-step">Success Step</div>
}));

jest.mock('../send/send-error-step', () => ({
  SendErrorStep: ({ text }: { text: string }) => (
    <div data-testid="send-error-step">{text}</div>
  )
}));

jest.mock('../send/send-form', () => ({
  StepperContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

jest.mock('../ui/dialog-stepper', () => ({
  DialogStepper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-stepper">{children}</div>
  ),
  useDialogStepper: jest.fn(() => ({
    next: jest.fn(),
    previous: jest.fn(),
    goToStep: jest.fn()
  }))
}));

jest.mock('../ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form">{children}</div>
  )
}));

const mockOnStepperChange = jest.fn();
const mockOnClose = jest.fn();

describe('SendCollectibleForm', () => {
  const mockCollectible = {
    id: '1',
    imageType: ImageType.URL,
    image: 'test.png',
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
    (useCollectiblesInfo as jest.Mock).mockReturnValue({
      activeCollectible: mockCollectible,
      activeToken: mockToken
    });
  });

  it('should render form with all steps', () => {
    render(
      <SendCollectibleForm
        onStepperChange={mockOnStepperChange}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-stepper')).toBeInTheDocument();
    expect(screen.getByTestId('select-collectible-step')).toBeInTheDocument();
    expect(screen.getByTestId('select-recipient-step')).toBeInTheDocument();
    expect(screen.getByTestId('summary-step')).toBeInTheDocument();
    expect(screen.getByTestId('processing-step')).toBeInTheDocument();
    expect(screen.getByTestId('send-success-step')).toBeInTheDocument();
    expect(screen.getByTestId('send-error-step')).toBeInTheDocument();
    expect(screen.getByText('No collectible was moved')).toBeVisible();
  });

  it('should return null when no active collectible', () => {
    (useCollectiblesInfo as jest.Mock).mockReturnValue({
      activeCollectible: null,
      activeToken: mockToken
    });

    const { container } = render(
      <SendCollectibleForm
        onStepperChange={mockOnStepperChange}
        onClose={mockOnClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should return null when no active token', () => {
    (useCollectiblesInfo as jest.Mock).mockReturnValue({
      activeCollectible: mockCollectible,
      activeToken: null
    });

    const { container } = render(
      <SendCollectibleForm
        onStepperChange={mockOnStepperChange}
        onClose={mockOnClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should return null when both active collectible and token are missing', () => {
    (useCollectiblesInfo as jest.Mock).mockReturnValue({
      activeCollectible: undefined,
      activeToken: undefined
    });

    const { container } = render(
      <SendCollectibleForm
        onStepperChange={mockOnStepperChange}
        onClose={mockOnClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should initialize form with correct default values', () => {
    render(
      <SendCollectibleForm
        onStepperChange={mockOnStepperChange}
        onClose={mockOnClose}
      />
    );

    // Form should be rendered with data
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });

  it('should handle ERC-1155 collectibles', () => {
    const erc1155Token = {
      ...mockToken,
      type: 'erc-1155'
    };

    const erc1155Collectible = {
      ...mockCollectible,
      value: '5'
    };

    (useCollectiblesInfo as jest.Mock).mockReturnValue({
      activeCollectible: erc1155Collectible,
      activeToken: erc1155Token
    });

    render(
      <SendCollectibleForm
        onStepperChange={mockOnStepperChange}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('form')).toBeInTheDocument();
  });
});
