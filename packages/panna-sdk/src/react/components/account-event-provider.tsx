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
import type {
  AccountEventPayload,
  OnConnectActivityRequest,
  DisconnectActivityRequest,
  AccountUpdateActivityRequest,
  SmartAccountTransform,
  SocialAuthData
} from '../../core/util';
import { AccountEventType } from '../../core/util';
import { usePanna } from '../hooks/use-panna';
import { getOrRefreshSiweToken } from '../utils/auth';

export type AccountEventContextType = {
  sendAccountEvent: (
    eventType: AccountEventPayload['eventType'],
    address: string,
    eventOptions?: {
      social?: SocialAuthData;
      reason?: string;
      updateType?: string;
    }
  ) => Promise<void>;
};

const AccountEventContext = createContext<AccountEventContextType | null>(null);

export type AccountEventProviderProps = {
  children: ReactNode;
};

/**
 * Provider component that handles wallet events and sends them to the Panna API
 */
export function AccountEventProvider({ children }: AccountEventProviderProps) {
  const { client, partnerId, pannaApiService, siweAuth } = usePanna();
  const previousAddressRef = useRef<string | null>(null);
  const lastKnownChainIdRef = useRef<number | null>(null);
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const userAddress = account?.address || null;
  const currentChain = activeWallet?.getChain?.();
  const { data: userProfiles } = useProfiles({ client: client! });

  // Store the chainId whenever it's available so we can use it during disconnect
  useEffect(() => {
    if (currentChain?.id) {
      lastKnownChainIdRef.current = currentChain.id;
    }
  }, [currentChain?.id]);

  const smartAccountConfig = useMemo(() => {
    const config = activeWallet?.getConfig();
    if (!config) {
      return null;
    }

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
      chain: config.chain.name || '',
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
   * Automatically handles SIWE token validation and re-authentication if expired.
   * Makes API calls mandatory when token exists.
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
      const chainId = currentChain?.id ?? lastKnownChainIdRef.current;

      if (!chainId) {
        throw new Error('Chain ID not found');
      }

      // Try to get valid token with automatic re-authentication if expired
      const siweToken = await getOrRefreshSiweToken(
        siweAuth,
        activeWallet ?? undefined
      );

      // If no token after re-auth attempt, throw an error since API calls are now mandatory
      if (!siweToken) {
        throw new Error(
          `${eventType} event failed: SIWE authentication is required but no token was available. Please ensure SIWE authentication is completed.`
        );
      }

      const basePayload = {
        eventType,
        timestamp: new Date().toISOString(),
        ecosystemId: EcosystemId.LISK,
        partnerId,
        chainId
      };

      let payload: AccountEventPayload;

      if (eventType === AccountEventType.ON_CONNECT) {
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
            eventType: AccountEventType.ON_CONNECT,
            smartAccount: transformSmartAccount(smartAccountConfig),
            social: {
              type: 'email',
              data: `wallet-${address.slice(-8)}@unknown.domain`
            }
          } as OnConnectActivityRequest;
        } else {
          payload = {
            ...basePayload,
            eventType: AccountEventType.ON_CONNECT,
            smartAccount: transformSmartAccount(smartAccountConfig),
            social: socialInfo
          } as OnConnectActivityRequest;
        }
      } else if (eventType === AccountEventType.DISCONNECT) {
        payload = {
          ...basePayload,
          eventType: AccountEventType.DISCONNECT,
          ...(eventOptions.reason && { reason: eventOptions.reason })
        } as DisconnectActivityRequest;
      } else if (eventType === AccountEventType.ACCOUNT_UPDATE) {
        payload = {
          ...basePayload,
          eventType: AccountEventType.ACCOUNT_UPDATE,
          ...(eventOptions.updateType && {
            updateType: eventOptions.updateType
          })
        } as AccountUpdateActivityRequest;
      } else {
        throw new Error(`Unsupported event type: ${eventType}`);
      }

      await pannaApiService.sendAccountEvent(address, payload, siweToken);
    } catch (error) {
      console.error(`Failed to send ${eventType} event:`, error);

      // Re-throw error for caller to handle
      throw error;
    }
  };

  const getSocialInfo = () => {
    const emailProfile = userProfiles?.find(
      (profile) => profile.type === 'email'
    );

    const googleProfile = userProfiles?.find(
      (profile) => profile.type === 'google'
    );

    const phoneProfile = userProfiles?.find(
      (profile) => profile.type === 'phone'
    );

    // Return profile data with the actual provider type
    if (emailProfile?.details?.email) {
      return {
        type: 'email' as const,
        data: emailProfile.details.email
      };
    } else if (googleProfile?.details?.email) {
      return {
        type: 'google' as const,
        data: googleProfile.details.email
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
   * Polls for SIWE authentication before sending the event
   */
  const handleOnConnect = async (address: string) => {
    try {
      const socialInfo = getSocialInfo();

      await sendAccountEvent(AccountEventType.ON_CONNECT, address, {
        social: socialInfo || undefined
      });
    } catch (error) {
      console.error('Error handling onConnect event:', error);
    }
  };

  /**
   * Handle wallet disconnect event
   * Polls for SIWE authentication before sending the event
   */
  const handleDisconnect = async (address: string) => {
    try {
      await sendAccountEvent(AccountEventType.DISCONNECT, address, {
        reason: 'User initiated'
      });
    } catch (error) {
      console.error('Error handling disconnect event:', error);
    }
  };

  /**
   * Handle account changed event
   * Polls for SIWE authentication before sending the event
   */
  const handleAccountChanged = async (address: string) => {
    try {
      await sendAccountEvent(AccountEventType.ACCOUNT_UPDATE, address, {
        updateType: 'account_change'
      });
    } catch (error) {
      console.error('Error handling account changed event:', error);
    }
  };

  /**
   * Monitor wallet state changes to detect connection/disconnection events
   * Uses Thirdweb's built-in state management instead of custom auth state
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
