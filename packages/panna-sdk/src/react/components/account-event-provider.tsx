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
  type OnConnectActivityRequest,
  type DisconnectActivityRequest,
  type AccountUpdateActivityRequest,
  type SmartAccountTransform,
  pannaApiService
} from '../../core/utils';
import { usePanna } from '../hooks/use-panna';

export type AccountEventContextType = {
  sendAccountEvent: (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventOptions?: {
      social?: { type: 'email' | 'phone' | 'google'; data: string };
      reason?: string;
      updateType?: string;
    }
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
   * Transform SmartWalletOptions to API-compatible format
   */
  const transformSmartAccount = (
    config: SmartWalletOptions
  ): SmartAccountTransform => {
    return {
      chain: config?.chain?.name || currentChain?.name || 'lisk-sepolia',
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
      social?: { type: 'email' | 'phone' | 'google'; data: string };
      reason?: string;
      updateType?: string;
    } = {}
  ) => {
    try {
      const basePayload = {
        eventType,
        timestamp: new Date().toISOString(),
        ecosystemId: EcosystemId.LISK,
        partnerId,
        chainId: currentChain?.id || 4202
      };

      let payload: AccountEventPayload;

      if (eventType === 'onConnect') {
        if (!smartAccountConfig) {
          throw new Error('Smart account config required for onConnect event');
        }

        const socialInfo = eventOptions.social || getSocialInfo();
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
      const socialInfo = getSocialInfo();
      await sendAccountEvent('onConnect', address, {
        social: socialInfo || undefined
      });
    } catch (error) {
      console.error('Error handling onConnect event:', error);
    }
  };

  /**
   * Handle wallet disconnect event
   */
  const handleDisconnect = async (address: string) => {
    try {
      await sendAccountEvent('disconnect', address, {
        reason: 'User initiated'
      });
    } catch (error) {
      console.error('Error handling disconnect event:', error);
    }
  };

  /**
   * Handle account changed event
   */
  const handleAccountChanged = async (address: string) => {
    try {
      await sendAccountEvent('accountUpdate', address, {
        updateType: 'account_change'
      });
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
      handleOnConnect(userAddress);
    } else if (!userAddress && previousAddress) {
      // User disconnected
      handleDisconnect(previousAddress);
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
        () => {
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
