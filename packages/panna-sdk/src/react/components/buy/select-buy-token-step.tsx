import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import type { BuyFormData } from './schema';

type SelectBuyTokenStepProps = {
  form: UseFormReturn<BuyFormData>;
};

export function SelectBuyTokenStep({ form }: SelectBuyTokenStepProps) {
  const { next } = useDialogStepper();
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
      <FormField
        control={form.control}
        name="token"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-4">
            <FormLabel>Asset</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <span className="flex items-center gap-3">
                      {field.value?.icon ? (
                        <img
                          src={field.value.icon}
                          alt={field.value.symbol}
                          className="size-6 rounded-full"
                        />
                      ) : (
                        <div className="bg-muted size-6 rounded-full" />
                      )}
                      {field.value ? (
                        <span className="font-medium">
                          {field.value.symbol}
                        </span>
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
                            key={t.address}
                            value={`${t.symbol} ${t.name}`}
                            onSelect={() => {
                              field.onChange(t);
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
                            {field.value?.address === t.address && (
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
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="button"
        className="w-full"
        onClick={() => next()}
        disabled={!form.watch('token')}
      >
        Next
      </Button>
    </div>
  );
}
