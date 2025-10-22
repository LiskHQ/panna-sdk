# Panna SDK Core Module Documentation

The Panna SDK Core module provides powerful Web3 primitives for building blockchain applications. Built on industry-standard infrastructure, it offers a simplified API for wallet management, transaction handling, and blockchain interactions.

## Quick Start

```typescript
import { client, wallet } from 'panna-sdk/core';

// Initialize the SDK client
const pannaClient = client.createPannaClient({
  clientId: 'your-client-id'
});

// Create a user account
const account = wallet.createAccount({
  partnerId: 'your-partner-id'
});

// Authenticate the user
await wallet.connect({
  client: pannaClient,
  ecosystem: {
    id: 'ecosystem.lisk',
    partnerId: 'your-partner-id'
  },
  strategy: wallet.LoginStrategy.EMAIL,
  email: 'user@example.com',
  verificationCode: '123456'
});
```

## Core Modules

### Essential Modules (Start Here)

1. **[Client](./client/README.md)** - SDK initialization and configuration
   - Create and configure SDK clients
   - Manage API keys and authentication
   - Set up for client-side or server-side usage

2. **[Wallet](./wallet/README.md)** - User authentication and account management
   - Email/phone authentication
   - Social login providers
   - Account linking and profile management

3. **[Transaction](./transaction/README.md)** - Blockchain transaction handling
   - Send native tokens and ERC-20 tokens
   - Interact with smart contracts
   - Prepare and execute transactions

### Network & Infrastructure

4. **[Chain](./chain/README.md)** - Blockchain network configuration
   - Pre-configured Lisk networks
   - Custom chain configuration
   - Network metadata and RPC management

5. **[Onramp](./onramp/README.md)** - Fiat-to-crypto gateway
   - Buy crypto with credit cards
   - Multiple payment provider support
   - Country-specific provider availability

### Utilities & Helpers

6. **[Util](../util/README.md)** - Common utility functions
   - Balance queries and conversions
   - Address validation
   - Token metadata fetching
   - Activity tracking

## Installation

```bash
npm install panna-sdk
# or
yarn add panna-sdk
# or
pnpm add panna-sdk
```

## Basic Usage Pattern

The SDK follows a consistent pattern across all modules:

1. **Initialize the client** - Create a Panna client with your credentials
2. **Create or connect account** - Set up user authentication
3. **Perform operations** - Execute transactions, query data, etc.

```typescript
import { client, wallet, util, chain } from 'panna-sdk';

// 1. Initialize
const pannaClient = client.createPannaClient({
  clientId: 'your-client-id'
});

// 2. Setup account
const account = wallet.createAccount({
  partnerId: 'your-partner-id'
});

// 3. Perform operations
const balance = await util.accountBalance({
  client: pannaClient,
  chain: chain.lisk,
  address: account.address
});
```

## Common Use Cases

### Accepting Payments

```typescript
import { transaction, util, chain } from 'panna-sdk';

// Prepare payment receipt
const tx = transaction.prepareTransaction({
  client: pannaClient,
  chain: chain.lisk,
  to: merchantAddress,
  value: util.toWei('10') // 10 ETH
});

// User sends payment
const result = await transaction.sendTransaction({ account, transaction: tx });
```

### Token Transfers

```typescript
import { transaction, util, chain } from 'panna-sdk';

// ERC-20 token transfer
const tx = transaction.prepareContractCall({
  client: pannaClient,
  chain: chain.lisk,
  address: tokenAddress,
  method: 'function transfer(address to, uint256 amount)',
  params: [recipientAddress, util.toWei('100')] // 100 ERC-20 tokens with 18 decimals
});

const result = await transaction.sendTransaction({ account, transaction: tx });
```

### Multi-Chain Support

```typescript
// Use different chain
import { chain } from 'panna-sdk';

// Pre-configured chain
const mainnet = chain.lisk;
const testnet = chain.liskSepolia;

// Custom chain
const customChain = chain.describeChain({
  id: 1234,
  rpc: 'https://my-rpc.com',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
});
```

## Module Documentation

For detailed information about each module, see the individual documentation:

- [Client Module](./client/README.md) - SDK initialization
- [Wallet Module](./wallet/README.md) - Authentication & accounts
- [Transaction Module](./transaction/README.md) - Sending transactions
- [Chain Module](./chain/README.md) - Network configuration
- [Onramp Module](./onramp/README.md) - Fiat gateways
- [Util Module](./util/README.md) - Helper functions
