import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { TokenBalance } from '@/mocks/token-balances';
import { getSupportedTokens } from '@/utils';
import { useExternalWallet, usePanna, useTokenBalances } from '../../../hooks';
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
  const { chainId } = usePanna();
  const [selectedToken, setSelectedToken] = useState<
    TransferFormData['tokenInfo'] | null
  >(null);
  const supportedTokens = getSupportedTokens(chainId);

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

  const handleTokenSelect = (token: TokenBalance) => {
    const matchingSupportedToken = supportedTokens.find((supportedToken) => {
      const matchesSymbol =
        supportedToken.symbol?.toLowerCase() ===
        token.token.symbol?.toLowerCase();
      const matchesName =
        supportedToken.name?.toLowerCase() === token.token.name?.toLowerCase();

      return matchesSymbol || matchesName;
    });

    const tokenAddress = token.token.address ?? matchingSupportedToken?.address;

    if (!tokenAddress) {
      console.warn(
        'Selected token is missing address and cannot be transferred',
        token
      );
      return;
    }

    const resolvedToken: TransferFormData['tokenInfo'] = {
      token: {
        ...token.token,
        address: tokenAddress
      },
      tokenBalance: token.tokenBalance,
      fiatBalance: token.fiatBalance
    };

    setSelectedToken(resolvedToken);
    form.setValue('tokenInfo', resolvedToken, {
      shouldDirty: true,
      shouldValidate: true
    });
    next();
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Select a token</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <Label>Your token balances</Label>

        <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </>
          ) : tokens.length === 0 ? (
            <Card className="flex flex-row items-center gap-4 px-3 py-3 text-center">
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
                  className={`hover:bg-muted/50 relative flex cursor-pointer flex-row items-center gap-4 px-3 py-3 transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="relative">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                      {token.token.icon ? (
                        <img
                          src={token.token.icon}
                          alt={token.token.symbol}
                          className="size-6"
                        />
                      ) : (
                        <Typography variant="small">
                          {token.token.symbol.slice(0, 1)}
                        </Typography>
                      )}
                    </div>
                    <div className="ring-background absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 ring-2">
                      {token.token.icon ? (
                        <img
                          src={token.token.icon}
                          alt="chain"
                          className="size-3"
                        />
                      ) : (
                        <div className="bg-muted size-2 rounded-full" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <Typography as="h1" variant="small">
                      {token.token.symbol}
                    </Typography>
                    <Typography variant="muted">{token.token.name}</Typography>
                  </div>

                  <div className="text-right">
                    <Typography as="h1" variant="small">
                      ${token.fiatBalance.amount.toFixed(2)}
                    </Typography>
                    <Typography variant="muted">
                      {token.tokenBalance.displayValue} {token.token.symbol}
                    </Typography>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
