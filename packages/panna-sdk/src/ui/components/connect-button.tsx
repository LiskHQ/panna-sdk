import { LoginForm } from './login-form';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Typography } from './ui/typography';

export function ConnectButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-center">
              Welcome to Connectify
            </DialogTitle>
          </DialogHeader>
          <LoginForm />
          <DialogFooter className="flex flex-col justify-center! text-xs text-neutral-400">
            <Typography>Powered by Panna</Typography>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
