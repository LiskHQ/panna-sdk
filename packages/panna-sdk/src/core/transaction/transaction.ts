import {
  prepareContractCall as thirdwebPrepareContractCall,
  prepareTransaction as thirdwebPrepareTransaction,
  getContract as thirdwebGetContract,
  sendTransaction as thirdwebSendTransaction
} from 'thirdweb';
import type { Chain } from '../chain/types';
import type { PannaClient } from '../client';
import { DEFAULT_CHAIN, NATIVE_TOKEN_ADDRESS } from '../defaults';
import { fromEIP1193Provider } from '../extensions';
import type { Abi, Address, Hex, PreparedTransaction } from '../types/external';
import { isValidAddress } from '../util/common';
import { removeUndefined } from '../util/object';
import type {
  PrepareTransactionParams,
  PrepareTransactionResult,
  PrepareContractCallParams,
  PrepareContractCallResult,
  GetContractParams,
  GetContractResult,
  SendTransactionParams,
  SendTransactionResult,
  TransferBalanceFromExternalWalletParams
} from './types';

/**
 * Prepare a raw transaction for execution
 *
 * This function creates a transaction object that can be used to send native tokens,
 * execute arbitrary contract interactions, or deploy contracts. The transaction is
 * prepared synchronously without making network requests.
 *
 * @param params - Parameters for preparing the transaction
 * @param params.client - The Panna client instance
 * @param params.chain - The chain to execute on
 * @param params.to - (Optional: only for contract deployments) The recipient address
 * @param params.value - The value to send (in wei)
 * @param params.data - The transaction data
 * @param params.gas - Gas limit for the transaction
 * @param params.gasPrice - Gas price for legacy transactions
 * @param params.maxFeePerGas - Maximum fee per gas for EIP-1559 transactions
 * @param params.maxPriorityFeePerGas - Maximum priority fee per gas for EIP-1559
 * @param params.nonce - Transaction nonce
 * @param params.extraGas - Additional gas to add to the estimated gas
 * @param params.accessList - Access list for EIP-2930 transactions
 * @returns Prepared transaction object
 *
 * @example
 * ```typescript
 * import { transaction, util, chain } from 'panna-sdk';
 *
 * // Prepare a simple ETH transfer
 * const tx = transaction.prepareTransaction({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   to: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   value: util.toWei("1") // 1 ETH
 * });
 *
 * // Prepare a transaction with gas settings
 * const txWithGas = transaction.prepareTransaction({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   to: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   value: util.toWei("0.5"),
 *   gasPrice: BigInt(20_000_000_000) // 20 gwei
 * });
 *
 * // Prepare a contract deployment (no `to` address)
 * const deployTx = transaction.prepareTransaction({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   data: "0x608060405234801561001057600080fd5b50...", // contract bytecode
 *   value: 0n
 * });
 * ```
 */
export const prepareTransaction = (
  params: PrepareTransactionParams
): PrepareTransactionResult => {
  const {
    client,
    chain,
    to,
    value,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    extraGas,
    accessList
  } = params;

  const optionalFields = {
    to,
    value,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    extraGas,
    accessList
  };

  const prepareParams = {
    client,
    chain,
    ...removeUndefined(optionalFields)
  };

  return thirdwebPrepareTransaction(prepareParams) as PrepareTransactionResult;
};

