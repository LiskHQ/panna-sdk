import { ArrowDownUpIcon, ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useActiveAccount } from 'thirdweb/react';
import { formatEther } from 'viem';
import { currencyMap } from '@/consts/currencies';
import { useTokenBalances } from '@/hooks/use-token-balances';
import { TokenBalance, tokenIconMap } from '@/mocks/token-balances';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Typography } from '../ui/typography';
import { SendFormData } from './schema';

type SendSelectTokenStepProps = {
  form: UseFormReturn<SendFormData>;
};

export function SendSelectTokenStep({ form }: SendSelectTokenStepProps) {
  const { next } = useDialogStepper();
  const [open, setOpen] = useState(false);
  const account = useActiveAccount();
  const { data: tokens = [] } = useTokenBalances(
    { address: account?.address as string },
    {
      enabled: !!account?.address
    }
  );
  const [primaryInput, setPrimaryInput] = useState<'crypto' | 'fiat'>('fiat');
  const [secondaryInput, setSecondaryInput] = useState<'crypto' | 'fiat'>(
    'crypto'
  );
  const [secondaryAmount, setSecondaryAmount] = useState<number>(0);
  const [inputSwap, setInputSwap] = useState<boolean>(false);
  const amount = form.watch('amount') || 0;
  const tokenInfo = form.watch('tokenInfo') as TokenBalance;

  useEffect(() => {
    // Set default token to ETH when tokens are loaded
    if (tokens.length && !tokenInfo.token.name) {
      const defaultToken = tokens.find(
        (token) => token.token.symbol === 'ETH'
      ) as TokenBalance;
      form.setValue('tokenInfo', defaultToken);
    }
  }, [tokens]);

  useEffect(() => {
    // Update secondary amount when primary amount changes on input
    // rather than on input swap
    if (!inputSwap) {
      if (primaryInput === 'fiat') {
        setSecondaryAmount(
          renderCryptoAmount() ? Number(renderCryptoAmount()) : 0
        );
      } else {
        setSecondaryAmount(renderFiatAmount() ? Number(renderFiatAmount()) : 0);
      }
    } else {
      setInputSwap(false);
    }
  }, [amount]);

  useEffect(() => {
    // Upon returning to this step from summary step,
    // set the primary and secondary inputs based on
    // what was previously selected
    const primaryInputAmount = form.getValues('primaryAmountInput');
    if (primaryInputAmount === 'crypto') {
      setInputSwap(true);
      setSecondaryAmount(renderFiatAmount() ? Number(renderFiatAmount()) : 0);
      setPrimaryInput('crypto');
      setSecondaryInput('fiat');
    }
  }, []);

  const renderFiatAmount = () => {
    // This function calculates the fiat equivalent of the crypto amount
    // using the formula: (fiatBalance * inputAmount * tokenDecimals) / tokenBalance
    // We multiply by 10 ^ 18 to retain precision during division
    // then format the result from wei to ether
    return Number(
      formatEther(
        BigInt(
          tokenInfo.fiatBalance.amount *
            (!isNaN(amount) ? amount : 0) *
            10 ** tokenInfo.token.decimals *
            10 ** 18
        ) / (tokenInfo.tokenBalance.value || BigInt(1))
      )
    ).toFixed(2);
  };

  const renderCryptoAmount = () => {
    return Number(
      formatEther(
        (tokenInfo.tokenBalance.value *
          BigInt((!isNaN(amount) ? amount : 0) * 10 ** 18)) /
          BigInt(
            (tokenInfo.fiatBalance.amount || 1) * 10 ** tokenInfo.token.decimals
          )
      )
    ).toFixed(6);
  };

  // Swap primary and secondary input types
  const handleInputSwap = () => {
    setInputSwap(true);
    setPrimaryInput(secondaryInput);
    setSecondaryInput(primaryInput);

    if (primaryInput === 'fiat') {
      setSecondaryAmount(form.getValues('amount') || 0);
      form.setValue('amount', secondaryAmount);
      form.setValue('primaryAmountInput', 'crypto');
    } else {
      setSecondaryAmount(form.getValues('amount') || 0);
      form.setValue('amount', secondaryAmount);
      form.setValue('primaryAmountInput', 'fiat');
    }
  };

  const handleMaxValue = () => {
    if (primaryInput === 'crypto') {
      form.setValue(
        'amount',
        Number(form.getValues('tokenInfo')?.tokenBalance.displayValue) || 0
      );
    } else {
      form.setValue(
        'amount',
        Number(
          Number(form.getValues('tokenInfo')?.fiatBalance.amount).toFixed(2)
        ) || 0
      );
    }
  };

  // Trigger fields validation and move to next step if valid
  const handleFormSubmit = async () => {
    if (primaryInput === 'fiat') {
      form.setValue('cryptoAmount', secondaryAmount);
      form.setValue('fiatAmount', Number(amount));
    } else {
      form.setValue('fiatAmount', secondaryAmount);
      form.setValue('cryptoAmount', Number(amount));
    }

    const isFieldValid = await form.trigger();
    if (isFieldValid) {
      next();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Send</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="tokenInfo"
        render={({ field }) => {
          const handleTokenSelect = (selectedToken: TokenBalance) => {
            field.onChange(selectedToken);
            setOpen(false);
          };

          return (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>Asset</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex h-14 w-full justify-between"
                    >
                      {field.value?.token.name ? (
                        <TokenItem
                          tokenData={
                            tokens.find(
                              (t) => t.token.name === field.value?.token.name
                            )!
                          }
                          withSelect
                        />
                      ) : (
                        <Typography variant="small">Select asset</Typography>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="max-h-[400px] w-[var(--radix-popover-trigger-width)] overflow-hidden p-0"
                    align="start"
                    sideOffset={4}
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Command className="max-h-[400px] overflow-hidden">
                      <CommandInput
                        placeholder="Search for an asset"
                        className="h-9"
                      />
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>No asset found.</CommandEmpty>
                        <CommandGroup>
                          {tokens.map((tokenData) => (
                            <CommandItem
                              key={tokenData.token.symbol}
                              value={tokenData.token.name}
                              onSelect={() => handleTokenSelect(tokenData)}
                              className="flex w-full justify-between"
                            >
                              <TokenItem tokenData={tokenData} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name="recipientAddress"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3">
            <FormLabel>Send to</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Recipient's address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
                onClick={() => handleMaxValue()}
              >
                Max
              </Button>
            </div>
            <FormControl>
              <Input
                {...field}
                placeholder={`0 ${tokenInfo.token.symbol || 'LSK'}`}
                className="[&>input]:h-13"
                endAdornment={
                  <AmountDisplay
                    tokenInfo={tokenInfo}
                    primaryInput={primaryInput}
                    secondaryInput={secondaryInput}
                    secondaryAmount={secondaryAmount}
                    handleInputSwap={handleInputSwap}
                  />
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        onClick={() => handleFormSubmit()}
        disabled={!tokenInfo.token.name}
      >
        Next
      </Button>
    </div>
  );
}

type TokenItemProps = {
  tokenData: TokenBalance;
  withSelect?: boolean;
};

function TokenItem({ tokenData, withSelect = false }: TokenItemProps) {
  return (
    <>
      <div className="flex gap-3 text-left">
        <div className="flex items-center justify-center">
          {tokenData?.token.symbol ? (
            <img
              className="h-5 w-5"
              src={tokenIconMap[tokenData.token.symbol]}
              alt={tokenData.token.symbol}
            />
          ) : null}
        </div>
        {withSelect ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Typography variant="small">{tokenData.token.symbol}</Typography>
              <ChevronDownIcon className="opacity-50" />
            </div>
            <Typography variant="muted">{tokenData.token.name}</Typography>
          </div>
        ) : (
          <div className="flex flex-col">
            <Typography variant="small">{tokenData.token.symbol}</Typography>
            <Typography variant="muted">{tokenData.token.name}</Typography>
          </div>
        )}
      </div>
      <div className="flex flex-col text-right">
        <Typography variant="small">
          {Number(tokenData.tokenBalance.displayValue).toFixed(6)}
        </Typography>
        <Typography variant="muted">
          {currencyMap[tokenData.fiatBalance.currency]}
          {tokenData.fiatBalance.amount.toFixed(2)}
        </Typography>
      </div>
    </>
  );
}

type AmountDisplayProps = {
  tokenInfo: TokenBalance;
  primaryInput: 'crypto' | 'fiat';
  secondaryInput: 'crypto' | 'fiat';
  secondaryAmount: number;
  handleInputSwap: () => void;
};

function AmountDisplay({
  tokenInfo,
  primaryInput,
  secondaryInput,
  secondaryAmount,
  handleInputSwap
}: AmountDisplayProps) {
  return (
    <div className="flex items-center gap-3 pr-3">
      <div className="flex flex-col text-right">
        <Typography variant="small">
          {primaryInput === 'fiat'
            ? tokenInfo.fiatBalance.currency
            : `${tokenInfo.token.symbol}`}
        </Typography>
        <Typography variant="muted">
          {tokenInfo.token.name && (
            <>
              {secondaryInput === 'crypto'
                ? `${secondaryAmount} ${tokenInfo.token.symbol}`
                : `${currencyMap[tokenInfo.fiatBalance.currency]}${secondaryAmount}`}
            </>
          )}
        </Typography>
      </div>
      {tokenInfo.token.name && (
        <ArrowDownUpIcon
          className="stroke-foreground"
          onClick={handleInputSwap}
        />
      )}
    </div>
  );
}
