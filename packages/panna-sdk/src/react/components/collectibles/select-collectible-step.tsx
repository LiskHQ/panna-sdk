import { DialogDescription } from '@radix-ui/react-dialog';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { ImageRenderer } from './collectibles-list';
import { SendCollectibleFormData } from './schema';

type SelectCollectibleStepProps = {
  form: UseFormReturn<SendCollectibleFormData>;
};

export function SelectCollectibleStep({ form }: SelectCollectibleStepProps) {
  const { collectible, token } = form.getValues();
  const { next } = useDialogStepper();

  return (
    <div className="flex flex-col gap-6">
      <DialogDescription className="sr-only">
        Send {token.name}
      </DialogDescription>
      <Card className="mt-6 p-0">
        <CardContent className="p-0">
          <ImageRenderer instance={collectible} />
        </CardContent>
      </Card>
      <Typography variant="large">
        {token.name} #{collectible.id}
      </Typography>
      <Button onClick={() => next()}>Send</Button>
    </div>
  );
}
