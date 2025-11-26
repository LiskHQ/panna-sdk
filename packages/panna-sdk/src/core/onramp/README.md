# Onramp Module

The Onramp module enables fiat-to-crypto conversions through multiple payment providers. The module supports country-specific provider selection and offers comprehensive purchase flow management.

## What You'll Learn

In this guide, you will:

- Set up onramp functionality for multiple providers
- Handle the complete purchase flow from preparation to confirmation
- Add dynamic pricing and country-specific provider selection

## Table of Contents

- [Onramp Module](#onramp-module)
  - [What You'll Learn](#what-youll-learn)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Provider Selection](#provider-selection)
  - [Complete Purchase Flow](#complete-purchase-flow)
  - [Advanced Usage](#advanced-usage)
    - [Status Polling](#status-polling)
    - [Country Detection](#country-detection)
  - [Next Steps](#next-steps)

## Quick Start

Get onramp functionality working quickly:

```ts
import { onramp, NATIVE_TOKEN_ADDRESS } from 'panna-sdk';

// 1. Prepare purchase session
const session = await onramp.onRampPrepare({
  client,
  chainId: 1135, // Lisk mainnet
  tokenAddress: NATIVE_TOKEN_ADDRESS, // Native ETH
  receiver: userWalletAddress,
  amount: '100',
  onRampProvider: 'stripe',
  country: 'US'
});

// 2. Redirect user to payment
window.location.href = session.link;

// 3. After payment, check status
const status = await onramp.onRampStatus({
  id: session.id,
  client
});
console.log('Purchase status:', status.status); // COMPLETED | FAILED | PENDING
```

## Provider Selection

Select the optimal provider for your users' location:

```ts
// Supported providers (empty string indicates no provider available)
type OnrampProvider =
  | 'stripe'
  | 'coinbase'
  | 'transak'
  | 'moonpay'
  | 'thirdweb'
  | '';

// Example provider availability by country (would typically come from API)
const PROVIDER_AVAILABILITY: Record<string, OnrampProvider[]> = {
  US: ['coinbase', 'stripe', 'moonpay'],
  GB: ['stripe', 'transak', 'moonpay'],
  DE: ['stripe', 'transak']
  // Add more countries as needed
};

// Auto-select best provider based on availability
// Returns empty string if no providers available for the country
function getBestProvider(countryCode: string): OnrampProvider {
  const providers = PROVIDER_AVAILABILITY[countryCode];

  // If country not found in availability list, return empty string
  if (!providers || providers.length === 0) {
    return '';
  }

  // Priority: Stripe → Coinbase → Transak → Others
  const priority: OnrampProvider[] = [
    'stripe',
    'coinbase',
    'transak',
    'moonpay',
    'thirdweb'
  ];

  for (const preferred of priority) {
    if (providers.includes(preferred)) {
      return preferred;
    }
  }

  // Return first available provider from the list
  return providers[0];
}

// Example usage with proper error handling
const countryCode = 'FR'; // France - not in our PROVIDER_AVAILABILITY list
const provider = getBestProvider(countryCode);

if (provider === '') {
  // Handle case where no provider is available for this country
  console.error(`No onramp providers available for country: ${countryCode}`);
  // Show user a message: "Onramp service not available in your region"
} else {
  // Proceed with the selected provider
  console.log(`Using provider: ${provider}`);
}
```

## Complete Purchase Flow

Create a production-ready purchase flow with status tracking:

```ts
import { onramp, chain } from 'panna-sdk';
import type { client } from 'panna-sdk';

class PurchaseManager {
  constructor(private client: client.PannaClient) {}

  async buyTokens(
    amount: string,
    tokenAddress: string,
    userAddress: string,
    countryCode = 'US'
  ) {
    try {
      // 1. Select provider
      const provider = getBestProvider(countryCode);

      // 2. Prepare purchase
      const session = await onramp.onRampPrepare({
        client: this.client,
        chainId: chain.lisk.id,
        tokenAddress,
        receiver: userAddress,
        amount,
        onRampProvider: provider,
        country: countryCode,
        purchaseData: { userId: userAddress, timestamp: Date.now() }
      });

      // 3. Store session ID
      localStorage.setItem('onramp_session', session.id);

      // 4. Redirect to payment
      window.location.href = session.link;

      return { success: true, sessionId: session.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async checkStatus(sessionId?: string) {
    const id = sessionId || localStorage.getItem('onramp_session');
    if (!id) {
      throw new Error('No session ID found');
    }

    return onramp.onRampStatus({ id, client: this.client });
  }
}
```

## Advanced Usage

### Status Polling

Automatically monitor purchase completion:

```ts
import { onramp } from 'panna-sdk';

async function pollPurchaseStatus(sessionId: string): Promise<void> {
  const checkStatus = async () => {
    const status = await onramp.onRampStatus({ id: sessionId, client });

    console.log('Purchase status:', status.status);

    if (status.status === 'COMPLETED') {
      console.log('✅ Purchase successful!');
      console.log('Transactions:', status.transactions);
      return;
    }

    if (status.status === 'FAILED') {
      console.log('❌ Purchase failed');
      return;
    }

    // Continue polling if still pending
    setTimeout(checkStatus, 3000);
  };

  await checkStatus();
}
```

### Country Detection

Automatically detect user location for provider selection:

```ts
async function detectCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code || 'US';
  } catch {
    return 'US'; // Default fallback
  }
}

// Usage
const countryCode = await detectCountry();
const provider = getBestProvider(countryCode);
```

### Error Handling

#### Handling Onramp Errors

```ts
import { onramp } from 'panna-sdk/core';

async function buyTokensWithErrorHandling(
  client: PannaClient,
  userAddress: string,
  amount: string
) {
  try {
    const session = await onramp.onRampPrepare({
      client,
      chainId: 1135,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      receiver: userAddress,
      amount,
      onRampProvider: 'stripe',
      country: 'US'
    });

    return { success: true, session };
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Invalid country code')) {
        return { success: false, error: 'Country not supported' };
      }
      if (error.message.includes('provider')) {
        return { success: false, error: 'Payment provider unavailable' };
      }
    }
    return { success: false, error: 'Failed to create session' };
  }
}
```

#### Status Polling with Error Handling

```ts
import { onramp } from 'panna-sdk/core';

type PollResult =
  | { status: 'completed'; transactions: OnrampTransaction[] }
  | { status: 'failed'; error: string }
  | { status: 'timeout' };

async function pollUntilComplete(
  sessionId: string,
  client: PannaClient,
  maxAttempts = 60 // 3 minutes at 3-second intervals
): Promise<PollResult> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const result = await onramp.onRampStatus({ id: sessionId, client });

      if (result.status === 'COMPLETED') {
        return { status: 'completed', transactions: result.transactions };
      }

      if (result.status === 'FAILED') {
        return { status: 'failed', error: 'Payment failed' };
      }

      // Still pending, wait and retry
      await new Promise((resolve) => setTimeout(resolve, 3000));
      attempts++;
    } catch (error) {
      console.error('Status check failed:', error);
      attempts++;
    }
  }

  return { status: 'timeout' };
}
```

### Supported Countries

The SDK includes a comprehensive country-provider mapping. Use `getOnrampProviders()` to get available providers:

```ts
import { onramp } from 'panna-sdk/core';

// Get providers for a country
const providers = onramp.getOnrampProviders('US');
// Returns: ['transak', 'coinbase', 'stripe', 'onrampmoney']

const providersDE = onramp.getOnrampProviders('DE');
// Returns: ['transak', 'coinbase', 'stripe', 'onrampmoney']

// Invalid country throws error
try {
  onramp.getOnrampProviders('XX');
} catch (error) {
  console.error('Invalid country code');
}
```

## Next Steps

- Explore [Client Module](../client/README.md) for SDK initialization and configuration
- Explore [Wallet Module](../wallet/README.md) for user authentication and account setup
- Review [Transaction Module](../transaction/README.md) for handling purchased tokens
- Check [Util Module](../util/README.md) for balance tracking and fiat conversions
- Learn about [Chain Module](../chain/README.md) for multi-chain onramp support
