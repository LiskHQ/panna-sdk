'use client';

import { useDialog } from '@/hooks/use-dialog';
import { AuthenticationFlow } from './authentication-flow';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';

export function ConnectButton() {
  const { isOpen, setIsOpen } = useDialog();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <AuthenticationFlow />
    </Dialog>
  );
}
