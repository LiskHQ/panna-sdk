import { useState } from 'react';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Label } from '../ui/label';
import { PROVIDERS } from './data';
import type { BuyStepData, Provider } from './types';

export function SelectBuyProviderStep() {
  const { next, prev } = useDialogStepper();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <Label>Select payment provider</Label>
        {PROVIDERS.map((p) => (
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
