import { defineChain, getChainMetadata } from 'thirdweb/chains';
import { Chain, ChainMetadata, ChainOptions } from './types';

/**
 * Defines a chain with the given options.
 * @param chainOptions The options for the chain.
 * @returns The defined chain.
 * @example
 * Just pass the chain ID to connect to:
 * ```ts
 * const chain = describeChain(1);
 * ```
 * Or pass your own RPC or custom values:
 * ```ts
 * const chain = describeChain({
 *  id: 1,
 *  rpc: "https://my-rpc.com",
 *  nativeCurrency: {
 *    name: "Ether",
 *    symbol: "ETH",
 *    decimals: 18,
 *  },
 * });
 * ```
 * @chain
 */

export function describeChain(chainOptions: ChainOptions | number): Chain {
  return defineChain(chainOptions);
}

/**
 * Retrieves the RPC URL for the specified chain.
 * If a custom RPC URL is defined in the options, it will be used.
 * Otherwise, a thirdweb RPC URL will be constructed using the chain ID and client ID.
 * @param options - The options object containing the chain and client information.
 * @returns The RPC URL for the specified chain.
 * @example
 * ```ts
 * import { getRpcUrlForChain } from "thirdweb/chains";
 * const rpcUrl = getRpcUrlForChain({
 *          id: 1,
 *          rpc: "https://my-rpc.com",
 *          nativeCurrency: {
 *          name: "Ether",
 *          symbol: "ETH",
 *          decimals: 18,
 *      },
 * });
 * console.log(rpcUrl); // "https://1.rpc.thirdweb.com/...
 * ```
 * @chain
 */
export function getRpcUrlForChain(chain: Chain): string {
  return chain.rpc;
}

/**
 * Retrieves chain data for a given chain.
 * @param chain - The chain object containing the chain ID.
 * @returns A Promise that resolves to the chain data.
 * @throws If there is an error fetching the chain data.
 * @example
 * ```ts
 * const chainData = await getChainInfo(chain);
 * console.log(chainData);
 * ```
 * @chain
 */
export async function getChainInfo(chain: Chain): Promise<ChainMetadata> {
  return getChainMetadata(chain);
}
