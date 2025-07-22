'use client';

import { AccountContent } from './account-content';
import { AuthProvider, useAuth } from './auth-provider';
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
  const { userAddress } = useAuth();

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
