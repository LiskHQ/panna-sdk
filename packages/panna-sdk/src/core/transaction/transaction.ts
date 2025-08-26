import {
  prepareContractCall as thirdwebPrepareContractCall,
  prepareTransaction as thirdwebPrepareTransaction,
  getContract as thirdwebGetContract
} from 'thirdweb';
import type { Chain } from '../chains/types';
import type { PannaClient } from '../client';
import type { Abi } from '../types/external';
import { removeUndefined } from '../utils/object';
import type {
  PrepareTransactionParams,
  PrepareTransactionResult,
  PrepareContractCallParams,
  PrepareContractCallResult,
  GetContractParams,
  GetContractResult
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
 * import { prepareTransaction, toWei, lisk } from 'panna-sdk';
 *
 * // Prepare a simple ETH transfer
 * const transaction = prepareTransaction({
 *   client: pannaClient,
 *   chain: lisk,
 *   to: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   value: toWei("1") // 1 ETH
 * });
 *
 * // Prepare a transaction with gas settings
 * const txWithGas = prepareTransaction({
 *   client: pannaClient,
 *   chain: lisk,
 *   to: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   value: toWei("0.5"),
 *   gasPrice: BigInt(20000000000) // 20 gwei
 * });
 *
 * // Prepare a contract deployment (no `to` address)
 * const deployTx = prepareTransaction({
 *   client: pannaClient,
 *   chain: lisk,
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
 * import { prepareContractCall, toWei, lisk } from 'panna-sdk';
 *
 * // 1. Basic usage with method signature (type-safe based on signature)
 * const transaction = prepareContractCall({
 *   client: pannaClient,
 *   chain: lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   method: "function transfer(address to, uint256 amount)",
 *   params: ["0x123...", toWei("100")]
 * });
 *
 * // 2. With full contract ABI (provides autocompletion and full type safety)
 * const typeSafeCall = prepareContractCall({
 *   client: pannaClient,
 *   chain: lisk,
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
 *   params: ["0x123...", toWei("100")]
 * });
 *
 * // 3. Using ABI snippet (efficient for single method calls)
 * const snippetCall = prepareContractCall({
 *   client: pannaClient,
 *   chain: lisk,
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
 *   params: ["0x123...", toWei("100")]
 * });
 *
 * // 4. Payable function with value
 * const payableCall = prepareContractCall({
 *   client: pannaClient,
 *   chain: lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   method: "function mint(address to)",
 *   params: ["0x123..."],
 *   value: toWei("0.1") // 0.1 ETH
 * });
 *
 * // 5. Advanced gas configuration (EIP-1559)
 * const advancedGasCall = prepareContractCall({
 *   client: pannaClient,
 *   chain: lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   method: "function transfer(address to, uint256 amount)",
 *   params: ["0x123...", toWei("100")],
 *   maxFeePerGas: BigInt(30000000000), // 30 gwei
 *   maxPriorityFeePerGas: BigInt(2000000000), // 2 gwei
 *   gas: BigInt(21000) // Gas limit
 * });
 *
 * // 6. Error handling pattern
 * try {
 *   const transaction = prepareContractCall({
 *     client: pannaClient,
 *     chain: lisk,
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
      address: `0x${string}`;
      storageKeys: readonly `0x${string}`[];
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
 * import { getContract, lisk } from 'panna-sdk';
 *
 * // Without ABI - use string-based method signatures
 * const contract = getContract({
 *   client: pannaClient,
 *   chain: lisk,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 * });
 *
 * // With ABI - type-safe with autocompletion
 * const erc20Contract = getContract({
 *   client: pannaClient,
 *   chain: lisk,
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
    address: `0x${string}`;
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
