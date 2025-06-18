import { Chain } from 'thirdweb';
import { lisk } from '../../core';
import { liskSepoliaTokenConfig, liskTokenConfig } from '../consts';

/**
 * Get the supported tokens for a given chain.
 * @param currentChain - The current blockchain network
 * @returns The supported tokens for the given chain
 */
export function getSupportedTokens(currentChain: Chain | undefined) {
  return currentChain?.id === lisk.id
    ? liskTokenConfig
    : liskSepoliaTokenConfig;
}
