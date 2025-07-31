import {
  createContext,
  useEffect,
  ReactNode,
  use,
  useMemo,
  useRef
} from 'react';
import { type Wallet, ecosystemWallet } from 'thirdweb/wallets';
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
  authToken?: string;
};

/**
 * Provider component that handles wallet events and sends them to the Panna dashboard API
 */
export function WalletEventProvider({
  children,
  authToken
}: WalletEventProviderProps) {
  const ecosystemId = 'ecosystem.lisk';
  const enableTracking = true;
  const { partnerId } = usePanna();
  const { userAddress, isHydrated } = useAuth();
  const walletRef = useRef<Wallet | null>(null);
  const previousAddressRef = useRef<string | null>(null);

  // Create wallet instance when user is authenticated
  const wallet = useMemo(() => {
    if (userAddress && partnerId) {
      const walletInstance = ecosystemWallet(EcosystemId.LISK, { partnerId });
      walletRef.current = walletInstance;
      return walletInstance;
    }
    return null;
  }, [userAddress, partnerId]);

  console.log({ userAddress, wallet, isHydrated });

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
  const handleOnConnect = async (address: string) => {
    try {
      const chain = wallet?.getChain?.();

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
    if (!enableTracking || !isHydrated) return;

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
  }, [userAddress, isHydrated, enableTracking]);

  /**
   * Subscribe to wallet events when wallet instance is available
   */
  useEffect(() => {
    if (!enableTracking || !wallet || !userAddress) return;

    const unsubscribers: (() => void)[] = [];

    try {
      // Subscribe to wallet events for additional event capturing
      const unsubscribeAccountChanged = wallet.subscribe?.(
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

      const unsubscribeChainChanged = wallet.subscribe?.(
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
  }, [wallet, userAddress, enableTracking]);

  const contextValue: WalletEventContextType = {
    isTracking: enableTracking,
    sendAccountEvent
  };

  return (
    <WalletEventContext value={contextValue}>{children}</WalletEventContext>
  );
}

/**
 * Hook to access wallet event functionality
 */
export function useWalletEventContext() {
  const context = use(WalletEventContext);
  if (!context) {
    throw new Error(
      'useWalletEventContext must be used within a WalletEventProvider'
    );
  }
  return context;
}
