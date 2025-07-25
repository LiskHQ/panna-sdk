import { useDialog } from '@/hooks/use-dialog';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { DialogStepper, useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { InputOTPForm } from './input-otp-form';
import { LoginForm } from './login-form';

type AuthDialogProps = {
  title?: string;
  description?: string;
};

export function AuthFlow() {
  return (
    <DialogStepper>
      <LoginFormDialog title="Welcome to Connectify" />
      <InputOTPFormDialog />
    </DialogStepper>
  );
}

function LoginFormDialog(props: AuthDialogProps) {
  const { next } = useDialogStepper();
  const { onClose } = useDialog();
  const title = props.title ?? 'Login';
  const description = props.description ?? 'Login form dialog';

  return (
    <DialogContent>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <LoginForm next={next} onClose={onClose} />
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}

function InputOTPFormDialog(props: AuthDialogProps) {
  const { reset, stepData } = useDialogStepper();
  const { onClose } = useDialog();
  const title = props.title ?? '6-digit code';
  const description = props.description ?? 'OTP form dialog';

  return (
    <DialogContent>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <InputOTPForm data={stepData} reset={reset} onClose={onClose} />
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}

function AccountDialogFooter() {
  return (
    <DialogFooter className="text-muted-foreground flex flex-col justify-center! text-xs">
      <Typography>Powered by Panna</Typography>
    </DialogFooter>
  );
}
