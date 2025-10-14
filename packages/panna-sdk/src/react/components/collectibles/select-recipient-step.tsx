import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { SendCollectibleFormData } from './schema';

type SelectRecipientStepProps = {
  form: UseFormReturn<SendCollectibleFormData>;
};

export function SelectRecipientStep({ form }: SelectRecipientStepProps) {
  const { next } = useDialogStepper();
  const { recipientAddress } = form.watch();

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Send collectible</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="recipientAddress"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3">
            <FormLabel>Send to</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Recipient's address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={() => next()} disabled={!recipientAddress}>
        Next
      </Button>
    </div>
  );
}
