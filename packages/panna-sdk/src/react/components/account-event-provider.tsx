import {
  createContext,
  useEffect,
  ReactNode,
  use,
  useMemo,
  useRef
} from 'react';
import {
  Account,
  createAccount,
  getEmail,
  getPhoneNumber,
  getLinkedAccounts
} from 'src/core';
import { EcosystemId } from '../../core/client';
import {
  type AccountEventPayload,
  type OnConnectEventData,
  type DisconnectEventData,
  type AccountUpdateEventData,
  pannaApiService
} from '../../core/utils';
import { usePanna } from '../hooks/use-panna';
import { useAuth } from './auth/auth-provider';

// Smart account configuration for Lisk ecosystem
// TODO: This should come from a centralized configuration or wallet config
const LISK_SMART_ACCOUNT_CONFIG = {
  factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb',
  entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
  sponsorGas: true
} as const;

export type AccountEventContextType = {
  sendAccountEvent: (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventData?:
      | OnConnectEventData
      | DisconnectEventData
      | AccountUpdateEventData
  ) => Promise<void>;
};

const AccountEventContext = createContext<AccountEventContextType | null>(null);

export type AccountEventProviderProps = {
  children: ReactNode;
  authToken?: string;
};

/**
 * Provider component that handles wallet events and sends them to the Panna dashboard API
 */
