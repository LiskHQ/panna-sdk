import { useDialog } from '@/hooks/use-dialog';
import { AccountDialogFooter } from './account-dialog-footer';
import { DialogStepper, useDialogStepper } from './dialog-stepper';
import { InputOTPForm } from './input-otp-form';
import { LoginForm } from './login-form';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from './ui/dialog';

export function AuthenticationFlow() {
  return (
    <DialogStepper>
      <LoginFormDialog />
      <InputOTPFormDialog />
    </DialogStepper>
  );
}

const LoginFormDialog = () => {
  const { next } = useDialogStepper();
  const { onClose } = useDialog();

  return (
    <DialogContent>
      <DialogDescription className="sr-only">
        Login form dialog
      </DialogDescription>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to Connectify
          </DialogTitle>
        </DialogHeader>
        <LoginForm next={next} onClose={onClose} />
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
};

const InputOTPFormDialog = () => {
  const { reset, stepData } = useDialogStepper();
  const { onClose } = useDialog();

  return (
    <DialogContent>
      <DialogDescription className="sr-only">OTP form dialog</DialogDescription>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">6-digit code</DialogTitle>
        </DialogHeader>
        <InputOTPForm data={stepData} reset={reset} onClose={onClose} />
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
};
