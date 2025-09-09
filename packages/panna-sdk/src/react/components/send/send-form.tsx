import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { StepperRefProvider } from '../buy/buy-form';
import { DialogStepper, DialogStepperContextValue } from '../ui/dialog-stepper';
import { Form } from '../ui/form';
import { sendFormSchema } from './schema';
import { SelectSendTokenStep } from './select-send-token-step';

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
      amount: 0
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        <DialogStepper>
          <StepperRefProvider stepperRef={stepperRef}>
            <SelectSendTokenStep form={form} />
          </StepperRefProvider>
          {/* <SendSpecifyAmountStep form={form} />
                    <SendEnterRecipientStep form={form} />
                    <SendReviewStep form={form} onClose={onClose} />
                    <ProcessingSendStep /> */}
          <div></div>
          <div></div>
        </DialogStepper>
      </form>
    </Form>
  );
}
