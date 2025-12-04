import { ArrowDownUpIcon, ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useActiveAccount } from 'thirdweb/react';
import { useTokenBalances } from '@/hooks/use-token-balances';
import { TokenBalance, tokenIconMap } from '@/mocks/token-balances';
import { renderCryptoAmount, renderFiatAmount } from '@/utils';
import { getCurrencySymbol } from '@/utils/countries';
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

const MAX_AMOUNT_DIGITS = 15;
const DIGIT_EXTRACTION_REGEX = /(\d+)/g;
const AMOUNT_INPUT_REGEX = /^\d*\.?\d*$/;

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
  const [secondaryAmount, setSecondaryAmount] = useState<string>('0');
  const [inputSwap, setInputSwap] = useState<boolean>(false);
  const amount = form.watch('amount') || '0';
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
      handleAmountChange(tokenInfo, amount);
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
      setSecondaryAmount(
        renderFiatAmount(tokenInfo, amount)
          ? renderFiatAmount(tokenInfo, amount)
          : '0'
      );
      setPrimaryInput('crypto');
      setSecondaryInput('fiat');
    }
  }, []);

  const handleAmountChange = (tokenData: TokenBalance, inputAmount: string) => {
    if (primaryInput === 'fiat') {
      setSecondaryAmount(
        renderCryptoAmount(tokenData, inputAmount)
          ? renderCryptoAmount(tokenData, inputAmount)
          : '0'
      );
    } else {
      setSecondaryAmount(
        renderFiatAmount(tokenData, inputAmount)
          ? renderFiatAmount(tokenData, inputAmount)
          : '0'
      );
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
      // Rounding down the fiat amount to 2 decimal places
      // to avoid slight disparity due to rounding
      // e.g. If fiat balance is 0.89982424, setting amount to
      // 0.90 would render fiat amount greater than
      // token fiat balance then throw "Insufficient balance" error.
      // Instead, we set it to 0.89
      form.setValue(
        'amount',
        Number(Math.floor(tokenInfo.fiatBalance.amount * 100) / 100).toFixed(
          2
        ) || '0'
      );
    }
  };

  // Trigger fields validation and move to next step if valid
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
        <DialogTitle>Send</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="tokenInfo"
        render={({ field }) => {
          const handleTokenSelect = (selectedToken: TokenBalance) => {
            field.onChange(selectedToken);
            handleAmountChange(selectedToken, amount);
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
                onChange={(e) => {
                  const value = e.target.value;

                  // Count the number of digits
                  const digits = value.match(DIGIT_EXTRACTION_REGEX);
                  const numDigits = digits
                    ? digits.reduce((a, c) => a + c.length, 0)
                    : 0;

                  // Only allow digits, single period, and max MAX_AMOUNT_DIGITS
                  if (
                    AMOUNT_INPUT_REGEX.test(value) &&
                    numDigits <= MAX_AMOUNT_DIGITS
                  ) {
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
          {getCurrencySymbol(tokenData.fiatBalance.currency)}
          {Number(Math.floor(tokenData.fiatBalance.amount * 100) / 100).toFixed(
            2
          )}
        </Typography>
      </div>
    </>
  );
}

type AmountDisplayProps = {
  tokenInfo: TokenBalance;
  primaryInput: 'crypto' | 'fiat';
  secondaryInput: 'crypto' | 'fiat';
  secondaryAmount: string;
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
                : `${getCurrencySymbol(tokenInfo.fiatBalance.currency)}${secondaryAmount}`}
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
