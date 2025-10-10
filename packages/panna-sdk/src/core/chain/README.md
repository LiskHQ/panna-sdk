# Chain Module

The Chain module provides blockchain network configuration and management. The module includes pre-configured Lisk networks and utilities for custom chain configuration.

## What You'll Learn

In this guide, you will:

- Learn how to use pre-configured Lisk networks
- Create custom chain configurations
- Manage RPC endpoints and metadata

## Table of Contents

- [Chain Module](#chain-module)
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
import { chain } from 'panna-sdk';

// Use pre-configured networks
const mainnet = chain.lisk; // Chain ID: 1135
const testnet = chain.liskSepolia; // Chain ID: 4202

// Create custom chain
const customChain = chain.describeChain({
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
import { chain, transaction, util } from 'panna-sdk';

// Chain properties
console.log({
  id: chain.lisk.id, // 1135
  name: chain.lisk.name, // "Lisk"
  nativeCurrency: chain.lisk.nativeCurrency, // ETH token
  blockExplorers: chain.lisk.blockExplorers
});

// Use in transactions (requires client setup)
const tx = transaction.prepareTransaction({
  client,
  chain: chain.lisk,
  to: recipientAddress,
  value: util.toWei('1')
});
```

### Lisk Sepolia Testnet

Development and testing network with free test tokens.

```ts
import { chain, transaction, util } from 'panna-sdk';

// Use testnet for development (requires client setup)
const tx = transaction.prepareTransaction({
  client,
  chain: chain.liskSepolia,
  to: testAddress,
  value: util.toWei('10')
});

// Get test tokens from faucet - Lisk Sepolia is a testnet
console.log('Get test LSK from: https://sepolia-faucet.lisk.com');
```

## Custom Chains

### Basic Configuration

```ts
import { chain } from 'panna-sdk';

// Minimal configuration
const simpleChain = chain.describeChain(12345);

// Full configuration
const customChain = chain.describeChain({
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
import { chain } from 'panna-sdk';

// Local development
const localChain = chain.describeChain({
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
const forkedLisk = chain.describeChain({
  ...chain.lisk,
  rpc: 'http://localhost:8545' // Local fork
});
```

## Chain Metadata

### Get Chain Information

```ts
import { chain } from 'panna-sdk';

// Fetch detailed metadata
const metadata = await chain.getChainInfo(chain.lisk);
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
import { chain } from 'panna-sdk';

// Get configured RPC endpoint
const rpcUrl = chain.getRPCUrlForChain(chain.lisk);
console.log('RPC endpoint:', rpcUrl);
```

### Custom RPC Configuration

```ts
import { chain } from 'panna-sdk';

// Override default RPC
const customRpcChain = chain.describeChain({
  ...chain.lisk,
  rpc: 'https://my-custom-lisk-rpc.com'
});

// Environment-based RPC
const envChain = chain.describeChain({
  id: 1135,
  rpc: process.env.CUSTOM_RPC || 'https://fallback-rpc.com'
});
```

## Environment Configuration

### Chain Selection by Environment

```ts
import { chain } from 'panna-sdk';

// Select chain based on environment
const getChain = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return chain.lisk;
    case 'development':
    case 'test':
      return chain.liskSepolia;
    default:
      return chain.liskSepolia;
  }
};

const activeChain = getChain();
```

### Multi-Chain Support

```ts
import { chain } from 'panna-sdk';

// Support multiple networks
const SUPPORTED_CHAINS = {
  mainnet: chain.lisk,
  testnet: chain.liskSepolia,
  local: chain.describeChain(31337)
} as const;

// Chain switcher
function selectChain(network: keyof typeof SUPPORTED_CHAINS) {
  return SUPPORTED_CHAINS[network];
}

const currentChain = selectChain('mainnet');
```

## Next Steps

- Learn about [Transaction Module](../transaction/README.md) for sending transactions on configured chain
- Explore [Client Module](../client/README.md) for SDK initialization with custom RPC endpoints
- Review [Wallet Module](../wallet/README.md) for user authentication across multiple networks
- Check [Onramp Module](../onramp/README.md) for fiat-to-crypto purchases
- Check [Util Module](../util/README.md) for chain-related utility functions
