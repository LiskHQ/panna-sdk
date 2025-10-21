import type { Account } from 'thirdweb/wallets';
import type { Chain } from '../chain/types';
import type { PannaClient } from '../client';
import type { Address } from '../types/external';

/**
 * Parameters for transferring balance from an external wallet to embedded wallet
 */
export interface TransferBalanceFromExternalWalletParams {
  /**
   * The external wallet account (e.g., MetaMask) to transfer from
   */
  externalAccount: Account;
  /**
   * The embedded wallet address to transfer to
   */
  embeddedWalletAddress: Address;
  /**
   * The token contract address (use zero address for native token)
   */
  tokenAddress: Address;
  /**
   * The amount to transfer (in smallest unit, e.g., wei for ETH)
   */
  amount: bigint;
  /**
   * The Panna client instance
   */
  client: PannaClient;
  /**
   * The chain to execute the transfer on
   */
  chain: Chain;
}

/**
 * Result of a transfer transaction
 */
export interface TransferBalanceResult {
  /**
   * The transaction hash
   */
  transactionHash: string;
  /**
   * The block number where the transaction was mined (if available)
   */
  blockNumber?: bigint;
}

/**
 * Transfer balance from an external wallet to the embedded wallet
 *
 * @remarks
 * This function initiates a transfer from an external wallet (e.g., MetaMask)
 * to the user's embedded wallet. The user will be prompted to approve the
 * transaction in their external wallet provider.
 *
 * **MOCK IMPLEMENTATION**: This is currently a mock implementation that simulates
 * the transfer process. In production, this should:
 * 1. Check if the token is native (ETH) or ERC-20
 * 2. For native tokens: Use `prepareTransaction()` and `sendTransaction()`
 * 3. For ERC-20: Use `prepareContractCall()` with transfer method
 * 4. Use the external account's provider to sign and send
 *
 * @param params - Transfer parameters
 * @returns Promise resolving to transaction result with hash
 *
 * @example
 * ```typescript
 * import { transferBalanceFromExternalWallet } from 'panna-sdk';
 *
 * const result = await transferBalanceFromExternalWallet({
 *   externalAccount: metaMaskAccount,
 *   embeddedWalletAddress: '0x...',
 *   tokenAddress: '0x0000000000000000000000000000000000000000', // Native token
 *   amount: BigInt('1000000000000000000'), // 1 ETH in wei
 *   client: pannaClient,
 *   chain: lisk
 * });
 *
 * console.log('Transaction hash:', result.transactionHash);
 * ```
 */
export async function transferBalanceFromExternalWallet(
  params: TransferBalanceFromExternalWalletParams
): Promise<TransferBalanceResult> {
  const {
    externalAccount,
    embeddedWalletAddress,
    tokenAddress,
    amount,
    client,
    chain
  } = params;

  // TODO: Replace this mock implementation with real transaction logic
  // 1. Determine if token is native or ERC-20 by checking tokenAddress
  // 2. For native tokens (tokenAddress === '0x0000000000000000000000000000000000000000'):
  //    - Use prepareTransaction({ to: embeddedWalletAddress, value: amount, ... })
  // 3. For ERC-20 tokens:
  //    - Use prepareContractCall with:
  //      method: 'function transfer(address to, uint256 value)'
  //      params: [embeddedWalletAddress, amount]
  //      address: tokenAddress
  // 4. Use sendTransaction({ account: externalAccount, transaction })
  // 5. Return the actual transaction hash

  console.log('MOCK: Transferring from external wallet', {
    from: externalAccount.address,
    to: embeddedWalletAddress,
    token: tokenAddress,
    amount: amount.toString(),
    chain: chain.name,
    clientId: client.clientId
  });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate random success/failure for testing
  const shouldSucceed = Math.random() > 0.1; // 90% success rate

  if (!shouldSucceed) {
    throw new Error('User rejected the transaction');
  }

  // Return mock transaction hash
  return {
    transactionHash: `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`,
    blockNumber: BigInt(Math.floor(Math.random() * 1000000))
  };
}
