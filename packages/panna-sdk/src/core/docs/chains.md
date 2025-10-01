# Chains Module

The Chains module provides blockchain network configuration and management. The module includes pre-configured Lisk networks and utilities for custom chain configuration.

## What You'll Learn

In this guide, you will:

- Learn how to use pre-configured Lisk networks
- Create custom chain configurations
- Manage RPC endpoints and metadata

## Table of Contents

- [Chains Module](#chains-module)
  - [What You'll Learn](#what-youll-learn)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Pre-configured Chains](#pre-configured-chains)
    - [Lisk Mainnet](#lisk-mainnet)
    - [Lisk Sepolia Testnet](#lisk-sepolia-testnet)
  - [Custom Chains](#custom-chains)
    - [Basic Configuration](#basic-configuration)
    - [Development Chains](#development-chains)
  - [Chain Metadata](#chain-metadata)
    - [Get Chain Information](#get-chain-information)
  - [RPC Management](#rpc-management)
    - [Get RPC URLs](#get-rpc-urls)
    - [Custom RPC Configuration](#custom-rpc-configuration)
  - [Environment Configuration](#environment-configuration)
    - [Chain Selection by Environment](#chain-selection-by-environment)
    - [Multi-Chain Support](#multi-chain-support)
  - [Next Steps](#next-steps)

## Quick Start

```ts
import { lisk, liskSepolia, describeChain } from 'panna-sdk';

// Use pre-configured networks
const mainnet = lisk; // Chain ID: 1135
const testnet = liskSepolia; // Chain ID: 4202

// Create custom chain
const customChain = describeChain({
  id: 12345,
  rpc: 'https://my-custom-rpc.com',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
});
```

## Pre-configured Chains

### Lisk Mainnet

Production network for applications deployed on Lisk.

```ts
import { lisk, prepareTransaction, toWei } from 'panna-sdk';

// Chain properties
console.log({
  id: lisk.id, // 1135
  name: lisk.name, // "Lisk"
  nativeCurrency: lisk.nativeCurrency, // ETH token
  blockExplorers: lisk.blockExplorers
});

// Use in transactions (requires client setup)
const transaction = prepareTransaction({
  client,
  chain: lisk,
  to: recipientAddress,
  value: toWei('1')
});
```

### Lisk Sepolia Testnet

Development and testing network with free test tokens.

```ts
import { liskSepolia, prepareTransaction, toWei } from 'panna-sdk';

// Use testnet for development (requires client setup)
const transaction = prepareTransaction({
  client,
  chain: liskSepolia,
  to: testAddress,
  value: toWei('10')
});

// Get test tokens from faucet - Lisk Sepolia is a testnet
console.log('Get test LSK from: https://sepolia-faucet.lisk.com');
```

## Custom Chains

### Basic Configuration

```ts
import { describeChain } from 'panna-sdk';

// Minimal configuration
const simpleChain = describeChain(12345);

// Full configuration
const customChain = describeChain({
  id: 12345,
  name: 'My Custom Chain',
  rpc: 'https://rpc.mychain.com',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorers: {
    default: {
      name: 'MyExplorer',
      url: 'https://explorer.mychain.com'
    }
  }
});
```

### Development Chains

```ts
// Local development
const localChain = describeChain({
  id: 31337,
  name: 'Local Development',
  rpc: 'http://localhost:8545',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
});

// Forked chain for testing
const forkedLisk = describeChain({
  ...lisk,
  rpc: 'http://localhost:8545' // Local fork
});
```

## Chain Metadata

### Get Chain Information

```ts
import { getChainInfo } from 'panna-sdk';

// Fetch detailed metadata
const metadata = await getChainInfo(lisk);
console.log({
  name: metadata.name,
  chainId: metadata.chainId,
  nativeCurrency: metadata.nativeCurrency,
  explorers: metadata.explorers,
  icon: metadata.icon // For UI display
});
```

## RPC Management

### Get RPC URLs

```ts
import { getRPCUrlForChain } from 'panna-sdk';

// Get configured RPC endpoint
const rpcUrl = getRPCUrlForChain(lisk);
console.log('RPC endpoint:', rpcUrl);
```

### Custom RPC Configuration

```ts
// Override default RPC
const customRpcChain = describeChain({
  ...lisk,
  rpc: 'https://my-custom-lisk-rpc.com'
});

// Environment-based RPC
const envChain = describeChain({
  id: 1135,
  rpc: process.env.CUSTOM_RPC || 'https://fallback-rpc.com'
});
```

## Environment Configuration

### Chain Selection by Environment

```ts
// Select chain based on environment
const getChain = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return lisk;
    case 'development':
    case 'test':
      return liskSepolia;
    default:
      return liskSepolia;
  }
};

const activeChain = getChain();
```

### Multi-Chain Support

```ts
// Support multiple networks
const SUPPORTED_CHAINS = {
  mainnet: lisk,
  testnet: liskSepolia,
  local: describeChain(31337)
} as const;

// Chain switcher
function selectChain(network: keyof typeof SUPPORTED_CHAINS) {
  return SUPPORTED_CHAINS[network];
}

const currentChain = selectChain('mainnet');
```

## Next Steps

- Learn about [Transaction Module](./transaction.md) for sending transactions on configured chains
- Explore [Client Module](./client.md) for SDK initialization with custom RPC endpoints
- Review [Wallet Module](./wallet.md) for user authentication across multiple networks
- Check [Onramp Module](./onramp.md) for fiat-to-crypto purchases
- Check [Utils Module](./utils.md) for chain-related utility functions
