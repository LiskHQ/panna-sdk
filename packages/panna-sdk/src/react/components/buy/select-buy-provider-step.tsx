import { useState, useMemo } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useOnrampProviders, useSupportedTokens } from '../../hooks';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import type { BuyStepData, Provider } from './types';

export function SelectBuyProviderStep() {
  const { next, prev, stepData } = useDialogStepper();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const activeAccount = useActiveAccount();
  const country = (stepData as Partial<BuyStepData>).country;
  const token = (stepData as Partial<BuyStepData>).token;
  const amount = (stepData as Partial<BuyStepData>).amount;

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
  const providers: Provider[] = useMemo(() => {
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
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading providers...</div>
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
              className={`bg-accent/20 hover:bg-accent/30 flex items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors ${selectedProvider?.id === p.id ? 'ring-primary ring-2' : ''}`}
              onClick={() => setSelectedProvider(p)}
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
          onClick={() =>
            selectedProvider &&
            next({ provider: selectedProvider } as Partial<BuyStepData>)
          }
          disabled={!selectedProvider}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
