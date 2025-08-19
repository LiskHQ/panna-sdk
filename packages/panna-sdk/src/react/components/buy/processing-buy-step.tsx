import { LoaderCircleIcon } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type ProcessingBuyStepProps = {
  onClose: () => void;
  form: UseFormReturn<BuyFormData>;
};

export function ProcessingBuyStep({ onClose, form }: ProcessingBuyStepProps) {
  const { reset } = useDialogStepper();
  const formData = form.getValues();

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
