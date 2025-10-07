import { ChevronLeftIcon, CircleXIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { EcosystemId } from 'src/core';
import { ecosystemWallet } from 'thirdweb/wallets';
import { LAST_AUTH_PROVIDER } from '@/consts';
import { useDialog, useLogin, usePanna } from '@/hooks';
import { getEnvironmentChain } from '../../utils';
import { Button } from '../ui/button';
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

function AccountDialogFooter() {
  return (
    <DialogFooter className="flex flex-col justify-center! text-xs">
      <Typography variant="muted">Powered by Panna</Typography>
    </DialogFooter>
  );
}

function SocialLoginPendingDialog() {
  const { next, goToStep, reset } = useDialogStepper();
  const { onClose } = useDialog();
  const { client, partnerId, chainId } = usePanna();
  const initializeGoogleLogin = useRef(true);

  const { connect } = useLogin({
    client,
    setWalletAsActive: true,
    accountAbstraction: {
      chain: getEnvironmentChain(chainId),
      sponsorGas: true
    }
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleGoogleLogin = async () => {
    try {
      let connectionError: Error | null = null;

      const wallet = await connect(async () => {
        const ecoWallet = ecosystemWallet(EcosystemId.LISK, {
          partnerId
        });

        try {
          await ecoWallet.connect({
            client,
            strategy: 'google'
          });
        } catch (error) {
          connectionError =
            error instanceof Error ? error : new Error(String(error));
          throw error;
        }

        return ecoWallet;
      });

      // If ecoWallet.connect() failed, throw the original error
      if (connectionError) {
        throw connectionError;
      }

      if (wallet) {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
          localStorage.setItem(LAST_AUTH_PROVIDER, 'Google');
          // Note: USER_ADDRESS is automatically managed by thirdweb
        }
        onClose?.();
      }
    } catch (error) {
      console.error('Google login failed:', error);
      next({ error: (error as Error).message });
    }
  };

  useEffect(() => {
    if (initializeGoogleLogin.current) {
      handleGoogleLogin();
      initializeGoogleLogin.current = false;
    }
  }, []);

  return (
    <DialogContent showCloseButton={false}>
      <DialogDescription className="sr-only">
        Pending social login dialog
      </DialogDescription>
      <div className="flex flex-col gap-6 text-center">
        <DialogHeader>
          <DialogTitle className="flex justify-between text-center">
            <ChevronLeftIcon
              className="text-muted-foreground hover:text-primary left-4"
              onClick={() => goToStep(0)}
            />
            <DialogClose>
              <XIcon
                size={20}
                className="text-muted-foreground hover:text-primary right-4 transition-colors"
                onClick={handleClose}
              />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <Typography variant="h4" as="p">
          Sign in
        </Typography>
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon size={80} className="animate-spin" />
          <Typography variant="muted">
            Sign into your account in the pop-up
          </Typography>
        </div>
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}

function SocialLoginErrorDialog() {
  const { goToStep, prev, reset, stepData } = useDialogStepper();
  const { onClose } = useDialog();
  const errorMessage = (stepData?.error as string) || 'Login window closed';

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <DialogContent showCloseButton={false}>
      <DialogDescription className="sr-only">
        Pending social login dialog
      </DialogDescription>
      <div className="flex flex-col gap-6 text-center">
        <DialogHeader>
          <DialogTitle className="flex justify-between text-center">
            <ChevronLeftIcon
              className="text-muted-foreground hover:text-primary left-4"
              onClick={() => goToStep(0)}
            />
            <DialogClose>
              <XIcon
                size={20}
                className="text-muted-foreground hover:text-primary right-4 transition-colors"
                onClick={handleClose}
              />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <Typography variant="h4" as="p">
          Sign in
        </Typography>
        <div className="flex flex-col items-center gap-3">
          <CircleXIcon size={80} className="h-20 w-20 stroke-[#FF6366]" />
          <Typography variant="muted">{errorMessage}</Typography>
        </div>
        <Button className="w-full" onClick={() => prev()}>
          Try again
        </Button>
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}
