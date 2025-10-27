# Client Module

The Client module is the foundation of the Panna SDK. The module provides the core client instance required by all other modules and handles SDK initialization and configuration.

## What You'll Learn

In this guide, you will:

- Learn how to initialize the SDK for client-side environments
- Understand essential configuration patterns for different use cases

## Table of Contents

- [Client Module](#client-module)
  - [What You'll Learn](#what-youll-learn)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
    - [Client-Side (Browser/Mobile)](#client-side-browsermobile)
  - [Step-by-Step Setup](#step-by-step-setup)
    - [Step 1: Environment Variables](#step-1-environment-variables)
      - [Next.js API Route](#nextjs-api-route)
  - [Configuration Options](#configuration-options)
    - [Custom RPC Endpoints](#custom-rpc-endpoints)
    - [Environment-Based Setup](#environment-based-setup)
  - [Ecosystem Configuration](#ecosystem-configuration)
  - [Common Use Cases](#common-use-cases)
    - [Basic Wallet Operations](#basic-wallet-operations)
    - [Reusable Client Pattern](#reusable-client-pattern)
  - [Next Steps](#next-steps)

## Quick Start

Choose your environment and follow the appropriate setup:

### Client-Side (Browser/Mobile)

```ts
import { client, util, chain } from 'panna-sdk';

// Initialize with public client ID
const pannaClient = client.createPannaClient({
  clientId: 'your-client-id'
});

// Use client in SDK operations
const balance = await util.accountBalance({
  client: pannaClient,
  chain: chain.lisk,
  address: '0x...'
});
```

## Step-by-Step Setup

### Step 1: Environment Variables

First, set up your environment variables:

````bash
# Client-side (Next.js example)
NEXT_PUBLIC_PANNA_CLIENT_ID=pk_live_abc123...

### Step 2: Basic Initialization

```ts
import { client } from 'panna-sdk';

const pannaClient = client.createPannaClient({
  clientId: process.env.NEXT_PUBLIC_PANNA_CLIENT_ID
});

### Step 3: Framework Integration

#### React Example

```ts
// contexts/PannaContext.tsx
import { createContext, useContext } from 'react';
import { client, type client as ClientTypes } from 'panna-sdk';

const pannaClient = client.createPannaClient({
  clientId: process.env.NEXT_PUBLIC_PANNA_CLIENT_ID!
});

const PannaContext = createContext<ClientTypes.PannaClient>(pannaClient);

export function PannaProvider({ children }) {
  return (
    <PannaContext.Provider value={pannaClient}>
      {children}
    </PannaContext.Provider>
  );
}

export const usePannaClient = () => useContext(PannaContext);
````

#### Next.js API Route

```ts
// app/api/wallet/route.ts
import { client, util, chain } from 'panna-sdk';

const pannaClient = client.createPannaClient({
  clientId: process.env.NEXT_PUBLIC_PANNA_CLIENT_ID!
});

export async function POST(request: Request) {
  // Use client for operations
  const data = await request.json();

  const balance = await util.accountBalance({
    client: pannaClient,
    chain: chain.lisk,
    address: data.address
  });

  return Response.json({ balance });
}
```

## Configuration Options

### Custom RPC Endpoints

```ts
import { client } from 'panna-sdk';

const pannaClient = client.createPannaClient({
  clientId: 'your-client-id',
  config: {
    rpc: {
      1135: 'https://rpc.lisk.network', // Lisk Mainnet
      4202: 'https://rpc.sepolia.lisk.network' // Lisk Sepolia
    }
  }
});
```

### Environment-Based Setup

```ts
import { client } from 'panna-sdk';

// Use environment variables for configuration
const pannaClient = client.createPannaClient({
  clientId: process.env.NEXT_PUBLIC_PANNA_CLIENT_ID!
});
```

## Ecosystem Configuration

When using authentication features, configure the ecosystem:

```ts
import { wallet } from 'panna-sdk';

const ecosystem: wallet.EcosystemConfig = {
  id: wallet.EcosystemId.LISK,
  partnerId: 'your-partner-id'
};

// Use in authentication
await wallet.connect({
  client: pannaClient,
  ecosystem,
  strategy: wallet.LoginStrategy.EMAIL,
  email: 'user@example.com',
  verificationCode: '123456'
});
```

## Common Use Cases

### Basic Wallet Operations

```ts
import { client, util, chain } from 'panna-sdk';

const pannaClient = client.createPannaClient({
  clientId: 'your-client-id'
});

// Get balance
const balance = await util.accountBalance({
  client: pannaClient,
  chain: chain.lisk,
  address: '0x...'
});
```

### Reusable Client Pattern

```ts
// services/panna.ts
import { client, type client as ClientTypes } from 'panna-sdk';

let pannaClient: ClientTypes.PannaClient | null = null;

export function getClient(): ClientTypes.PannaClient {
  if (!pannaClient) {
    pannaClient = client.createPannaClient({
      clientId: process.env.NEXT_PUBLIC_PANNA_CLIENT_ID!
    });
  }
  return pannaClient;
}

// Use throughout your app
const myClient = getClient();
```

## Next Steps

Now that you have a configured client, explore these SDK modules:

- [Wallet Module](../wallet/README.md) - User authentication and account management
- [Transaction Module](../transaction/README.md) - Send and prepare blockchain transactions
- [Chain Module](../chain/README.md) - Configure supported blockchain networks
- [Onramp Module](../onramp/README.md) - Integrate fiat-to-crypto payments
- [Util Module](../util/README.md) - Helper functions for common operations
- [Extensions Module](../extensions/README.md) - External wallet integration
