'use client';

import {
  useLogout,
  useConnectedAccounts,
  useAccountBalance,
  useFlowClient,
  useActiveAccount,
  lisk
} from 'flow-sdk';
import { LogOut, User, Wallet, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

export default function Homepage() {
  const { disconnect: logout } = useLogout();
  const connectedAccounts = useConnectedAccounts();
  const activeAccount = useActiveAccount();
  const client = useFlowClient();
  const [copied, setCopied] = useState(false);

  const { data: accountBalance, isLoading: isLoadingBalance } =
    useAccountBalance({
      address: activeAccount?.address || '',
      client: client!,
      chain: lisk
    });

  const isConnected = !!activeAccount;
  const activeConnectedAccount = connectedAccounts?.[0];

  const handleDisconnect = () => {
    if (activeConnectedAccount) {
      logout(activeConnectedAccount);
    }
  };

  const handleCopyAddress = async () => {
    if (activeAccount?.address) {
      await navigator.clipboard.writeText(activeAccount.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <section className="mx-auto w-full max-w-2xl flex-1 p-4 md:p-6">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full bg-blue-900/30 p-6">
            <Wallet className="size-12 text-blue-400" />
          </div>

          <Typography variant="h2" className="mb-2 text-white">
            Welcome to Lisk Flow SDK
          </Typography>

          <Typography variant="lead" className="mb-8 max-w-lg text-gray-400">
            Connect your wallet to get started with the Lisk Flow SDK demo.
            Experience seamless blockchain interactions with minimal
            configuration.
          </Typography>

          <div className="space-y-4 text-left text-sm text-gray-400">
            <p>✨ Simple wallet connection</p>
            <p>⚡ Real-time balance updates</p>
            <p>🔧 Minimal SDK configuration</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-4 md:p-6">
      {/* User Account Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2">
            Logged in Account
            <span className="rounded-full bg-green-900 px-2 py-1 text-xs text-green-200">
              Active
            </span>
          </CardTitle>

          <Button
            onClick={handleDisconnect}
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/20 gap-2"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Address */}
          <div className="space-y-2">
            <Typography variant="small" className="text-gray-400">
              Wallet Address
            </Typography>
            <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-3">
              <Typography
                variant="inline-code"
                className="flex-1 text-gray-200"
              >
                {activeAccount?.address}
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

          {/* Chain */}
          <div className="space-y-2">
            <Typography variant="small" className="text-gray-400">
              Network
            </Typography>
            <div className="rounded-lg border border-blue-800 bg-blue-900/20 p-3">
              <Typography variant="small" className="font-medium text-blue-200">
                {activeConnectedAccount?.getChain?.()?.name || 'Lisk Network'}
              </Typography>
            </div>
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <Typography variant="small" className="text-gray-400">
              Balance
            </Typography>
            <div className="rounded-lg border border-green-800 bg-green-900/20 p-3">
              {isLoadingBalance ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-green-400"></div>
                  <Typography variant="small" className="text-green-200">
                    Loading balance...
                  </Typography>
                </div>
              ) : accountBalance ? (
                <Typography
                  variant="small"
                  className="font-medium text-green-200"
                >
                  {accountBalance.displayValue} {accountBalance.symbol}
                </Typography>
              ) : (
                <Typography variant="small" className="text-red-400">
                  Unable to fetch balance
                </Typography>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
