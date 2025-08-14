import { DialogStepper } from '../ui/dialog-stepper';
import { ProcessingBuyStep } from './processing-buy-step';
import { SelectBuyProviderStep } from './select-buy-provider-step';
import { SelectBuyRegionStep } from './select-buy-region-step';
import { SelectBuyTokenStep } from './select-buy-token-step';
import { SpecifyBuyAmountStep } from './specify-buy-amount-step';
import type { BuyFlowProps } from './types';

export function BuyFlow({ onClose }: BuyFlowProps) {
  return (
    <DialogStepper>
      <SelectBuyRegionStep />
      <SelectBuyTokenStep />
      <SpecifyBuyAmountStep />
      <SelectBuyProviderStep />
      <ProcessingBuyStep onClose={onClose} />
    </DialogStepper>
  );
}
