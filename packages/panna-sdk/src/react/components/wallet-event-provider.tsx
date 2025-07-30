import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useConnectedWallets, useActiveAccount } from 'thirdweb/react';
import { type Wallet } from 'thirdweb/wallets';
import {
  type AccountEventPayload,
  type OnConnectEventData,
  type DisconnectEventData,
  type AccountUpdateEventData,
  pannaApiService
} from '../../core/utils';
import { usePanna } from '../hooks/use-panna';

export type WalletEventContextType = {
  isTracking: boolean;
  sendAccountEvent: (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventData?:
      | OnConnectEventData
      | DisconnectEventData
      | AccountUpdateEventData
  ) => Promise<void>;
};

const WalletEventContext = createContext<WalletEventContextType | null>(null);

export type WalletEventProviderProps = {
  children: ReactNode;
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
 * Provider component that handles wallet events and sends them to the Panna dashboard API
 */
export function WalletEventProvider({
  children,
  ecosystemId = 'ecosystem.lisk',
  enableTracking = true,
  authToken
}: WalletEventProviderProps) {
  const { partnerId } = usePanna();
  const connectedWallets = useConnectedWallets();
  const activeAccount = useActiveAccount();

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
   * Get social profile information from the connected wallet
   */
  const getSocialProfileInfo = async () => {
    try {
      const { getUserEmail, getUserPhoneNumber, getProfiles } = await import(
        'thirdweb/wallets'
      );
      const { client } = usePanna();

      // Try to get profiles from the wallet
      const profiles = await getProfiles({ client });

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

      // Fallback to direct methods
      try {
        const email = await getUserEmail({ client });
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
        const phone = await getUserPhoneNumber({ client });
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
  const handleOnConnect = async (wallet: Wallet) => {
    if (!activeAccount?.address) return;

    try {
      const chain = wallet.getChain?.();

      const eventData: OnConnectEventData = {
        smartAccount: {
          chain: chain?.name || 'lisk-sepolia',
          factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb', // Default factory address
          entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032', // Default entrypoint
          sponsorGas: true
        }
      };

      // Try to get social profile information
      const socialInfo = await getSocialProfileInfo();
      if (socialInfo) {
        eventData.social = socialInfo;
      }

      await sendAccountEvent('onConnect', activeAccount.address, eventData);
    } catch (error) {
      console.error('Error handling onConnect event:', error);
    }
  };

  /**
   * Handle wallet disconnect event
   */
  const handleDisconnect = async (wallet: Wallet) => {
    const account = wallet.getAccount?.();
    if (account?.address) {
      await sendAccountEvent('disconnect', account.address, {});
    }
  };

  /**
   * Handle account changed event
   */
  const handleAccountChanged = async (
    wallet: Wallet,
    newAccount: { address?: string }
  ) => {
    if (newAccount?.address) {
      await sendAccountEvent('accountUpdate', newAccount.address, {});
    }
  };

  /**
   * Set up wallet event subscriptions
   */
  useEffect(() => {
    if (!enableTracking || !connectedWallets.length) return;

    const unsubscribers: (() => void)[] = [];

    connectedWallets.forEach((wallet: Wallet) => {
      try {
        // Subscribe to onConnect event
        const unsubscribeOnConnect = wallet.subscribe('onConnect', (data) => {
          console.log('Wallet onConnect event:', data);
          handleOnConnect(wallet);
        });
        unsubscribers.push(unsubscribeOnConnect);

        // Subscribe to disconnect event
        const unsubscribeDisconnect = wallet.subscribe('disconnect', () => {
          console.log('Wallet disconnect event');
          handleDisconnect(wallet);
        });
        unsubscribers.push(unsubscribeDisconnect);

        // Subscribe to accountChanged event
        const unsubscribeAccountChanged = wallet.subscribe(
          'accountChanged',
          (account) => {
            console.log('Wallet accountChanged event:', account);
            handleAccountChanged(wallet, account);
          }
        );
        unsubscribers.push(unsubscribeAccountChanged);

        // Subscribe to chainChanged event (for account updates)
        const unsubscribeChainChanged = wallet.subscribe(
          'chainChanged',
          (chain) => {
            console.log('Wallet chainChanged event:', chain);
            const account = wallet.getAccount?.();
            if (account) {
              handleAccountChanged(wallet, account);
            }
          }
        );
        unsubscribers.push(unsubscribeChainChanged);
      } catch (error) {
        console.error('Error subscribing to wallet events:', error);
      }
    });

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
  }, [connectedWallets, enableTracking]);

  const contextValue: WalletEventContextType = {
    isTracking: enableTracking,
    sendAccountEvent
  };

  return (
    <WalletEventContext.Provider value={contextValue}>
      {children}
    </WalletEventContext.Provider>
  );
}

/**
 * Hook to access wallet event functionality
 */
export function useWalletEventContext() {
  const context = useContext(WalletEventContext);
  if (!context) {
    throw new Error(
      'useWalletEventContext must be used within a WalletEventProvider'
    );
  }
  return context;
}
