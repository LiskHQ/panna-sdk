import { lisk, liskSepolia } from '../../core';

const DEFAULT_ONRAMP_NETWORK = 'lisk';

const CHAIN_ID_TO_ONRAMP_NETWORK: Record<number, string> = {
  [lisk.id]: DEFAULT_ONRAMP_NETWORK,
  [liskSepolia.id]: 'lisk-sepolia'
};

/**
 * Resolve the network identifier expected by the Panna onramp API based on a chain ID.
 *
 * @param chainId - The numeric chain identifier (e.g. 1135 for Lisk, 4202 for Lisk Sepolia).
 * @returns The network identifier string accepted by the onramp API.
 */
export function getOnrampNetworkName(chainId?: number): string {
  if (typeof chainId === 'number') {
    const mappedNetwork = CHAIN_ID_TO_ONRAMP_NETWORK[chainId];
    if (mappedNetwork) {
      return mappedNetwork;
    }
  }

  return DEFAULT_ONRAMP_NETWORK;
}
