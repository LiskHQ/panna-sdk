import { DialogTitle } from '@radix-ui/react-dialog';
import { UseFormReturn } from 'react-hook-form';
import { FiatCurrency } from 'src/core';
import { currencyMap } from '@/consts/currencies';
import { Button } from '../ui/button';
import { DialogHeader } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { SendFormData } from './schema';

type SendSummaryStepProps = {
  form: UseFormReturn<SendFormData>;
};

export function SendSummaryStep({ form }: SendSummaryStepProps) {
  const { next } = useDialogStepper();
  const currency = (form.getValues('tokenInfo.fiatBalance.currency') ||
    'USD') as FiatCurrency;

  const renderCryptoAmount = () => {
    const cryptoAmount = form.getValues('cryptoAmount');
    const symbol = form.getValues('tokenInfo.token.symbol') || 'LSK';
    return `${cryptoAmount} ${symbol}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Summary</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-1 text-center">
        <Typography variant="h2" className="pb-0">
          {renderCryptoAmount()}
        </Typography>
        <Typography variant="muted">
          ~{currencyMap[currency]}
          {form.getValues('fiatAmount')}
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="small">Send to</Typography>
        <Typography variant="small">
          {form.getValues('recipientAddress')}
        </Typography>
      </div>
      <Button type="button" onClick={() => next()}>
        Send
      </Button>
    </div>
  );
}
