import { useConnectedAccounts } from '@/hooks';
import { AccountDialogFooter } from './account-dialog-footer';
import { InputOTPForm } from './input-otp-form';
import { LoginForm } from './login-form';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export function AccountContent() {
  const connectedAccounts = useConnectedAccounts();

  if (!connectedAccounts.length) {
    return (
      <DialogContent>
        <div className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-center">
              Welcome to Connectify
            </DialogTitle>
          </DialogHeader>
          <LoginForm />
          <AccountDialogFooter />
        </div>
      </DialogContent>
    );
  }

  if (connectedAccounts.length === 1) {
    return (
      <DialogContent>
        <div className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-center">6-digit code</DialogTitle>
          </DialogHeader>
          <InputOTPForm />
          <AccountDialogFooter />
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to Connectify
          </DialogTitle>
        </DialogHeader>
        <div></div>
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}
