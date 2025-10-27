import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TokenBalance } from '@/mocks/token-balances';
import { useExternalWallet, useTokenBalances } from '../../../hooks';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { DialogHeader, DialogTitle } from '../../ui/dialog';
import { useDialogStepper } from '../../ui/dialog-stepper';
import { Skeleton } from '../../ui/skeleton';
import { Typography } from '../../ui/typography';
import { TransferFormData } from './schema';

type TransferSelectTokenStepProps = {
  form: UseFormReturn<TransferFormData>;
};

export function TransferSelectTokenStep({
  form
}: TransferSelectTokenStepProps) {
  const { next } = useDialogStepper();
  const { externalAddress } = useExternalWallet();
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);

  // Set the external wallet address when component loads
  useEffect(() => {
    if (externalAddress) {
      form.setValue('fromAddress', externalAddress);
    }
  }, [externalAddress, form]);

  const { data: tokens = [], isLoading } = useTokenBalances(
    { address: externalAddress || '' },
    {
      enabled: !!externalAddress
    }
  );

  // Set default token to ETH when tokens are loaded
  useEffect(() => {
    if (tokens.length && !selectedToken) {
      const defaultToken = tokens.find((token) => token.token.symbol === 'ETH');
      if (defaultToken) {
        setSelectedToken(defaultToken);
      }
    }
  }, [tokens, selectedToken]);

  const handleTokenSelect = (token: TokenBalance) => {
    setSelectedToken(token);
  };

  const handleNext = () => {
    if (selectedToken) {
      form.setValue('tokenInfo', selectedToken);
      next();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Select token</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <Typography variant="muted" className="text-center">
          Choose which token to transfer
        </Typography>

        <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </>
          ) : tokens.length === 0 ? (
            <Card className="p-6 text-center">
              <Typography variant="muted">
                No tokens found in this wallet
              </Typography>
            </Card>
          ) : (
            tokens.map((token) => {
              const isSelected =
                selectedToken?.token.symbol === token.token.symbol;

              return (
                <Card
                  key={token.token.symbol}
                  className={`hover:bg-muted/50 relative cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Token Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                      {token.token.icon ? (
                        <img
                          src={token.token.icon}
                          alt={token.token.symbol}
                          className="h-6 w-6"
                        />
                      ) : (
                        <Typography variant="small">
                          {token.token.symbol.slice(0, 1)}
                        </Typography>
                      )}
                    </div>

                    {/* Token Info */}
                    <div className="flex-1">
                      <Typography variant="small" className="font-medium">
                        {token.token.name}
                      </Typography>
                      <Typography variant="muted" className="text-xs">
                        {token.tokenBalance.displayValue} {token.token.symbol}
                      </Typography>
                    </div>

                    {/* Fiat Value */}
                    <div className="text-right">
                      <Typography variant="small" className="font-medium">
                        ${token.fiatBalance.amount.toFixed(2)}
                      </Typography>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleNext}
        disabled={!selectedToken || isLoading}
      >
        Next
      </Button>
    </div>
  );
}
