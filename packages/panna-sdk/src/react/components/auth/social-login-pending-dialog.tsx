import { ChevronLeftIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { EcosystemId } from 'src/core';
import { ecosystemWallet } from 'thirdweb/wallets';
import { LAST_AUTH_PROVIDER } from '@/consts';
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
import { AccountDialogFooter } from './auth-flow';

export function SocialLoginPendingDialog() {
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
      let connectionError: string | null = null;

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
          connectionError = getErrorMessage(error);
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

        // Automatically perform SIWE authentication in the background
        await handleSiweAuth(wallet, {
          chainId: getEnvironmentChain().id as number
        });

        onClose?.();
      }
    } catch (error) {
      console.error('Google login failed:', error);
      next({ error });
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
