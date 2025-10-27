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
import { Typography } from '../ui/typography';
import { SendCollectibleFormData } from './schema';

type SelectRecipientStepProps = {
  form: UseFormReturn<SendCollectibleFormData>;
};

export function SelectRecipientStep({ form }: SelectRecipientStepProps) {
  const { next } = useDialogStepper();
  const { recipientAddress, collectible, amount } = form.watch();

  const handleSubmit = async () => {
    const isFieldValid = await form.trigger();
    if (isFieldValid) {
      next();
    }
  };

  const handleMaxValue = () => {
    const maxValue = collectible?.value ?? '1';
    form.setValue('amount', maxValue);
  };

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
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <FormLabel>Quantity</FormLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="bg-muted hover:bg-border! h-6 p-2"
                  onClick={() => handleMaxValue()}
                >
                  Max
                </Button>
              </div>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Quantity"
                  type="number"
                  min={1}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits to a maximum of 4 characters
                    if (/^\d{0,4}$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
            </div>
            <Typography variant="muted" className="text-xs">
              Max {collectible?.value ?? 1} available
            </Typography>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        onClick={() => handleSubmit()}
        disabled={!recipientAddress || !amount}
      >
        Next
      </Button>
    </div>
  );
}
