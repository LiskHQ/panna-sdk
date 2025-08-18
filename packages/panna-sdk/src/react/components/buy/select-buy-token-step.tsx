import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { TOKENS } from './data';
import type { BuyStepData, Token } from './types';

export function SelectBuyTokenStep() {
  const { next, prev } = useDialogStepper();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const tokens = useMemo(() => {
    if (!query) return TOKENS;
    return TOKENS.filter((t) =>
      `${t.symbol} ${t.name}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <Label>Asset</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between">
              <span className="flex items-center gap-3">
                {selectedToken?.icon ? (
                  <img
                    src={selectedToken.icon}
                    alt={selectedToken.symbol}
                    className="size-6 rounded-full"
                  />
                ) : (
                  <div className="bg-muted size-6 rounded-full" />
                )}
                {selectedToken ? (
                  <span className="font-medium">{selectedToken.symbol}</span>
                ) : (
                  'Select asset'
                )}
              </span>
              <ChevronRightIcon className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            sideOffset={4}
          >
            <Command>
              <CommandInput
                placeholder="Search for an asset"
                className="h-9"
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandEmpty>No asset found.</CommandEmpty>
                <CommandGroup>
                  {tokens.map((t) => (
                    <CommandItem
                      key={t.symbol}
                      value={`${t.symbol} ${t.name}`}
                      onSelect={() => {
                        setSelectedToken(t);
                        setOpen(false);
                      }}
                    >
                      {t.icon ? (
                        <img
                          src={t.icon}
                          alt={t.symbol}
                          className="size-6 rounded-full"
                        />
                      ) : (
                        <div className="bg-muted size-6 rounded-full" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{t.symbol}</span>
                        <span className="text-muted-foreground text-xs">
                          {t.name}
                        </span>
                      </div>
                      {selectedToken?.symbol === t.symbol && (
                        <CheckIcon className="ml-auto opacity-100" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
            selectedToken &&
            next({ token: selectedToken } as Partial<BuyStepData>)
          }
          disabled={!selectedToken}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
