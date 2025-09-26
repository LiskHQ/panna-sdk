import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SendSuccessStep } from '../send/send-success-step';
import { DialogStepper } from '../ui/dialog-stepper';
import { Form } from '../ui/form';
import { useCollectiblesInfo } from './collectibles-provider';
import { ProcessingStep } from './processing-step';
import { SendCollectibleFormData, sendCollectibleFormSchema } from './schema';
import { SelectCollectibleStep } from './select-collectible-step';
import { SelectRecipientStep } from './select-recipient-step';
import { SummaryStep } from './summary-step';

type SendCollectibleFormProps = {
  onClose: () => void;
};

export function SendCollectibleForm({ onClose }: SendCollectibleFormProps) {
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
          <SelectCollectibleStep form={form} />
          <SelectRecipientStep form={form} />
          <SummaryStep form={form} />
          <ProcessingStep form={form} />
          <SendSuccessStep onClose={onClose} />
        </DialogStepper>
      </form>
    </Form>
  );
}
