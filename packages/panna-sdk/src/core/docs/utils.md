# Utils Module

The Utils module provides essential blockchain utilities for balances, conversions, activity tracking, and data validation. The module includes helper functions for common operations and data processing.

## What You'll Learn

In this guide, you will:

- Query token balances and convert to fiat values
- Convert between wei and token amounts
- Track user transaction history and NFT collections
- Validate addresses and sanitize inputs
- Build common patterns like portfolio dashboards

## Table of Contents

- [Utils Module](#utils-module)
  - [What You'll Learn](#what-youll-learn)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [1. Balance Operations](#1-balance-operations)
    - [Basic Balance Queries](#basic-balance-queries)
    - [Multiple Token Balances](#multiple-token-balances)
    - [Fiat Conversions](#fiat-conversions)
  - [2. Token Conversions](#2-token-conversions)
    - [Wei Conversions](#wei-conversions)
    - [Custom Decimal Support](#custom-decimal-support)
  - [3. Activity Tracking](#3-activity-tracking)
  - [4. NFT Collections](#4-nft-collections)
  - [5. Validation \& Input Handling](#5-validation--input-handling)
  - [6. Social Authentication](#6-social-authentication)
  - [Next Steps](#next-steps)

## Quick Start

```ts
import {
  accountBalance,
  accountBalanceInFiat,
  toWei,
  isValidAddress,
  getActivitiesByAddress,
  getCollectiblesByAddress
} from 'panna-sdk';

// Essential operations
const balance = await accountBalance({
  client,
  chain: lisk,
  address: userAddress
});
const amount = toWei('10.5'); // Convert to wei: 10500000000000000000n
const isValid = isValidAddress(recipientAddress); // Validate address

// Get user data
const activities = await getActivitiesByAddress({
  client,
  address: userAddress
});
const nfts = await getCollectiblesByAddress({ client, address: userAddress });
const fiatBalance = await accountBalanceInFiat({
  client,
  chain: lisk,
  address: userAddress,
  currency: 'USD'
});
```

## 1. Balance Operations

### Basic Balance Queries

```ts
import { accountBalance } from 'panna-sdk';

// Native token balance (LSK)
const balance = await accountBalance({
  client,
  chain: lisk,
  address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e'
});

console.log({
  value: balance.value, // BigInt in wei
  displayValue: balance.displayValue, // "10.5"
  symbol: balance.symbol, // "LSK"
  decimals: balance.decimals // 18
});

// ERC-20 token balance
const usdtBalance = await accountBalance({
  client,
  chain: lisk,
  address: userAddress,
  tokenAddress: '0x1234567890123456789012345678901234567890'
});
```

### Multiple Token Balances

```ts
// Query multiple tokens efficiently
async function getPortfolioBalances(address: string, tokens: string[]) {
  const balances = await Promise.all(
    tokens.map((tokenAddress) =>
      accountBalance({ client, chain: lisk, address, tokenAddress })
    )
  );

  return balances.map((balance) => ({
    token: balance.symbol,
    amount: balance.displayValue,
    value: balance.value
  }));
}

const tokens = ['0xAAA...', '0xBBB...', '0xCCC...'];
const portfolio = await getPortfolioBalances(userAddress, tokens);
```

### Fiat Conversions

```ts
import {
  accountBalanceInFiat,
  accountBalancesInFiat,
  getFiatPrice
} from 'panna-sdk';

// Single token balance with fiat value
const balanceWithFiat = await accountBalanceInFiat({
  client,
  chain: lisk,
  address: userAddress,
  currency: 'USD'
});

console.log(
  `${balanceWithFiat.displayValue} ${balanceWithFiat.symbol} = $${balanceWithFiat.fiatValue}`
);
// "10.5 LSK = $13.12"

// Complete portfolio with fiat values
const portfolio = await accountBalancesInFiat({
  client,
  chain: lisk,
  address: userAddress,
  currency: 'USD'
});

const totalValue = portfolio.reduce(
  (sum, token) => sum + parseFloat(token.fiatValue),
  0
);
console.log(`Total portfolio: $${totalValue.toFixed(2)}`);
```

## 2. Token Conversions

### Wei Conversions

```ts
import { toWei } from 'panna-sdk';

// Convert token amounts to wei (18 decimals)
const examples = {
  whole: toWei('10'), // 10000000000000000000n
  decimal: toWei('10.5'), // 10500000000000000000n
  small: toWei('0.001') // 1000000000000000n
};

// Use in transactions
const transaction = prepareTransaction({
  client,
  chain: lisk,
  to: recipientAddress,
  value: toWei('1.5') // Send 1.5 tokens
});
```

### Custom Decimal Support

```ts
// For tokens with different decimal places (like USDC with 6 decimals)
function toTokenUnits(amount: string, decimals: number): bigint {
  const factor = BigInt(10 ** decimals);
  const [whole, decimal = '0'] = amount.split('.');
  const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole) * factor + BigInt(paddedDecimal);
}

const usdcAmount = toTokenUnits('100.50', 6); // 100500000n (6 decimals)
```

## 3. Activity Tracking

```ts
import { getActivitiesByAddress } from 'panna-sdk';

// Get user's transaction history
const activities = await getActivitiesByAddress({
  client,
  address: userAddress,
  limit: 20,
  offset: 0 // For pagination
});

// Process and filter activities
const sentTransactions = activities.filter(
  (activity) => activity.activityType.toLowerCase() === 'sent'
);
const failedTransactions = activities.filter(
  (activity) => activity.status.toLowerCase() === 'error'
);

// Format for display
function formatTransactionHistory(activities: Activity[]) {
  return activities.map((activity) => ({
    date: new Date(activity.timestamp * 1000).toLocaleDateString(),
    type: activity.type,
    amount: (Number(BigInt(activity.value)) / 1e18).toString(),
    counterparty:
      activity.activityType === 'sent' ? activity.to : activity.from,
    status: activity.status,
    explorerUrl: `https://blockscout.lisk.com/tx/${activity.transactionID}`
  }));
}
```

## 4. NFT Collections

```ts
import { getCollectiblesByAddress } from 'panna-sdk';

// Get user's NFT collection
const nfts = await getCollectiblesByAddress({
  client,
  address: userAddress
});

// Group NFTs by collection
const groupedNFTs = nfts.reduce(
  (groups, nft) => {
    const collection = nft.collection;
    if (!groups[collection]) groups[collection] = [];
    groups[collection].push(nft);
    return groups;
  },
  {} as Record<string, typeof nfts>
);

// Display collection summary
Object.entries(groupedNFTs).forEach(([collection, nfts]) => {
  console.log(`${collection}: ${nfts.length} NFTs`);
});
```

## 5. Validation & Input Handling

```ts
import { isValidAddress } from 'panna-sdk';

// Address validation
const address = '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e';
const isValid = isValidAddress(address);

// Form validation helper
function validateTransactionInput(
  recipient: string,
  amount: string,
  balance?: bigint
) {
  const errors: string[] = [];

  // Address validation
  if (!recipient || !isValidAddress(recipient.trim())) {
    errors.push('Invalid recipient address');
  }

  // Amount validation
  const numAmount = parseFloat(amount);
  if (!amount || numAmount < 0) {
    errors.push('Amount must be greater than or equal to 0');
  }

  // Balance check
  if (balance && numAmount && toWei(amount) > balance) {
    errors.push('Insufficient balance');
  }

  return { valid: errors.length === 0, errors };
}

// Usage in forms
const { valid, errors } = validateTransactionInput(
  recipientAddress,
  '10.5',
  userBalance
);
if (!valid) {
  console.error('Validation errors:', errors);
}
```

## 6. Social Authentication

```ts
import { getSocialIcon } from 'panna-sdk';

// Create social login UI data
function createSocialLoginButtons(providers: SocialProvider[]) {
  return providers.map((provider) => ({
    provider,
    iconUrl: getSocialIcon(provider),
    label: `Continue with ${provider}`,
    onClick: () => {
      // Implementation would depend on your specific login logic
      console.log(`Login with ${provider}`);
    }
  }));
}

const socialButtons = createSocialLoginButtons([
  'google',
  'apple',
  'facebook',
  'discord'
]);

// Each button contains: provider, iconUrl, label, onClick
socialButtons.forEach((button) => {
  console.log(
    `<button><img src="${button.iconUrl}" />${button.label}</button>`
  );
});
```

## Next Steps

- Explore the [Wallet Module](./wallet.md) for user authentication and account management
- Check the [Transaction Module](./transaction.md) for sending tokens and smart contract interactions
- Review the [Client Module](./client.md) for SDK initialization and configuration
- Learn about [Onramp Module](./onramp.md) for fiat-to-crypto purchases
- Learn about [Chains Module](./chains.md) for network configuration
