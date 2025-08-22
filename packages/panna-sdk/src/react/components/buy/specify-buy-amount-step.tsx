import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useFiatToCrypto, useSupportedTokens } from '../../hooks';
import { getEnvironmentChain, getCurrencySymbolForCountry } from '../../utils';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type SpecifyBuyAmountStepProps = {
  form: UseFormReturn<BuyFormData>;
};

export function SpecifyBuyAmountStep({ form }: SpecifyBuyAmountStepProps) {
  const { next, prev } = useDialogStepper();
  const token = form.watch('token');
  const fiatAmount = form.watch('amount');
  const country = form.watch('country');

  const { data: supportedTokens = [] } = useSupportedTokens();
  const chain = getEnvironmentChain();

  // Get currency symbol based on selected country
  const currencySymbol = useMemo(() => {
    return country?.code ? getCurrencySymbolForCountry(country.code) : '$';
  }, [country?.code]);

  // Get the token address for the selected token
  const tokenAddress = useMemo(() => {
    if (!token?.symbol) return undefined;
    const supportedToken = supportedTokens.find(
      (t) => t.symbol === token.symbol
    );
    return supportedToken?.address;
  }, [token?.symbol, supportedTokens]);

  // Convert fiat amount to crypto amount to show the estimate
  const {
    data: cryptoConversion,
    isLoading,
    isError
  } = useFiatToCrypto(
    {
      chain,
      tokenAddress,
      fiatAmount: fiatAmount || 0,
      currency: 'USD'
    },
    { enabled: !!fiatAmount && fiatAmount > 0 }
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy {token?.symbol}</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => {
          const amountString = field.value?.toString() || '';

          return (
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
                      value={amountString}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          const numericValue = parseFloat(value);
                          if (!isNaN(numericValue)) {
                            field.onChange(numericValue);
                          } else if (value === '') {
                            field.onChange(undefined);
                          }
                        }
                      }}
                      className="w-fit max-w-[8ch] border-none bg-transparent text-center text-3xl font-bold outline-none"
                      size={Math.max(1, (amountString || '0').length)}
                    />
                  </div>
                  <Typography variant="muted">
                    {isLoading
                      ? 'Loading...'
                      : isError
                        ? 'Error'
                        : cryptoConversion?.amount
                          ? cryptoConversion.amount.toFixed(6) +
                            ' ' +
                            token?.symbol
                          : `0 ${token?.symbol}`}
                  </Typography>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <div className="flex gap-3">
        {[25, 50, 100].map((value) => (
          <Button
            key={value}
            type="button"
            variant={form.watch('amount') === value ? 'default' : 'secondary'}
            onClick={() => form.setValue('amount', value)}
          >
            {currencySymbol}
            {value}
          </Button>
        ))}
      </div>
      <footer className="flex w-full items-center gap-2">
        <Button
          variant="outline"
          type="button"
          className="flex-1"
          onClick={() => prev()}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={() => next()}
          disabled={!form.watch('amount') || form.watch('amount')! <= 0}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
