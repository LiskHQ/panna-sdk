import { ArrowDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TokenBalance } from '@/mocks/token-balances';
import { truncateAddress } from '@/utils/address';
import { useActiveAccount } from '../../../hooks';
import { Button } from '../../ui/button';
import { DialogHeader, DialogTitle } from '../../ui/dialog';
import { useDialogStepper } from '../../ui/dialog-stepper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Typography } from '../../ui/typography';
import { TransferFormData } from './schema';

type TransferAmountStepProps = {
  form: UseFormReturn<TransferFormData>;
};

// Helper to render crypto amount based on token and fiat input
const renderCryptoAmount = (
  tokenData: TokenBalance,
  fiatAmount: string
): string => {
  const fiatValue = parseFloat(fiatAmount);
  if (isNaN(fiatValue) || fiatValue === 0) return '0';

  const tokenPrice =
    tokenData.fiatBalance.amount /
    parseFloat(tokenData.tokenBalance.displayValue);

  if (tokenPrice === 0) return '0';

  return (fiatValue / tokenPrice).toFixed(8);
};

// Helper to render fiat amount based on token and crypto input
const renderFiatAmount = (
  tokenData: TokenBalance,
  cryptoAmount: string
): string => {
  const cryptoValue = parseFloat(cryptoAmount);
  if (isNaN(cryptoValue) || cryptoValue === 0) return '0';

  const tokenPrice =
    tokenData.fiatBalance.amount /
    parseFloat(tokenData.tokenBalance.displayValue);

  return (cryptoValue * tokenPrice).toFixed(2);
};

// Amount display component for input endAdornment
function AmountDisplay({
  tokenInfo,
  primaryInput,
  secondaryInput,
  secondaryAmount,
  handleInputSwap
}: {
  tokenInfo: TokenBalance;
  primaryInput: 'crypto' | 'fiat';
  secondaryInput: 'crypto' | 'fiat';
  secondaryAmount: string;
  handleInputSwap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={handleInputSwap}
      className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1 transition-colors"
    >
      <div className="text-right">
        <Typography variant="small" className="text-muted-foreground text-xs">
          {secondaryInput === 'crypto'
            ? `${secondaryAmount} ${tokenInfo.token.symbol}`
            : `$${secondaryAmount}`}
        </Typography>
      </div>
    </button>
  );
}

