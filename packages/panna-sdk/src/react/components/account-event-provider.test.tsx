import { UseQueryResult } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import React from 'react';
import { SmartAccountOptions } from 'thirdweb/dist/types/wallets/smart/types';
import { useActiveAccount, useActiveWallet, useProfiles } from 'thirdweb/react';
import { Account, Profile, SmartWalletOptions, Wallet } from 'thirdweb/wallets';
import { pannaApiService, AccountEventType } from '../../core/utils';
import { usePanna } from '../hooks/use-panna';
import {
  AccountEventProvider,
  useAccountEventContext,
  type AccountEventProviderProps
} from './account-event-provider';
import { PannaContextValue } from './panna-provider';

// Mock thirdweb hooks
jest.mock('thirdweb/react', () => ({
  useActiveAccount: jest.fn(),
  useActiveWallet: jest.fn(),
  useProfiles: jest.fn()
}));

// Mock usePanna hook
jest.mock('../hooks/use-panna', () => ({
  usePanna: jest.fn()
}));

// Mock pannaApiService
jest.mock('../../core/utils', () => ({
  ...jest.requireActual('../../core/utils'),
  pannaApiService: {
    sendAccountEvent: jest.fn()
  }
}));

// Mock EcosystemId
jest.mock('../../core/client', () => ({
  EcosystemId: {
    LISK: 'ecosystem.lisk'
  }
}));

// Type the mocked functions
const mockUseActiveAccount = useActiveAccount as jest.MockedFunction<
  typeof useActiveAccount
>;
const mockUseActiveWallet = useActiveWallet as jest.MockedFunction<
  typeof useActiveWallet
>;
const mockUseProfiles = useProfiles as jest.MockedFunction<typeof useProfiles>;
const mockUsePanna = usePanna as jest.MockedFunction<typeof usePanna>;
const mockSendAccountEvent =
  pannaApiService.sendAccountEvent as jest.MockedFunction<
    typeof pannaApiService.sendAccountEvent
  >;

// Test consumer component
const TestConsumer: React.FC = () => {
  const context = useAccountEventContext();

  const handleTestEvent = async () => {
    await context.sendAccountEvent(
      AccountEventType.ON_CONNECT,
      '0x1234567890123456789012345678901234567890',
      {
        social: { type: 'email', data: 'test@example.com' }
      }
    );
  };

  return (
    <div>
      <span data-testid="context-available">
        {context ? 'context-available' : 'context-null'}
      </span>
      <button data-testid="trigger-event" onClick={handleTestEvent}>
        Trigger Event
      </button>
    </div>
  );
};

// Mock wallet and account objects
const mockAccount = {
  address: '0x1234567890123456789012345678901234567890'
};

const mockChain = {
  id: 4202,
  name: 'lisk-sepolia',
  rpc: 'https://rpc.sepolia-api.lisk.com'
};

const mockSmartAccountConfig: SmartWalletOptions = {
  chain: {
    ...mockChain,
    rpc: 'https://rpc.sepolia-api.lisk.com'
  },
  factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb',
  overrides: {
    entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032'
  },
  sponsorGas: true
};

const mockWallet = {
  getChain: jest.fn(() => mockChain),
  getConfig: jest.fn(() => ({ smartAccount: mockSmartAccountConfig })),
  subscribe: jest.fn()
};

const mockUserProfiles = [
  {
    type: 'email',
    details: { email: 'user@example.com' }
  },
  {
    type: 'phone',
    details: { phone: '+1234567890' }
  }
];

const mockPannaContext = {
  client: { clientId: 'test-client' },
  partnerId: '123e4567-e89b-12d3-a456-426614174000'
};

