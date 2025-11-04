import { UseFormReturn } from 'react-hook-form';
import { TokenERC } from 'src/core';
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
import { MIN_ERC1155_VALUE, SendCollectibleFormData } from './schema';

type SelectRecipientStepProps = {
  form: UseFormReturn<SendCollectibleFormData>;
};

const ONLY_DIGITS_REGEX = /^\d+$/;

export function SelectRecipientStep({ form }: SelectRecipientStepProps) {
  const { next } = useDialogStepper();
  const { recipientAddress, token, collectible, amount } = form.watch();
  const MAX_ERC1155_AMOUNT = collectible?.value as string;

  const handleSubmit = async () => {
    const isFieldValid = await form.trigger();
    if (isFieldValid) {
      next();
    }
  };

  const handleMaxValue = () => {
    form.setValue('amount', MAX_ERC1155_AMOUNT);
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
      {token.type === TokenERC.ERC1155 && (
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
                    min={MIN_ERC1155_VALUE}
                    max={MAX_ERC1155_AMOUNT}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow digits
                      if (ONLY_DIGITS_REGEX.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
              </div>
              <Typography variant="muted" className="text-xs">
                Max {MAX_ERC1155_AMOUNT} available
              </Typography>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
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
