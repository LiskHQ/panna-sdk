import { ChevronLeftIcon, XIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { connect, EcosystemId } from 'src/core';
import { WalletId } from 'thirdweb/wallets';
import { useDialog, useLogin, usePanna } from '@/hooks';
import { getEnvironmentChain } from '@/utils';
import { handleSiweAuth } from '@/utils/auth';
import { Button } from '../ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';

type WalletOption = {
  id: string;
  rdns: WalletId;
  name: string;
  icon: string;
};

const walletOptions: WalletOption[] = [
  {
    id: 'metamask',
    rdns: 'io.metamask',
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg'
  },
  {
    id: 'phantom',
    rdns: 'app.phantom',
    name: 'Phantom',
    icon: 'https://explorer-api.walletconnect.com/v3/logo/md/b6ec7b81-bb4f-427d-e290-7631e6e50d00?projectId=ad53ae497ee922ad9beb2ef78b1a7a6e'
  },
  {
    id: 'walletConnect',
    rdns: 'walletConnect',
    name: 'WalletConnect',
    icon: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg'
  },
  {
    id: 'coinbase',
    rdns: 'com.coinbase.wallet',
    name: 'Coinbase Wallet',
    icon: 'https://gist.githubusercontent.com/taycaldwell/2291907115c0bb5589bc346661435007/raw/cbw.svg'
  },
  {
    id: 'binance',
    rdns: 'com.binance.wallet',
    name: 'Binance Wallet',
    icon: 'https://explorer-api.walletconnect.com/v3/logo/md/ebac7b39-688c-41e3-7912-a4fefba74600?projectId=ad53ae497ee922ad9beb2ef78b1a7a6e'
  }
];

export default function ChooseWalletDialog() {
  const { onClose } = useDialog();
  const { next, prev, reset } = useDialogStepper();
  const { client, partnerId, chainId } = usePanna();
  const { connect: connectWallet } = useLogin({
    client,
    setWalletAsActive: true,
    accountAbstraction: {
      chain: getEnvironmentChain(chainId),
      sponsorGas: true
    }
  });

  const handleWalletSelect = async (wallet: WalletOption) => {
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
            strategy: 'wallet',
            walletId: wallet.rdns,
            chain: getEnvironmentChain(chainId)
          })
      );

      if (userWallet) {
        // Automatically perform SIWE authentication in the background
        await handleSiweAuth(userWallet, {
          chainId: Number(chainId)
        });

        next();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error instanceof Error ? error.message : (error as string));
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <DialogContent showCloseButton={false}>
      <DialogDescription className="sr-only">Choose wallet</DialogDescription>
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
            Choose Wallet
          </Typography>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              size="lg"
              onClick={() => handleWalletSelect(wallet)}
              className="flex min-h-14 items-center justify-normal gap-3 rounded-xl bg-[#FFFFFF0D] px-3 py-2"
            >
              <img
                src={wallet.icon}
                alt={wallet.name}
                className="h-10 w-10 rounded-lg"
              />
              <Typography className="mt-0!">{wallet.name}</Typography>
            </Button>
          ))}
        </div>
      </div>
    </DialogContent>
  );
}
