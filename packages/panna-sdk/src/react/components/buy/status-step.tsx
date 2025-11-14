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
      <Button
        variant="secondary"
        className="bg-muted w-full"
        onClick={handleClose}
      >
        Close
      </Button>
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
      <Typography variant="h4">Error</Typography>
      <CircleXIcon className="h-20 w-20 stroke-[#FF6366]" />
      <div className="flex flex-col items-center gap-2">
        <Typography variant="large">Something went wrong</Typography>
        <Typography variant="muted">No funds were moved</Typography>
      </div>
      <Button className="w-full" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}
