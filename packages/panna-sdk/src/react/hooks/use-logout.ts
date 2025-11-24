import { useEffect, useRef } from 'react';
import { useDisconnect } from 'thirdweb/react';
import { Wallet, WalletId } from 'thirdweb/wallets';
import { usePanna } from './use-panna';

const SIWE_LOGOUT_DELAY_MS = 2000;

/**
 * Hook for managing wallet disconnection with SIWE authentication cleanup.
 *
 * This hook provides a disconnect function that:
 * 1. Disconnects the wallet
 * 2. Waits for a brief period to allow wallet cleanup
 * 3. Clears SIWE authentication state (token, cookies, etc.)
 *
 * The delay between wallet disconnect and auth cleanup prevents race conditions
 * where wallet state changes might still be processing when auth is cleared.
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const { disconnect } = useLogout();
 *   const wallet = useActiveWallet();
 *
 *   return (
 *     <button onClick={() => wallet && disconnect(wallet)}>
 *       Logout
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns Object containing the disconnect function
 */
export function useLogout() {
  const { disconnect: disconnectWallet } = useDisconnect();
  const { siweAuth } = usePanna();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount to prevent any memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Disconnects the wallet and clears SIWE authentication.
   *
   * @param wallet - The wallet to disconnect
   */
  function disconnect(wallet: Wallet<WalletId>): void {
    // Disconnect the wallet
    disconnectWallet(wallet);

    // Clear any pending logout timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule SIWE auth cleanup
    // The delay ensures that a valid SIWE token exists to log the wallet disconnect activity
    timeoutRef.current = setTimeout(() => {
      try {
        siweAuth.logout();
      } catch (error) {
        console.error('Failed to complete SIWE logout:', error);
      }
    }, SIWE_LOGOUT_DELAY_MS);
  }

  return {
    disconnect
  };
}
