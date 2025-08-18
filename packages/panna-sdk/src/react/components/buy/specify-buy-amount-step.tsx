import { useState } from 'react';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import type { BuyStepData, Token } from './types';

export function SpecifyBuyAmountStep() {
  const { next, prev, stepData } = useDialogStepper();
  const token: Token | undefined = (stepData as Partial<BuyStepData>).token;
  const [amount, setAmount] = useState<string>('');

  const handleAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

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
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-fit max-w-[8ch] border-none bg-transparent text-center text-3xl font-bold outline-none"
            size={Math.max(1, (amount || '0').length)}
          />
          <Typography variant="h2" className="text-muted-foreground pb-0">
            {token?.symbol}
          </Typography>
        </div>
        <Typography variant="muted">
          ~${(parseFloat(amount) * 0 || 0).toFixed(2)}
        </Typography>
      </div>
      <div className="flex gap-3">
        {[25, 50, 100].map((v) => (
          <Button
            key={v}
            variant={parseFloat(amount) === v ? 'default' : 'secondary'}
            onClick={() => setAmount(v.toString())}
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
          onClick={() =>
            next({ amount: parseFloat(amount) } as Partial<BuyStepData>)
          }
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
