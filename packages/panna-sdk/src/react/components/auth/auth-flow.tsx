import { ChevronLeftIcon, XIcon } from 'lucide-react';
import { useDialog } from '@/hooks/use-dialog';
import {
  DialogClose,
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
  const { reset, stepData, prev } = useDialogStepper();
  const { onClose } = useDialog();
  const title = props.title ?? '6-digit code';
  const description = props.description ?? 'OTP form dialog';

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <DialogContent showCloseButton={false}>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="flex justify-between text-center">
            <ChevronLeftIcon
              className="text-muted-foreground hover:text-primary left-4"
              onClick={() => prev()}
            />
            <Typography variant="h4" as="p">
              {title}
            </Typography>
            <DialogClose>
              <XIcon
                size={20}
                className="text-muted-foreground hover:text-primary right-4 transition-colors"
                onClick={handleClose}
              />
            </DialogClose>
          </DialogTitle>
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
