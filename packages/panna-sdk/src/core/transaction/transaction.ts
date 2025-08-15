import {
  prepareContractCall as thirdwebPrepareContractCall,
  prepareTransaction as thirdwebPrepareTransaction,
  getContract as thirdwebGetContract
} from 'thirdweb';
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
 * @param params.to - The recipient address (optional for contract deployments)
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
export function prepareTransaction(
  params: PrepareTransactionParams
): PrepareTransactionResult {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prepareParams: any = {
    client,
    chain,
    ...(to !== undefined && { to }),
    ...(value !== undefined && { value }),
    ...(data !== undefined && { data }),
    ...(gas !== undefined && { gas }),
    ...(gasPrice !== undefined && { gasPrice }),
    ...(maxFeePerGas !== undefined && { maxFeePerGas }),
    ...(maxPriorityFeePerGas !== undefined && { maxPriorityFeePerGas }),
    ...(nonce !== undefined && { nonce }),
    ...(extraGas !== undefined && { extraGas }),
    ...(accessList !== undefined && { accessList })
  };

  return thirdwebPrepareTransaction(prepareParams) as PrepareTransactionResult;
}

/**
 * Prepare a contract method call for execution
 *
 * This function creates a transaction object for calling a specific method on a smart contract.
 * It supports both string method signatures and ABI function objects, providing type safety
 * and parameter validation.
 *
 * @param params - Parameters for preparing the contract call
 * @param params.contract - The contract instance
 * @param params.method - The method signature or ABI function
 * @param params.params - The parameters for the method call
 * @param params.value - The value to send with the transaction (in wei)
 * @param params.gas - Gas limit for the transaction
 * @param params.gasPrice - Gas price for legacy transactions
 * @param params.maxFeePerGas - Maximum fee per gas for EIP-1559 transactions
 * @param params.maxPriorityFeePerGas - Maximum priority fee per gas for EIP-1559
 * @param params.nonce - Transaction nonce
 * @param params.extraGas - Additional gas to add to the estimated gas
 * @param params.accessList - Access list for EIP-2930 transactions
 * @returns Prepared contract call transaction
 *
 * @example
 * ```typescript
 * import { prepareContractCall, getContract, toWei, lisk } from 'panna-sdk';
 *
 * // Get a contract instance
 * const contract = getContract({
 *   client: pannaClient,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   chain: lisk
 * });
 *
 * // Prepare a contract call with method signature
 * const transaction = prepareContractCall({
 *   contract,
 *   method: "function transfer(address to, uint256 amount)",
 *   params: ["0x123...", toWei("100")]
 * });
 *
 * // Prepare a payable contract call
 * const payableCall = prepareContractCall({
 *   contract,
 *   method: "function mint(address to)",
 *   params: ["0x123..."],
 *   value: toWei("0.1") // 0.1 ETH
 * });
 * ```
 */
export function prepareContractCall(
  params: PrepareContractCallParams
): PrepareContractCallResult {
  const {
    contract,
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

  const contractWithTypedAddress = {
    ...contract,
    address: contract.address
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callParams: any = {
    contract: contractWithTypedAddress,
    method,
    params: methodParams,
    ...(value !== undefined && { value }),
    ...(gas !== undefined && { gas }),
    ...(gasPrice !== undefined && { gasPrice }),
    ...(maxFeePerGas !== undefined && { maxFeePerGas }),
    ...(maxPriorityFeePerGas !== undefined && { maxPriorityFeePerGas }),
    ...(nonce !== undefined && { nonce }),
    ...(extraGas !== undefined && { extraGas }),
    ...(accessList !== undefined && { accessList })
  };

  return thirdwebPrepareContractCall(callParams) as PrepareContractCallResult;
}

/**
 * Get a contract instance for interaction
 *
 * This function creates a contract instance that can be used to prepare contract calls.
 * It provides type-safe access to contract methods when an ABI is provided, and enables
 * autocompletion and validation of method calls.
 *
 * @param params - Parameters for getting the contract
 * @param params.client - The Panna client instance
 * @param params.address - The contract address
 * @param params.abi - The contract ABI (optional for basic interactions)
 * @param params.chain - The chain the contract is deployed on
 * @returns Contract instance ready for interaction
 *
 * @example
 * ```typescript
 * import { getContract, lisk } from 'panna-sdk';
 *
 * // Get a contract instance without ABI
 * const contract = getContract({
 *   client: pannaClient,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   chain: lisk
 * });
 *
 * // Get a contract instance with full ABI (erc20Abi should be defined in your code)
 * const erc20Contract = getContract({
 *   client: pannaClient,
 *   address: "0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e",
 *   abi: erc20Abi, // Define this ABI in your code or import from your contract definitions
 *   chain: lisk
 * });
 * ```
 */
export function getContract(params: GetContractParams): GetContractResult {
  const { client, address, abi, chain } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contractParams: any = {
    client,
    address: address,
    chain,
    ...(abi !== undefined && { abi })
  };

  return thirdwebGetContract(contractParams) as GetContractResult;
}
