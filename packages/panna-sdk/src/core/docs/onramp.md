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
import { onRampPrepare, onRampStatus } from 'panna-sdk';

// 1. Prepare purchase session
const session = await onRampPrepare({
  client,
  chainId: 1135, // Lisk mainnet
  tokenAddress: '0x0000000000000000000000000000000000000000', // Native ETH
  receiver: userWalletAddress,
  amount: '100',
  onRampProvider: 'stripe',
  country: 'US'
});

// 2. Redirect user to payment
window.location.href = session.link;

// 3. After payment, check status
const status = await onRampStatus({
  id: session.id,
  client
});
console.log('Purchase status:', status.status); // COMPLETED | FAILED | PENDING
```

## Provider Selection

Select the optimal provider for your users' location:

```ts
// Supported providers
type OnrampProvider =
  | 'stripe'
  | 'coinbase'
  | 'transak'
  | 'moonpay'
  | 'thirdweb';

// Example provider availability by country (would typically come from API)
const PROVIDER_AVAILABILITY: Record<string, OnrampProvider[]> = {
  US: ['coinbase', 'stripe', 'moonpay'],
  GB: ['stripe', 'transak', 'moonpay'],
  DE: ['stripe', 'transak']
  // Add more countries as needed
};

// Auto-select best provider based on availability
function getBestProvider(countryCode: string): OnrampProvider {
  const providers = PROVIDER_AVAILABILITY[countryCode] || ['stripe'];

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

  return providers[0] || 'stripe';
}
```

## Complete Purchase Flow

Create a production-ready purchase flow with status tracking:

```ts
class PurchaseManager {
  constructor(private client: PannaClient) {}

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
      const session = await onRampPrepare({
        client: this.client,
        chainId: lisk.id,
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

    return onRampStatus({ id, client: this.client });
  }
}
```

## Advanced Usage

### Status Polling

Automatically monitor purchase completion:

```ts
async function pollPurchaseStatus(sessionId: string): Promise<void> {
  const checkStatus = async () => {
    const status = await onRampStatus({ id: sessionId, client });

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

## Next Steps

- Explore [Client Module](./client.md) for SDK initialization and configuration
- Explore [Wallet Module](./wallet.md) for user authentication and account setup
- Review [Transaction Module](./transaction.md) for handling purchased tokens
- Check [Utils Module](./utils.md) for balance tracking and fiat conversions
- Learn about [Chains Module](./chains.md) for multi-chain onramp support
