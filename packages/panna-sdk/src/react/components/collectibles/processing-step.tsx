import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  liskSepolia,
  prepareContractCall,
  PrepareContractCallResult,
  sendTransaction,
  TokenERC
} from 'src/core';
import { Abi } from 'viem';
import { useActiveAccount, usePanna } from '@/hooks';
import { getEnvironmentChain } from '@/utils';
import { Address, PreparedTransaction } from '../../../core/types/external';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import { SendCollectibleFormData } from './schema';

const DEFAULT_ERC1155_VALUE = 1;
const DEFAULT_ERC1155_DATA = '0x';

type ProcessingStepProps = {
  form: UseFormReturn<SendCollectibleFormData>;
};

export function ProcessingStep({ form }: ProcessingStepProps) {
  const { client, chainId } = usePanna();
  const { next } = useDialogStepper();
  const account = useActiveAccount();
  const initializeTokenSend = useRef(true);
  const { collectible, token, recipientAddress } = form.getValues();

  // TODO: Possibly create hook for this logic
  useEffect(() => {
    let transaction: PrepareContractCallResult;
    const chain = getEnvironmentChain(chainId);
    if (token.type === TokenERC.ERC721) {
      transaction = prepareContractCall({
        client,
        chain,
        method:
          'function safeTransferFrom(address from, address to, uint256 tokenId)',
        params: [
          account?.address as Address,
          recipientAddress as Address,
          BigInt(collectible.id)
        ],
        address: token.address as Address
      });
    } else {
      transaction = prepareContractCall({
        client,
        chain,
        method:
          'function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)',
        params: [
          account?.address as Address,
          recipientAddress as Address,
          BigInt(collectible.id),
          DEFAULT_ERC1155_VALUE,
          DEFAULT_ERC1155_DATA
        ],
        address: token.address as Address
      });
    }

    async function sendCollectible() {
      try {
        const result = await sendTransaction({
          account: account!,
          transaction: transaction as PreparedTransaction<Abi>
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
      }
    }

    if (initializeTokenSend.current) {
      sendCollectible();
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
