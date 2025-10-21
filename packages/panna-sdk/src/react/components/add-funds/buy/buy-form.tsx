import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  DialogStepper,
  useDialogStepper,
  type DialogStepperContextValue
} from '../../ui/dialog-stepper';
import { Form } from '../../ui/form';
import { ProcessingBuyStep } from './processing-buy-step';
import { buyFormSchema, type BuyFormData } from './schema';
import { SelectBuyProviderStep } from './select-buy-provider-step';
import { SelectBuyRegionStep } from './select-buy-region-step';
import { SelectBuyTokenStep } from './select-buy-token-step';
import { SpecifyBuyAmountStep } from './specify-buy-amount-step';

export type BuyFormProps = {
  onClose: () => void;
  stepperRef: ReturnType<typeof useRef<DialogStepperContextValue | null>>;
};

export function StepperRefProvider({
  stepperRef,
  children
}: {
  stepperRef: ReturnType<typeof useRef<DialogStepperContextValue | null>>;
  children: React.ReactNode;
}) {
  const stepperContext = useDialogStepper();

  useEffect(() => {
    stepperRef.current = stepperContext;
  }, [stepperContext, stepperRef]);

  return <>{children}</>;
}

export function BuyForm({ onClose, stepperRef }: BuyFormProps) {
  const form = useForm<BuyFormData>({
    resolver: zodResolver(buyFormSchema),
    defaultValues: {
      country: undefined,
      token: undefined,
      fiatAmount: undefined,
      cryptoAmount: undefined,
      provider: undefined
    },
    mode: 'onChange'
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        <DialogStepper>
          <StepperRefProvider stepperRef={stepperRef}>
            <SelectBuyRegionStep form={form} />
          </StepperRefProvider>
          <StepperRefProvider stepperRef={stepperRef}>
            <SelectBuyTokenStep form={form} />
          </StepperRefProvider>
          <StepperRefProvider stepperRef={stepperRef}>
            <SpecifyBuyAmountStep form={form} />
          </StepperRefProvider>
          <StepperRefProvider stepperRef={stepperRef}>
            <SelectBuyProviderStep form={form} />
          </StepperRefProvider>
          <StepperRefProvider stepperRef={stepperRef}>
            <ProcessingBuyStep onClose={onClose} form={form} />
          </StepperRefProvider>
        </DialogStepper>
      </form>
    </Form>
  );
}
