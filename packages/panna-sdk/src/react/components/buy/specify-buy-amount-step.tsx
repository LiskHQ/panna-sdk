import { useState } from 'react';
import { cn } from '@/utils';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography, typographyVariants } from '../ui/typography';
import type { BuyStepData, Token } from './types';

export function SpecifyBuyAmountStep() {
  const { next, prev, stepData } = useDialogStepper();
  const token: Token | undefined = (stepData as Partial<BuyStepData>).token;
  const [amount, setAmount] = useState<number>(0);

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy {token?.symbol}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-2">
        <Typography variant="h2">
          {amount}{' '}
          <span
            className={cn(
              typographyVariants({ variant: 'h2' }),
              'text-muted-foreground'
            )}
          >
            {token?.symbol}
          </span>
        </Typography>
        <Typography variant="muted">~${(amount * 0).toFixed(2)}</Typography>
      </div>
      <div className="flex gap-3">
        {[25, 50, 100].map((v) => (
          <Button
            key={v}
            variant={amount === v ? 'default' : 'secondary'}
            onClick={() => setAmount(v)}
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
          onClick={() => next({ amount } as Partial<BuyStepData>)}
          disabled={amount <= 0}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