export function AccountEventProvider({
  children,
  authToken
}: AccountEventProviderProps) {
  const { partnerId } = usePanna();
  const { userAddress, isHydrated } = useAuth();
  const accountRef = useRef<Account | null>(null);
  const previousAddressRef = useRef<string | null>(null);

  // Create wallet instance when user is authenticated
  const account = useMemo(() => {
    if (userAddress && partnerId) {
      const accountInstance = createAccount({
        ecosystemId: EcosystemId.LISK,
        partnerId
      });
      accountRef.current = accountInstance;
      return accountInstance;
    }
    return null;
  }, [userAddress, partnerId]);

  /**
   * Send account event to Panna dashboard API
   */
  const sendAccountEvent = async (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventData:
      | OnConnectEventData
      | DisconnectEventData
      | AccountUpdateEventData = {}
  ) => {
    try {
      const payload: AccountEventPayload = {
        eventType,
        timestamp: new Date().toISOString(),
        ecosystemId: EcosystemId.LISK,
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
   * Get social profile information from the connected wallet
   */
  const getSocialProfileInfo = async () => {
    try {
      const { client, partnerId: currentPartnerId } = usePanna();

      if (!client || !currentPartnerId) {
        console.debug('Client or partnerId not available');
        return null;
      }

      const ecosystemConfig = {
        id: EcosystemId.LISK,
        partnerId: currentPartnerId
      };

      // Try to get profiles from the wallet using core function
      try {
        const profiles = await getLinkedAccounts({
          client,
          ecosystem: ecosystemConfig
        });

        if (profiles && profiles.length > 0) {
          const emailProfile = profiles.find(
            (p) => p.type === 'email' || p.type === 'google' || p.details?.email
          );

          const phoneProfile = profiles.find(
            (p) => p.type === 'phone' || p.details?.phone
          );

          if (emailProfile?.details?.email) {
            return {
              type: 'email' as const,
              data: emailProfile.details.email
            };
          } else if (phoneProfile?.details?.phone) {
            return {
              type: 'phone' as const,
              data: phoneProfile.details.phone
            };
          }
        }
      } catch (error) {
        console.debug('Could not get linked accounts:', error);
      }

      // Fallback to direct methods using core functions
      try {
        const email = await getEmail({ client, ecosystem: ecosystemConfig });
        if (email) {
          return {
            type: 'email' as const,
            data: email
          };
        }
      } catch (error) {
        console.debug('Could not get user email:', error);
      }

      try {
        const phone = await getPhoneNumber({
          client,
          ecosystem: ecosystemConfig
        });
        if (phone) {
          return {
            type: 'phone' as const,
            data: phone
          };
        }
      } catch (error) {
        console.debug('Could not get user phone:', error);
      }
    } catch (error) {
      console.debug('Could not retrieve social profile information:', error);
    }

    return null;
  };

  /**
   * Handle wallet onConnect event
   */
  const handleOnConnect = async (address: string) => {
    try {
      if (!account) {
        throw new Error('Account not found');
      }

      const chain = account.getChain?.();

      // Use centralized smart account configuration
      const eventData: OnConnectEventData = {
        smartAccount: {
          chain: chain?.name || 'lisk-sepolia',
          ...LISK_SMART_ACCOUNT_CONFIG
        }
      };

      // Try to get social profile information
      const socialInfo = await getSocialProfileInfo();
      if (socialInfo) {
        eventData.social = socialInfo;
      }

      await sendAccountEvent('onConnect', address, eventData);
    } catch (error) {
      console.error('Error handling onConnect event:', error);
    }
  };

  /**
   * Handle wallet disconnect event
   */
  const handleDisconnect = async (address: string) => {
    try {
      await sendAccountEvent('disconnect', address, {});
    } catch (error) {
      console.error('Error handling disconnect event:', error);
    }
  };

  /**
   * Handle account changed event
   */
  const handleAccountChanged = async (address: string) => {
    try {
      await sendAccountEvent('accountUpdate', address, {});
    } catch (error) {
      console.error('Error handling account changed event:', error);
    }
  };

  /**
   * Monitor auth state changes to detect wallet events
   */
  useEffect(() => {
    if (!isHydrated) return;

    const previousAddress = previousAddressRef.current;

    if (userAddress && !previousAddress) {
      // User connected
      console.log('User connected:', userAddress);
      handleOnConnect(userAddress);
    } else if (!userAddress && previousAddress) {
      // User disconnected
      console.log('User disconnected:', previousAddress);
      handleDisconnect(previousAddress);
    } else if (
      userAddress &&
      previousAddress &&
      userAddress !== previousAddress
    ) {
      // Account changed
      console.log('Account changed:', {
        from: previousAddress,
        to: userAddress
      });
      handleAccountChanged(userAddress);
    }

    // Update the reference
    previousAddressRef.current = userAddress;
  }, [userAddress, isHydrated]);

  /**
   * Subscribe to wallet events when wallet instance is available
   */
  useEffect(() => {
    if (!account || !userAddress) return;

    const unsubscribers: (() => void)[] = [];

    try {
      // Subscribe to wallet events for additional event capturing
      const unsubscribeAccountChanged = account.subscribe?.(
        'accountChanged',
        (account) => {
          console.log('Wallet accountChanged event:', account);
          if (account?.address && account.address !== userAddress) {
            handleAccountChanged(account.address);
          }
        }
      );
      if (unsubscribeAccountChanged)
        unsubscribers.push(unsubscribeAccountChanged);

      const unsubscribeChainChanged = account.subscribe?.(
        'chainChanged',
        (chain) => {
          console.log('Wallet chainChanged event:', chain);
          if (userAddress) {
            handleAccountChanged(userAddress);
          }
        }
      );
      if (unsubscribeChainChanged) unsubscribers.push(unsubscribeChainChanged);
    } catch (error) {
      console.error('Error subscribing to wallet events:', error);
    }

    // Cleanup function
    return () => {
      unsubscribers.forEach((unsubscribe) => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from wallet events:', error);
        }
      });
    };
  }, [account, userAddress]);

  const contextValue: AccountEventContextType = {
    sendAccountEvent
  };

  return (
    <AccountEventContext value={contextValue}>{children}</AccountEventContext>
  );
}

/**
 * Hook to access wallet event functionality
 */
export function useAccountEventContext() {
  const context = use(AccountEventContext);
  if (!context) {
    throw new Error(
      'useAccountEventContext must be used within a AccountEventProvider'
    );
  }
  return context;
}