/**
 * Prepare a contract method call for execution
 *
 * This function creates a transaction object for calling a specific method on a smart contract.
 * It supports multiple approaches for maximum flexibility and type safety:
 *
 * - **String method signatures**: Use Solidity function signatures for dynamic calls
 * - **Full contract ABI**: Provides autocompletion and full type safety
 * - **ABI snippets**: Efficient for single method calls without full ABI
 * - **ABI function objects**: Direct specification of function metadata
 *
 * The function automatically infers parameter types and provides compile-time validation
 * when using ABI-based approaches.
 *
 * @param params - Parameters for preparing the contract call
 * @param params.client - The Panna client instance
 * @param params.chain - The chain the contract is deployed on
 * @param params.address - The contract address
 * @param params.abi - (Optional) The contract ABI. When provided, enables type-safe method calls with autocompletion. When omitted, the SDK will attempt to resolve the ABI automatically or you can use string-based method signatures with `prepareContractCall`
 * @param params.method - The method signature, ABI function, or method name (when ABI is provided)
 * @param params.params - (Optional) The parameters for the method call (types are automatically inferred from method)
 * @param params.value - (Optional) The value to send with the transaction (in wei)
 * @param params.gas - (Optional) Gas limit for the transaction
 * @param params.gasPrice - (Optional) Gas price for legacy transactions
 * @param params.maxFeePerGas - (Optional) Maximum fee per gas for EIP-1559 transactions
 * @param params.maxPriorityFeePerGas - (Optional) Maximum priority fee per gas for EIP-1559
 * @param params.nonce - (Optional) Transaction nonce
 * @param params.extraGas - (Optional) Additional gas to add to the estimated gas
 * @param params.accessList - (Optional) Access list for EIP-2930 transactions
 * @returns Prepared contract call transaction
 * @throws Error when invalid client, address or chain is provided
 *
 * @example
 * ```typescript
 * import { transaction, util, chain } from 'panna-sdk';
 *
 * // 1. Basic usage with method signature (type-safe based on signature)
 * const tx = transaction.prepareContractCall({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   method: "function transfer(address to, uint256 amount)",
 *   params: ["0x123...", util.toWei("100")]
 * });
 *
 * // 2. With full contract ABI (provides autocompletion and full type safety)
 * const typeSafeCall = transaction.prepareContractCall({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   abi: [
 *     {
 *       name: "transfer",
 *       type: "function",
 *       inputs: [
 *         { type: "address", name: "to" },
 *         { type: "uint256", name: "amount" }
 *       ],
 *       outputs: [{ type: "bool" }],
 *       stateMutability: "nonpayable"
 *     },
 *     {
 *       name: "mint",
 *       type: "function",
 *       inputs: [{ type: "address", name: "to" }],
 *       outputs: [],
 *       stateMutability: "payable"
 *     }
 *   ],
 *   method: "transfer", // Auto-completion and type inference from ABI
 *   params: ["0x123...", util.toWei("100")]
 * });
 *
 * // 3. Using ABI snippet (efficient for single method calls)
 * const snippetCall = transaction.prepareContractCall({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   method: {
 *     name: "mintTo",
 *     type: "function",
 *     inputs: [
 *       { type: "address", name: "to" },
 *       { type: "uint256", name: "amount" }
 *     ],
 *     outputs: [{ type: "uint256" }],
 *     stateMutability: "nonpayable"
 *   },
 *   params: ["0x123...", util.toWei("100")]
 * });
 *
 * // 4. Payable function with value
 * const payableCall = transaction.prepareContractCall({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   method: "function mint(address to)",
 *   params: ["0x123..."],
 *   value: util.toWei("0.1") // 0.1 ETH
 * });
 *
 * // 5. Advanced gas configuration (EIP-1559)
 * const advancedGasCall = transaction.prepareContractCall({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   method: "function transfer(address to, uint256 amount)",
 *   params: ["0x123...", util.toWei("100")],
 *   maxFeePerGas: BigInt(30_000_000_000), // 30 gwei
 *   maxPriorityFeePerGas: BigInt(2_000_000_000), // 2 gwei
 *   gas: BigInt(21000) // Gas limit
 * });
 *
 * // 6. Error handling pattern
 * try {
 *   const tx = transaction.prepareContractCall({
 *     client: pannaClient,
 *     chain: chain.lisk,
 *     address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *     method: "function nonExistentFunction()",
 *     params: []
 *   });
 * } catch (error) {
 *   console.error("Failed to prepare contract call:", error.message);
 * }
 * ```
 */
export const prepareContractCall = (
  params: PrepareContractCallParams
): PrepareContractCallResult => {
  const {
    client,
    address,
    chain,
    abi,
    method,
    params: methodParams,
    value,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    extraGas,
    accessList
  } = params;

  const optionalFields = {
    value,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    extraGas,
    accessList
  };

  const contract = getContract({ client, address, chain, abi });

  const callParams: {
    contract: GetContractParams;
    method: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    params: readonly any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    value?: bigint;
    gas?: bigint;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: number;
    extraGas?: bigint;
    accessList?: Array<{
      address: Address;
      storageKeys: readonly Hex[];
    }>;
  } = {
    contract,
    method,
    params: methodParams ?? [],
    ...removeUndefined(optionalFields)
  };

  return thirdwebPrepareContractCall(callParams) as PrepareContractCallResult;
};

