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
import { LogOut, User } from 'lucide-react';
import { AccountInformationCard } from '@/app/(account)/components/account-information-card';
import { NotConnectedView } from '@/app/(account)/components/not-connected-view';
import { SocialProfilesCard } from '@/app/(account)/components/social-profiles-card';
import { WalletDetailsCard } from '@/app/(account)/components/wallet-details-card';
import { Button } from '@/components/ui/button';
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

  // Get user profiles (email, phone, etc.)
  const { data: userProfiles, isLoading: isLoadingProfiles } = useUserProfiles({
    client: client!
  });

  // Get social profiles (farcaster, lens, ens)
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

  const handleDisconnect = () => {
    if (activeConnectedAccount) {
      logout(activeConnectedAccount);
    }
  };

  if (!isConnected) {
    return <NotConnectedView />;
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

      <WalletDetailsCard
        address={activeAccount.address}
        networkName={
          activeConnectedAccount?.getChain?.()?.name || 'Lisk Network'
        }
        accountBalance={accountBalance}
        isLoadingBalance={isLoadingBalance}
      />

      <AccountInformationCard
        userEmail={userEmail}
        userPhone={userPhone}
        isLoadingProfiles={isLoadingProfiles}
      />

      <SocialProfilesCard
        socialProfiles={socialProfiles}
        isLoadingSocialProfiles={isLoadingSocialProfiles}
      />
    </section>
  );
}
