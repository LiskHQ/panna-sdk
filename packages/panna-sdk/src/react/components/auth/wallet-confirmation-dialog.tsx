import { ChevronLeftIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { connect, EcosystemId, LoginStrategy } from 'src/core';
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
import { WalletOption } from './choose-wallet-dialog';

export default function WalletConfirmationDialog() {
  const { onClose } = useDialog();
  const { prev, next, reset, stepData } = useDialogStepper();
  const selectedWallet = stepData?.wallet as WalletOption;
  const { client, partnerId, chainId, siweAuth } = usePanna();
  const { connect: connectWallet, error: loginError } = useLogin({
    client,
    setWalletAsActive: true,
    accountAbstraction: {
      chain: getEnvironmentChain(chainId),
      sponsorGas: true
    }
  });
  const initializeWalletConnection = useRef(true);

  useEffect(() => {
    if (!selectedWallet) {
      console.error('No wallet selected for confirmation dialog');
      toast.error('No wallet selected. Please try again.');
      onClose();
    } else if (selectedWallet && initializeWalletConnection.current) {
      handleWalletConnection();
    }

    if (initializeWalletConnection.current) {
      initializeWalletConnection.current = false;
    }
  }, []);

  useEffect(() => {
    if (loginError) {
      console.error('Error connecting wallet:', getErrorMessage(loginError));
      toast.error(getErrorMessage(loginError));
      prev();
    }
  }, [loginError]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleWalletConnection = async () => {
    try {
      // Wrap with connectWallet during login but without it during linking
      const userWallet = await connectWallet(
        async () =>
          await connect({
            client,
            ecosystem: {
              id: EcosystemId.LISK,
              partnerId
            },
            strategy: LoginStrategy.WALLET,
            walletId: selectedWallet.rdns,
            chain: getEnvironmentChain(chainId)
          })
      );

      if (userWallet) {
        // Automatically perform SIWE authentication in the background
        await handleSiweAuth(siweAuth, userWallet, {
          chainId: Number(chainId)
        });

        next();
      }
    } catch (error) {
      // Catch only triggers when connect is run directly, not when wrapped with connectWallet
      // Therefore it is only triggered during account linking rather than login
      console.error('Error connecting wallet:', getErrorMessage(error));
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <DialogContent showCloseButton={false}>
      <DialogDescription className="sr-only">
        Confirm wallet connection
      </DialogDescription>
      <div className="flex flex-col gap-6">
        <DialogHeader className="gap-0">
          <DialogTitle className="flex justify-between">
            <ChevronLeftIcon
              className="text-muted-foreground hover:text-primary left-4"
              onClick={() => prev()}
            />
            <DialogClose>
              <XIcon
                size={20}
                className="text-muted-foreground hover:text-primary right-4 transition-colors"
                onClick={handleClose}
              />
            </DialogClose>
          </DialogTitle>
          <Typography variant="h4" as="p" className="text-center">
            {selectedWallet.name}
          </Typography>
        </DialogHeader>
        <div className="relative flex justify-center">
          <Loader2Icon className="h-20 w-20 animate-spin" />
          <img
            src={selectedWallet.icon}
            alt={selectedWallet.name}
            className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="large" className="text-center">
            Awaiting confirmation
          </Typography>
          <Typography variant="muted" className="text-center">
            Accept the connection request in {selectedWallet.name}
          </Typography>
        </div>
      </div>
    </DialogContent>
  );
}
