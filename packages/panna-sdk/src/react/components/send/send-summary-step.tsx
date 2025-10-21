import { DialogTitle } from '@radix-ui/react-dialog';
import { CheckCircleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FiatCurrency } from 'src/core';
import { useActiveWallet } from 'thirdweb/react';
import { SmartWalletOptions } from 'thirdweb/wallets';
import { currencyMap } from '@/consts/currencies';
import { Button } from '../ui/button';
import { DialogHeader } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { SendFormData } from './schema';

type SendSummaryStepProps = {
  form: UseFormReturn<SendFormData>;
};

export function SendSummaryStep({ form }: SendSummaryStepProps) {
  const { next } = useDialogStepper();
  const activeWallet = useActiveWallet();
  const currency = (form.getValues('tokenInfo.fiatBalance.currency') ||
    FiatCurrency.USD) as FiatCurrency;

  const isGasSponsored = useMemo(() => {
    const config = activeWallet?.getConfig();
    if (!config) {
      return false;
    }

    const smartAccountConfig = (
      config as unknown as { smartAccount: SmartWalletOptions }
    ).smartAccount;

    if (!smartAccountConfig) {
      return false;
    }

    // Check for sponsorGas property (handling both sponsorGas and legacy gasless)
    return 'sponsorGas' in smartAccountConfig
      ? smartAccountConfig.sponsorGas
      : 'gasless' in smartAccountConfig
        ? smartAccountConfig.gasless
        : false;
  }, [activeWallet]);

  const renderCryptoAmount = () => {
    const cryptoAmount = form.getValues('cryptoAmount');
    const symbol = form.getValues('tokenInfo.token.symbol') || 'LSK';
    return `${cryptoAmount} ${symbol}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Summary</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-1 text-center">
        <Typography variant="h2" className="pb-0">
          {renderCryptoAmount()}
        </Typography>
        <Typography variant="muted">
          ~{currencyMap[currency]}
          {form.getValues('fiatAmount')}
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="small">Send to</Typography>
        <Typography variant="small">
          {form.getValues('recipientAddress')}
        </Typography>
      </div>
      {isGasSponsored && (
        <div className="flex items-center gap-2">
          <CheckCircleIcon size={16} className="text-muted-foreground" />
          <Typography variant="muted">Gas sponsored</Typography>
        </div>
      )}
      <Button type="button" onClick={() => next({ hideBackButton: true })}>
        Send
      </Button>
    </div>
  );
}
