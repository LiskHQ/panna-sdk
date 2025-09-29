import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { ImageRenderer } from './collectibles-list';
import { SendCollectibleFormData } from './schema';

type SummaryStepProps = {
  form: UseFormReturn<SendCollectibleFormData>;
};

export function SummaryStep({ form }: SummaryStepProps) {
  const { collectible, token, recipientAddress } = form.getValues();
  const { next } = useDialogStepper();

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Summary</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3">
        <Card className="h-50 w-50 p-0">
          <CardContent className="p-0">
            <ImageRenderer instance={collectible} />
          </CardContent>
        </Card>
        <Typography className="mt-0!">
          {token.name} #{collectible.id}
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        <Typography>Send to</Typography>
        <Typography variant="small" className="text-primary mt-0!">
          {recipientAddress}
        </Typography>
      </div>
      <Button onClick={() => next({ hideBackButton: true })}>Send</Button>
    </div>
  );
}
