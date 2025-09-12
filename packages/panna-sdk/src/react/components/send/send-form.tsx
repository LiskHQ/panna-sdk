import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { StepperRefProvider } from '../buy/buy-form';
import { DialogStepper, DialogStepperContextValue } from '../ui/dialog-stepper';
import { Form } from '../ui/form';
import { sendFormSchema } from './schema';
import { SendSelectTokenStep } from './select-send-token-step';
import { SendSummaryStep } from './send-summary-step';

type SendFormProps = {
  stepperRef: ReturnType<typeof useRef<DialogStepperContextValue | null>>;
  onClose: () => void;
};

export function SendForm({ stepperRef, onClose }: SendFormProps) {
  const form = useForm({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      tokenInfo: {
        token: {
          decimals: 0,
          symbol: '',
          name: '',
          icon: ''
        },
        tokenBalance: {
          value: 0n,
          displayValue: '0'
        },
        fiatBalance: {
          amount: 0,
          currency: ''
        }
      },
      recipientAddress: '',
      amount: 0,
      fiatAmount: 0,
      cryptoAmount: 0,
      primaryAmountInput: 'fiat'
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        <DialogStepper>
          <StepperRefProvider stepperRef={stepperRef}>
            <SendSelectTokenStep form={form} />
          </StepperRefProvider>
          <StepperRefProvider stepperRef={stepperRef}>
            <SendSummaryStep form={form} />
          </StepperRefProvider>
          {/*   <SendEnterRecipientStep form={form} />
                    <SendReviewStep form={form} onClose={onClose} />
                    <ProcessingSendStep /> */}
        </DialogStepper>
      </form>
    </Form>
  );
}
