'use client';

import {
  createAccount,
  EcosystemId,
  lisk,
  LoginButton,
  useAccountBalance,
  useActiveAccount,
  useConnectedAccounts,
  useFlowClient,
  useLogout
} from 'flow-sdk';

export function WalletDashboard() {
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
  const wallets = [
    createAccount(EcosystemId.LISK, process.env.NEXT_PUBLIC_PARTNER_ID || '')
  ];

  const handleDisconnect = () => {
    if (activeConnectedAccount) {
      logout(activeConnectedAccount);
    }
  };

  return (
    <section className="mx-auto min-h-screen max-w-4xl space-y-8 bg-gray-900 p-8">
      <header className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Lisk Flow SDK Demo
        </h1>
        <p className="text-lg text-gray-300">Simple hook usage demonstration</p>
      </header>

      {/* Connection Status */}
      <article className="rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-100">
          Connection Status
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
              <span className="font-medium text-gray-200">Connected:</span>
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
              <span className="font-medium text-gray-200">
                Connected Accounts:
              </span>
              <span className="rounded-full border border-blue-700 bg-blue-900 px-3 py-1 text-sm font-medium text-blue-200">
                {connectedAccounts?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Action Buttons */}
      <article className="rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-100">Actions</h2>
        <div className="flex gap-4">
          {!isConnected ? (
            <LoginButton wallets={wallets} />
          ) : (
            <button
              onClick={handleDisconnect}
              className="flex transform items-center gap-2 rounded-xl bg-red-600 px-8 py-4 font-medium text-white transition-all hover:scale-105 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/25"
            >
              Disconnect
            </button>
          )}
        </div>
      </article>

      {/* Account Information */}
      {isConnected && (
        <article className="rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
          <h2 className="mb-6 text-2xl font-semibold text-gray-100">
            Account Information
          </h2>
          <div className="space-y-6">
            {connectedAccounts?.map((account, index) => (
              <div
                key={index}
                className="rounded-xl border border-blue-800 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="min-w-20 font-semibold text-gray-200">
                      Address:
                    </span>
                    <span className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-1 font-mono text-sm break-all text-gray-200">
                      {account.getAccount?.()?.address || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-20 font-semibold text-gray-200">
                      Chain:
                    </span>
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
                  <span className="font-semibold text-gray-200">Balance:</span>
                  <div className="flex items-center gap-2">
                    {isLoadingBalance ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-green-400"></div>
                        <span className="text-gray-300">Loading...</span>
                      </div>
                    ) : accountBalance ? (
                      <span className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 font-mono text-lg text-gray-200">
                        {accountBalance.displayValue} {accountBalance.symbol}
                      </span>
                    ) : (
                      <span className="rounded-lg border border-red-700 bg-red-900 px-3 py-1 text-sm text-red-200">
                        Unable to fetch balance
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      )}
    </section>
  );
}
