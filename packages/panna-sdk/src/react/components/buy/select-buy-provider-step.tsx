import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useActiveAccount } from 'thirdweb/react';
import {
  useBuyWithFiatQuotes,
  useFiatToCrypto,
  useSupportedTokens
} from '../../hooks';
import type { BuyWithFiatQuote } from '../../types/buy-with-fiat-quote.types';
import { getEnvironmentChain } from '../../utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type SelectBuyProviderStepProps = {
  form: UseFormReturn<BuyFormData>;
};

export function SelectBuyProviderStep({ form }: SelectBuyProviderStepProps) {
  const { next, prev } = useDialogStepper();

  const activeAccount = useActiveAccount();
  const { token, country, amount } = form.watch();

  const receiver = activeAccount?.address;
  const { data: supportedTokens = [] } = useSupportedTokens();
  const chain = getEnvironmentChain();

  const tokenAddress = useMemo(() => {
    if (!token?.symbol) return undefined;
    const supportedToken = supportedTokens.find(
      (t) => t.symbol === token.symbol
    );
    return supportedToken?.address;
  }, [token?.symbol, supportedTokens]);

  // Convert fiat amount to crypto amount for API calls
  const { data: cryptoConversion } = useFiatToCrypto(
    {
      chain,
      tokenAddress,
      fiatAmount: amount || 0,
      currency: 'USD'
    },
    { enabled: !!amount && amount > 0 }
  );

  const { data: quotes = [], isLoading } = useBuyWithFiatQuotes(
    {
      countryCode: country?.code || '',
      tokenAddress,
      amount: cryptoConversion?.amount?.toString(),
      receiver
    },
    {
      enabled: Boolean(
        country?.code && tokenAddress && cryptoConversion?.amount && receiver
      )
    }
  );

  const quotesWithBestPrice: (BuyWithFiatQuote & { best?: boolean })[] =
    useMemo(() => {
      const quotesWithParsedPrices = quotes.map((quote) => {
        const numericPrice =
          quote.price && !quote.error
            ? parseFloat(quote.price.replace(/[^\d.-]/g, ''))
            : Infinity;

        return {
          ...quote,
          numericPrice
        };
      });

      const lowestPrice = Math.min(
        ...quotesWithParsedPrices
          .filter((q) => !q.error && isFinite(q.numericPrice))
          .map((q) => q.numericPrice)
      );

      // Mark the quote with the lowest price as best
      return quotesWithParsedPrices.map((quote) => ({
        providerId: quote.providerId,
        providerName: quote.providerName,
        providerDescription: quote.providerDescription,
        providerLogoUrl: quote.providerLogoUrl,
        price: quote.price,
        error: quote.error,
        prepareResult: quote.prepareResult,
        best:
          !quote.error &&
          quote.numericPrice === lowestPrice &&
          isFinite(lowestPrice)
      }));
    }, [quotes]);

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Select payment provider</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="provider"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-4">
            <FormControl>
              <div className="flex flex-col gap-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <Loader2Icon size={48} className="animate-spin" />
                    <Typography variant="muted">
                      Generating quotes...
                    </Typography>
                  </div>
                ) : quotesWithBestPrice.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Typography variant="muted">
                      No quotes available for this country
                    </Typography>
                  </div>
                ) : (
                  quotesWithBestPrice.map((quote) => (
                    <button
                      key={quote.providerId}
                      type="button"
                      className={`bg-accent/20 hover:bg-accent/30 flex items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors ${field.value?.providerId === quote.providerId ? 'ring-primary ring-2' : ''}`}
                      onClick={() => field.onChange(quote)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={quote.providerLogoUrl}
                          alt={quote.providerName}
                          className="size-8 rounded-full"
                        />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Typography variant="small">
                              {quote.providerName}
                            </Typography>
                            {quote.best && (
                              <Badge variant="default">Best price</Badge>
                            )}
                          </div>
                          {quote.providerDescription && (
                            <Typography variant="muted">
                              {quote.providerDescription}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Typography variant="small">{quote.price}</Typography>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
          disabled={!form.watch('provider')}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
