import { render, screen } from '@testing-library/react';
import {
  Activity,
  DEFAULT_CURRENCY,
  FiatCurrency,
  TokenERC,
  TransactionActivity
} from 'src/core';
import { ActivityItem } from './activity-item';

describe('ActivityItem', () => {
  it('renders ETH activity with fiat value', () => {
    const activity: Activity = {
      activityType: TransactionActivity.SENT,
      transactionID: '0x123',
      amount: {
        type: TokenERC.ETH,
        value: '1000000000000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: TokenERC.ETH,
          icon: null
        },
        fiatValue: {
          amount: 3000.5,
          currency: DEFAULT_CURRENCY
        }
      },
      status: 'success',
      timestamp: '2024-01-01T00:00:00.000000Z'
    };

    render(<ActivityItem activity={activity} />);

    expect(screen.getByText('Sent')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('1.00000 ETH')).toBeInTheDocument();
    expect(screen.getByText('$3000.50')).toBeInTheDocument();
  });

  it('renders ERC20 activity with fiat value', () => {
    const activity: Activity = {
      activityType: TransactionActivity.RECEIVED,
      transactionID: '0x456',
      amount: {
        type: TokenERC.ERC20,
        value: '1000000',
        tokenInfo: {
          address: '0x1234567890123456789012345678901234567890',
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          type: TokenERC.ERC20,
          icon: null
        },
        fiatValue: {
          amount: 1.0,
          currency: DEFAULT_CURRENCY
        }
      },
      status: 'success',
      timestamp: '2024-01-01T00:00:00.000000Z'
    };

    render(<ActivityItem activity={activity} />);

    expect(screen.getByText('Received')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('1.00000 USDC')).toBeInTheDocument();
    expect(screen.getByText('$1.00')).toBeInTheDocument();
  });

  it('renders "-" when fiat value is not available', () => {
    const activity: Activity = {
      activityType: TransactionActivity.SENT,
      transactionID: '0x789',
      amount: {
        type: TokenERC.ETH,
        value: '500000000000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: TokenERC.ETH,
          icon: null
        }
      },
      status: 'success',
      timestamp: '2024-01-01T00:00:00.000000Z'
    };

    render(<ActivityItem activity={activity} />);

    expect(screen.getByText('Sent')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('renders EUR currency symbol correctly', () => {
    const activity: Activity = {
      activityType: TransactionActivity.RECEIVED,
      transactionID: '0xabc',
      amount: {
        type: TokenERC.ETH,
        value: '2000000000000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: TokenERC.ETH,
          icon: null
        },
        fiatValue: {
          amount: 2700.0,
          currency: FiatCurrency.EUR
        }
      },
      status: 'success',
      timestamp: '2024-01-01T00:00:00.000000Z'
    };

    render(<ActivityItem activity={activity} />);

    expect(screen.getByText('€2700.00')).toBeInTheDocument();
  });

  it('renders GBP currency symbol correctly', () => {
    const activity: Activity = {
      activityType: TransactionActivity.RECEIVED,
      transactionID: '0xdef',
      amount: {
        type: TokenERC.ETH,
        value: '1500000000000000000',
        tokenInfo: {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          type: TokenERC.ETH,
          icon: null
        },
        fiatValue: {
          amount: 2400.0,
          currency: FiatCurrency.GBP
        }
      },
      status: 'success',
      timestamp: '2024-01-01T00:00:00.000000Z'
    };

    render(<ActivityItem activity={activity} />);

    expect(screen.getByText('£2400.00')).toBeInTheDocument();
  });

  it('renders ERC721 collectible without fiat value', () => {
    const activity: Activity = {
      activityType: TransactionActivity.MINTED,
      transactionID: '0x111',
      amount: {
        type: TokenERC.ERC721,
        tokenId: '100',
        instance: {
          id: '100',
          isUnique: true,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Cool NFT',
            symbol: 'CNFT',
            decimals: 0,
            type: TokenERC.ERC721,
            icon: null
          }
        }
      },
      status: 'success',
      timestamp: '2024-01-01T00:00:00.000000Z'
    };

    render(<ActivityItem activity={activity} />);

    expect(screen.getByText('Minted')).toBeInTheDocument();
    expect(screen.getByText('Cool NFT')).toBeInTheDocument();
    expect(screen.getByText('Collectible')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('renders ERC1155 collectible with fiat value', () => {
    const activity: Activity = {
      activityType: TransactionActivity.RECEIVED,
      transactionID: '0x222',
      amount: {
        type: TokenERC.ERC1155,
        tokenId: '50',
        value: '5',
        instance: {
          id: '50',
          isUnique: false,
          owner: {
            address: '0x0000000000000000000000000000000000000000',
            isContract: false
          },
          tokenInfo: {
            address: '0x0000000000000000000000000000000000000000',
            name: 'Multi Token',
            symbol: 'MULTI',
            decimals: 0,
            type: TokenERC.ERC1155,
            icon: null
          }
        },
        fiatValue: {
          amount: 250.0,
          currency: DEFAULT_CURRENCY
        }
      },
      status: 'success',
      timestamp: '2024-01-01T00:00:00.000000Z'
    };

    render(<ActivityItem activity={activity} />);

    expect(screen.getByText('Received')).toBeInTheDocument();
    expect(screen.getByText('Multi Token')).toBeInTheDocument();
    expect(screen.getByText('Collectible')).toBeInTheDocument();
    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });
});
