import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSupportedTokens } from '../../hooks';
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
import { Typography } from '../ui/typography';
import type { Token } from './types';

type SelectBuyTokenStepProps = {
  selectedToken?: Token;
  onTokenChange: (token: Token) => void;
  error?: string;
};

export function SelectBuyTokenStep({
  selectedToken,
  onTokenChange,
  error
}: SelectBuyTokenStepProps) {
  const { next, prev } = useDialogStepper();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { data: supportedTokens = [], isLoading } = useSupportedTokens();

  const tokens = useMemo(() => {
    if (!query) return supportedTokens;
    return supportedTokens.filter((t) =>
      `${t.symbol} ${t.name}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, supportedTokens]);

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
            className="max-h-[400px] w-[var(--radix-popover-trigger-width)] overflow-hidden p-0"
            align="start"
            sideOffset={4}
          >
            <Command className="max-h-[400px] overflow-hidden">
              <CommandInput
                placeholder="Search for an asset"
                className="h-9"
                value={query}
                onValueChange={setQuery}
              />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty>
                  {isLoading ? 'Loading assets...' : 'No asset found.'}
                </CommandEmpty>
                <CommandGroup>
                  {tokens.map((t) => (
                    <CommandItem
                      key={t.symbol}
                      value={`${t.symbol} ${t.name}`}
                      onSelect={() => {
                        onTokenChange(t);
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
        {error && (
          <Typography className="text-center text-sm text-red-500">
            {error}
          </Typography>
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
          onClick={() => next()}
          disabled={!selectedToken}
        >
          Next
        </Button>
      </footer>
    </div>
  );
}
