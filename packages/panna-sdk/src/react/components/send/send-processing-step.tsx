import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  lisk,
  liskSepolia,
  prepareTransaction,
  sendTransaction,
  toWei
} from 'src/core';
import { useActiveAccount, usePanna } from '@/hooks';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { SendFormData } from './schema';

type SendProcessingStepProps = {
  form: UseFormReturn<SendFormData>;
};

export function SendProcessingStep({ form }: SendProcessingStepProps) {
  const { client } = usePanna();
  const { next } = useDialogStepper();
  const account = useActiveAccount();

  // @Todo: Possibly create hook for this logic
  useEffect(() => {
    const transaction = prepareTransaction({
      client,
      chain: process.env.NODE_ENV === 'development' ? liskSepolia : lisk,
      to: form.getValues('recipientAddress') as `0x${string}`,
      value: BigInt(toWei(String(form.getValues('cryptoAmount'))))
    });
    console.log('Prepared transaction:', transaction);

    async function sendToken() {
      try {
        const result = await sendTransaction({
          account: account!,
          transaction
        });

        console.log('Success! Transaction hash:', result.transactionHash);
        next();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('insufficient funds')) {
          console.error('Not enough balance to send transaction');
        } else if (errorMessage.includes('user rejected')) {
          console.error('User rejected the transaction');
        } else {
          console.error('Transaction failed:', errorMessage);
        }
      }
    }

    sendToken();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center">
        <DialogTitle>Sending</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3">
        <Loader2Icon size={80} className="animate-spin" />
        <div className="space-y-2 text-center">
          <Typography variant="muted">Processing your transfer...</Typography>
        </div>
      </div>
    </div>
  );
}
