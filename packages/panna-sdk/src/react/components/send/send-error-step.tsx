import { CircleXIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';

export function SendErrorStep({ text }: { text?: string }) {
  const { goToStep, lastStep } = useDialogStepper();

  const handleRetry = () => {
    goToStep(lastStep - 2); // Navigate back to the "Processing" step
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Typography variant="h4">Transaction failed</Typography>
      <CircleXIcon className="h-20 w-20 stroke-[#FF6366]" />
      <div className="flex flex-col items-center gap-2">
        <Typography variant="large">Something went wrong</Typography>
        <Typography variant="muted">
          {text || 'No funds were moved.'}
        </Typography>
      </div>
      <Button className="w-full" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}
