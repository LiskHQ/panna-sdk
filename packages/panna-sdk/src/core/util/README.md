# Util Module

The Util module provides essential blockchain utilities for balances, conversions, activity tracking, and data validation. The module includes helper functions for common operations and data processing.

## What You'll Learn

In this guide, you will:

- Query token balances and convert to fiat values
- Convert between wei and token amounts
- Track user transaction history and NFT collections
- Validate addresses and sanitize inputs
- Build common patterns like portfolio dashboards

## Table of Contents

- [Util Module](#util-module)
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
    - [Activity Fiat Values](#activity-fiat-values)
  - [4. NFT Collections](#4-nft-collections)
  - [5. Validation \& Input Handling](#5-validation--input-handling)
  - [6. Social Authentication](#6-social-authentication)
  - [Next Steps](#next-steps)

## Quick Start

```ts
import { util, chain } from 'panna-sdk';

// Essential operations
const balance = await util.accountBalance({
  client,
  chain: chain.lisk,
  address: userAddress
});
const amount = util.toWei('10.5'); // Convert to wei: 10500000000000000000n
const isValid = util.isValidAddress(recipientAddress); // Validate address

// Get user data
const activities = await util.getActivitiesByAddress({
  client,
  address: userAddress,
  currency: util.FiatCurrency.USD // Optional: include fiat values
});
const nfts = await util.getCollectiblesByAddress({
  client,
  address: userAddress
});
const fiatBalance = await util.accountBalanceInFiat({
  client,
  chain: chain.lisk,
  address: userAddress,
  currency: util.FiatCurrency.USD
});
```

## 1. Balance Operations

### Basic Balance Queries

```ts
import { util, chain } from 'panna-sdk';

// Native token balance (LSK)
const balance = await util.accountBalance({
  client,
  chain: chain.lisk,
  address: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e'
});

console.log({
  value: balance.value, // BigInt in wei
  displayValue: balance.displayValue, // "10.5"
  symbol: balance.symbol, // "LSK"
  decimals: balance.decimals // 18
});

// ERC-20 token balance
const usdtBalance = await util.accountBalance({
  client,
  chain: chain.lisk,
  address: userAddress,
  tokenAddress: '0x1234567890123456789012345678901234567890'
});
```

### Multiple Token Balances

```ts
import { util, chain } from 'panna-sdk';

// Query multiple tokens efficiently
async function getPortfolioBalances(address: string, tokens: string[]) {
  const balances = await Promise.all(
    tokens.map((tokenAddress) =>
      util.accountBalance({
        client,
        chain: chain.lisk,
        address,
        tokenAddress
      })
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
import { util, chain } from 'panna-sdk';

// Single token balance with fiat value
const balanceWithFiat = await util.accountBalanceInFiat({
  client,
  chain: chain.lisk,
  address: userAddress,
  currency: util.FiatCurrency.USD
});

console.log(
  `${balanceWithFiat.displayValue} ${balanceWithFiat.symbol} = $${balanceWithFiat.fiatValue}`
);
// "10.5 LSK = $13.12"

// Complete portfolio with fiat values
const portfolio = await util.accountBalancesInFiat({
  client,
  chain: chain.lisk,
  address: userAddress,
  currency: util.FiatCurrency.USD
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
import { util, transaction, chain } from 'panna-sdk';

// Convert token amounts to wei (18 decimals)
const examples = {
  whole: util.toWei('10'), // 10000000000000000000n
  decimal: util.toWei('10.5'), // 10500000000000000000n
  small: util.toWei('0.001') // 1000000000000000n
};

// Use in transactions
const tx = transaction.prepareTransaction({
  client,
  chain: chain.lisk,
  to: recipientAddress,
  value: util.toWei('1.5') // Send 1.5 tokens
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
import { util } from 'panna-sdk';

// Get user's transaction history
const activities = await util.getActivitiesByAddress({
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

### Activity Fiat Values

Activities can include fiat values for token amounts when prices are available. Use the `currency` parameter to specify any of the 46 supported fiat currencies (defaults to FiatCurrency.USD). The `fiatValue` property is optional and only present when token prices exist for the given token.

**Supported Currencies (46 total):** AED, ARS, AUD, BOB, BRL, BWP, CAD, CDF, CLP, COP, CRC, EGP, EUR, GBP, GHS, GTQ, IDR, INR, JPY, KES, KRW, LKR, MWK, MXN, MYR, NGN, NZD, PEN, PHP, PLN, PYG, RWF, SGD, THB, TRY, TWD, TZS, UGX, USD, UYU, VES, VND, XAF, XOF, ZAR, ZMW

```ts
import { util } from 'panna-sdk';

// Fetch activities with fiat values
const activities = await util.getActivitiesByAddress({
  client,
  address: userAddress,
  currency: util.FiatCurrency.USD // Optional: any of 46 supported currencies (default: FiatCurrency.USD)
});

// Access fiat values (available for ETH, ERC-20, and ERC-1155 tokens)
activities.activities.forEach((activity) => {
  if ('fiatValue' in activity.amount) {
    const { amount, currency } = activity.amount.fiatValue;
    console.log(
      `Token value: ${activity.amount.value} = ${amount} ${currency}`
    );
  }
});
```

**Note:** USDC.e tokens are automatically mapped to USDC prices for fiat value calculation.

## 4. NFT Collections

```ts
import { util } from 'panna-sdk';

// Get user's NFT collection
const result = await util.getCollectiblesByAddress({
  client,
  address: userAddress
});

// Group NFTs by collection (using token address as unique identifier)
const groupedNFTs = result.collectibles.reduce(
  (groups, nft) => {
    const collectionKey = nft.token.address;
    if (!groups[collectionKey]) groups[collectionKey] = [];
    groups[collectionKey].push(nft);
    return groups;
  },
  {} as Record<string, typeof result.collectibles>
);

// Display collection summary
Object.entries(groupedNFTs).forEach(([collectionAddress, nfts]) => {
  const collectionName = nfts[0]?.token.name || 'Unknown';
  console.log(`${collectionName}: ${nfts.length} NFTs`);
});
```

## 5. Validation & Input Handling

```ts
import { util } from 'panna-sdk';

// Address validation
const address = '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e';
const isValid = util.isValidAddress(address);

// Form validation helper
function validateTransactionInput(
  recipient: string,
  amount: string,
  balance?: bigint
) {
  const errors: string[] = [];

  // Address validation
  if (!recipient || !util.isValidAddress(recipient.trim())) {
    errors.push('Invalid recipient address');
  }

  // Amount validation
  const numAmount = parseFloat(amount);
  if (!amount || numAmount < 0) {
    errors.push('Amount must be greater than or equal to 0');
  }

  // Balance check
  if (balance && numAmount && util.toWei(amount) > balance) {
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
import { util } from 'panna-sdk';

// Create social login UI data
function createSocialLoginButtons(providers: SocialProvider[]) {
  return providers.map((provider) => ({
    provider,
    iconUrl: util.getSocialIcon(provider),
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

- Explore the [Wallet Module](../wallet/README.md) for user authentication and account management
- Check the [Transaction Module](../transaction/README.md) for sending tokens and smart contract interactions
- Review the [Client Module](../client/README.md) for SDK initialization and configuration
- Learn about [Onramp Module](../onramp/README.md) for fiat-to-crypto purchases
- Learn about [Chain Module](../chain/README.md) for network configuration
