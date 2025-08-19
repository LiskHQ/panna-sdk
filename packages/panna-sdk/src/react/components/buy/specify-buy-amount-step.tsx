import type { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type SpecifyBuyAmountStepProps = {
  form: UseFormReturn<BuyFormData>;
};

export function SpecifyBuyAmountStep({ form }: SpecifyBuyAmountStepProps) {
  const { next, prev } = useDialogStepper();
  const token = form.watch('token');

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy {token?.symbol}</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => {
          const amountString = field.value?.toString() || '';

          return (
            <FormItem className="flex flex-col items-center gap-2">
              <FormControl>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      value={amountString}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          const numericValue = parseFloat(value);
                          if (!isNaN(numericValue)) {
                            field.onChange(numericValue);
                          } else if (value === '') {
                            field.onChange(undefined);
                          }
                        }
                      }}
                      className="w-fit max-w-[8ch] border-none bg-transparent text-center text-3xl font-bold outline-none"
                      size={Math.max(1, (amountString || '0').length)}
                    />
                    <Typography
                      variant="h2"
                      className="text-muted-foreground pb-0"
                    >
                      {token?.symbol}
                    </Typography>
                  </div>
                  <Typography variant="muted">
                    ~${((field.value || 0) * 0).toFixed(2)}
                  </Typography>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <div className="flex gap-3">
        {[25, 50, 100].map((v) => (
          <Button
            key={v}
            type="button"
            variant={form.watch('amount') === v ? 'default' : 'secondary'}
            onClick={() => form.setValue('amount', v)}
          >
            ${v}
          </Button>
        ))}
      </div>
      <footer className="flex w-full items-center gap-2">
        <Button
          variant="outline"
          type="button"
          className="flex-1"
          onClick={() => prev()}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={() => next()}
          disabled={!form.watch('amount') || form.watch('amount')! <= 0}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
