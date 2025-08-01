import { useEffect, useRef } from 'react';
import { EcosystemId } from '../../core/client';
import {
  type AccountEventPayload,
  type OnConnectEventData,
  pannaApiService
} from '../../core/utils';
import { getEmail, getPhoneNumber } from '../../core/wallet';
import { useAuth } from '../components/auth/auth-provider';
import { usePanna } from './use-panna';

// Smart account configuration for Lisk ecosystem
// TODO: This should come from a centralized configuration or wallet config
const LISK_SMART_ACCOUNT_CONFIG = {
  factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb',
  entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
  sponsorGas: true
} as const;

export type AccountEventConfig = {
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
export function useAccountEvents(config: AccountEventConfig = {}) {
  const {
    ecosystemId = 'ecosystem.lisk',
    enableTracking = true,
    authToken
  } = config;

  const { partnerId } = usePanna();
  const { userAddress } = useAuth();
  const previousAddressRef = useRef<string | null>(null);

  /**
   * Send account event to Panna API
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
      // Use centralized smart account configuration
      const eventData: OnConnectEventData = {
        smartAccount: {
          chain: 'lisk-sepolia', // Default chain since we don't have wallet access
          ...LISK_SMART_ACCOUNT_CONFIG
        }
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
   * Set up wallet event subscriptions
   */
  useEffect(() => {
    if (!enableTracking || !userAddress) return;

    // Note: In this hook implementation, we're monitoring account changes
    // rather than directly subscribing to wallet events. The AccountEventProvider
    // handles the direct wallet event subscriptions.
  }, [userAddress, enableTracking]);

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
