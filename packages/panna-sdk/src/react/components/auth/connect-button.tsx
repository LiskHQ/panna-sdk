'use client';

import { useDialog } from '@/hooks/use-dialog';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { AuthFlow } from './auth-flow';

export function ConnectButton() {
  const { isOpen, setIsOpen } = useDialog();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <AuthFlow />
    </Dialog>
  );
}