describe('AccountEventProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset wallet mock functions
    mockWallet.getChain.mockReturnValue(mockChain);
    mockWallet.getConfig.mockReturnValue({
      smartAccount: mockSmartAccountConfig
    });
    mockWallet.subscribe.mockReturnValue(jest.fn());

    // Setup default mocks
    mockUseActiveAccount.mockReturnValue(mockAccount as unknown as Account);
    mockUseActiveWallet.mockReturnValue(mockWallet as unknown as Wallet);
    mockUseProfiles.mockReturnValue({
      data: mockUserProfiles
    } as unknown as UseQueryResult<Profile[]>);
    mockUsePanna.mockReturnValue(
      mockPannaContext as unknown as PannaContextValue
    );
    mockSendAccountEvent.mockResolvedValue({
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue({}),
      text: jest.fn().mockResolvedValue('{}')
    } as unknown as Response);

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Provider Setup', () => {
    it('should render children and provide context', () => {
      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      expect(screen.getByTestId('context-available')).toHaveTextContent(
        'context-available'
      );
    });

    it('should throw error when useAccountEventContext is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestConsumer />);
      }).toThrow(
        'useAccountEventContext must be used within a AccountEventProvider'
      );

      consoleSpy.mockRestore();
    });

    it('should accept authToken prop', () => {
      const props: AccountEventProviderProps = {
        authToken: 'test-auth-token',
        children: <TestConsumer />
      };

      render(<AccountEventProvider {...props} />);
      expect(screen.getByTestId('context-available')).toHaveTextContent(
        'context-available'
      );
    });
  });

  describe('Smart Account Transformation', () => {
    it('should transform smart account config correctly', async () => {
      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          '0x1234567890123456789012345678901234567890',
          expect.objectContaining({
            smartAccount: {
              chain: 'lisk-sepolia',
              factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb',
              entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
              sponsorGas: true
            }
          }),
          undefined
        );
      });
    });

    it('should handle smart account with gasless property', async () => {
      const mockSmartAccountWithGasless = {
        chain: {
          ...mockChain,
          rpc: 'https://rpc.sepolia-api.lisk.com'
        },
        factoryAddress: '0x4be0ddfebca9a5a4a617dee4dece99e7c862dceb',
        overrides: {
          entrypointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032'
        },
        gasless: true
      } as SmartWalletOptions;

      mockWallet.getConfig.mockReturnValue({
        smartAccount: mockSmartAccountWithGasless
      } as unknown as { smartAccount: SmartAccountOptions });

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        // Check the first call (from our test button click)
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            smartAccount: expect.objectContaining({
              sponsorGas: true // Should map gasless: true to sponsorGas: true
            })
          })
        );
      });
    });

    it('should use fallback values for missing smart account properties', async () => {
      const incompleteSmartAccount = {
        chain: {
          ...mockChain,
          rpc: 'https://rpc.sepolia-api.lisk.com'
        },
        sponsorGas: false
      } as SmartWalletOptions;

      mockWallet.getConfig.mockReturnValue({
        smartAccount: incompleteSmartAccount
      } as unknown as {
        smartAccount: SmartAccountOptions;
      });

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        // Check the first call (from our test button click)
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            smartAccount: {
              chain: 'lisk-sepolia',
              factoryAddress: '',
              entrypointAddress: '',
              sponsorGas: false
            }
          })
        );
      });
    });
  });

  describe('Social Info Detection', () => {
    it('should detect email from user profiles', async () => {
      // Clear previous calls
      jest.clearAllMocks();

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        // Check the first call (from our test button click)
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            social: { type: 'email', data: 'user@example.com' }
          })
        );
      });
    });

    it('should detect phone when no email available', async () => {
      // Clear previous calls and setup phone-only profiles
      jest.clearAllMocks();

      const phoneOnlyProfiles = [
        {
          type: 'phone',
          details: { phone: '+1234567890' }
        }
      ];

      mockUseProfiles.mockReturnValue({
        data: phoneOnlyProfiles
      } as unknown as UseQueryResult<Profile[]>);

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        // Check the first call (from our test button click)
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            social: { type: 'phone', data: '+1234567890' }
          })
        );
      });
    });

    it('should use fallback when no social info available', async () => {
      // Clear previous calls and setup empty profiles
      jest.clearAllMocks();

      mockUseProfiles.mockReturnValue({ data: [] } as unknown as UseQueryResult<
        Profile[]
      >);

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        // Check the first call (from our test button click)
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            social: {
              type: 'email',
              data: 'wallet-34567890@unknown.domain' // Fallback format
            }
          })
        );
      });
    });

    it('should handle google profile as google type', async () => {
      // Clear previous calls and setup google profiles
      jest.clearAllMocks();

      const googleProfiles = [
        {
          type: 'google',
          details: { email: 'google@example.com' }
        }
      ];

      mockUseProfiles.mockReturnValue({
        data: googleProfiles
      } as unknown as UseQueryResult<Profile[]>);

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        // Check the first call (from our test button click)
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            social: { type: 'google', data: 'google@example.com' }
          })
        );
      });
    });

    it('should handle discord profile as discord type', async () => {
      jest.clearAllMocks();

      const discordProfiles = [
        {
          type: 'discord',
          details: { email: 'discord@example.com' }
        }
      ];

      mockUseProfiles.mockReturnValue({
        data: discordProfiles
      } as unknown as UseQueryResult<Profile[]>);

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            social: { type: 'discord', data: 'discord@example.com' }
          })
        );
      });
    });

    it('should handle apple profile as apple type', async () => {
      jest.clearAllMocks();

      const appleProfiles = [
        {
          type: 'apple',
          details: { email: 'apple@example.com' }
        }
      ];

      mockUseProfiles.mockReturnValue({
        data: appleProfiles
      } as unknown as UseQueryResult<Profile[]>);

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            social: { type: 'apple', data: 'apple@example.com' }
          })
        );
      });
    });

    it('should handle facebook profile as facebook type', async () => {
      jest.clearAllMocks();

      const facebookProfiles = [
        {
          type: 'facebook',
          details: { email: 'facebook@example.com' }
        }
      ];

      mockUseProfiles.mockReturnValue({
        data: facebookProfiles
      } as unknown as UseQueryResult<Profile[]>);

      render(
        <AccountEventProvider>
          <TestConsumer />
        </AccountEventProvider>
      );

      const button = screen.getByTestId('trigger-event');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalled();
        const firstCall = mockSendAccountEvent.mock.calls[0];
        expect(firstCall[1]).toEqual(
          expect.objectContaining({
            social: { type: 'facebook', data: 'facebook@example.com' }
          })
        );
      });
    });
  });

  describe('Event Handling', () => {
    it('should send onConnect event with correct payload structure', async () => {
      const mockConsumer = () => {
        const context = useAccountEventContext();
        return (
          <button
            data-testid="connect-button"
            onClick={() =>
              context.sendAccountEvent(
                AccountEventType.ON_CONNECT,
                mockAccount.address
              )
            }
          >
            Connect
          </button>
        );
      };

      render(
        <AccountEventProvider>
          {React.createElement(mockConsumer)}
        </AccountEventProvider>
      );

      const button = screen.getByTestId('connect-button');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          mockAccount.address,
          expect.objectContaining({
            eventType: AccountEventType.ON_CONNECT,
            timestamp: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
            ),
            ecosystemId: 'ecosystem.lisk',
            partnerId: '123e4567-e89b-12d3-a456-426614174000',
            chainId: 4202,
            smartAccount: expect.any(Object),
            social: expect.any(Object)
          }),
          undefined
        );
      });
    });

    it('should send disconnect event with correct payload', async () => {
      const mockConsumer = () => {
        const context = useAccountEventContext();
        return (
          <button
            data-testid="disconnect-button"
            onClick={() =>
              context.sendAccountEvent(
                AccountEventType.DISCONNECT,
                mockAccount.address,
                {
                  reason: 'User initiated'
                }
              )
            }
          >
            Disconnect
          </button>
        );
      };

      render(
        <AccountEventProvider>
          {React.createElement(mockConsumer)}
        </AccountEventProvider>
      );

      const button = screen.getByTestId('disconnect-button');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          mockAccount.address,
          expect.objectContaining({
            eventType: AccountEventType.DISCONNECT,
            reason: 'User initiated'
          }),
          undefined
        );
      });
    });

    it('should send accountUpdate event with correct payload', async () => {
      const mockConsumer = () => {
        const context = useAccountEventContext();
        return (
          <button
            data-testid="update-button"
            onClick={() =>
              context.sendAccountEvent(
                AccountEventType.ACCOUNT_UPDATE,
                mockAccount.address,
                {
                  updateType: 'profile_change'
                }
              )
            }
          >
            Update
          </button>
        );
      };

      render(
        <AccountEventProvider>
          {React.createElement(mockConsumer)}
        </AccountEventProvider>
      );

      const button = screen.getByTestId('update-button');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          mockAccount.address,
          expect.objectContaining({
            eventType: AccountEventType.ACCOUNT_UPDATE,
            updateType: 'profile_change'
          }),
          undefined
        );
      });
    });

    it('should include authToken when provided', async () => {
      const mockConsumer = () => {
        const context = useAccountEventContext();
        return (
          <button
            data-testid="auth-button"
            onClick={() =>
              context.sendAccountEvent(
                AccountEventType.ON_CONNECT,
                mockAccount.address
              )
            }
          >
            Connect with Auth
          </button>
        );
      };

      render(
        <AccountEventProvider authToken="test-auth-token">
          {React.createElement(mockConsumer)}
        </AccountEventProvider>
      );

      const button = screen.getByTestId('auth-button');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          'test-auth-token'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing smart account config error', async () => {
      mockWallet.getConfig.mockReturnValue(
        {} as unknown as {
          smartAccount: SmartAccountOptions;
        }
      );

      const mockConsumer = () => {
        const context = useAccountEventContext();
        return (
          <button
            data-testid="error-button"
            onClick={() =>
              context.sendAccountEvent(
                AccountEventType.ON_CONNECT,
                mockAccount.address
              )
            }
          >
            Trigger Error
          </button>
        );
      };

      render(
        <AccountEventProvider>
          {React.createElement(mockConsumer)}
        </AccountEventProvider>
      );

      const button = screen.getByTestId('error-button');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Failed to send onConnect event:',
          expect.any(Error)
        );
      });
    });

    it('should handle API service errors gracefully', async () => {
      mockSendAccountEvent.mockRejectedValue(new Error('API Error'));

      const mockConsumer = () => {
        const context = useAccountEventContext();
        return (
          <button
            data-testid="api-error-button"
            onClick={() =>
              context.sendAccountEvent(
                AccountEventType.ON_CONNECT,
                mockAccount.address
              )
            }
          >
            Trigger API Error
          </button>
        );
      };

      render(
        <AccountEventProvider>
          {React.createElement(mockConsumer)}
        </AccountEventProvider>
      );

      const button = screen.getByTestId('api-error-button');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Failed to send onConnect event:',
          expect.any(Error)
        );
      });
    });

    it('should warn when using social fallback', async () => {
      // Clear previous calls and setup null profiles
      jest.clearAllMocks();

      mockUseProfiles.mockReturnValue({
        data: null
      } as unknown as UseQueryResult<Profile[]>);

      const mockConsumer = () => {
        const context = useAccountEventContext();
        return (
          <button
            data-testid="fallback-button"
            onClick={() =>
              context.sendAccountEvent(
                AccountEventType.ON_CONNECT,
                mockAccount.address
              )
            }
          >
            Use Fallback
          </button>
        );
      };

      render(
        <AccountEventProvider>
          {React.createElement(mockConsumer)}
        </AccountEventProvider>
      );

      const button = screen.getByTestId('fallback-button');
      await act(async () => {
        button.click();
      });

      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith(
          'Social authentication info not available, using fallback'
        );
      });
    });
  });

  describe('Wallet State Monitoring', () => {
    it('should trigger onConnect when user address changes from null to address', async () => {
      // Clear previous calls and start with no account
      jest.clearAllMocks();

      mockUseActiveAccount.mockReturnValue(null as unknown as Account);

      const { rerender } = render(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      // Clear mocks again to isolate the connection event
      jest.clearAllMocks();

      // Change to connected account
      mockUseActiveAccount.mockReturnValue(mockAccount as unknown as Account);

      rerender(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          mockAccount.address,
          expect.objectContaining({
            eventType: 'onConnect'
          }),
          undefined
        );
      });
    });

    it('should trigger disconnect when user address changes from address to null', async () => {
      // Start with connected account
      mockUseActiveAccount.mockReturnValue(mockAccount as unknown as Account);

      const { rerender } = render(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      // Clear mocks to isolate the disconnect event
      jest.clearAllMocks();

      // Change to no account
      mockUseActiveAccount.mockReturnValue(null as unknown as Account);

      rerender(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          mockAccount.address,
          expect.objectContaining({
            eventType: AccountEventType.DISCONNECT,
            reason: 'User initiated'
          }),
          undefined
        );
      });
    });

    it('should trigger accountUpdate when address changes to different address', async () => {
      const newAccount = {
        address: '0x9876543210987654321098765432109876543210'
      };

      // Start with first account
      mockUseActiveAccount.mockReturnValue(mockAccount as unknown as Account);

      const { rerender } = render(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      // Clear initial onConnect event
      jest.clearAllMocks();

      // Change to different account
      mockUseActiveAccount.mockReturnValue(newAccount as unknown as Account);

      rerender(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      await waitFor(() => {
        expect(mockSendAccountEvent).toHaveBeenCalledWith(
          newAccount.address,
          expect.objectContaining({
            eventType: AccountEventType.ACCOUNT_UPDATE,
            updateType: 'account_change'
          }),
          undefined
        );
      });
    });
  });

  describe('Wallet Event Subscriptions', () => {
    it('should subscribe to wallet events when wallet is available', () => {
      const mockUnsubscribe = jest.fn();
      mockWallet.subscribe.mockReturnValue(mockUnsubscribe);

      render(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      expect(mockWallet.subscribe).toHaveBeenCalledWith(
        'accountChanged',
        expect.any(Function)
      );
      expect(mockWallet.subscribe).toHaveBeenCalledWith(
        'chainChanged',
        expect.any(Function)
      );
      expect(mockWallet.subscribe).toHaveBeenCalledWith(
        'accountsChanged',
        expect.any(Function)
      );
    });

    it('should handle wallet subscription errors gracefully', () => {
      mockWallet.subscribe.mockImplementation(() => {
        throw new Error('Subscription error');
      });

      render(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error subscribing to wallet events:',
        expect.any(Error)
      );
    });

    it('should not subscribe when wallet is not available', () => {
      mockUseActiveWallet.mockReturnValue(undefined as unknown as Wallet);

      render(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      expect(mockWallet.subscribe).not.toHaveBeenCalled();
    });

    it('should not subscribe when user address is not available', () => {
      mockUseActiveAccount.mockReturnValue(null as unknown as Account);

      render(
        <AccountEventProvider>
          <div data-testid="provider-content">Provider Active</div>
        </AccountEventProvider>
      );

      expect(mockWallet.subscribe).not.toHaveBeenCalled();
    });
  });
});
