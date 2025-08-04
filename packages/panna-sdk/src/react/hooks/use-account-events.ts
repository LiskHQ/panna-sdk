import { useEffect, useMemo, useRef } from 'react';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { SmartWalletOptions } from 'thirdweb/wallets';
import { EcosystemId } from '../../core/client';
import {
  type AccountEventPayload,
  type OnConnectEventData,
  pannaApiService
} from '../../core/utils';
import { getEmail, getPhoneNumber } from '../../core/wallet';
import { usePanna } from './use-panna';

export type AccountEventConfig = {
  /**
   * The ecosystem ID for the wallet events
   * @default 'ecosystem.lisk'
   */
  ecosystemId?: string;

  /**
   * Optional authentication token for API requests
   */
  authToken?: string;
};

/**
 * Hook to handle wallet events and send them to the Panna dashboard API
 * @param config - Configuration options for wallet event handling
 */
export function useAccountEvents(config: AccountEventConfig = {}) {
  const { ecosystemId = EcosystemId.LISK, authToken } = config;

  const { partnerId } = usePanna();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const userAddress = account?.address || null;
  const previousAddressRef = useRef<string | null>(null);

  const smartAccountConfig = useMemo(() => {
    const config = activeWallet?.getConfig();
    if (!config) return null;

    return (config as unknown as { smartAccount: SmartWalletOptions })
      .smartAccount;
  }, [activeWallet]);

  /**
   * Send account event to Panna API
   */
  const sendAccountEvent = async (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventData: OnConnectEventData | Record<string, never> = {}
  ) => {
    try {
      const payload: AccountEventPayload = {
        eventType,
        timestamp: new Date().toISOString(),
        ecosystemId,
        partnerId,
        chainId: '4202', // Default to Lisk Sepolia
        eventData
      };

      // Use the default Panna API service
      await pannaApiService.sendAccountEvent(address, payload, authToken);
      console.log(`Successfully sent ${eventType} event for address:`, address);
    } catch (error) {
      console.error(`Failed to send ${eventType} event:`, error);
    }
  };

  /**
   * Handle wallet onConnect event
   */
  const handleOnConnect = async () => {
    if (!userAddress) return;

    try {
      if (!smartAccountConfig) {
        throw new Error('Smart account config not found');
      }

      const eventData: OnConnectEventData = {
        smartAccount: smartAccountConfig
      };

      // Try to get social profile information if available using core functions
      try {
        const { client, partnerId: currentPartnerId } = usePanna();

        if (client && currentPartnerId) {
          const ecosystemConfig = {
            id: EcosystemId.LISK,
            partnerId: currentPartnerId
          };

          try {
            const email = await getEmail({
              client,
              ecosystem: ecosystemConfig
            });
            if (email) {
              eventData.social = {
                type: 'email',
                data: email
              };
            }
          } catch (error) {
            console.debug('Could not get user email:', error);
          }

          if (!eventData.social) {
            try {
              const phone = await getPhoneNumber({
                client,
                ecosystem: ecosystemConfig
              });
              if (phone) {
                eventData.social = {
                  type: 'phone',
                  data: phone
                };
              }
            } catch (error) {
              console.debug('Could not get user phone:', error);
            }
          }
        }
      } catch (error) {
        // Social profile information is optional
        console.debug('Could not retrieve social profile information:', error);
      }

      await sendAccountEvent('onConnect', userAddress, eventData);
    } catch (error) {
      console.error('Error handling onConnect event:', error);
    }
  };

  /**
   * Handle wallet disconnect event
   */
  const handleDisconnect = async () => {
    const previousAddress = userAddress;
    if (previousAddress) {
      await sendAccountEvent('disconnect', previousAddress, {});
    }
  };

  /**
   * Handle account changed event
   */
  const handleAccountChanged = async (address: string) => {
    if (address) {
      await sendAccountEvent('accountUpdate', address, {});
    }
  };

  /**
   * Monitor account changes to detect connections/disconnections
   */
  useEffect(() => {
    const previousAddress = previousAddressRef.current;

    if (userAddress && !previousAddress) {
      // Account connected
      handleOnConnect();
    } else if (!userAddress && previousAddress) {
      // Account disconnected
      handleDisconnect();
    } else if (
      userAddress &&
      previousAddress &&
      userAddress !== previousAddress
    ) {
      // Account changed
      handleAccountChanged(userAddress);
    }

    // Update the reference
    previousAddressRef.current = userAddress;
  }, [userAddress]);

  return {
    sendAccountEvent,
    handleOnConnect,
    handleDisconnect,
    handleAccountChanged
  };
}
