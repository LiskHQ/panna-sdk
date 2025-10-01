import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  liskSepolia,
  prepareContractCall,
  PrepareContractCallResult,
  prepareTransaction,
  PrepareTransactionResult,
  sendTransaction,
  toWei
} from 'src/core';
import { tokenConfig } from '@/consts';
import { useActiveAccount, usePanna } from '@/hooks';
import { getEnvironmentChain } from '@/utils';
import { Address, PreparedTransaction } from '../../../core/types/external';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { SendFormData } from './schema';

type SendProcessingStepProps = {
  form: UseFormReturn<SendFormData>;
};

export function SendProcessingStep({ form }: SendProcessingStepProps) {
  const { client, chainId } = usePanna();
  const { next, goToStep, lastStep } = useDialogStepper();
  const account = useActiveAccount();
  const initializeTokenSend = useRef(true);
  const tokenData = form.getValues('tokenInfo.token');
  const cryptoAmount = form.getValues('cryptoAmount') || '0';

  // @Todo: Possibly create hook for this logic
  useEffect(() => {
    let transaction: PrepareTransactionResult | PrepareContractCallResult;
    const chain = getEnvironmentChain(chainId);
    const currentTokenConfig = tokenConfig[chain.id];
    if (tokenData.symbol === 'ETH') {
      transaction = prepareTransaction({
        client,
        chain,
        to: form.getValues('recipientAddress') as Address,
        value: BigInt(toWei(cryptoAmount) * 100000000000000000n) // Convert ETH to wei
      });
    } else {
      transaction = prepareContractCall({
        method: 'function transfer(address to, uint256 value)',
        params: [
          form.getValues('recipientAddress') as Address,
          BigInt(Number(cryptoAmount) * 10 ** tokenData.decimals)
        ],
        address: currentTokenConfig.find(
          (token) => token.symbol === tokenData.symbol
        )?.address as Address,
        chain,
        client
      });
    }

    async function sendToken() {
      try {
        const result = await sendTransaction({
          account: account!,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transaction: transaction as PreparedTransaction<any>
        });

        if (chainId === String(liskSepolia.id)) {
          console.log('Success! Transaction hash:', result.transactionHash);
        }
        next();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('insufficient funds')) {
          console.error('Not enough balance to send transaction');
        } else if (errorMessage.includes('user rejected')) {
          console.error('User rejected the transaction');
        } else {
          console.error('Transaction failed:', errorMessage);
        }
        // Error screen is always the last step
        goToStep(lastStep, { hideBackButton: true });
      }
    }

    if (initializeTokenSend.current) {
      sendToken();
      initializeTokenSend.current = false;
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center">
        <DialogTitle>Sending</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3">
        <Loader2Icon size={80} className="animate-spin" />
        <div className="space-y-2 text-center">
          <Typography variant="muted">Processing your transfer...</Typography>
        </div>
      </div>
    </div>
  );
}
