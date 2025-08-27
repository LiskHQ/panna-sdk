/**
 * External type re-exports for abstraction layer
 * This file centralizes all external library type imports to ease future migrations
 */

// Thirdweb type re-exports
export type { Abi } from 'thirdweb/utils';
export type { PreparedTransaction } from 'thirdweb';
export type { Account } from 'thirdweb/wallets';

// Viem type re-exports
export type { Address, Hex } from 'viem';
