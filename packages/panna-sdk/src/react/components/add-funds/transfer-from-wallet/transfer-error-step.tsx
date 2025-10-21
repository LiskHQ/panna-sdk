import { CircleXIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { useDialogStepper } from '../../ui/dialog-stepper';
import { Typography } from '../../ui/typography';

export function TransferErrorStep({ text }: { text?: string }) {
  const { goToStep, lastStep } = useDialogStepper();

  const handleRetry = () => {
    // Navigate back to the amount step (2 steps before error)
    goToStep(lastStep - 2);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Typography variant="h4">Transfer failed</Typography>
      <CircleXIcon className="h-20 w-20 stroke-[#FF6366]" />
      <div className="flex flex-col items-center gap-2">
        <Typography variant="large">Something went wrong</Typography>
        <Typography variant="muted">
          {text || 'The transfer could not be completed.'}
        </Typography>
      </div>
      <Button className="w-full" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}
