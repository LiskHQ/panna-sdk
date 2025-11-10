import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { liskSepolia } from 'src/core';
import { extractNumericPrice } from 'src/core/util/utils';
import { useActiveAccount } from 'thirdweb/react';
import { useBuyWithFiatQuotes, usePanna, useSupportedTokens } from '@/hooks';
import type { BuyWithFiatQuote } from '@/types/buy-with-fiat-quote.types';
import { getEnvironmentChain } from '@/utils';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { DialogHeader, DialogTitle } from '../../ui/dialog';
import { useDialogStepper } from '../../ui/dialog-stepper';
import { FormControl, FormField, FormItem, FormMessage } from '../../ui/form';
import { Typography } from '../../ui/typography';
import type { BuyFormData } from './schema';

type SelectBuyProviderStepProps = {
  form: UseFormReturn<BuyFormData>;
};

export function SelectBuyProviderStep({ form }: SelectBuyProviderStepProps) {
  const { next } = useDialogStepper();
  const { chainId } = usePanna();

  const activeAccount = useActiveAccount();
  const { token, country, cryptoAmount } = form.watch();

  const receiver = activeAccount?.address;
  const { data: supportedTokens = [] } = useSupportedTokens();

  const tokenAddress = useMemo(() => {
    if (!token?.address) {
      return undefined;
    }

    const currentChain = getEnvironmentChain(chainId);
    const isLiskSepolia = currentChain.id === liskSepolia.id;

    const supportedToken = supportedTokens.find((supportedToken) => {
      if (isLiskSepolia) {
        // Special case for liskSepolia: use symbol comparison
        return supportedToken.symbol === token.symbol;
      }
      return supportedToken.address === token.address;
    });

    if (!supportedToken) {
      console.warn('Token not found in supported tokens list:', token);
      return undefined;
    }

    return supportedToken.address;
  }, [token?.address, token?.symbol, supportedTokens]);

  const { data: quotes = [], isLoading } = useBuyWithFiatQuotes(
    {
      countryCode: country?.code || '',
      tokenAddress,
      cryptoAmount: cryptoAmount?.toString(),
      receiver
    },
    {
      enabled: Boolean(
        country?.code && tokenAddress && cryptoAmount && receiver
      )
    }
  );

  const quotesWithBestPrice: (BuyWithFiatQuote & { best?: boolean })[] =
    useMemo(() => {
      const quotesWithParsedPrices = quotes.map((quote) => {
        const numericPrice =
          quote.price && !quote.error
            ? extractNumericPrice(quote.price)
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
                        {cryptoAmount && token?.symbol && (
                          <Typography variant="muted" className="text-xs">
                            {cryptoAmount.toFixed(6)} {token.symbol}
                          </Typography>
                        )}
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
      <Button
        type="button"
        className="w-full"
        onClick={() => next()}
        disabled={!form.watch('provider')}
      >
        Next
      </Button>
    </div>
  );
}
