'use client';

import { AccountContent } from './account-content';
import { AuthProvider, useAuth } from './auth-provider';
import { USER_ADDRESS } from './input-otp-form';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export function ConnectButton() {
  return (
    <AuthProvider>
      <ConnectButtonInner />
    </AuthProvider>
  );
}

function ConnectButtonInner() {
  const { userAddress: contextUserAddress } = useAuth();
  const isBrowser = typeof window !== 'undefined';
  const lsUserAddress = isBrowser ? localStorage.getItem(USER_ADDRESS) : null;
  const userAddress = contextUserAddress || lsUserAddress;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {userAddress ? (
          <Button>Disconnect Wallet</Button>
        ) : (
          <Button>Connect Wallet</Button>
        )}
      </DialogTrigger>
      {userAddress ? (
        <DialogContent>{userAddress}</DialogContent>
      ) : (
        <AccountContent />
      )}
    </Dialog>
  );
}
