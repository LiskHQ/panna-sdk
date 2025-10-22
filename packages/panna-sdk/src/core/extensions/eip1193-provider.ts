/**
 * EIP-1193 Provider Extensions
 *
 * This module provides utilities for working with EIP-1193 compatible wallet providers
 * like MetaMask, WalletConnect, Coinbase Wallet, etc.
 *
 * @module extensions/eip1193-provider
 */
import { EIP1193 } from 'thirdweb/wallets';
import type { EIP1193Provider } from '../types/external';

/**
 * Convert an EIP-1193 compatible provider into a wallet instance
 *
 * This function creates a wallet from any EIP-1193 compatible provider
 * (such as window.ethereum for MetaMask, WalletConnect, Coinbase Wallet, etc.).
 * The resulting wallet can be used with all Panna SDK functions.
 *
 * @param options - Options for creating the wallet
 * @param options.provider - The EIP-1193 compatible provider (e.g., window.ethereum)
 * @param options.walletId - Optional wallet identifier (defaults to "adapter")
 * @returns A wallet instance that can be connected
 *
 * @example
 * ```typescript
 * import { fromEIP1193Provider } from 'panna-sdk/core';
 *
 * // Create a wallet from MetaMask
 * const wallet = fromEIP1193Provider({
 *   provider: window.ethereum,
 *   walletId: "io.metamask"
 * });
 *
 * // Connect the wallet
 * const account = await wallet.connect({
 *   client: pannaClient,
 *   chain: lisk
 * });
 *
 * console.log("Connected address:", account.address);
 * ```
 *
 * @example
 * ```typescript
 * // Using with WalletConnect
 * import { fromEIP1193Provider } from 'panna-sdk/core';
 *
 * const walletConnectProvider = await getWalletConnectProvider();
 * const wallet = fromEIP1193Provider({
 *   provider: walletConnectProvider,
 *   walletId: "walletconnect"
 * });
 *
 * const account = await wallet.connect({
 *   client: pannaClient
 * });
 * ```
 */
export const fromEIP1193Provider = EIP1193.fromProvider;

/**
 * Convert a wallet or account into an EIP-1193 compatible provider
 *
 * This function wraps a wallet or account to provide an EIP-1193 compatible
 * interface. This is useful when you need to use a Panna wallet with libraries
 * that expect a standard Ethereum provider (like ethers.js, web3.js, etc.).
 *
 * @param options - Options for creating the provider
 * @param options.wallet - The wallet to convert
 * @param options.chain - The chain to use for RPC requests
 * @param options.client - The client instance
 * @returns An EIP-1193 compatible provider
 *
 * @example
 * ```typescript
 * import { toEIP1193Provider, createAccount, lisk } from 'panna-sdk/core';
 *
 * // Create a Panna wallet
 * const account = createAccount({ partnerId: 'your-partner-id' });
 * await account.connect({
 *   client: pannaClient,
 *   strategy: 'email',
 *   email: 'user@example.com'
 * });
 *
 * // Convert to EIP-1193 provider for use with other libraries
 * const provider = toEIP1193Provider({
 *   wallet: account,
 *   chain: lisk,
 *   client: pannaClient
 * });
 *
 * // Now you can use it with libraries expecting window.ethereum-like interface
 * const web3 = new Web3(provider);
 * ```
 *
 * @example
 * ```typescript
 * // Using with external libraries like ethers.js
 * import { toEIP1193Provider, fromEIP1193Provider, lisk } from 'panna-sdk/core';
 * import { ethers } from 'ethers';
 *
 * const wallet = fromEIP1193Provider({ provider: window.ethereum });
 * const account = await wallet.connect({ client: pannaClient, chain: lisk });
 *
 * // Convert to EIP-1193 provider for use with ethers.js
 * const eip1193Provider = toEIP1193Provider({
 *   wallet,
 *   chain: lisk,
 *   client: pannaClient
 * });
 * const ethersProvider = new ethers.BrowserProvider(eip1193Provider);
 * ```
 */
export const toEIP1193Provider = EIP1193.toProvider;

/**
 * Type guard to check if an object is an EIP-1193 compatible provider
 *
 * @param provider - The object to check
 * @returns True if the object implements the EIP-1193 provider interface
 *
 * @example
 * ```typescript
 * import { isEIP1193Provider, fromEIP1193Provider } from 'panna-sdk/core';
 *
 * if (isEIP1193Provider(window.ethereum)) {
 *   console.log("MetaMask or compatible wallet detected");
 *   const wallet = fromEIP1193Provider({ provider: window.ethereum });
 * }
 * ```
 */
export function isEIP1193Provider(
  provider: unknown
): provider is EIP1193Provider {
  return (
    typeof provider === 'object' &&
    provider !== null &&
    'request' in provider &&
    typeof (provider as EIP1193Provider).request === 'function' &&
    'on' in provider &&
    typeof (provider as EIP1193Provider).on === 'function' &&
    'removeListener' in provider &&
    typeof (provider as EIP1193Provider).removeListener === 'function'
  );
}
