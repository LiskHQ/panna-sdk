import { AccountDialogFooter } from './account-dialog-footer';
import { DialogStepper, useDialogStepper } from './dialog-stepper';
import { InputOTPForm } from './input-otp-form';
import { LoginForm } from './login-form';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export function AccountContent() {
  return (
    <DialogStepper>
      <LoginFormDialog />
      <InputOTPFormDialog />
    </DialogStepper>
  );
}

const LoginFormDialog = () => {
  const { next } = useDialogStepper();

  return (
    <DialogContent>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to Connectify
          </DialogTitle>
        </DialogHeader>
        <LoginForm next={next} />
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
};

const InputOTPFormDialog = () => {
  const { next } = useDialogStepper();

  return (
    <DialogContent>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">6-digit code</DialogTitle>
        </DialogHeader>
        <InputOTPForm next={next} />
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
};
