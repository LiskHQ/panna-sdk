import { fireEvent, render, screen } from '@testing-library/react';
import { useDialog } from '@/hooks';
import { Dialog } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { StatusStep } from './status-step';

jest.mock('@/hooks');
jest.mock('../ui/dialog-stepper');

describe('StatusStep', () => {
  const mockOnClose = jest.fn();
  const mockReset = jest.fn();
  const mockPrev = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDialog as jest.Mock).mockReturnValue({ onClose: mockOnClose });
  });

  describe('SuccessStatus', () => {
    beforeEach(() => {
      (useDialogStepper as jest.Mock).mockReturnValue({
        stepData: { status: 'completed' },
        reset: mockReset
      });
    });

    it('renders success status correctly', () => {
      render(
        <Dialog open>
          <StatusStep />
        </Dialog>
      );
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(
        screen.getByText('Your purchase is complete.')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });

    it('calls reset and onClose when close button is clicked', () => {
      render(
        <Dialog open>
          <StatusStep />
        </Dialog>
      );
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('ErrorStatus', () => {
    beforeEach(() => {
      (useDialogStepper as jest.Mock).mockReturnValue({
        stepData: { status: 'failed' },
        prev: mockPrev
      });
    });

    it('renders error status correctly', () => {
      render(
        <Dialog open>
          <StatusStep />
        </Dialog>
      );
      expect(screen.getByText('Transaction failed')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('No funds were moved')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('calls prev when try again button is clicked', () => {
      render(
        <Dialog open>
          <StatusStep />
        </Dialog>
      );
      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);
      expect(mockPrev).toHaveBeenCalledTimes(1);
    });
  });

  describe('ExpiredStatus', () => {
    beforeEach(() => {
      (useDialogStepper as jest.Mock).mockReturnValue({
        stepData: { status: 'expired' },
        prev: mockPrev
      });
    });

    it('renders expired status correctly', () => {
      render(
        <Dialog open>
          <StatusStep />
        </Dialog>
      );
      expect(screen.getByText('Transaction failed')).toBeInTheDocument();
      expect(screen.getByText('Session expired')).toBeInTheDocument();
      expect(screen.getByText('No funds were moved')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('calls prev when try again button is clicked', () => {
      render(
        <Dialog open>
          <StatusStep />
        </Dialog>
      );
      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);
      expect(mockPrev).toHaveBeenCalledTimes(1);
    });
  });
});
