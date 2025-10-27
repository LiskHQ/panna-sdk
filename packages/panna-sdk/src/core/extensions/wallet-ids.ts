/**
 * Wallet rDNS Identifiers
 *
 * This module provides reverse DNS (rDNS) identifiers for popular Ethereum wallets
 * following the EIP-6963 standard. These identifiers are used to uniquely identify
 * wallet providers and prevent namespace conflicts when multiple wallet extensions
 * are installed.
 *
 * @see https://eips.ethereum.org/EIPS/eip-6963
 * @module extensions/wallet-ids
 */

/**
 * Reverse DNS identifiers for popular Ethereum wallets
 *
 * These identifiers follow the EIP-6963 standard for Multi Injected Provider Discovery.
 * Each identifier uses reverse domain name syntax (e.g., "io.metamask" for metamask.io).
 *
 * This enum includes commonly supported wallets based on the Panna SDK's compatibility list.
 *
 * @example
 * ```typescript
 * import { WalletId, fromEIP1193Provider } from 'panna-sdk/core';
 *
 * // Create a wallet from MetaMask with proper identifier
 * const wallet = fromEIP1193Provider({
 *   provider: window.ethereum,
 *   walletId: WalletId.MetaMask
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Detect which wallet is installed
 * import { WalletId, isEIP1193Provider } from 'panna-sdk/core';
 *
 * if (window.ethereum?.isMetaMask) {
 *   console.log("MetaMask detected with ID:", WalletId.MetaMask);
 * }
 * ```
 */
export enum WalletId {
  /**
   * MetaMask - The most popular Ethereum wallet browser extension
   * @see https://metamask.io
   */
  MetaMask = 'io.metamask',

  /**
   * Coinbase Wallet - Official wallet from Coinbase
   * @see https://www.coinbase.com/wallet
   */
  Coinbase = 'com.coinbase.wallet',

  /**
   * Trust Wallet - Multi-coin crypto wallet
   * @see https://trustwallet.com
   */
  Trust = 'com.trustwallet.app',

  /**
   * Rainbow Wallet - A fun, simple, and secure Ethereum wallet
   * @see https://rainbow.me
   */
  Rainbow = 'me.rainbow',

  /**
   * Phantom - Solana and multi-chain wallet
   * @see https://phantom.app
   */
  Phantom = 'app.phantom',

  /**
   * Generic adapter - Use this as fallback for unlisted wallets
   */
  Adapter = 'adapter'
}

/**
 * Type representing all possible wallet identifier values
 */
export type WalletIdValue = `${WalletId}`;

/**
 * Helper function to check if a string is a valid WalletId
 *
 * @param id - The string to check
 * @returns True if the string matches a known WalletId
 *
 * @example
 * ```typescript
 * import { isWalletId, WalletId } from 'panna-sdk/core';
 *
 * if (isWalletId('io.metamask')) {
 *   console.log("Valid wallet ID");
 * }
 * ```
 */
export function isWalletId(id: string): id is WalletIdValue {
  return Object.values(WalletId).includes(id as WalletId);
}

/**
 * Helper function to get a human-readable wallet name from a WalletId
 *
 * @param id - The wallet identifier
 * @returns Human-readable wallet name
 *
 * @example
 * ```typescript
 * import { getWalletName, WalletId } from 'panna-sdk/core';
 *
 * const name = getWalletName(WalletId.MetaMask);
 * console.log(name); // "MetaMask"
 * ```
 */
export function getWalletName(id: WalletId): string {
  const names: Record<WalletId, string> = {
    [WalletId.MetaMask]: 'MetaMask',
    [WalletId.Coinbase]: 'Coinbase Wallet',
    [WalletId.Trust]: 'Trust Wallet',
    [WalletId.Rainbow]: 'Rainbow',
    [WalletId.Phantom]: 'Phantom',
    [WalletId.Adapter]: 'Adapter'
  };

  return names[id] || id;
}
