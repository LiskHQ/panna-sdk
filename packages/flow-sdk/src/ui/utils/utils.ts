import { lisk, liskSepolia } from '../../core';
import { liskSepoliaTokenConfig, liskTokenConfig } from '../consts';

/**
 * Get the supported tokens for a given chain.
 * @param testingStatus - The testing status
 * @returns The supported tokens for the given chain
 */
export function getSupportedTokens(testingStatus?: boolean | undefined) {
  return testingStatus ? liskSepoliaTokenConfig : liskTokenConfig;
}

/**
 * Get the chain settings for a given chain.
 * @param testingStatus - The testing status
 * @returns The chain settings for the given chain
 */
export function getChain(testingStatus?: boolean | undefined) {
  return testingStatus ? liskSepolia : lisk;
}

/**
 * Get the account abstraction settings for a given chain.
 * @param testingStatus - The testing status
 * @returns The account abstraction settings for the given chain
 */
export function getAAChain(testingStatus?: boolean | undefined) {
  return testingStatus ? liskSepolia : lisk;
}
