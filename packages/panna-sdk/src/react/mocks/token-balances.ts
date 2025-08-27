import { DEFAULT_CURRENCY, lisk } from 'src/core';
import { liskTokenConfig } from '@/consts';
import { AccountBalanceInFiatResult } from '../../core/utils/types';

export type TokenBalance = AccountBalanceInFiatResult & {
  token: {
    icon: string;
  };
};

const mockAccountBalances: AccountBalanceInFiatResult[] = [
  {
    token: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      address: '0x519cA97c86Df5286e94327Bd7f639cD8619BB309'
    },
    tokenBalance: {
      value: BigInt(1234567890123456789n),
      displayValue: '1.234567890123456789'
    },
    fiatBalance: {
      amount: 4200.5,
      currency: DEFAULT_CURRENCY
    }
  },
  {
    token: {
      symbol: 'LSK',
      name: 'Lisk',
      decimals: 8,
      address: '0xac485391EB2d7D88253a7F1eF18C37f4242D1A24'
    },
    tokenBalance: {
      value: BigInt(1000000000000000000000n),
      displayValue: '1000.00000000'
    },
    fiatBalance: {
      amount: 1500.0,
      currency: DEFAULT_CURRENCY
    }
  },
  {
    token: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0xF242275d3a6527d877f2c927a82D9b057609cc71'
    },
    tokenBalance: {
      value: BigInt(5000000000000000000000n),
      displayValue: '5000.000000'
    },
    fiatBalance: {
      amount: 5000.0,
      currency: DEFAULT_CURRENCY
    }
  },
  {
    token: {
      symbol: 'USDT',
      name: 'Tether',
      decimals: 6,
      address: '0x05D032ac25d322df992303dCa074EE7392C117b9'
    },
    tokenBalance: {
      value: BigInt(250000000000000000000n),
      displayValue: '2500.000000'
    },
    fiatBalance: {
      amount: 2500.0,
      currency: DEFAULT_CURRENCY
    }
  }
];

// Since we internally maintain a list of tokens for a supported network,
// we can use that to map the token symbols to their icons in the mock balances.
export const tokenIconMap = liskTokenConfig[lisk.id].reduce<
  Record<string, string>
>((acc, token) => {
  acc[token.symbol] = token.icon ?? liskTokenConfig[lisk.id][0].icon!; // Fallback to the Lisk icon if not defined
  return acc;
}, {});

export const mockTokenBalances: TokenBalance[] = mockAccountBalances.map(
  (balance) => {
    const tokenIcon = tokenIconMap[balance.token.symbol];
    return {
      ...balance,
      token: {
        ...balance.token,
        icon: tokenIcon
      }
    };
  }
);
