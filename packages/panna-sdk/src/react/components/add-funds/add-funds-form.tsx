import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  DialogStepper,
  useDialogStepper,
  type DialogStepperContextValue
} from '../ui/dialog-stepper';
import { Form } from '../ui/form';
import { AddFundsEntryStep } from './add-funds-entry-step';
import { ProcessingBuyStep } from './buy/processing-buy-step';
import { buyFormSchema, type BuyFormData } from './buy/schema';
import { SelectBuyProviderStep } from './buy/select-buy-provider-step';
import { SelectBuyRegionStep } from './buy/select-buy-region-step';
import { SelectBuyTokenStep } from './buy/select-buy-token-step';
import { SpecifyBuyAmountStep } from './buy/specify-buy-amount-step';
import {
  transferFormSchema,
  type TransferFormData
} from './transfer-from-wallet/schema';
import { TransferAmountStep } from './transfer-from-wallet/transfer-amount-step';
import { TransferErrorStep } from './transfer-from-wallet/transfer-error-step';
import { TransferProcessingStep } from './transfer-from-wallet/transfer-processing-step';
import { TransferSelectTokenStep } from './transfer-from-wallet/transfer-select-token-step';
import { TransferSuccessStep } from './transfer-from-wallet/transfer-success-step';

export type AddFundsFormProps = {
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

type FlowType = 'none' | 'buy' | 'transfer';

export function AddFundsForm({ onClose, stepperRef }: AddFundsFormProps) {
  const [selectedFlow, setSelectedFlow] = useState<FlowType>('none');

  // Buy form
  const buyForm = useForm<BuyFormData>({
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

  // Transfer form
  const transferForm = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      fromAddress: '',
      toAddress: '',
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
      amount: '',
      fiatAmount: '0',
      cryptoAmount: '0',
      primaryAmountInput: 'fiat'
    }
  });

  const handleBuySelected = () => {
    setSelectedFlow('buy');
  };

  const handleTransferSelected = () => {
    setSelectedFlow('transfer');
  };

  return (
    <>
      {selectedFlow === 'none' && (
        <AddFundsEntryStep
          onBuySelected={handleBuySelected}
          onTransferSelected={handleTransferSelected}
        />
      )}

      {selectedFlow === 'buy' && (
        <Form {...buyForm}>
          <form className="space-y-6">
            <DialogStepper>
              <StepperRefProvider stepperRef={stepperRef}>
                <SelectBuyRegionStep form={buyForm} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <SelectBuyTokenStep form={buyForm} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <SpecifyBuyAmountStep form={buyForm} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <SelectBuyProviderStep form={buyForm} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <ProcessingBuyStep onClose={onClose} form={buyForm} />
              </StepperRefProvider>
            </DialogStepper>
          </form>
        </Form>
      )}

      {selectedFlow === 'transfer' && (
        <Form {...transferForm}>
          <form className="space-y-6">
            <DialogStepper>
              <StepperRefProvider stepperRef={stepperRef}>
                <TransferSelectTokenStep form={transferForm} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <TransferAmountStep form={transferForm} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <TransferProcessingStep form={transferForm} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <TransferSuccessStep onClose={onClose} />
              </StepperRefProvider>
              <StepperRefProvider stepperRef={stepperRef}>
                <TransferErrorStep />
              </StepperRefProvider>
            </DialogStepper>
          </form>
        </Form>
      )}
    </>
  );
}
