import type { Abi } from 'thirdweb/utils';
import type { Chain } from '../chains/types';
import type { PannaClient } from '../client';

/**
 * Parameters for preparing a raw transaction
 *
 * Note: The `to` field is optional to support:
 * - Contract deployment transactions (no recipient)
 * - Contract creation via CREATE2
 * - EIP-4844 blob transactions
 *
 * For most use cases sending ETH or calling contracts, you'll want to provide `to`.
 */
export interface PrepareTransactionParams {
  /** The Panna client instance */
  client: PannaClient;
  /** The chain to execute on */
  chain: Chain;
  /**
   * The recipient address. Optional for contract deployment transactions.
   * For regular transfers and contract calls, this should be provided.
   */
  to?: string;
  /** The value to send (in wei) */
  value?: bigint;
  /** The transaction data */
  data?: string;
  /** Gas limit for the transaction */
  gas?: bigint;
  /** Gas price for legacy transactions */
  gasPrice?: bigint;
  /** Maximum fee per gas for EIP-1559 transactions */
  maxFeePerGas?: bigint;
  /** Maximum priority fee per gas for EIP-1559 transactions */
  maxPriorityFeePerGas?: bigint;
  /** Transaction nonce */
  nonce?: number;
  /** Additional gas to add to the estimated gas */
  extraGas?: bigint;
  /** Access list for EIP-2930 transactions */
  accessList?: Array<{
    address: string;
    storageKeys: string[];
  }>;
}

/**
 * Result from preparing a transaction
 */
export interface PrepareTransactionResult {
  /** The Panna client instance */
  client: PannaClient;
  /** The chain to execute on */
  chain: Chain;
  /** The recipient address (optional for contract deployments) */
  to?: string;
  /** The value to send (in wei) */
  value?: bigint;
  /** The transaction data */
  data?: string;
  /** Gas limit for the transaction */
  gas?: bigint;
  /** Gas price for legacy transactions */
  gasPrice?: bigint;
  /** Maximum fee per gas for EIP-1559 transactions */
  maxFeePerGas?: bigint;
  /** Maximum priority fee per gas for EIP-1559 transactions */
  maxPriorityFeePerGas?: bigint;
  /** Transaction nonce */
  nonce?: number;
  /** Additional gas to add to the estimated gas */
  extraGas?: bigint;
  /** Access list for EIP-2930 transactions */
  accessList?: Array<{
    address: string;
    storageKeys: string[];
  }>;
}

/**
 * Parameters for preparing a contract call
 */
export interface PrepareContractCallParams {
  /** The contract instance */
  contract: {
    /** The Panna client instance */
    client: PannaClient;
    /** The contract address */
    address: string;
    /** The chain the contract is deployed on */
    chain: Chain;
    /** The contract ABI (optional for basic interactions) */
    abi?: Abi;
  };
  /** The method signature or ABI function */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  method: string | any;
  /** The parameters for the method call */
  params?: unknown[];
  /** The value to send with the transaction (in wei) */
  value?: bigint;
  /** Gas limit for the transaction */
  gas?: bigint;
  /** Gas price for legacy transactions */
  gasPrice?: bigint;
  /** Maximum fee per gas for EIP-1559 transactions */
  maxFeePerGas?: bigint;
  /** Maximum priority fee per gas for EIP-1559 transactions */
  maxPriorityFeePerGas?: bigint;
  /** Transaction nonce */
  nonce?: number;
  /** Additional gas to add to the estimated gas */
  extraGas?: bigint;
  /** Access list for EIP-2930 transactions */
  accessList?: Array<{
    address: string;
    storageKeys: string[];
  }>;
}

/**
 * Result from preparing a contract call
 *
 * Note: The data field is a function that returns transaction data when called.
 * This is a lazy evaluation pattern - users should not call this function directly.
 * Instead, pass the entire transaction object to sendTransaction which handles data resolution.
 */
export interface PrepareContractCallResult {
  /** The recipient address */
  to: string;
  /** The transaction data as a lazy-evaluated function */
  data: () => Promise<string>;
  /** The value to send with the transaction (in wei) */
  value?: bigint;
  /** The chain the contract is deployed on */
  chain?: Chain;
}

/**
 * Parameters for getting a contract instance
 */
export interface GetContractParams {
  /** The Panna client instance */
  client: PannaClient;
  /** The contract address */
  address: string;
  /** The contract ABI (optional for basic interactions) */
  abi?: Abi;
  /** The chain the contract is deployed on */
  chain: Chain;
}

/**
 * Result from getting a contract instance
 */
export interface GetContractResult {
  /** The Panna client instance */
  client: PannaClient;
  /** The contract address */
  address: string;
  /** The contract ABI */
  abi?: Abi;
  /** The chain the contract is deployed on */
  chain: Chain;
}
