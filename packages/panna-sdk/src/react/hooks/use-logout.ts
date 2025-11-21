import { useEffect, useRef } from 'react';
import { useDisconnect } from 'thirdweb/react';
import { Wallet, WalletId } from 'thirdweb/wallets';
import { usePanna } from './use-panna';

const LOGOUT_DELAY_MS = 2000;

export function useLogout() {
  const { disconnect: disconnectWallet } = useDisconnect();
  const { siweAuth } = usePanna();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function disconnect(wallet: Wallet<WalletId>): void {
    disconnectWallet(wallet);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => siweAuth.logout(), LOGOUT_DELAY_MS);
  }

  return {
    disconnect
  };
}
