import { CheckIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { DialogHeader, DialogTitle } from '../../ui/dialog';
import { Typography } from '../../ui/typography';

type TransferSuccessStepProps = {
  onClose: () => void;
};

export function TransferSuccessStep({ onClose }: TransferSuccessStepProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center">
        <DialogTitle>Success</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3">
        <CheckIcon size={80} />
        <div className="space-y-2 text-center">
          <Typography variant="muted">Your transfer is complete.</Typography>
        </div>
      </div>
      <Button
        variant="secondary"
        className="bg-muted w-full"
        onClick={() => {
          onClose();
        }}
      >
        Close
      </Button>
    </div>
  );
}
