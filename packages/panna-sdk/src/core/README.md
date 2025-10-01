# Panna SDK Core Module Documentation

The Panna SDK Core module provides powerful Web3 primitives for building blockchain applications. Built on industry-standard infrastructure, it offers a simplified API for wallet management, transaction handling, and blockchain interactions.

## Quick Start

```typescript
import { createPannaClient, createAccount, login } from 'panna-sdk';

// Initialize the SDK client
const client = createPannaClient({
  clientId: 'your-client-id'
});

// Create a user account
const account = createAccount({
  partnerId: 'your-partner-id'
});

// Authenticate the user
await login({
  client,
  ecosystem: {
    id: 'ecosystem.lisk',
    partnerId: 'your-partner-id'
  },
  strategy: 'email',
  email: 'user@example.com',
  verificationCode: '123456'
});
```

## Core Modules

### Essential Modules (Start Here)

1. **[Client](./docs/client.md)** - SDK initialization and configuration
   - Create and configure SDK clients
   - Manage API keys and authentication
   - Set up for client-side or server-side usage

2. **[Wallet](./docs/wallet.md)** - User authentication and account management
   - Email/phone authentication
   - Social login providers
   - Account linking and profile management

3. **[Transaction](./docs/transaction.md)** - Blockchain transaction handling
   - Send native tokens and ERC-20 tokens
   - Interact with smart contracts
   - Prepare and execute transactions

### Network & Infrastructure

4. **[Chains](./docs/chains.md)** - Blockchain network configuration
   - Pre-configured Lisk networks
   - Custom chain configuration
   - Network metadata and RPC management

5. **[Onramp](./docs/onramp.md)** - Fiat-to-crypto gateway
   - Buy crypto with credit cards
   - Multiple payment provider support
   - Country-specific provider availability

### Utilities & Helpers

6. **[Utils](./docs/utils.md)** - Common utility functions
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
// 1. Initialize
const client = createPannaClient({
  clientId: 'your-client-id'
});

// 2. Setup account
const account = createAccount({
  partnerId: 'your-partner-id'
});

// 3. Perform operations
const balance = await accountBalance({
  client,
  chain: lisk,
  address: account.address
});
```

## Common Use Cases

### Accepting Payments

```typescript
// Prepare payment receipt
const transaction = prepareTransaction({
  client,
  chain: lisk,
  to: merchantAddress,
  value: toWei('10') // 10 ETH
});

// User sends payment
const result = await sendTransaction({
  account: userAccount,
  transaction
});
```

### Token Transfers

```typescript
// ERC-20 token transfer
const transaction = prepareContractCall({
  client,
  chain: lisk,
  address: tokenAddress,
  method: 'function transfer(address to, uint256 amount)',
  params: [recipientAddress, toWei('100')] // 100 ERC-20 tokens with 18 decimals
});

const result = await sendTransaction({ account, transaction });
```

### Multi-Chain Support

```typescript
// Use different chains
import { lisk, liskSepolia, describeChain } from 'panna-sdk';

// Pre-configured chains
const mainnet = lisk;
const testnet = liskSepolia;

// Custom chain
const customChain = describeChain({
  id: 1234,
  rpc: 'https://my-rpc.com',
  nativeCurrency: {
    name: 'Custom Token',
    symbol: 'CTK',
    decimals: 18
  }
});
```

## Module Documentation

For detailed information about each module, see the individual documentation:

- [Client Module](./docs/client.md) - SDK initialization
- [Wallet Module](./docs/wallet.md) - Authentication & accounts
- [Transaction Module](./docs/transaction.md) - Sending transactions
- [Chains Module](./docs/chains.md) - Network configuration
- [Onramp Module](./docs/onramp.md) - Fiat gateways
- [Utils Module](./docs/utils.md) - Helper functions
