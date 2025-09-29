import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StepperContextProvider } from '../send/send-form';
import { SendSuccessStep } from '../send/send-success-step';
import { DialogStepper, DialogStepperContextValue } from '../ui/dialog-stepper';
import { Form } from '../ui/form';
import { useCollectiblesInfo } from './collectibles-provider';
import { ProcessingStep } from './processing-step';
import { SendCollectibleFormData, sendCollectibleFormSchema } from './schema';
import { SelectCollectibleStep } from './select-collectible-step';
import { SelectRecipientStep } from './select-recipient-step';
import { SummaryStep } from './summary-step';

type SendCollectibleFormProps = {
  onStepperChange: (stepper: DialogStepperContextValue | null) => void;
  onClose: () => void;
};

export function SendCollectibleForm({
  onStepperChange,
  onClose
}: SendCollectibleFormProps) {
  const { activeCollectible, activeToken } = useCollectiblesInfo();
  const form = useForm<SendCollectibleFormData>({
    resolver: zodResolver(sendCollectibleFormSchema),
    defaultValues: {
      collectible: activeCollectible,
      token: activeToken,
      recipientAddress: ''
    }
  });

  if (!activeCollectible || !activeToken) {
    return null;
  }

  return (
    <Form {...form}>
      <form>
        <DialogStepper>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SelectCollectibleStep form={form} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SelectRecipientStep form={form} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SummaryStep form={form} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <ProcessingStep form={form} />
          </StepperContextProvider>
          <StepperContextProvider onStepperChange={onStepperChange}>
            <SendSuccessStep onClose={onClose} />
          </StepperContextProvider>
        </DialogStepper>
      </form>
    </Form>
  );
}
