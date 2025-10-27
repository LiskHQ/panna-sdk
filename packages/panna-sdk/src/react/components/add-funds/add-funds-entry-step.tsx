import { BanknoteIcon, WalletIcon } from 'lucide-react';
import { useExternalWallet } from '../../hooks';
import { Card } from '../ui/card';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Typography } from '../ui/typography';

type AddFundsEntryStepProps = {
  onBuySelected: () => void;
  onTransferSelected: () => void;
};

export function AddFundsEntryStep({
  onBuySelected,
  onTransferSelected
}: AddFundsEntryStepProps) {
  const { hasExternalWallet } = useExternalWallet();

  const handleBuyClick = () => {
    onBuySelected();
  };

  const handleTransferClick = () => {
    if (hasExternalWallet) {
      onTransferSelected();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Add funds</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label>Buy</Label>
          <Card
            className="hover:bg-muted/50 flex flex-row items-center gap-4 px-3 py-3 transition-colors"
            onClick={handleBuyClick}
          >
            <BanknoteIcon className="text-primary size-8" />
            <div className="flex-1">
              <Typography as="h1" variant="small">
                Buy crypto
              </Typography>
              <Typography variant="muted">
                Buy using your preferred payment method
              </Typography>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Label>Transfer from wallet</Label>
          <Card
            className={`flex flex-row items-center gap-4 px-3 py-3 transition-colors ${
              hasExternalWallet
                ? 'hover:bg-muted/50 cursor-pointer'
                : 'cursor-not-allowed opacity-50'
            }`}
            onClick={handleTransferClick}
          >
            <WalletIcon className="text-primary size-8" />
            <div className="flex-1">
              <Typography as="h1" variant="small">
                Transfer from wallet
              </Typography>
              <Typography variant="muted">
                {hasExternalWallet
                  ? 'Transfer assets from your connected external wallet'
                  : 'Connect an external wallet (e.g., MetaMask) to transfer assets'}
              </Typography>
            </div>
          </Card>
        </div>
        {!hasExternalWallet && (
          <div className="bg-muted/50 rounded-lg p-3">
            <Typography
              variant="small"
              className="text-muted-foreground text-center"
            >
              💡 Tip: Connect MetaMask or another wallet to enable transfers
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
