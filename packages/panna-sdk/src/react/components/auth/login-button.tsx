'use client';

import { useDialog } from '@/hooks/use-dialog';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { AuthFlow } from './auth-flow';
import { ConnectButtonProps } from './connect-button';

export function LoginButton({
  connectButton,
  connectDialog
}: ConnectButtonProps) {
  const { isOpen, setIsOpen } = useDialog();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{connectButton?.title || 'Connect Wallet'}</Button>
      </DialogTrigger>
      <AuthFlow connectDialog={connectDialog} />
    </Dialog>
  );
}
