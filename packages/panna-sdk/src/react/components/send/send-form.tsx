import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  DialogStepper,
  DialogStepperContextValue,
  useDialogStepper
} from '../ui/dialog-stepper';
import { Form } from '../ui/form';
import { sendFormSchema } from './schema';
import { SendErrorStep } from './send-error-step';
import { SendProcessingStep } from './send-processing-step';
import { SendSelectTokenStep } from './send-select-token-step';
import { SendSuccessStep } from './send-success-step';
import { SendSummaryStep } from './send-summary-step';

type SendFormProps = {
  onStepperChange: (stepper: DialogStepperContextValue | null) => void;
  onClose: () => void;
};

export function StepperContextProvider({
  onStepperChange,
  children
}: {
  onStepperChange: (stepper: DialogStepperContextValue | null) => void;
  children: React.ReactNode;
}) {
  const stepperContext = useDialogStepper();

  useEffect(() => {
    onStepperChange(stepperContext);
  }, []);

  return <>{children}</>;
}

export function SendForm({ onStepperChange, onClose }: SendFormProps) {
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
      amount: '',
      fiatAmount: '0',
      cryptoAmount: '0',
      primaryAmountInput: 'fiat'
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        <DialogStepper>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SendSelectTokenStep form={form} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SendSummaryStep form={form} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SendProcessingStep form={form} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SendSuccessStep onClose={onClose} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SendErrorStep />
          </StepperContextProvider>
        </DialogStepper>
      </form>
    </Form>
  );
}
