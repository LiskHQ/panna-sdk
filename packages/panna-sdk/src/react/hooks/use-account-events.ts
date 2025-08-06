import { useEffect, useMemo, useRef } from 'react';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { SmartWalletOptions } from 'thirdweb/wallets';
import { EcosystemId } from '../../core/client';
import {
  type AccountEventPayload,
  type OnConnectActivityRequest,
  type DisconnectActivityRequest,
  type AccountUpdateActivityRequest,
  type SmartAccountTransform,
  type SocialAuthData,
  pannaApiService
} from '../../core/utils';
import { getEmail, getPhoneNumber } from '../../core/wallet';
import { usePanna } from './use-panna';

export type AccountEventConfig = {
  ecosystemId?: string;
  authToken?: string;
};

/**
 * Hook to handle wallet events and send them to the Panna API
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
   * Transform SmartWalletOptions to API-compatible format
   */
  const transformSmartAccount = (
    config: SmartWalletOptions
  ): SmartAccountTransform => {
    return {
      chain: config?.chain?.name || 'lisk-sepolia',
      factoryAddress: config.factoryAddress || '',
      entrypointAddress: config.overrides?.entrypointAddress || '',
      sponsorGas:
        'sponsorGas' in config
          ? config.sponsorGas
          : 'gasless' in config
            ? config.gasless
            : true
    };
  };

  /**
   * Send account event to Panna API
   */
  const sendAccountEvent = async (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventOptions: {
      social?: SocialAuthData;
      reason?: string;
      updateType?: string;
    } = {}
  ) => {
    try {
      const basePayload = {
        eventType,
        timestamp: new Date().toISOString(),
        ecosystemId,
        partnerId,
        chainId: smartAccountConfig?.chain?.id
      };

      let payload: AccountEventPayload;

      if (eventType === 'onConnect') {
        if (!smartAccountConfig) {
          throw new Error('Smart account config required for onConnect event');
        }

        const socialInfo = eventOptions.social;
        if (!socialInfo) {
          console.warn(
            'Social authentication info not available, using fallback'
          );
          payload = {
            ...basePayload,
            eventType: 'onConnect',
            smartAccount: transformSmartAccount(smartAccountConfig),
            social: {
              type: 'email',
              data: `wallet-${address.slice(-8)}@unknown.domain`
            }
          } as OnConnectActivityRequest;
        } else {
          payload = {
            ...basePayload,
            eventType: 'onConnect',
            smartAccount: transformSmartAccount(smartAccountConfig),
            social: socialInfo
          } as OnConnectActivityRequest;
        }
      } else if (eventType === 'disconnect') {
        payload = {
          ...basePayload,
          eventType: 'disconnect',
          ...(eventOptions.reason && { reason: eventOptions.reason })
        } as DisconnectActivityRequest;
      } else if (eventType === 'accountUpdate') {
        payload = {
          ...basePayload,
          eventType: 'accountUpdate',
          ...(eventOptions.updateType && {
            updateType: eventOptions.updateType
          })
        } as AccountUpdateActivityRequest;
      } else {
        throw new Error(`Unsupported event type: ${eventType}`);
      }

      await pannaApiService.sendAccountEvent(address, payload, authToken);
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
      let socialInfo: SocialAuthData | undefined;

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
              socialInfo = {
                type: 'email',
                data: email
              };
            }
          } catch (error) {
            console.debug('Could not get user email:', error);
          }

          if (!socialInfo) {
            try {
              const phone = await getPhoneNumber({
                client,
                ecosystem: ecosystemConfig
              });
              if (phone) {
                socialInfo = {
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

      await sendAccountEvent('onConnect', userAddress, { social: socialInfo });
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
      await sendAccountEvent('disconnect', previousAddress, {
        reason: 'User initiated'
      });
    }
  };

  /**
   * Handle account changed event
   */
  const handleAccountChanged = async (address: string) => {
    if (address) {
      await sendAccountEvent('accountUpdate', address, {
        updateType: 'account_change'
      });
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
