import { useDisconnect } from 'thirdweb/react';
import { Wallet, WalletId } from 'thirdweb/wallets';
import { usePanna } from './use-panna';

export function useLogout() {
  const { disconnect: disconnectWallet } = useDisconnect();
  const { siweAuth } = usePanna();

  function disconnect(wallet: Wallet<WalletId>): void {
    disconnectWallet(wallet);
    siweAuth.logout();
  }

  return {
    disconnect
  };
}
