import { CreditCardIcon, WalletIcon } from 'lucide-react';
import { useExternalWallet } from '../../hooks';
import { Card } from '../ui/card';
import { DialogHeader, DialogTitle } from '../ui/dialog';
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
        <Typography variant="muted" className="text-center">
          Choose how you want to add funds
        </Typography>

        {/* Buy Crypto Option */}
        <Card
          className="hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={handleBuyClick}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
              <CreditCardIcon className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <Typography variant="large" className="font-semibold">
                Buy crypto
              </Typography>
              <Typography variant="muted" className="mt-1 text-sm">
                Purchase cryptocurrency using your credit card or other payment
                methods
              </Typography>
            </div>
          </div>
        </Card>

        {/* Transfer from Wallet Option */}
        <Card
          className={`transition-colors ${
            hasExternalWallet
              ? 'hover:bg-muted/50 cursor-pointer'
              : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleTransferClick}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
              <WalletIcon className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <Typography variant="large" className="font-semibold">
                Transfer from wallet
              </Typography>
              <Typography variant="muted" className="mt-1 text-sm">
                {hasExternalWallet
                  ? 'Transfer assets from your connected external wallet'
                  : 'Connect an external wallet (e.g., MetaMask) to transfer assets'}
              </Typography>
            </div>
          </div>
        </Card>

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
