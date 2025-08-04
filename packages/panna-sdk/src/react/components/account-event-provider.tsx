import {
  createContext,
  useEffect,
  ReactNode,
  use,
  useRef,
  useMemo
} from 'react';
import { useActiveAccount, useActiveWallet, useProfiles } from 'thirdweb/react';
import { SmartWalletOptions } from 'thirdweb/wallets';
import { EcosystemId } from '../../core/client';
import {
  type AccountEventPayload,
  type OnConnectEventData,
  type DisconnectEventData,
  type AccountUpdateEventData,
  pannaApiService
} from '../../core/utils';
import { usePanna } from '../hooks/use-panna';

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
 * Provider component that handles wallet events and sends them to the Panna API
 */
export function AccountEventProvider({
  children,
  authToken
}: AccountEventProviderProps) {
  const { client, partnerId } = usePanna();
  const previousAddressRef = useRef<string | null>(null);
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const userAddress = account?.address || null;
  const currentChain = activeWallet?.getChain?.();
  const { data: userProfiles } = useProfiles({ client: client! });

  const smartAccountConfig = useMemo(() => {
    const config = activeWallet?.getConfig();
    if (!config) return null;

    return (config as unknown as { smartAccount: SmartWalletOptions })
      .smartAccount;
  }, [activeWallet]);

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
        chainId: currentChain?.id?.toString() || '4202', // Use actual chain ID or default to Lisk Sepolia
        eventData
      };

      // Use the default Panna API service
      await pannaApiService.sendAccountEvent(address, payload, authToken);
      console.log(`Successfully sent ${eventType} event for address:`, address);
    } catch (error) {
      console.error(`Failed to send ${eventType} event:`, error);
    }
  };

  const getSocialInfo = () => {
    const emailProfile = userProfiles?.find(
      (profile) =>
        profile.type === 'email' ||
        profile.type === 'google' ||
        profile.type === 'discord' ||
        profile.type === 'apple' ||
        profile.type === 'facebook'
    );

    const phoneProfile = userProfiles?.find(
      (profile) => profile.type === 'phone'
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

    return null;
  };

  /**
   * Handle wallet onConnect event
   */
  const handleOnConnect = async (address: string) => {
    try {
      if (!smartAccountConfig) {
        throw new Error('Smart account config not found');
      }

      const eventData: OnConnectEventData = {
        smartAccount: smartAccountConfig
      };

      const socialInfo = getSocialInfo();
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
   * Monitor wallet state changes to detect connection/disconnection events
   * Uses thirdweb's built-in state management instead of custom auth state
   */
  useEffect(() => {
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
  }, [userAddress]);

  /**
   * Subscribe to wallet events using useActiveWallet
   */
  useEffect(() => {
    if (!activeWallet || !userAddress) return;

    const unsubscribers: (() => void)[] = [];

    try {
      // Subscribe to account change events
      const unsubscribeAccountChanged = activeWallet.subscribe(
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

      // Subscribe to chain change events
      const unsubscribeChainChanged = activeWallet.subscribe(
        'chainChanged',
        (chain) => {
          console.log('Wallet chainChanged event:', chain);
          if (userAddress) {
            handleAccountChanged(userAddress);
          }
        }
      );
      if (unsubscribeChainChanged) unsubscribers.push(unsubscribeChainChanged);

      // Subscribe to multiple accounts change events
      const unsubscribeAccountsChanged = activeWallet.subscribe(
        'accountsChanged',
        (addresses) => {
          console.log('Wallet accountsChanged event:', addresses);
          if (addresses?.[0] && addresses[0] !== userAddress) {
            handleAccountChanged(addresses[0]);
          }
        }
      );
      if (unsubscribeAccountsChanged)
        unsubscribers.push(unsubscribeAccountsChanged);
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
  }, [activeWallet, userAddress]);

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
