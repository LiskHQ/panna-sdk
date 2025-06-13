'use client';

import {
  useLogout,
  useConnectedAccounts,
  useAccountBalance,
  useFlowClient,
  useActiveAccount,
  useUserProfiles,
  useSocialAccounts,
  lisk
} from 'flow-sdk';
import {
  LogOut,
  Wallet,
  Copy,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  User,
  Users,
  LinkIcon
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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

  // Get user profiles (email, phone, etc.) - requires client
  const { data: userProfiles, isLoading: isLoadingProfiles } = useUserProfiles({
    client: client!
  });

  // Get social profiles (farcaster, lens, ens) - requires client and address
  const { data: socialProfiles, isLoading: isLoadingSocialProfiles } =
    useSocialAccounts({
      client: client!,
      address: activeAccount?.address || ''
    });

  const isConnected = !!activeAccount;
  const activeConnectedAccount = connectedAccounts?.[0];

  // Extract email and phone from profiles
  const emailProfile = userProfiles?.find(
    (profile) =>
      profile.type === 'email' ||
      profile.type === 'google' ||
      profile.type === 'discord' ||
      profile.type === 'apple' ||
      profile.type === 'facebook'
  );
  const phoneProfile = userProfiles?.find(
    (profile) => profile.type === 'phone'
  );

  const userEmail = emailProfile?.details?.email;
  const userPhone = phoneProfile?.details?.phone;

  // Extract social platform information
  const farcasterProfile = socialProfiles?.find(
    (profile) => profile.type === 'farcaster'
  );
  const lensProfile = socialProfiles?.find(
    (profile) => profile.type === 'lens'
  );
  const ensProfile = socialProfiles?.find((profile) => profile.type === 'ens');

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
            <Wallet className="size-12 text-blue-600" />
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Account Details
            <Badge className="bg-blue-500 text-white dark:bg-blue-600">
              <CheckCircle className="size-4" /> Active
            </Badge>
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

        <CardContent className="flex flex-col gap-8">
          {/* Address */}
          <div className="flex flex-col gap-4">
            <Typography variant="small">Wallet Address</Typography>
            <div className="border-input flex h-10 w-full items-center gap-2 border bg-transparent px-3 py-2 shadow-xs">
              <Typography
                variant="small"
                className="text-foreground flex-1 text-base md:text-sm"
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

          {/* User Email */}
          {(userEmail || isLoadingProfiles) && (
            <div className="flex flex-col gap-4">
              <Typography variant="small" className="flex items-center gap-2">
                Email
              </Typography>
              <div className="border-input flex h-10 w-full items-center border bg-transparent px-3 py-2 shadow-xs">
                {isLoadingProfiles ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    <Typography
                      variant="small"
                      className="text-muted-foreground text-base md:text-sm"
                    >
                      Loading email...
                    </Typography>
                  </div>
                ) : userEmail ? (
                  <Typography
                    variant="small"
                    className="text-foreground text-base font-medium md:text-sm"
                  >
                    {userEmail}
                  </Typography>
                ) : null}
              </div>
            </div>
          )}

          {/* User Phone */}
          {(userPhone || isLoadingProfiles) && (
            <div className="flex flex-col gap-4">
              <Typography variant="small" className="flex items-center gap-2">
                Phone Number
              </Typography>
              <div className="border-input flex h-10 w-full items-center border bg-transparent px-3 py-2 shadow-xs">
                {isLoadingProfiles ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    <Typography
                      variant="small"
                      className="text-muted-foreground text-base md:text-sm"
                    >
                      Loading phone...
                    </Typography>
                  </div>
                ) : userPhone ? (
                  <Typography
                    variant="small"
                    className="text-foreground text-base font-medium md:text-sm"
                  >
                    {userPhone}
                  </Typography>
                ) : null}
              </div>
            </div>
          )}

          {/* Social Profiles */}
          {(socialProfiles?.length || isLoadingSocialProfiles) && (
            <div className="flex flex-col gap-4">
              <Typography variant="small" className="flex items-center gap-2">
                Social Profiles
              </Typography>
              <div className="border-input min-h-10 w-full border bg-transparent px-3 py-2 shadow-xs">
                {isLoadingSocialProfiles ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    <Typography
                      variant="small"
                      className="text-muted-foreground text-base md:text-sm"
                    >
                      Loading social profiles...
                    </Typography>
                  </div>
                ) : socialProfiles?.length ? (
                  <div className="flex flex-col gap-2">
                    {farcasterProfile && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="size-4 text-purple-500" />
                        <Typography
                          variant="small"
                          className="font-medium text-purple-500"
                        >
                          Farcaster
                        </Typography>
                        {farcasterProfile.name && (
                          <Typography
                            variant="small"
                            className="text-foreground"
                          >
                            {farcasterProfile.name}
                          </Typography>
                        )}
                      </div>
                    )}
                    {lensProfile && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="size-4 text-green-500" />
                        <Typography
                          variant="small"
                          className="font-medium text-green-500"
                        >
                          Lens Protocol
                        </Typography>
                        {lensProfile.name && (
                          <Typography
                            variant="small"
                            className="text-foreground"
                          >
                            {lensProfile.name}
                          </Typography>
                        )}
                      </div>
                    )}
                    {ensProfile && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="size-4 text-blue-500" />
                        <Typography
                          variant="small"
                          className="font-medium text-blue-500"
                        >
                          ENS
                        </Typography>
                        {ensProfile.name && (
                          <Typography
                            variant="small"
                            className="text-foreground"
                          >
                            {ensProfile.name}
                          </Typography>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Typography
                    variant="small"
                    className="text-muted-foreground text-base md:text-sm"
                  >
                    No social profiles found
                  </Typography>
                )}
              </div>
            </div>
          )}

          {/* Chain */}
          <div className="flex flex-col gap-4">
            <Typography variant="small">Network</Typography>
            <div className="border-input flex h-10 w-full items-center border bg-transparent px-3 py-2 shadow-xs">
              <Typography
                variant="small"
                className="text-foreground text-base font-medium md:text-sm"
              >
                {activeConnectedAccount?.getChain?.()?.name || 'Lisk Network'}
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
    </section>
  );
}
