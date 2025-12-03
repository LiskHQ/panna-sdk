import { useMemo, useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { DEFAULT_COUNTRY_CODE, type FiatCurrency } from 'src/core';
import { useFiatToCrypto, useSupportedTokens } from '../../hooks';
import {
  getEnvironmentChain,
  getCurrencyForCountry,
  getCurrencySymbol
} from '../../utils';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

const DECIMAL_NUMBER_REGEX = /^\d*\.?\d*$/;

type SpecifyBuyAmountStepProps = {
  form: UseFormReturn<BuyFormData>;
};

export function SpecifyBuyAmountStep({ form }: SpecifyBuyAmountStepProps) {
  const { next } = useDialogStepper();
  const token = form.watch('token');
  const fiatAmount = form.watch('fiatAmount');
  const country = form.watch('country');
  const currencyCode = getCurrencyForCountry(
    country?.code ?? DEFAULT_COUNTRY_CODE
  );
  const currencySymbol = getCurrencySymbol(currencyCode);

  const { data: supportedTokens = [] } = useSupportedTokens();
  const chain = getEnvironmentChain();

  // Input state for decimal handling
  const [inputValue, setInputValue] = useState(fiatAmount?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);

  // Sync from form value when input is not focused
  // This handles: preset buttons, normalization on blur
  useEffect(() => {
    if (!isFocused) {
      setInputValue(fiatAmount?.toString() || '');
    }
  }, [fiatAmount, isFocused]);

  const tokenAddress = useMemo(() => {
    if (!token?.address) {
      return undefined;
    }
    // Since the token now comes with address from the form, we can use it directly
    // but still validate it exists in our supported tokens list for security
    const supportedToken = supportedTokens.find(
      (supportedToken) => supportedToken.address === token.address
    );
    return supportedToken?.address;
  }, [token?.address, supportedTokens]);

  const {
    data: cryptoConversion,
    isLoading,
    isError,
    error
  } = useFiatToCrypto(
    {
      chain,
      tokenAddress,
      tokenSymbol: token?.symbol,
      fiatAmount: fiatAmount || 0,
      currency: currencyCode as FiatCurrency
    },
    { enabled: !!fiatAmount && fiatAmount > 0 }
  );

  // Update crypto amount in form when conversion changes
  useEffect(() => {
    if (cryptoConversion?.amount) {
      form.setValue('cryptoAmount', cryptoConversion.amount);
    } else {
      form.setValue('cryptoAmount', undefined);
    }
  }, [cryptoConversion?.amount, form]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: number | undefined) => void
  ) => {
    const value = e.target.value;
    if (value === '' || DECIMAL_NUMBER_REGEX.test(value)) {
      setInputValue(value);

      if (value === '') {
        fieldOnChange(undefined);
      } else if (value !== '.') {
        // Only update form value if it's not a lone '.' (preserve previous value)
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          fieldOnChange(numericValue);
        }
      }
      // If value is '.', do not update form value (preserve previous)
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy {token?.symbol}</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="fiatAmount"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center gap-2">
            <FormControl>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <Typography
                    variant="h2"
                    className="text-muted-foreground pb-0"
                  >
                    {currencySymbol}
                  </Typography>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={inputValue}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => handleInputChange(e, field.onChange)}
                    className="w-fit max-w-[8ch] border-none bg-transparent text-center text-3xl font-bold outline-none"
                    size={Math.max(1, (inputValue || '0').length)}
                  />
                </div>
                <Typography variant="muted">
                  {isLoading
                    ? 'Loading...'
                    : isError
                      ? error?.message?.includes('Price not available')
                        ? 'Amount shown on next step'
                        : 'Error'
                      : cryptoConversion?.amount
                        ? `≈ ${cryptoConversion.amount.toFixed(6)} ${token?.symbol}`
                        : `0 ${token?.symbol}`}
                </Typography>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-3">
        {[25, 50, 100].map((value) => (
          <Button
            key={value}
            type="button"
            variant={
              form.watch('fiatAmount') === value ? 'default' : 'secondary'
            }
            onClick={() => form.setValue('fiatAmount', value)}
          >
            {currencySymbol}
            {value}
          </Button>
        ))}
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() => next()}
        disabled={!form.watch('fiatAmount') || form.watch('fiatAmount')! <= 0}
      >
        Next
      </Button>
    </div>
  );
}
