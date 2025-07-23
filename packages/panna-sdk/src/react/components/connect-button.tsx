'use client';

import { AuthenticationFlow } from './authentication-flow';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';

export function ConnectButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <AuthenticationFlow />
    </Dialog>
  );
}
