import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DialogStepper } from '../ui/dialog-stepper';
import { Form } from '../ui/form';
import { ProcessingBuyStep } from './processing-buy-step';
import { buyFormSchema, type BuyFormData } from './schema';
import { SelectBuyProviderStep } from './select-buy-provider-step';
import { SelectBuyRegionStep } from './select-buy-region-step';
import { SelectBuyTokenStep } from './select-buy-token-step';
import { SpecifyBuyAmountStep } from './specify-buy-amount-step';

type BuyFormProps = { onClose: () => void };

export function BuyForm({ onClose }: BuyFormProps) {
  const form = useForm<BuyFormData>({
    resolver: zodResolver(buyFormSchema),
    defaultValues: {
      country: undefined,
      token: undefined,
      amount: undefined,
      provider: undefined
    },
    mode: 'onChange'
  });

  console.log(form.watch());

  return (
    <Form {...form}>
      <form className="space-y-6">
        <DialogStepper>
          <SelectBuyRegionStep form={form} />
          <SelectBuyTokenStep form={form} />
          <SpecifyBuyAmountStep form={form} />
          <SelectBuyProviderStep form={form} />
          <ProcessingBuyStep onClose={onClose} form={form} />
        </DialogStepper>
      </form>
    </Form>
  );
}
