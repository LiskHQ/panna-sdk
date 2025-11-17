import { CheckIcon, CircleXIcon } from 'lucide-react';
import {
  OnrampMoneySessionStatus,
  OnrampMoneySessionStatusEnum
} from 'src/core';
import { useDialog } from '@/hooks';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';

export function StatusStep() {
  const { stepData } = useDialogStepper<{ status: OnrampMoneySessionStatus }>();

  if (stepData.status === OnrampMoneySessionStatusEnum.Failed) {
    return <ErrorStatus />;
  }

  if (stepData.status === OnrampMoneySessionStatusEnum.Expired) {
    return <ExpiredStatus />;
  }

  return <SuccessStatus />;
}

function SuccessStatus() {
  const { onClose } = useDialog();
  const { reset } = useDialogStepper();

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
        <CheckIcon size={80} />
        <div className="space-y-2 text-center">
          <Typography variant="muted">Your purchase is complete.</Typography>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 text-center">
        <a
          href="http://blockscout.lisk.com"
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
      <CircleXIcon className="h-20 w-20 stroke-[#FF6366]" />
      <div className="flex flex-col items-center gap-2">
        <Typography variant="large">Something went wrong</Typography>
        <Typography variant="muted">No funds were moved</Typography>
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
      <CircleXIcon className="h-20 w-20 stroke-[#FF6366]" />
      <div className="flex flex-col items-center gap-2">
        <Typography variant="large">Session expired</Typography>
        <Typography variant="muted">No funds were moved</Typography>
      </div>
      <Button type="button" className="w-full" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}
