import { ChevronLeftIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { EcosystemId } from 'src/core';
import { ecosystemWallet } from 'thirdweb/wallets';
import { useDialog, useLogin, usePanna } from '@/hooks';
import { getEnvironmentChain } from '@/utils';
import { handleSiweAuth } from '@/utils/auth';
import { getErrorMessage } from '@/utils/get-error-message';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { AccountDialogFooter, STEP_LOGIN_FORM } from './auth-flow';

export function SocialLoginPendingDialog() {
  const { next, goToStep, reset } = useDialogStepper();
  const { onClose } = useDialog();
  const { client, partnerId, chainId, siweAuth } = usePanna();
  const initializeGoogleLogin = useRef(true);

  const { connect, error: loginError } = useLogin({
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
    const wallet = await connect(async () => {
      const ecoWallet = ecosystemWallet(EcosystemId.LISK, {
        partnerId
      });

      await ecoWallet.connect({
        client,
        strategy: 'google'
      });

      return ecoWallet;
    });

    if (wallet) {
      // Automatically perform SIWE authentication in the background
      await handleSiweAuth(siweAuth, wallet, {
        chainId: getEnvironmentChain().id as number
      });

      onClose?.();
    }
  };

  useEffect(() => {
    if (initializeGoogleLogin.current) {
      handleGoogleLogin();
      initializeGoogleLogin.current = false;
    }
  }, []);

  useEffect(() => {
    if (loginError) {
      console.error('Login error:', getErrorMessage(loginError));
      next({ error: getErrorMessage(loginError) });
    }
  }, [loginError]);

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
              data-testid="back-icon"
              onClick={() => goToStep(STEP_LOGIN_FORM)}
            />
            <DialogClose>
              <XIcon
                size={20}
                className="text-muted-foreground hover:text-primary right-4 transition-colors"
                data-testid="close-icon"
                onClick={handleClose}
              />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <Typography variant="h4" as="p">
          Sign in
        </Typography>
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon
            size={80}
            className="animate-spin"
            data-testid="loader-icon"
          />
          <Typography variant="muted">
            Sign into your account in the pop-up
          </Typography>
        </div>
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}