export function TransferAmountStep({ form }: TransferAmountStepProps) {
  const { next } = useDialogStepper();
  const account = useActiveAccount();
  const fromAddress = form.watch('fromAddress');
  const tokenInfo = form.watch('tokenInfo') as TokenBalance;
  const amount = form.watch('amount') || '0';

  const [primaryInput, setPrimaryInput] = useState<'crypto' | 'fiat'>('fiat');
  const [secondaryInput, setSecondaryInput] = useState<'crypto' | 'fiat'>(
    'crypto'
  );
  const [secondaryAmount, setSecondaryAmount] = useState<string>('0');
  const [inputSwap, setInputSwap] = useState<boolean>(false);

  // Set the to address (embedded wallet)
  useEffect(() => {
    if (account?.address) {
      form.setValue('toAddress', account.address);
    }
  }, [account, form]);

  // Update secondary amount when primary amount changes
  useEffect(() => {
    if (!inputSwap && tokenInfo) {
      handleAmountChange(tokenInfo, amount);
    } else {
      setInputSwap(false);
    }
  }, [amount, tokenInfo]);

  const handleAmountChange = (tokenData: TokenBalance, inputAmount: string) => {
    if (primaryInput === 'fiat') {
      setSecondaryAmount(renderCryptoAmount(tokenData, inputAmount) || '0');
    } else {
      setSecondaryAmount(renderFiatAmount(tokenData, inputAmount) || '0');
    }
  };

  // Swap primary and secondary input types
  const handleInputSwap = () => {
    setInputSwap(true);
    setPrimaryInput(secondaryInput);
    setSecondaryInput(primaryInput);

    if (primaryInput === 'fiat') {
      setSecondaryAmount(amount);
      form.setValue('amount', secondaryAmount);
      form.setValue('primaryAmountInput', 'crypto');
    } else {
      setSecondaryAmount(amount);
      form.setValue('amount', secondaryAmount);
      form.setValue('primaryAmountInput', 'fiat');
    }
  };

  const handleMaxValue = () => {
    if (primaryInput === 'crypto') {
      form.setValue('amount', tokenInfo.tokenBalance.displayValue || '0');
    } else {
      // Round down fiat amount to avoid insufficient balance errors
      form.setValue(
        'amount',
        Number(Math.floor(tokenInfo.fiatBalance.amount * 100) / 100).toFixed(
          2
        ) || '0'
      );
    }
  };

  // Trigger validation and move to next step
  const handleFormSubmit = async () => {
    if (primaryInput === 'fiat') {
      form.setValue('cryptoAmount', secondaryAmount);
      form.setValue('fiatAmount', amount);
    } else {
      form.setValue('fiatAmount', secondaryAmount);
      form.setValue('cryptoAmount', amount);
    }

    const isFieldValid = await form.trigger();
    if (isFieldValid) {
      next();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Transfer details</DialogTitle>
      </DialogHeader>

      {/* From/To Section */}
      <div className="border-border flex flex-col gap-3 rounded-lg border p-4">
        {/* From */}
        <div className="flex items-center justify-between">
          <Typography variant="small" className="text-muted-foreground">
            From
          </Typography>
          <Typography variant="small" className="font-medium">
            {truncateAddress(fromAddress)}
          </Typography>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
            <ArrowDownIcon className="text-muted-foreground h-4 w-4" />
          </div>
        </div>

        {/* To */}
        <div className="flex items-center justify-between">
          <Typography variant="small" className="text-muted-foreground">
            To (Embedded Wallet)
          </Typography>
          <Typography variant="small" className="font-medium">
            {account?.address ? truncateAddress(account.address) : '...'}
          </Typography>
        </div>
      </div>

      {/* Token Info */}
      <div className="border-border flex items-center gap-3 rounded-lg border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
          {tokenInfo?.token.icon ? (
            <img
              src={tokenInfo.token.icon}
              alt={tokenInfo.token.symbol}
              className="h-6 w-6"
            />
          ) : (
            <Typography variant="small">
              {tokenInfo?.token.symbol.slice(0, 1)}
            </Typography>
          )}
        </div>
        <div className="flex-1">
          <Typography variant="small" className="font-medium">
            {tokenInfo?.token.name}
          </Typography>
          <Typography variant="muted" className="text-xs">
            Available: {tokenInfo?.tokenBalance.displayValue}{' '}
            {tokenInfo?.token.symbol}
          </Typography>
        </div>
      </div>

      {/* Amount Input */}
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3">
            <div className="flex justify-between">
              <FormLabel>Amount</FormLabel>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="bg-muted hover:bg-border! h-6 p-2"
                onClick={handleMaxValue}
              >
                Max
              </Button>
            </div>
            <FormControl>
              <Input
                {...field}
                placeholder={`0 ${tokenInfo?.token.symbol || 'LSK'}`}
                className="[&>input]:h-13"
                endAdornment={
                  tokenInfo ? (
                    <AmountDisplay
                      tokenInfo={tokenInfo}
                      primaryInput={primaryInput}
                      secondaryInput={secondaryInput}
                      secondaryAmount={secondaryAmount}
                      handleInputSwap={handleInputSwap}
                    />
                  ) : undefined
                }
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow digits and a single period
                  if (/^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
                inputMode="decimal"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Estimated Time */}
      <div className="bg-muted/50 rounded-lg p-3">
        <Typography
          variant="small"
          className="text-muted-foreground text-center"
        >
          Estimated transfer time: ~2 min
        </Typography>
      </div>

      <Button
        type="button"
        onClick={handleFormSubmit}
        disabled={!tokenInfo || !amount || amount === '0'}
      >
        Transfer
      </Button>
    </div>
  );
}
