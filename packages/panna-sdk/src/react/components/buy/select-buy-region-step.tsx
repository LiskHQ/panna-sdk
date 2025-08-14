import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
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
import { COUNTRIES } from './data';
import type { BuyStepData, Country } from './types';

export function SelectBuyRegionStep() {
  const { next } = useDialogStepper();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<Country | null>(COUNTRIES[0]);

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <Label>Your country/region</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between">
              <span className="flex items-center gap-3">
                <span className="text-xl">{country?.flag}</span>
                {country?.name ?? 'Select country'}
              </span>
              <ChevronRightIcon className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search for a country..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {COUNTRIES.map((c) => (
                    <CommandItem
                      key={c.code}
                      value={c.name}
                      onSelect={() => {
                        setCountry(c);
                        setOpen(false);
                      }}
                    >
                      <span className="text-xl">{c.flag}</span>
                      {c.name}
                      {country?.code === c.code && (
                        <CheckIcon className="ml-auto opacity-100" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Typography variant="muted" className="text-center">
          Availability may vary based on your bank's location and our payment
          providers.
        </Typography>
      </div>
      <Button
        type="button"
        onClick={() => next({ country } as Partial<BuyStepData>)}
      >
        Next
      </Button>
    </div>
  );
}
