import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TokenBalance } from '@/mocks/token-balances';
import { truncateAddress } from '@/utils/address';
import { renderCryptoAmount } from '@/utils/utils';
import { useActiveAccount, useExternalWallet } from '../../../hooks';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
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
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import { Typography } from '../../ui/typography';
import { TransferFormData } from './schema';

type TransferAmountStepProps = {
  form: UseFormReturn<TransferFormData>;
};

// Amount display component for input endAdornment - shows USD and crypto equivalent
function AmountDisplay({
  tokenInfo,
  cryptoAmount
}: {
  tokenInfo: TokenBalance;
  cryptoAmount: string;
}) {
  // Format the crypto amount - remove trailing zeros
  const formattedAmount = parseFloat(cryptoAmount)
    .toFixed(6)
    .replace(/\.?0+$/, '');

  return (
    <div className="flex flex-col pr-3 text-right">
      <Typography variant="small" className="text-primary">
        USD
      </Typography>
      <Typography variant="muted" className="text-xs">
        {formattedAmount} {tokenInfo.token.symbol}
      </Typography>
    </div>
  );
}

export function TransferAmountStep({ form }: TransferAmountStepProps) {
  const { next } = useDialogStepper();
  const account = useActiveAccount();
  const { externalWallet } = useExternalWallet();
  const fromAddress = form.watch('fromAddress');
  const tokenInfo = form.watch('tokenInfo') as TokenBalance;
  const fiatAmount = form.watch('amount') || '0';

  const [cryptoAmount, setCryptoAmount] = useState<string>('0');

  // Get wallet name from wallet ID
  const getWalletName = () => {
    if (!externalWallet) return 'External Wallet';

    const walletId = externalWallet.id;
    if (walletId.includes('metamask')) return 'MetaMask';
    if (walletId.includes('coinbase')) return 'Coinbase Wallet';
    if (walletId.includes('walletconnect')) return 'WalletConnect';
    if (walletId.includes('rainbow')) return 'Rainbow';

    return 'External Wallet';
  };

  // Set the to address (embedded wallet)
  useEffect(() => {
    if (account?.address) {
      form.setValue('toAddress', account.address);
    }
  }, [account, form]);

  // Update crypto amount when fiat amount changes
  useEffect(() => {
    if (tokenInfo && fiatAmount) {
      const crypto = renderCryptoAmount(tokenInfo, fiatAmount);
      setCryptoAmount(crypto);
    } else {
      setCryptoAmount('0');
    }
  }, [fiatAmount, tokenInfo]);

  const handleMaxValue = () => {
    // Round down fiat amount to avoid insufficient balance errors
    form.setValue(
      'amount',
      Number(Math.floor(tokenInfo.fiatBalance.amount * 100) / 100).toFixed(2) ||
        '0'
    );
  };

  // Trigger validation and move to next step
  const handleFormSubmit = async () => {
    form.setValue('cryptoAmount', cryptoAmount);
    form.setValue('fiatAmount', fiatAmount);
    form.setValue('primaryAmountInput', 'fiat');

    const isFieldValid = await form.trigger();
    if (isFieldValid) {
      next();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Transfer {tokenInfo?.token.symbol || ''}</DialogTitle>
      </DialogHeader>

      {/* Transfer Section */}
      <div className="flex flex-col gap-4">
        <Label>Transfer</Label>

        <div className="relative flex flex-col gap-2">
          {/* From Card */}
          <Card className="flex flex-col gap-0 p-0">
            {/* Wallet Row */}
            <div className="flex flex-row items-center gap-4 px-3 py-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                <Typography variant="small">
                  {getWalletName().slice(0, 1)}
                </Typography>
              </div>

              <div className="flex-1">
                <Typography as="h1" variant="small">
                  {getWalletName()}
                </Typography>
                <Typography variant="muted">
                  {truncateAddress(fromAddress)}
                </Typography>
              </div>
            </div>

            <Separator />

            {/* Token Row */}
            <div className="flex flex-row items-center gap-4 px-3 py-3">
              <div className="relative">
                <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                  {tokenInfo?.token.icon ? (
                    <img
                      src={tokenInfo.token.icon}
                      alt={tokenInfo.token.symbol}
                      className="size-6"
                    />
                  ) : (
                    <Typography variant="small">
                      {tokenInfo?.token.symbol.slice(0, 1) || 'T'}
                    </Typography>
                  )}
                </div>
                <div className="ring-background absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 ring-2">
                  {tokenInfo?.token.icon ? (
                    <img
                      src={tokenInfo.token.icon}
                      alt="chain"
                      className="size-3"
                    />
                  ) : (
                    <div className="bg-muted size-2 rounded-full" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <Typography as="h1" variant="small">
                  {tokenInfo?.token.symbol || ''}
                </Typography>
                <Typography variant="muted">
                  {tokenInfo?.token.name || ''}
                </Typography>
              </div>

              <div className="text-right">
                <Typography as="h1" variant="small">
                  ${tokenInfo?.fiatBalance.amount.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="muted">
                  {tokenInfo?.tokenBalance.displayValue || '0'}{' '}
                  {tokenInfo?.token.symbol || ''}
                </Typography>
              </div>
            </div>
          </Card>

          {/* Caret Arrow Icon */}
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="border-border bg-background flex size-10 items-center justify-center rounded-full border">
              <ChevronDownIcon className="text-primary size-6" />
            </div>
          </div>

          {/* To Card */}
          <Card className="flex flex-col gap-0 p-0">
            {/* Wallet Row */}
            <div className="flex flex-row items-center gap-4 px-3 py-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                <Typography variant="small">Y</Typography>
              </div>

              <div className="flex-1">
                <Typography as="h1" variant="small">
                  Your account
                </Typography>
                <Typography variant="muted">
                  {account?.address ? truncateAddress(account.address) : '...'}
                </Typography>
              </div>
            </div>

            <Separator />

            {/* Token Row */}
            <div className="flex flex-row items-center gap-4 px-3 py-3">
              <div className="relative">
                <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                  {tokenInfo?.token.icon ? (
                    <img
                      src={tokenInfo.token.icon}
                      alt={tokenInfo.token.symbol}
                      className="size-6"
                    />
                  ) : (
                    <Typography variant="small">
                      {tokenInfo?.token.symbol.slice(0, 1) || 'T'}
                    </Typography>
                  )}
                </div>
                <div className="ring-background absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 ring-2">
                  {tokenInfo?.token.icon ? (
                    <img
                      src={tokenInfo.token.icon}
                      alt="chain"
                      className="size-3"
                    />
                  ) : (
                    <div className="bg-muted size-2 rounded-full" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <Typography as="h1" variant="small">
                  {tokenInfo?.token.symbol || ''}
                </Typography>
                <Typography variant="muted">
                  {tokenInfo?.token.name || ''}
                </Typography>
              </div>

              <div className="text-right">
                <Typography as="h1" variant="small">
                  $0
                </Typography>
                <Typography variant="muted">
                  0 {tokenInfo?.token.symbol || ''}
                </Typography>
              </div>
            </div>
          </Card>
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
                className="bg-muted hover:bg-border h-6 p-2"
                onClick={handleMaxValue}
              >
                Max
              </Button>
            </div>
            <FormControl>
              <Input
                {...field}
                placeholder="0"
                className="[&>input]:h-12"
                endAdornment={
                  tokenInfo && cryptoAmount !== '0' ? (
                    <AmountDisplay
                      tokenInfo={tokenInfo}
                      cryptoAmount={cryptoAmount}
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
      <Typography variant="muted" className="text-center">
        Estimated time <span className="text-primary">~2 min</span>
      </Typography>

      <Button
        type="button"
        onClick={handleFormSubmit}
        disabled={!tokenInfo || !fiatAmount || fiatAmount === '0'}
      >
        Transfer
      </Button>
    </div>
  );
}
