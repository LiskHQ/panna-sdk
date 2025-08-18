import { LoaderCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './types';

type ProcessingBuyStepProps = {
  onClose: () => void;
  formData: BuyFormData;
};

export function ProcessingBuyStep({
  onClose,
  formData
}: ProcessingBuyStepProps) {
  const { reset } = useDialogStepper();

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Processing payment</DialogTitle>
      </DialogHeader>
      <LoaderCircleIcon size={48} className="text-primary animate-spin" />
      <Typography variant="muted" className="text-center">
        Keep this window open until all transactions are complete.
      </Typography>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          reset();
          onClose();
        }}
      >
        Cancel transaction
      </Button>
    </div>
  );
}