/**
 * Get a contract instance for interaction
 *
 * This function creates a contract instance that can be used to prepare contract calls.
 *
 * **With ABI**: Provides full type safety, autocompletion, and validation for all contract methods.
 * **Without ABI**: The SDK will attempt automatic ABI resolution, or you can use string-based
 * method signatures (e.g., "function transfer(address to, uint256 amount)") when calling contract methods.
 *
 * @param params - Parameters for getting the contract
 * @param params.client - The Panna client instance
 * @param params.chain - The chain the contract is deployed on
 * @param params.address - The contract address
 * @param params.abi - (Optional) The contract ABI. When provided, enables type-safe method calls with autocompletion. When omitted, the SDK will attempt to resolve the ABI automatically or you can use string-based method signatures with `prepareContractCall`
 * @returns Contract instance ready for interaction
 * @throws Error when invalid client, address or chain is provided
 *
 * @example
 * ```typescript
 * import { transaction, chain } from 'panna-sdk';
 *
 * // Without ABI - use string-based method signatures
 * const contract = transaction.getContract({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 * });
 *
 * // With ABI - type-safe with autocompletion
 * const erc20Contract = transaction.getContract({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   abi: erc20Abi, // Full type safety and autocompletion. Define this ABI in your code or import from your contract definitions
 * });
 * ```
 */
export const getContract = (params: GetContractParams): GetContractResult => {
  const { client, address, abi, chain } = params;

  const optionalFields = { abi };

  const contractParams: {
    client: PannaClient;
    address: Address;
    chain: Chain;
    abi?: Abi;
  } = {
    client,
    address: address,
    chain,
    ...removeUndefined(optionalFields)
  };

  return thirdwebGetContract(contractParams) as GetContractResult;
};

/**
 * Send a prepared transaction to the blockchain
 *
 * This function executes a previously prepared transaction on the blockchain.
 * It requires a connected wallet/account to sign and send the transaction.
 * The transaction can be prepared using `prepareTransaction` for raw transactions
 * or `prepareContractCall` for smart contract interactions.
 *
 * @param params - Parameters for sending the transaction
 * @param params.transaction - The prepared transaction object from `prepareTransaction` or `prepareContractCall`
 * @param params.account - The connected wallet/account to send the transaction from
 * @returns Promise resolving to the transaction result with transaction hash
 * @throws Error when the transaction fails due to:
 *   - Insufficient funds for gas and value
 *   - User rejection of the transaction
 *   - Network connectivity issues
 *   - Invalid transaction parameters
 *   - Contract execution errors
 *
 * @example
 * ```typescript
 * import { transaction, wallet, chain, util } from 'panna-sdk';
 *
 * // 1. Create and connect an account
 * const account = wallet.createAccount({ partnerId: 'your-partner-id' });
 * // ... connect the account (see wallet documentation)
 *
 * // 2. Prepare a transaction
 * const tx = transaction.prepareTransaction({
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   to: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   value: util.toWei("1") // 1 ETH
 * });
 *
 * // 3. Send the transaction
 * const result = await transaction.sendTransaction({
 *   account,
 *   transaction: tx
 * });
 *
 * console.log("Transaction sent:", result.transactionHash);
 *
 * ```
 *
 * @example
 * ```typescript
 * // Send a contract call transaction
 * import { transaction, chain, util } from 'panna-sdk';
 *
 * const contract = transaction.getContract({
 *   client: pannaClient,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   chain: chain.lisk
 * });
 *
 * const tx = transaction.prepareContractCall({
 *   contract,
 *   method: "function transfer(address to, uint256 amount)",
 *   params: ["0x123...", util.toWei("100")]
 * });
 *
 * const result = await transaction.sendTransaction({
 *   account: connectedAccount,
 *   transaction: tx
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Error handling pattern
 * try {
 *   const result = await sendTransaction({
 *     account,
 *     transaction
 *   });
 *
 *   console.log("Success! Transaction hash:", result.transactionHash);
 * } catch (error) {
 *   if (error.message.includes("insufficient funds")) {
 *     console.error("Not enough balance to send transaction");
 *   } else if (error.message.includes("user rejected")) {
 *     console.error("User rejected the transaction");
 *   } else {
 *     console.error("Transaction failed:", error.message);
 *   }
 * }
 * ```
 */
