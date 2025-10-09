import { ChevronLeftIcon, XIcon } from 'lucide-react';
import { useDialog } from '@/hooks';
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
import { ConnectButtonProps } from './connect-button';
import { InputOTPForm } from './input-otp-form';
import { LoginForm } from './login-form';
import { SocialLoginErrorDialog } from './social-login-error-dialog';
import { SocialLoginPendingDialog } from './social-login-pending-dialog';

export function AuthFlow({ connectDialog }: ConnectButtonProps) {
  return (
    <DialogStepper>
      <LoginFormDialog
        title={connectDialog?.title}
        description={connectDialog?.description}
      />
      <InputOTPFormDialog
        title={connectDialog?.otpTitle}
        description={connectDialog?.otpDescription}
      />
      <SocialLoginPendingDialog />
      <SocialLoginErrorDialog />
    </DialogStepper>
  );
}

type AuthFormDialogProps = ConnectButtonProps['connectDialog'];

function LoginFormDialog(props: AuthFormDialogProps) {
  const { next, goToStep } = useDialogStepper();
  const title = props?.title ?? 'Welcome to Connectify';
  const description = props?.description ?? 'Login form dialog';

  return (
    <DialogContent>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <div className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <LoginForm next={next} goToStep={goToStep} />
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}

function InputOTPFormDialog(props: AuthFormDialogProps) {
  const { reset, stepData, prev } = useDialogStepper();
  const { onClose } = useDialog();
  const title = props?.title ?? '6-digit code';
  const description = props?.description ?? 'OTP form dialog';

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

export function AccountDialogFooter() {
  return (
    <DialogFooter className="flex flex-col justify-center! text-xs">
      <Typography variant="muted">Powered by Panna</Typography>
    </DialogFooter>
  );
}
