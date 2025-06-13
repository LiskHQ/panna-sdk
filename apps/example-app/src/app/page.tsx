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
      {/* Header with logout button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-900/30 p-3">
            <User className="size-6 text-blue-600" />
          </div>
          <div>
            <Typography variant="h3" className="text-white">
              Account Overview
            </Typography>
            <Typography variant="small" className="text-gray-400">
              Connected account details and information
            </Typography>
          </div>
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="border-destructive text-destructive hover:bg-destructive/20 gap-2"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>

      {/* Wallet Details Card */}
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

          {/* Network */}
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

      {/* Account Information Card */}
      {(userEmail || userPhone || isLoadingProfiles) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* User Email */}
            {(userEmail || isLoadingProfiles) && (
              <div className="flex flex-col gap-4">
                <Typography variant="small" className="flex items-center gap-2">
                  <Mail className="size-4" />
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
                  ) : (
                    <Typography
                      variant="small"
                      className="text-muted-foreground text-base md:text-sm"
                    >
                      No email available
                    </Typography>
                  )}
                </div>
              </div>
            )}

            {/* User Phone */}
            {(userPhone || isLoadingProfiles) && (
              <div className="flex flex-col gap-4">
                <Typography variant="small" className="flex items-center gap-2">
                  <Phone className="size-4" />
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
                  ) : (
                    <Typography
                      variant="small"
                      className="text-muted-foreground text-base md:text-sm"
                    >
                      No phone number available
                    </Typography>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Social Profiles Card */}
      {(socialProfiles?.length || isLoadingSocialProfiles) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Social Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-input min-h-16 w-full border bg-transparent px-3 py-3 shadow-xs">
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
                <div className="flex flex-col gap-3">
                  {farcasterProfile && (
                    <div className="flex items-center gap-3 rounded-lg border border-purple-500/20 bg-purple-500/10 p-2">
                      <LinkIcon className="size-5 text-purple-500" />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-medium text-purple-500"
                        >
                          Farcaster
                        </Typography>
                        {farcasterProfile.name && (
                          <Typography
                            variant="small"
                            className="text-foreground text-xs"
                          >
                            {farcasterProfile.name}
                          </Typography>
                        )}
                      </div>
                    </div>
                  )}
                  {lensProfile && (
                    <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-2">
                      <LinkIcon className="size-5 text-green-500" />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-medium text-green-500"
                        >
                          Lens Protocol
                        </Typography>
                        {lensProfile.name && (
                          <Typography
                            variant="small"
                            className="text-foreground text-xs"
                          >
                            {lensProfile.name}
                          </Typography>
                        )}
                      </div>
                    </div>
                  )}
                  {ensProfile && (
                    <div className="flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
                      <LinkIcon className="size-5 text-blue-500" />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-medium text-blue-500"
                        >
                          ENS
                        </Typography>
                        {ensProfile.name && (
                          <Typography
                            variant="small"
                            className="text-foreground text-xs"
                          >
                            {ensProfile.name}
                          </Typography>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-12 items-center justify-center">
                  <Typography
                    variant="small"
                    className="text-muted-foreground text-base md:text-sm"
                  >
                    No social profiles connected
                  </Typography>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
