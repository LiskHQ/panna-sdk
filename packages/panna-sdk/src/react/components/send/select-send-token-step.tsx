import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useActiveAccount } from 'thirdweb/react';
import { currencyMap } from '@/consts/currencies';
import { useTokenBalances } from '@/hooks/use-token-balances';
import { TokenBalance, tokenIconMap } from '@/mocks/token-balances';
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
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Typography } from '../ui/typography';
import { SendFormData } from './schema';

type SelectSendTokenStepProps = {
  form: UseFormReturn<SendFormData>;
};

export function SelectSendTokenStep({ form }: SelectSendTokenStepProps) {
  const { next } = useDialogStepper();
  const [open, setOpen] = useState(false);
  const account = useActiveAccount();
  const { data: tokens = [] } = useTokenBalances(
    { address: account?.address as string },
    {
      enabled: !!account?.address
    }
  );

  // Trigger fields validation and move to next step if valid
  const handleFormSubmit = async () => {
    const isFieldValid = await form.trigger();
    if (isFieldValid) {
      next();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Send</DialogTitle>
      </DialogHeader>
      <FormField
        control={form.control}
        name="tokenInfo"
        render={({ field }) => {
          const handleTokenSelect = (selectedToken: TokenBalance) => {
            field.onChange(selectedToken);
            setOpen(false);
          };

          return (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>Asset</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex h-14 w-full justify-between"
                    >
                      {field.value?.token.name ? (
                        <TokenItem
                          tokenData={
                            tokens.find(
                              (t) => t.token.name === field.value?.token.name
                            )!
                          }
                        />
                      ) : (
                        <Typography variant="small">Select asset</Typography>
                      )}
                      {!field.value?.token.name && (
                        <ChevronDownIcon className="opacity-50" />
                      )}
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
                        placeholder="Search for an asset"
                        className="h-9"
                      />
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>No asset found.</CommandEmpty>
                        <CommandGroup>
                          {tokens.map((tokenData) => (
                            <CommandItem
                              key={tokenData.token.symbol}
                              value={tokenData.token.name}
                              onSelect={() => handleTokenSelect(tokenData)}
                              className="flex w-full justify-between"
                            >
                              <TokenItem tokenData={tokenData} />
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
          );
        }}
      />
      <FormField
        control={form.control}
        name="recipientAddress"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3">
            <FormLabel>Send to</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Recipient's address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3">
            <div className="flex justify-between">
              <FormLabel>Amount</FormLabel>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="bg-muted hover:bg-border! h-6 p-2"
                onClick={() =>
                  form.setValue(
                    'amount',
                    Number(
                      form.getValues('tokenInfo')?.tokenBalance.displayValue
                    ) || 0
                  )
                }
              >
                Max
              </Button>
            </div>
            <FormControl>
              <Input
                {...field}
                placeholder={`0 ${form.watch('tokenInfo')?.token.symbol || 'ETH'}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        onClick={() => handleFormSubmit()}
        disabled={!form.watch('tokenInfo')}
      >
        Next
      </Button>
    </div>
  );
}

type TokenItemProps = {
  tokenData: TokenBalance;
};

function TokenItem({ tokenData }: TokenItemProps) {
  return (
    <>
      <div className="flex gap-3 text-left">
        <div className="flex items-center justify-center">
          {tokenData.token.symbol ? (
            <img
              className="h-5 w-5"
              src={tokenIconMap[tokenData.token.symbol]}
              alt={tokenData.token.symbol}
            />
          ) : null}
        </div>
        <div className="flex flex-col">
          <Typography variant="small">{tokenData.token.symbol}</Typography>
          <Typography variant="muted">{tokenData.token.name}</Typography>
        </div>
      </div>
      <div className="flex flex-col text-right">
        <Typography variant="small">
          {Number(tokenData.tokenBalance.displayValue).toFixed(6)}
        </Typography>
        <Typography variant="muted">
          {currencyMap[tokenData.fiatBalance.currency]}
          {tokenData.fiatBalance.amount.toFixed(2)}
        </Typography>
      </div>
    </>
  );
}
