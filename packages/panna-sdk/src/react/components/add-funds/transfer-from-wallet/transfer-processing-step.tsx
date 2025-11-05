import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toEIP1193Provider } from 'src/core/extensions';
import {
  WalletId,
  isWalletId,
  type WalletIdValue
} from 'src/core/extensions/wallet-ids';
import { transferBalanceFromExternalWallet } from 'src/core/transaction/transaction';
import type { Address } from 'src/core/types/external';
import type { TokenBalance } from '@/mocks/token-balances';
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

  const tokenData = form.getValues('tokenInfo.token') as TokenBalance['token'];
  const cryptoAmount = form.getValues('cryptoAmount') || '0';
  const toAddress = form.getValues('toAddress');

  useEffect(() => {
    async function executeTransfer() {
      try {
        if (!externalWallet) {
          throw new Error('No external wallet connected.');
        }

        const account = externalWallet.getAccount();

        if (!account) {
          throw new Error('Could not retrieve external wallet account.');
        }

        if (!tokenData) {
          throw new Error('No token information available.');
        }

        const chain = getEnvironmentChain(chainId);

        const provider = toEIP1193Provider({
          wallet: externalWallet,
          chain,
          client
        });

        const walletIdMap: Record<string, WalletIdValue> = {
          [WalletId.MetaMask]: WalletId.MetaMask,
          [WalletId.Coinbase]: WalletId.Coinbase,
          [WalletId.Trust]: WalletId.Trust,
          [WalletId.Rainbow]: WalletId.Rainbow,
          [WalletId.Phantom]: WalletId.Phantom,
          walletConnect: WalletId.WalletConnect,
          walletconnect: WalletId.WalletConnect
        };

        const externalWalletId = externalWallet.id;
        const normalizedWalletId = externalWalletId.toLowerCase();

        let resolvedWalletId: WalletIdValue | null = null;

        if (walletIdMap[externalWalletId]) {
          resolvedWalletId = walletIdMap[externalWalletId];
        } else if (walletIdMap[normalizedWalletId]) {
          resolvedWalletId = walletIdMap[normalizedWalletId];
        } else if (normalizedWalletId.startsWith('ecosystem.')) {
          resolvedWalletId = WalletId.WalletConnect;
        } else if (normalizedWalletId.includes('metamask')) {
          resolvedWalletId = WalletId.MetaMask;
        } else if (normalizedWalletId.includes('coinbase')) {
          resolvedWalletId = WalletId.Coinbase;
        } else if (normalizedWalletId.includes('trust')) {
          resolvedWalletId = WalletId.Trust;
        } else if (normalizedWalletId.includes('rainbow')) {
          resolvedWalletId = WalletId.Rainbow;
        } else if (normalizedWalletId.includes('phantom')) {
          resolvedWalletId = WalletId.Phantom;
        } else if (normalizedWalletId.includes('walletconnect')) {
          resolvedWalletId = WalletId.WalletConnect;
        } else if (isWalletId(externalWalletId)) {
          resolvedWalletId = externalWalletId as WalletIdValue;
        }

        if (!resolvedWalletId) {
          throw new Error('This wallet is not supported.');
        }

        const transferWalletId = normalizedWalletId.startsWith('ecosystem.')
          ? WalletId.WalletConnect
          : resolvedWalletId;

        const rawTokenAddress = tokenData.address;
        const isNativeToken =
          !rawTokenAddress ||
          rawTokenAddress === '0x0000000000000000000000000000000000000000' ||
          tokenData.symbol === 'ETH';

        const tokenAddress = isNativeToken
          ? undefined
          : (rawTokenAddress as Address);

        const amount = BigInt(
          Math.floor(Number(cryptoAmount) * 10 ** tokenData.decimals)
        );

        if (!toAddress) {
          throw new Error('Destination address is invalid.');
        }

        const recipientAddress = toAddress as Address;

        await transferBalanceFromExternalWallet({
          provider,
          walletId: transferWalletId,
          to: recipientAddress,
          amount,
          client,
          chain,
          tokenAddress,
          account
        });

        next();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error('Transfer failed:', errorMessage);

        const normalizedError = errorMessage.toLowerCase();

        if (normalizedError.includes('insufficient funds')) {
          console.error('Insufficient balance to complete the transfer.');
        } else if (normalizedError.includes('user rejected')) {
          console.error('The transaction was rejected by the user.');
        } else {
          console.error('The transaction failed:', errorMessage);
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
