import { Loader2Icon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { Typography } from '../ui/typography';
import { SendFormData } from './schema';

type SendProcessingStepProps = {
  form: UseFormReturn<SendFormData>;
};

export function SendProcessingStep({ form }: SendProcessingStepProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center">
        <DialogTitle>Sending</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3">
        <Loader2Icon size={80} className="animate-spin" />
        <div className="space-y-2 text-center">
          <Typography variant="muted">Processing your transfer...</Typography>
        </div>
      </div>
    </div>
  );
}
