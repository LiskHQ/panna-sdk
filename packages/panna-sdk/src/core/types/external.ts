/**
 * External type re-exports for abstraction layer
 * This file centralizes all external library type imports to ease future migrations
 */

// Thirdweb type re-exports
export type { Abi } from 'thirdweb/utils';
export type { PreparedTransaction } from 'thirdweb';
export type { Account } from 'thirdweb/wallets';
export { EIP1193 } from 'thirdweb/wallets';

// EIP1193 provider type - this is the standard interface
export interface EIP1193Provider {
  request(args: {
    method: string;
    params?: Array<unknown> | Record<string, unknown>;
  }): Promise<unknown>;
  on(event: unknown, listener: (params: unknown) => unknown): void;
  removeListener(event: unknown, listener: (params: unknown) => unknown): void;
}

// Viem type re-exports
export type { Address, Hex } from 'viem';
