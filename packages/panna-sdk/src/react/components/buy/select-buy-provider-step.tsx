import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useActiveAccount } from 'thirdweb/react';
import { useOnrampProviders, useSupportedTokens } from '../../hooks';
import type { OnrampProvider } from '../../types/onramp-provider.types';
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

  const tokenAddress = useMemo(() => {
    if (!token?.symbol) return undefined;
    const supportedToken = supportedTokens.find(
      (t) => t.symbol === token.symbol
    );
    return supportedToken?.address;
  }, [token?.symbol, supportedTokens]);

  const { data: providerInfos = [], isLoading } = useOnrampProviders(
    {
      countryCode: country?.code || '',
      tokenAddress,
      amount: amount?.toString(),
      receiver
    },
    { enabled: Boolean(country?.code && tokenAddress && amount && receiver) }
  );

  console.log({ providerInfos });

  const providers: OnrampProvider[] = useMemo(() => {
    const basicProviders = providerInfos.map((info) => ({
      id: info.id,
      name: info.displayName,
      description: info.description,
      price: info.price || 'Loading...',
      rawPrice: info.price,
      hasError: !!info.error,
      icon: info.logoUrl
    }));

    const providersWithParsedPrices = basicProviders.map((provider) => {
      const numericPrice =
        provider.rawPrice && !provider.hasError
          ? parseFloat(provider.rawPrice.replace(/[^\d.-]/g, ''))
          : Infinity;

      return {
        ...provider,
        numericPrice
      };
    });

    const lowestPrice = Math.min(
      ...providersWithParsedPrices
        .filter((p) => !p.hasError && isFinite(p.numericPrice))
        .map((p) => p.numericPrice)
    );

    // Mark the provider with the lowest price as best
    return providersWithParsedPrices.map((provider, index) => ({
      id: provider.id,
      name: provider.name,
      description: provider.description,
      price: provider.price,
      best:
        !provider.hasError &&
        provider.numericPrice === lowestPrice &&
        isFinite(lowestPrice),
      icon: provider.icon,
      prepareResult: providerInfos[index]?.prepareResult
    }));
  }, [providerInfos]);

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
                ) : providers.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Typography variant="muted">
                      No providers available for this country
                    </Typography>
                  </div>
                ) : (
                  providers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`bg-accent/20 hover:bg-accent/30 flex items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors ${field.value?.id === p.id ? 'ring-primary ring-2' : ''}`}
                      onClick={() => field.onChange(p)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.icon}
                          alt={p.name}
                          className="size-8 rounded-full"
                        />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Typography variant="small">{p.name}</Typography>
                            {p.best && (
                              <Badge variant="default">Best price</Badge>
                            )}
                          </div>
                          {p.description && (
                            <Typography variant="muted">
                              {p.description}
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Typography variant="small">{p.price}</Typography>
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
