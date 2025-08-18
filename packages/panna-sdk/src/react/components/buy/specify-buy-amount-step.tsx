import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import type { Token } from './types';

type SpecifyBuyAmountStepProps = {
  amount?: number;
  onAmountChange: (amount: number) => void;
  token?: Token;
  error?: string;
};

export function SpecifyBuyAmountStep({
  amount,
  onAmountChange,
  token,
  error
}: SpecifyBuyAmountStepProps) {
  const { next, prev } = useDialogStepper();
  const amountString = amount?.toString() || '';

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy {token?.symbol}</DialogTitle>
      </DialogHeader>
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
                  onAmountChange(numericValue);
                } else if (value === '') {
                  onAmountChange(0);
                }
              }
            }}
            className="w-fit max-w-[8ch] border-none bg-transparent text-center text-3xl font-bold outline-none"
            size={Math.max(1, (amountString || '0').length)}
          />
          <Typography variant="h2" className="text-muted-foreground pb-0">
            {token?.symbol}
          </Typography>
        </div>
        <Typography variant="muted">
          ~${(amount || 0 * 0).toFixed(2)}
        </Typography>
        {error && (
          <Typography className="text-center text-sm text-red-500">
            {error}
          </Typography>
        )}
      </div>
      <div className="flex gap-3">
        {[25, 50, 100].map((v) => (
          <Button
            key={v}
            variant={amount === v ? 'default' : 'secondary'}
            onClick={() => onAmountChange(v)}
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
          className="flex-1"
          onClick={() => next()}
          disabled={!amount || amount <= 0}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
