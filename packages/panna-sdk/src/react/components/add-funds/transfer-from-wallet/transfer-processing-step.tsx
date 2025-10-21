import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { transferBalanceFromExternalWallet } from 'src/core';
import { getEnvironmentChain } from '@/utils';
import { useExternalWallet, usePanna } from '../../../hooks';
import { DialogHeader, DialogTitle } from '../../ui/dialog';
import { useDialogStepper } from '../../ui/dialog-stepper';
import { Typography } from '../../ui/typography';
import { TransferFormData } from './schema';

type TransferProcessingStepProps = {
  form: UseFormReturn<TransferFormData>;
};

export function TransferProcessingStep({ form }: TransferProcessingStepProps) {
  const { client, chainId } = usePanna();
  const { next, goToStep, lastStep } = useDialogStepper();
  const { externalWallet } = useExternalWallet();
  const initializeTransfer = useRef(true);

  const tokenData = form.getValues('tokenInfo.token');
  const cryptoAmount = form.getValues('cryptoAmount') || '0';
  const toAddress = form.getValues('toAddress');

  useEffect(() => {
    async function executeTransfer() {
      try {
        if (!externalWallet) {
          throw new Error('No external wallet connected');
        }

        const externalAccount = externalWallet.getAccount();
        if (!externalAccount) {
          throw new Error('Could not get external wallet account');
        }

        const chain = getEnvironmentChain(chainId);

        // Determine token address (use zero address for native token)
        const tokenAddress =
          tokenData.symbol === 'ETH'
            ? '0x0000000000000000000000000000000000000000'
            : tokenData.address || '0x0000000000000000000000000000000000000000';

        // Convert amount to smallest unit (wei for ETH, token units for ERC-20)
        const amount = BigInt(
          Math.floor(Number(cryptoAmount) * 10 ** tokenData.decimals)
        );

        const result = await transferBalanceFromExternalWallet({
          externalAccount,
          embeddedWalletAddress: toAddress,
          tokenAddress,
          amount,
          client,
          chain
        });

        console.log('Transfer successful:', result.transactionHash);
        next();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error('Transfer failed:', errorMessage);

        if (errorMessage.includes('insufficient funds')) {
          console.error('Not enough balance to complete transfer');
        } else if (
          errorMessage.includes('user rejected') ||
          errorMessage.includes('User rejected')
        ) {
          console.error('User rejected the transaction');
        } else {
          console.error('Transaction failed:', errorMessage);
        }

        // Navigate to error step (always the last step)
        goToStep(lastStep, { hideBackButton: true });
      }
    }

    if (initializeTransfer.current) {
      executeTransfer();
      initializeTransfer.current = false;
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center">
        <DialogTitle>Processing transfer</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3">
        <Loader2Icon size={80} className="animate-spin" />
        <div className="space-y-2 text-center">
          <Typography variant="large">Awaiting confirmation</Typography>
          <Typography variant="muted">
            Please approve the transaction in your wallet
          </Typography>
          <Typography variant="muted" className="text-xs">
            Keep this window open
          </Typography>
        </div>
      </div>
    </div>
  );
}
