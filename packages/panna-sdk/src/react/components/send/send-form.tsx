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
      token: {
        address: '',
        symbol: '',
        name: '',
        icon: ''
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
