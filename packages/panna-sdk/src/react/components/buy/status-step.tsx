import { CheckIcon, CircleXIcon, ClockIcon } from 'lucide-react';
import {
  lisk,
  OnrampMoneySessionStatus,
  OnrampMoneySessionStatusEnum
} from 'src/core';
import { useDialog, usePanna } from '@/hooks';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';

/**
 * Handles the different final onramp status steps:
 * - Success
 * - Error
 * - Cancelled
 * - Expired
 * Created and pending states are handled in the processing step
 */
export function StatusStep() {
  const { stepData } = useDialogStepper<{
    status: Omit<OnrampMoneySessionStatus, 'created' | 'pending'>;
  }>();

  if (stepData?.status === OnrampMoneySessionStatusEnum.Failed) {
    return <ErrorStatus />;
  }

  if (stepData?.status === OnrampMoneySessionStatusEnum.Expired) {
    return <ExpiredStatus />;
  }

  if (stepData?.status === OnrampMoneySessionStatusEnum.Cancelled) {
    return <CancelledStatus />;
  }

  return <SuccessStatus />;
}

function SuccessStatus() {
  const { onClose } = useDialog();
  const { reset } = useDialogStepper();
  const { chainId } = usePanna();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center">
        <DialogTitle>Success</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3">
        <CheckIcon size={80} className="stroke-1" aria-label="Success" />
        <div className="space-y-2 text-center">
          <Typography variant="muted">Your purchase is complete.</Typography>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 text-center">
        <a
          href={
            chainId !== String(lisk.id)
              ? 'https://sepolia-blockscout.lisk.com'
              : 'https://blockscout.lisk.com'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography variant="small" className="underline">
            View on explorer
          </Typography>
        </a>
        <Button type="button" className="w-full" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

function ErrorStatus() {
  const { prev } = useDialogStepper();

  const handleRetry = () => {
    prev();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Typography variant="h4">Transaction failed</Typography>
      <CircleXIcon
        className="h-20 w-20 stroke-[#FF6366] stroke-1"
        aria-label="Transaction failed"
      />
      <div className="flex flex-col items-center gap-2">
        <Typography variant="large">Something went wrong</Typography>
        <Typography variant="muted">No funds were moved.</Typography>
      </div>
      <Button type="button" className="w-full" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}

function ExpiredStatus() {
  const { prev } = useDialogStepper();

  const handleRetry = () => {
    prev();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Typography variant="h4">Transaction failed</Typography>
      <ClockIcon
        className="h-20 w-20 stroke-[#FF6366] stroke-1"
        aria-label="Session expired"
      />
      <div className="flex flex-col items-center gap-2">
        <Typography variant="large">Session expired</Typography>
        <Typography variant="muted">No funds were moved.</Typography>
      </div>
      <Button type="button" className="w-full" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}

function CancelledStatus() {
  const { prev } = useDialogStepper();

  const handleRetry = () => {
    prev();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Typography variant="h4">Transaction cancelled</Typography>
      <CircleXIcon
        className="h-20 w-20 stroke-[#FF6366] stroke-1"
        aria-label="Session cancelled"
      />
      <Typography variant="muted">No funds were moved.</Typography>
      <Button type="button" className="w-full" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}
