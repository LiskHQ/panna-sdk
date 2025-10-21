import { WalletIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { truncateAddress } from '@/utils/address';
import { useExternalWallet } from '../../../hooks';
import { Button } from '../../ui/button';
import { DialogHeader, DialogTitle } from '../../ui/dialog';
import { useDialogStepper } from '../../ui/dialog-stepper';
import { Typography } from '../../ui/typography';
import { TransferFormData } from './schema';

type TransferSelectWalletStepProps = {
  form: UseFormReturn<TransferFormData>;
};

export function TransferSelectWalletStep({
  form
}: TransferSelectWalletStepProps) {
  const { next } = useDialogStepper();
  const { externalWallet, externalAddress } = useExternalWallet();

  // Set the from address in the form
  const handleNext = () => {
    if (externalAddress) {
      form.setValue('fromAddress', externalAddress);
      next();
    }
  };

  // Get wallet name from wallet ID
  const getWalletName = () => {
    if (!externalWallet) return 'External Wallet';

    const walletId = externalWallet.id;
    if (walletId.includes('metamask')) return 'MetaMask';
    if (walletId.includes('coinbase')) return 'Coinbase Wallet';
    if (walletId.includes('walletconnect')) return 'WalletConnect';
    if (walletId.includes('rainbow')) return 'Rainbow';

    return 'External Wallet';
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Transfer from wallet</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <Typography variant="muted" className="text-center">
          Transfer assets from your connected wallet
        </Typography>

        <div className="border-border bg-muted/50 flex items-center gap-4 rounded-lg border p-4">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <WalletIcon className="text-primary h-6 w-6" />
          </div>
          <div className="flex-1">
            <Typography variant="small" className="font-medium">
              {getWalletName()}
            </Typography>
            <Typography variant="muted" className="text-xs">
              {externalAddress
                ? truncateAddress(externalAddress)
                : 'Not connected'}
            </Typography>
          </div>
        </div>

        {!externalAddress && (
          <Typography variant="small" className="text-destructive text-center">
            No external wallet detected. Please connect a wallet to continue.
          </Typography>
        )}
      </div>

      <Button type="button" onClick={handleNext} disabled={!externalAddress}>
        Next
      </Button>
    </div>
  );
}
