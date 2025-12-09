import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import type { UseFormReturn } from 'react-hook-form';
import { DEFAULT_COUNTRY_CODE } from 'src/core';
import type { Country } from '../../types/country.types';
import {
  COUNTRIES_SORTED,
  detectUserCountry,
  getCountryByCode
} from '../../utils';
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type SelectBuyRegionStepProps = {
  form: UseFormReturn<BuyFormData>;
};

type CookieDataTypes = {
  panna_user_country: Country;
};

export function SelectBuyRegionStep({ form }: SelectBuyRegionStepProps) {
  const { next } = useDialogStepper();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cookie, setCookie] = useCookies<'panna_user_country', CookieDataTypes>(
    ['panna_user_country']
  );

  const countries = useMemo(() => {
    if (!query) return COUNTRIES_SORTED;
    return COUNTRIES_SORTED.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Auto-detect and set user's country on mount
  useEffect(() => {
    const currentCountry = form.getValues('country');
    if (!currentCountry) {
      const detectedCountryCode = detectUserCountry();
      const detectedCountry = detectedCountryCode
        ? getCountryByCode(detectedCountryCode)
        : null;

      // Set default country: cookie > detected > US > first available
      const defaultCountry =
        detectedCountry ||
        getCountryByCode(DEFAULT_COUNTRY_CODE) ||
        COUNTRIES_SORTED[0];
      if (cookie.panna_user_country?.code) {
        const cookieCountry = getCountryByCode(cookie.panna_user_country.code);
        if (cookieCountry) {
          form.setValue('country', cookieCountry);
        } else if (defaultCountry) {
          form.setValue('country', defaultCountry);
        }
      } else if (defaultCountry) {
        form.setValue('country', defaultCountry);
      }
    }
  }, [form, cookie.panna_user_country]);

  const handleCountrySubmit = () => {
    const selectedCountry = form.getValues('country');
    if (!selectedCountry) return;
    if (
      !cookie.panna_user_country?.code ||
      cookie.panna_user_country.code !== selectedCountry.code
    ) {
      setCookie('panna_user_country', selectedCountry);
    }
    next();
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Buy</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => {
          const handleCountrySelect = (selectedCountry: Country) => {
            field.onChange(selectedCountry);
            setOpen(false);
          };

          return (
            <FormItem className="flex flex-col gap-4">
              <FormLabel>Your country/region</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{field.value?.flag}</span>
                        {field.value?.name ?? 'Select country'}
                      </span>
                      <ChevronDownIcon className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="max-h-[400px] w-[var(--radix-popover-trigger-width)] overflow-hidden p-0"
                    align="start"
                    sideOffset={4}
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Command className="max-h-[400px] overflow-hidden">
                      <CommandInput
                        placeholder="Search for a country..."
                        className="h-9"
                        value={query}
                        onValueChange={setQuery}
                      />
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((c) => (
                            <CommandItem
                              key={c.code}
                              value={c.name}
                              onSelect={() => handleCountrySelect(c)}
                            >
                              <span className="text-xl">{c.flag}</span>
                              {c.name}
                              {field.value?.code === c.code && (
                                <CheckIcon className="ml-auto opacity-100" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <Typography variant="muted" className="text-center">
                Availability may vary based on your bank's location and our
                payment providers.
              </Typography>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <Button
        type="button"
        onClick={handleCountrySubmit}
        disabled={!form.watch('country')}
      >
        Next
      </Button>
    </div>
  );
}
