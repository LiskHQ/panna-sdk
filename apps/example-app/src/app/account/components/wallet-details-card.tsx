'use client';

import { Wallet, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

type WalletDetailsCardProps = {
  address: string;
  networkName: string;
  accountBalance:
    | {
        displayValue: string;
        symbol: string;
      }
    | null
    | undefined;
  isLoadingBalance: boolean;
};

export function WalletDetailsCard({
  address,
  networkName,
  accountBalance,
  isLoadingBalance
}: WalletDetailsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-5" />
          Wallet Details
          <Badge className="bg-blue-500 text-white dark:bg-blue-600">
            <CheckCircle className="size-4" /> Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Wallet Address */}
        <div className="flex flex-col gap-4">
          <Typography variant="small">Wallet Address</Typography>
          <div className="border-input flex h-10 w-full items-center gap-2 border bg-transparent px-3 py-2 shadow-xs">
            <Typography
              variant="small"
              className="text-foreground flex-1 text-base md:text-sm"
            >
              {address}
            </Typography>
            <Button
              onClick={handleCopyAddress}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Copy className="size-4" />
            </Button>
          </div>
          {copied && (
            <Typography variant="small" className="text-green-400">
              ✓ Address copied to clipboard
            </Typography>
          )}
        </div>

        {/* Network */}
        <div className="flex flex-col gap-4">
          <Typography variant="small">Network</Typography>
          <div className="border-input flex h-10 w-full items-center border bg-transparent px-3 py-2 shadow-xs">
            <Typography
              variant="small"
              className="text-foreground text-base font-medium md:text-sm"
            >
              {networkName}
            </Typography>
          </div>
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-4">
          <Typography variant="small">Balance</Typography>
          <div className="border-input flex h-10 w-full items-center border bg-transparent px-3 py-2 shadow-xs">
            {isLoadingBalance ? (
              <div className="flex items-center gap-2">
                <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                <Typography
                  variant="small"
                  className="text-muted-foreground text-base md:text-sm"
                >
                  Loading balance...
                </Typography>
              </div>
            ) : accountBalance ? (
              <Typography
                variant="small"
                className="text-foreground text-base font-medium md:text-sm"
              >
                {accountBalance.displayValue} {accountBalance.symbol}
              </Typography>
            ) : (
              <Typography
                variant="small"
                className="text-destructive text-base md:text-sm"
              >
                Unable to fetch balance
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
