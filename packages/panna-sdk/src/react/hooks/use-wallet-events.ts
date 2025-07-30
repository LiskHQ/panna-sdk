import { useEffect, useRef } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { type Wallet, type Account } from 'thirdweb/wallets';
import {
  type AccountEventPayload,
  type OnConnectEventData,
  pannaApiService
} from '../../core/utils';
import { usePanna } from './use-panna';

export type WalletEventConfig = {
  /**
   * The ecosystem ID for the wallet events
   * @default 'ecosystem.lisk'
   */
  ecosystemId?: string;

  /**
   * Whether to enable automatic event tracking
   * @default true
   */
  enableTracking?: boolean;

  /**
   * Optional authentication token for API requests
   */
  authToken?: string;
};

/**
 * Hook to handle wallet events and send them to the Panna dashboard API
 * @param config - Configuration options for wallet event handling
 */
export function useWalletEvents(config: WalletEventConfig = {}) {
  const {
    ecosystemId = 'ecosystem.lisk',
    enableTracking = true,
    authToken
  } = config;

  const { partnerId } = usePanna();
  const activeAccount = useActiveAccount();
  const walletRef = useRef<Wallet | null>(null);
  const connectedAccountRef = useRef<Account | null>(null);

  /**
   * Send account event to Panna dashboard API
   */
  const sendAccountEvent = async (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventData: OnConnectEventData | Record<string, never> = {}
  ) => {
    if (!enableTracking) return;

    try {
      const payload: AccountEventPayload = {
        eventType,
        timestamp: new Date().toISOString(),
        address,
        ecosystemId,
        partnerId,
        chainId: '4202', // Default to Lisk Sepolia
        eventData
      };

      // Use the default Panna API service
      await pannaApiService.sendAccountEvent(payload, authToken);
      console.log(`Successfully sent ${eventType} event for address:`, address);
    } catch (error) {
      console.error(`Failed to send ${eventType} event:`, error);
    }
  };

  /**
   * Handle wallet onConnect event
   */
  const handleOnConnect = async () => {
    if (!activeAccount?.address) return;

    try {
      // Extract smart account information from the wallet
      const wallet = walletRef.current;
      const chain = wallet?.getChain?.();

      const eventData: OnConnectEventData = {
        smartAccount: {
          chain: chain?.name || 'lisk-sepolia',
          factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb', // Default factory address
          entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032', // Default entrypoint
          sponsorGas: true
        }
      };

      // Try to get social profile information if available
      try {
        const { getUserEmail, getUserPhoneNumber } = await import(
          'thirdweb/wallets'
        );
        const { client } = usePanna();

        const email = await getUserEmail({ client });
        const phone = await getUserPhoneNumber({ client });

        if (email) {
          eventData.social = {
            type: 'email',
            data: email
          };
        } else if (phone) {
          eventData.social = {
            type: 'phone',
            data: phone
          };
        }
      } catch (error) {
        // Social profile information is optional
        console.debug('Could not retrieve social profile information:', error);
      }

      await sendAccountEvent('onConnect', activeAccount.address, eventData);
    } catch (error) {
      console.error('Error handling onConnect event:', error);
    }
  };

  /**
   * Handle wallet disconnect event
   */
  const handleDisconnect = async () => {
    const previousAddress = connectedAccountRef.current?.address;
    if (previousAddress) {
      await sendAccountEvent('disconnect', previousAddress, {});
    }
  };

  /**
   * Handle account changed event
   */
  const handleAccountChanged = async (account: Account) => {
    if (account?.address) {
      await sendAccountEvent('accountUpdate', account.address, {});
    }
  };

  /**
   * Set up wallet event subscriptions
   */
  useEffect(() => {
    if (!enableTracking || !activeAccount) return;

    // Note: In this hook implementation, we're monitoring account changes
    // rather than directly subscribing to wallet events. The WalletEventProvider
    // handles the direct wallet event subscriptions.
  }, [activeAccount, enableTracking]);

  /**
   * Monitor account changes to detect connections/disconnections
   */
  useEffect(() => {
    const previousAccount = connectedAccountRef.current;

    if (activeAccount && !previousAccount) {
      // Account connected
      handleOnConnect();
    } else if (!activeAccount && previousAccount) {
      // Account disconnected
      handleDisconnect();
    } else if (
      activeAccount &&
      previousAccount &&
      activeAccount.address !== previousAccount.address
    ) {
      // Account changed
      handleAccountChanged(activeAccount);
    }

    // Update the reference
    connectedAccountRef.current = activeAccount || null;
  }, [activeAccount]);

  return {
    sendAccountEvent,
    handleOnConnect,
    handleDisconnect,
    handleAccountChanged
  };
}
