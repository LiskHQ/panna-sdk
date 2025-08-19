import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useActiveAccount } from 'thirdweb/react';
import { useOnrampProviders, useSupportedTokens } from '../../hooks';
import type { OnrampProvider } from '../../types/onramp-provider.types';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import type { BuyFormData } from './schema';

type SelectBuyProviderStepProps = {
  form: UseFormReturn<BuyFormData>;
};

export function SelectBuyProviderStep({ form }: SelectBuyProviderStepProps) {
  const { next, prev } = useDialogStepper();

  const activeAccount = useActiveAccount();
  const formData = form.watch();
  const country = formData.country;
  const token = formData.token;
  const amount = formData.amount;

  const receiver = activeAccount?.address;
  const { data: supportedTokens = [] } = useSupportedTokens();

  // Find the token address from supported tokens
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

  // Transform EnrichedProviderInfo to Provider format expected by the component
  const providers: OnrampProvider[] = useMemo(() => {
    return providerInfos.map((info, index) => ({
      id: info.id,
      name: info.displayName,
      description: info.error
        ? 'Pricing unavailable'
        : 'Card, Apple Pay or bank transfer',
      price: info.price || 'Loading...',
      best: index === 0 && !info.error, // Mark first successful provider as best
      icon: info.logoUrl
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
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">
                      Loading providers...
                    </div>
                  </div>
                ) : providers.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">
                      No providers available for this country
                    </div>
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
                        <div className="bg-muted size-8 rounded-full" />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{p.name}</span>
                            {p.best && (
                              <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs">
                                Best price
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {p.description}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{p.price}</div>
                        <div className="text-muted-foreground">0.01</div>
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
