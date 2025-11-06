import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { getWalletName, isWalletId, type WalletIdValue } from 'src/core';
import { TokenBalance } from '@/mocks/token-balances';
import { lskIcon, ethIcon } from '@/react/consts/token-config';
import { getEnvironmentChain, renderCryptoAmount } from '@/utils';
import { truncateAddress } from '@/utils/address';
import {
  useAccountAvatar,
  useActiveAccount,
  useExternalWallet,
  usePanna,
  useTokenBalances
} from '../../../hooks';
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
  const { chainId } = usePanna();
  const fromAddress = form.watch('fromAddress');
  const tokenInfo = form.watch('tokenInfo') as TokenBalance;
  const fiatAmount = form.watch('amount') || '0';

  const sourceAddress =
    fromAddress || externalWallet?.getAccount()?.address || '';

  const chainDisplay = useMemo(() => {
    const chain = getEnvironmentChain(chainId);
    const chainName = chain?.name ?? '';
    const normalizedName = chainName.toLowerCase();

    if (normalizedName.includes('lisk')) {
      return {
        icon: lskIcon,
        label: chainName,
        initial: 'L'
      } as const;
    }

    if (normalizedName.includes('ethereum')) {
      return {
        icon: ethIcon,
        label: chainName,
        initial: 'E'
      } as const;
    }

    return {
      icon: undefined,
      label: chainName,
      initial: chainName.length > 0 ? chainName.charAt(0).toUpperCase() : 'N'
    } as const;
  }, [chainId]);

  const walletId = externalWallet?.id;
  const walletIdValue = useMemo<WalletIdValue | null>(() => {
    if (!walletId || !isWalletId(walletId)) {
      return null;
    }

    return walletId;
  }, [walletId]);

  type WalletImageId = Parameters<typeof useAccountAvatar>[0];
  const walletImageId = useMemo<WalletImageId>(() => {
    if (!walletIdValue) {
      return undefined;
    }

    if (walletIdValue === 'walletconnect') {
      return 'walletConnect' as WalletImageId;
    }

    return walletIdValue as WalletImageId;
  }, [walletIdValue]);

  const { data: walletImage } = useAccountAvatar(walletImageId);

  const walletDisplayName = useMemo(() => {
    if (!walletIdValue) {
      return 'External Wallet';
    }

    try {
      return getWalletName(walletIdValue);
    } catch (error) {
      console.warn('Unknown wallet ID detected:', walletIdValue, error);
      return 'External Wallet';
    }
  }, [walletIdValue]);

  const destinationAddress = account?.address ?? '';

  const {
    data: destinationBalances = [],
    isLoading: isDestinationBalancesLoading
  } = useTokenBalances(
    { address: destinationAddress },
    {
      enabled: Boolean(destinationAddress)
    }
  );

  const destinationTokenBalance = useMemo(() => {
    if (!tokenInfo?.token?.symbol) {
      return null;
    }

    const targetSymbol = tokenInfo.token.symbol.toLowerCase();
    const targetName = tokenInfo.token.name?.toLowerCase();
    const targetAddress = tokenInfo.token.address?.toLowerCase();

    return destinationBalances.find((balance) => {
      const balanceSymbol = balance.token.symbol?.toLowerCase();
      const balanceName = balance.token.name?.toLowerCase();
      const balanceAddress = balance.token.address?.toLowerCase();

      return (
        (targetAddress && balanceAddress === targetAddress) ||
        balanceSymbol === targetSymbol ||
        balanceName === targetName
      );
    });
  }, [destinationBalances, tokenInfo]);

  const destinationFiatAmount = useMemo(() => {
    if (!destinationTokenBalance) {
      return '0.00';
    }

    return destinationTokenBalance.fiatBalance.amount.toFixed(2);
  }, [destinationTokenBalance]);

  const destinationTokenDisplayValue =
    destinationTokenBalance?.tokenBalance.displayValue ?? '0';

  const sourceFiatAmount = tokenInfo?.fiatBalance?.amount ?? 0;
  const sourceFiatLabel = `$${sourceFiatAmount.toFixed(2)}`;
  const sourceTokenLabel = `${tokenInfo?.tokenBalance?.displayValue ?? '0'} ${
    tokenInfo?.token.symbol || ''
  }`;

  const [cryptoAmount, setCryptoAmount] = useState<string>('0');

  const destinationFiatLabel = isDestinationBalancesLoading
    ? '...'
    : `$${destinationFiatAmount}`;
  const destinationTokenLabel = isDestinationBalancesLoading
    ? '...'
    : `${destinationTokenDisplayValue} ${tokenInfo?.token.symbol || ''}`;

  // Set the to address (embedded wallet)
  useEffect(() => {
    if (!account?.address) {
      return;
    }

    form.setValue('toAddress', account.address, {
      shouldDirty: true,
      shouldValidate: true
    });
  }, [account?.address, form]);

  // Update crypto amount when fiat amount changes
  useEffect(() => {
    if (tokenInfo?.token?.symbol && fiatAmount) {
      const crypto = renderCryptoAmount(tokenInfo, fiatAmount);
      setCryptoAmount(crypto);
    } else {
      setCryptoAmount('0');
    }
  }, [fiatAmount, tokenInfo]);

  const handleMaxValue = () => {
    if (!tokenInfo?.fiatBalance) {
      form.setValue('amount', '0');
      return;
    }

    // Round down fiat amount to avoid insufficient balance errors
    const roundedFiatAmount =
      Math.floor(tokenInfo.fiatBalance.amount * 100) / 100;
    form.setValue(
      'amount',
      Number.isFinite(roundedFiatAmount) ? roundedFiatAmount.toFixed(2) : '0'
    );
  };

  // Trigger validation and move to next step
  const handleFormSubmit = async () => {
    form.setValue('cryptoAmount', cryptoAmount);
    form.setValue('fiatAmount', fiatAmount);

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
              <div className="bg-muted flex size-10 items-center justify-center overflow-hidden rounded-full">
                {walletImage ? (
                  <img
                    src={walletImage}
                    alt={`${walletDisplayName} logo`}
                    className="size-6"
                  />
                ) : (
                  <Typography variant="small">
                    {walletDisplayName.charAt(0)}
                  </Typography>
                )}
              </div>

              <div className="flex-1">
                <Typography as="h1" variant="small">
                  {walletDisplayName}
                </Typography>
                <Typography variant="muted">
                  {truncateAddress(sourceAddress)}
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
                  {chainDisplay.icon ? (
                    <img
                      src={chainDisplay.icon}
                      alt={`${chainDisplay.label || 'Network'} logo`}
                      className="size-3"
                    />
                  ) : (
                    <span className="text-[10px] font-semibold text-white">
                      {chainDisplay.initial}
                    </span>
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
                  {sourceFiatLabel}
                </Typography>
                <Typography variant="muted">{sourceTokenLabel}</Typography>
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
                  {truncateAddress(destinationAddress)}
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
                  {chainDisplay.icon ? (
                    <img
                      src={chainDisplay.icon}
                      alt={`${chainDisplay.label || 'Network'} logo`}
                      className="size-3"
                    />
                  ) : (
                    <span className="text-[10px] font-semibold text-white">
                      {chainDisplay.initial}
                    </span>
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
                  {destinationFiatLabel}
                </Typography>
                <Typography variant="muted">{destinationTokenLabel}</Typography>
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
