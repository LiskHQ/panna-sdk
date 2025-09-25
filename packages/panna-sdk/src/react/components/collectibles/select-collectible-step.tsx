import {
  DialogClose,
  DialogDescription,
  DialogTitle
} from '@radix-ui/react-dialog';
import { ArrowLeftIcon, XIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { DialogHeader } from '../ui/dialog';
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
      <DialogHeader className="items-center gap-0">
        <DialogTitle className="sr-only">Send {token.name}</DialogTitle>
        <div className="flex w-full items-center justify-between gap-2">
          <button type="button">
            <ArrowLeftIcon
              size={20}
              className="text-muted-foreground hover:text-primary transition-colors"
            />
          </button>
          <DialogClose>
            <XIcon
              size={20}
              className="text-muted-foreground hover:text-primary transition-colors"
            />
          </DialogClose>
        </div>
      </DialogHeader>
      <Card className="p-0">
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
