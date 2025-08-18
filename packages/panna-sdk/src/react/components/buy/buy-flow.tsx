import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DialogStepper } from '../ui/dialog-stepper';
import { ProcessingBuyStep } from './processing-buy-step';
import { buyFormSchema } from './schema';
import { SelectBuyProviderStep } from './select-buy-provider-step';
import { SelectBuyRegionStep } from './select-buy-region-step';
import { SelectBuyTokenStep } from './select-buy-token-step';
import { SpecifyBuyAmountStep } from './specify-buy-amount-step';
import type {
  BuyFlowProps,
  BuyFormData,
  Country,
  Token,
  Provider
} from './types';

export function BuyFlow({ onClose }: BuyFlowProps) {
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

  const { watch, setValue, getValues, formState } = form;
  const formData = watch();
  const { errors } = formState;

  return (
    <DialogStepper>
      <SelectBuyRegionStep
        selectedCountry={formData.country}
        onCountryChange={(country: Country) => setValue('country', country)}
        error={errors.country?.message}
      />
      <SelectBuyTokenStep
        selectedToken={formData.token}
        onTokenChange={(token: Token) => setValue('token', token)}
        error={errors.token?.message}
      />
      <SpecifyBuyAmountStep
        amount={formData.amount}
        onAmountChange={(amount: number) => setValue('amount', amount)}
        token={formData.token}
        error={errors.amount?.message}
      />
      <SelectBuyProviderStep
        selectedProvider={formData.provider}
        onProviderChange={(provider: Provider) =>
          setValue('provider', provider)
        }
        formData={getValues()}
        error={errors.provider?.message}
      />
      <ProcessingBuyStep onClose={onClose} formData={getValues()} />
    </DialogStepper>
  );
}