export async function sendTransaction(
  params: SendTransactionParams
): Promise<SendTransactionResult> {
  const { transaction, account } = params;

  try {
    const result = await thirdwebSendTransaction({
      transaction,
      account
    });

    return result as SendTransactionResult;
  } catch (error) {
    // Re-throw with more context
    throw new Error(
      `Failed to send transaction: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Transfer balance from an external wallet (e.g., MetaMask, WalletConnect) to a recipient address
 *
 * This function enables transfers from external wallet providers that implement the EIP-1193 standard.
 * It can transfer either native tokens (ETH) or ERC20 tokens. The function handles all the necessary
 * steps: provider conversion, transaction preparation, and execution.
 *
 * @param params - Parameters for the transfer
 * @param params.provider - EIP-1193 compatible provider (e.g., window.ethereum for MetaMask)
 * @param params.from - The address to send from (must be controlled by the provider)
 * @param params.to - The recipient address
 * @param params.amount - The amount to transfer in smallest unit (wei for native, token's smallest unit for ERC20)
 * @param params.client - The Panna client instance
 * @param params.chain - (Optional) The chain to execute on (defaults to Lisk mainnet)
 * @param params.tokenAddress - (Optional) The token contract address (if undefined, transfers native token)
 * @returns Promise resolving to the transaction result with transaction hash
 * @throws Error when:
 *   - Provider is invalid or undefined
 *   - From, to, or token addresses are invalid
 *   - Amount is zero or negative
 *   - User rejects the transaction
 *   - Insufficient balance
 *   - Network connectivity issues
 *
 * @example
 * ```typescript
 * import { transaction, util } from 'panna-sdk/core';
 *
 * // 1. Transfer native token (ETH) from MetaMask
 * const result = await transaction.transferBalanceFromExternalWallet({
 *   provider: window.ethereum,
 *   from: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   to: "0x123...",
 *   amount: util.toWei("1"), // 1 ETH
 *   client: pannaClient
 * });
 *
 * console.log("Transaction hash:", result.transactionHash);
 *
 * // 2. Transfer ERC20 token from external wallet
 * const erc20Result = await transaction.transferBalanceFromExternalWallet({
 *   provider: window.ethereum,
 *   from: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   to: "0x123...",
 *   amount: BigInt(100_000_000), // 100 USDC (6 decimals)
 *   client: pannaClient,
 *   chain: chain.lisk,
 *   tokenAddress: "0xUSDC_CONTRACT_ADDRESS"
 * });
 *
 * // 3. With error handling
 * try {
 *   const result = await transaction.transferBalanceFromExternalWallet({
 *     provider: window.ethereum,
 *     from: userAddress,
 *     to: recipientAddress,
 *     amount: transferAmount,
 *     client: pannaClient
 *   });
 *
 *   console.log("Transfer successful:", result.transactionHash);
 * } catch (error) {
 *   if (error.message.includes("User rejected")) {
 *     console.error("User cancelled the transaction");
 *   } else if (error.message.includes("insufficient funds")) {
 *     console.error("Not enough balance");
 *   } else {
 *     console.error("Transfer failed:", error.message);
 *   }
 * }
 * ```
 */
export async function transferBalanceFromExternalWallet(
  params: TransferBalanceFromExternalWalletParams
): Promise<SendTransactionResult> {
  const {
    provider,
    to,
    amount,
    client,
    chain = DEFAULT_CHAIN,
    tokenAddress
  } = params;

  // Validation
  if (!provider) {
    throw new Error('Provider is required');
  }

  if (!isValidAddress(to)) {
    throw new Error(`Invalid 'to' address: ${to}`);
  }

  if (tokenAddress && !isValidAddress(tokenAddress)) {
    throw new Error(`Invalid token address: ${tokenAddress}`);
  }

  if (amount <= 0n) {
    throw new Error('Amount must be greater than zero');
  }

  try {
    // Convert EIP1193 provider to a wallet, then connect to get an account
    const wallet = fromEIP1193Provider({ provider });
    const account = await wallet.connect({ client, chain });

    let transaction: PrepareTransactionResult | PrepareContractCallResult;

    if (tokenAddress && tokenAddress !== NATIVE_TOKEN_ADDRESS) {
      // ERC20 transfer
      transaction = prepareContractCall({
        client,
        chain,
        address: tokenAddress,
        method: 'function transfer(address to, uint256 amount)',
        params: [to, amount]
      });
    } else {
      // Native token transfer
      transaction = prepareTransaction({
        client,
        chain,
        to,
        value: amount
      });
    }

    // Send the transaction
    const result = await sendTransaction({
      account,
      transaction: transaction as PreparedTransaction
    });

    return result;
  } catch (error) {
    throw new Error(
      `Failed to transfer balance from external wallet: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
