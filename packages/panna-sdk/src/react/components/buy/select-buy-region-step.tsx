import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { getCountriesWithPopularFirst, getCountryByCode } from '../../utils';
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
import type { Country } from './types';

type SelectBuyRegionStepProps = {
  selectedCountry?: Country;
  onCountryChange: (country: Country) => void;
  error?: string;
};

export function SelectBuyRegionStep({
  selectedCountry,
  onCountryChange,
  error
}: SelectBuyRegionStepProps) {
  const { next } = useDialogStepper();
  const [open, setOpen] = useState(false);
  const countries = getCountriesWithPopularFirst();
  const country = selectedCountry || getCountryByCode('US') || countries[0];

  const handleCountrySelect = (selectedCountry: Country) => {
    onCountryChange(selectedCountry);
    setOpen(false);
  };

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
          <PopoverContent
            className="max-h-[400px] w-[var(--radix-popover-trigger-width)] overflow-hidden p-0"
            align="start"
            sideOffset={4}
          >
            <Command className="max-h-[400px] overflow-hidden">
              <CommandInput
                placeholder="Search for a country..."
                className="h-9"
              />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup heading="Popular">
                  {countries.slice(0, 10).map((c) => (
                    <CommandItem
                      key={c.code}
                      value={c.name}
                      onSelect={() => handleCountrySelect(c)}
                    >
                      <span className="text-xl">{c.flag}</span>
                      {c.name}
                      {country?.code === c.code && (
                        <CheckIcon className="ml-auto opacity-100" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="All Countries">
                  {countries.slice(10).map((c) => (
                    <CommandItem
                      key={c.code}
                      value={c.name}
                      onSelect={() => handleCountrySelect(c)}
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
        {error && (
          <Typography className="text-center text-sm text-red-500">
            {error}
          </Typography>
        )}
      </div>
      <Button type="button" onClick={() => next()} disabled={!selectedCountry}>
        Next
      </Button>
    </div>
  );
}
