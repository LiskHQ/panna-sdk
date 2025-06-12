'use client';

import {
  useLogout,
  useConnectedAccounts,
  useAccountBalance,
  useFlowClient,
  useActiveAccount,
  lisk,
  LoginButton
} from 'flow-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

export default function Homepage() {
  const { disconnect: logout } = useLogout();
  const connectedAccounts = useConnectedAccounts();
  const activeAccount = useActiveAccount();
  const client = useFlowClient();
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

  return (
    <section className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-4 md:p-6">
      <header className="text-center">
        <Typography variant="h2" className="text-white">
          Lisk Flow SDK Demo
        </Typography>
        <Typography variant="lead" className="text-gray-300">
          Simple demo of the Lisk Flow SDK
        </Typography>
      </header>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
                <Typography variant="small" className="text-gray-200">
                  Connected:
                </Typography>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    isConnected
                      ? 'border border-green-700 bg-green-900 text-green-200'
                      : 'border border-red-700 bg-red-900 text-red-200'
                  }`}
                >
                  {isConnected ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
                <Typography variant="small" className="text-gray-200">
                  Connected Accounts:
                </Typography>
                <span className="rounded-full border border-blue-700 bg-blue-900 px-3 py-1 text-sm font-medium text-blue-200">
                  {connectedAccounts?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {!isConnected ? (
              <LoginButton />
            ) : (
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                size="lg"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {connectedAccounts?.map((account, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-blue-800 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Typography variant="small" className="text-gray-200">
                        Address:
                      </Typography>
                      <Typography
                        variant="inline-code"
                        className="break-all text-gray-200"
                      >
                        {account.getAccount?.()?.address || 'Unknown'}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-3">
                      <Typography variant="small" className="text-gray-200">
                        Chain:
                      </Typography>
                      <span className="rounded-lg border border-green-700 bg-green-900 px-3 py-1 text-sm font-medium text-green-200">
                        {account.getChain?.()?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {activeAccount && (
                <div className="rounded-xl border border-green-800 bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-6">
                  <div className="flex items-center gap-3">
                    <Typography variant="small" className="text-gray-200">
                      Balance:
                    </Typography>
                    <div className="flex items-center gap-2">
                      {isLoadingBalance ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-green-400"></div>
                          <Typography variant="muted">Loading...</Typography>
                        </div>
                      ) : accountBalance ? (
                        <Typography
                          variant="inline-code"
                          className="text-gray-200"
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
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
