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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EIP1193Provider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(args: {
    method: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Array<any> | Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: any, listener: (params: any) => any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener(event: any, listener: (params: any) => any): void;
}

// Viem type re-exports
export type { Address, Hex } from 'viem';
