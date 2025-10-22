# Panna SDK Documentation

Panna SDK is a developer-first toolkit for building seamless, user-friendly decentralized applications. It combines essential Web3 infrastructure with pre-built UI components to help developers create apps that feel like Web2. With features like social login wallets (email, Google, phone number), gasless transactions, and fiat onramps, Panna eliminates the typical friction of blockchain onboarding—making Web3 invisible to users while giving developers full control.

---

## Table of Contents

- [Panna SDK Documentation](#panna-sdk-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
  - [Configuration Reference](#configuration-reference)
    - [PannaProvider Configuration](#pannaprovider-configuration)
    - [createPannaClient Configuration](#createpannaclient-configuration)
  - [Core Functionality](#core-functionality)
    - [Chain management](#chain-management)
      - [Key Functions](#key-functions)
    - [Client management](#client-management)
      - [Key Functions](#key-functions-1)
    - [Wallet management](#wallet-management)
      - [Key Functions](#key-functions-2)
  - [UI Components](#ui-components)
    - [Purpose](#purpose)
    - [Structure](#structure)
    - [Usage](#usage)
  - [Examples](#examples)
    - [Using a UI Component](#using-a-ui-component)
    - [Authenticating a User](#authenticating-a-user)
    - [Linking an account](#linking-an-account)
  - [Best Practices](#best-practices)
  - [FAQ](#faq)
  - [Support](#support)

---

## Overview

Panna is designed to make Web3 app development as smooth and intuitive as possible by offering:

- **Invisible Web3 for users**: abstract away wallets, gas fees, and onboarding complexity
- **Plug-and-play Web3 features**: social login, fiat onramps, and transaction handling
- **Composable React UI components**: rapidly build polished Web3-enabled interfaces

By streamlining both the developer experience and the user journey, Panna enables teams to ship modern, production-ready dApps—without the usual complexity of Web3 development.

---

## Getting Started

To get started with the Panna SDK, follow these steps:

1. **Install the SDK**:

   ```bash
   npm install panna-sdk
   ```

2. **Import the SDK in your project**:

   The SDK provides modular imports for optimal tree-shaking and bundle size:

   ```ts
   // Core functions (no React dependencies) - recommended for backend/Node.js
   import { client, transaction, wallet } from 'panna-sdk/core';
   // React components and hooks - recommended for React apps
   import { ConnectButton, usePanna } from 'panna-sdk/react';

   const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });
   ```

3. **Initialize the client**:

   ```ts
   import { client } from 'panna-sdk/core';

   const pannaClient = client.createPannaClient({
     clientId: process.env.CLIENT_ID || ''
   });
   ```

4. **Integrate UI components**:

   ```tsx
   import { PannaProvider, ConnectButton } from 'panna-sdk/react';

   function App() {
     return (
       <PannaProvider
         clientId={process.env.CLIENT_ID}
         partnerId={process.env.PARTNER_ID}
         chainId={process.env.CHAIN_ID}
       >
         <ConnectButton />
       </PannaProvider>
     );
   }
   ```

---

## Configuration Reference

This section provides a complete reference for all SDK configuration options.

### PannaProvider Configuration

The `PannaProvider` component accepts the following props:

| Property             | Type                                             | Required | Default             | Description                                                              |
| -------------------- | ------------------------------------------------ | -------- | ------------------- | ------------------------------------------------------------------------ |
| `children`           | `ReactNode`                                      | No       | -                   | Child components wrapped by the provider                                 |
| `clientId`           | `string`                                         | No       | -                   | Thirdweb client ID for client-side operations                            |
| `partnerId`          | `string`                                         | No       | `''`                | Partner ID for Lisk ecosystem wallet creation                            |
| `chainId`            | `string`                                         | No       | `'1135'` (Lisk)     | Chain ID to connect to (`'1135'` for Lisk mainnet, `'4202'` for testnet) |
| `queryClient`        | `QueryClient`                                    | No       | `new QueryClient()` | Custom React Query client for advanced cache configuration               |
| `autoConnectTimeout` | `number`                                         | No       | -                   | Timeout in milliseconds for automatic wallet reconnection                |
| `authToken`          | `string`                                         | No       | -                   | Authentication token for wallet event tracking API requests              |
| `errorFallback`      | `ReactNode \| ((error, errorInfo) => ReactNode)` | No       | Default error UI    | Custom error UI to display when errors occur                             |
| `onError`            | `(error: Error, errorInfo: ErrorInfo) => void`   | No       | -                   | Callback function invoked when errors are caught                         |

**Default QueryClient Configuration:**

- `staleTime`: 5 minutes (300000ms)
- `retry`: 3 attempts

---

### createPannaClient Configuration

The `createPannaClient` function accepts the following options:

#### Required Options

| Property   | Type     | Description                                                |
| ---------- | -------- | ---------------------------------------------------------- |
| `clientId` | `string` | Thirdweb client ID for client-side usage (browser, mobile) |

#### Advanced Options

| Property                                | Type          | Default                                    | Description                                          |
| --------------------------------------- | ------------- | ------------------------------------------ | ---------------------------------------------------- |
| `config.rpc.maxBatchSize`               | `number`      | `100`                                      | Maximum number of RPC requests to batch together     |
| `config.rpc.batchTimeoutMs`             | `number`      | `0` (no timeout)                           | Maximum time to wait before sending batched requests |
| `config.rpc.fetch.requestTimeoutMs`     | `number`      | `300000`                                   | Request timeout in milliseconds                      |
| `config.rpc.fetch.keepalive`            | `boolean`     | `false`                                    | Enable HTTP keepalive for connections                |
| `config.rpc.fetch.headers`              | `HeadersInit` | `{}`                                       | Custom HTTP headers for RPC requests                 |
| `config.storage.gatewayUrl`             | `string`      | `https://<clientId>.ipfscdn.io/ipfs/<cid>` | Custom IPFS gateway URL for storage                  |
| `config.storage.fetch.requestTimeoutMs` | `number`      | `600000`                                   | Storage request timeout in milliseconds              |

---

## Core Functionality

The core functionality of the Panna SDK is organized into several modules, each serving a specific purpose in interacting with the Lisk blockchain.

### Chain management

Chain management utilities enable handling the chain configurations for interacting with the blockchain.
It allows you to:

- Describe the chain configuration
- Get the chain information

#### Key Functions

- `describeChain`: Defines a chain with the given options.
- `getRpcUrlForChain`: Retrieves the RPC information for a given chain.
- `getChainInfo`: Retrieves the chain data for a given chain.

### Client management

Client management utilities help with creating and managing client information. A client is necessary for most SDK operations, as it manages the connection to the Lisk network.

#### Key Functions

- `createPannaClient`: Creates a Panna client using the provided client ID.

### Wallet management

Wallet management utilities provide tools for user authentication, allowing users to securely access and manage their accounts.

#### Key Functions

- `connect`: Authenticates a user with the various authentication methods.
- `createAccount`: Creates a new Lisk ecosystem account.
- `getEmail`: Retrieves a user's email address.
- `getPhoneNumber`: Retrieves a user's phone number.
- `linkAccount`: Connects a new profile to the current user.
- `unlinkAccount`: Disconnects an existing profile from the current user.

---

## UI Components

The SDK includes a set of React components and utilities for building user interfaces that interact with the Lisk blockchain.

### Purpose

The `src/react` directory contains all UI-related code, including:

- React components for Panna interactions (e.g., login, transaction, pay embed, etc)
- React hooks for blockchain operations
- Panna-specific hooks and context providers

### Structure

UI components are organized for reusability and maintainability:

- `/components`: Reusable UI elements (panna provider, login button, transaction button, pay embed, etc)
- `/hooks`: Custom React hooks for Panna interactions

### Usage

To use a UI component, import it from the SDK and include it in your React application. For example:

```tsx
// Import from react entry (recommended for tree-shaking)
import { ConnectButton } from 'panna-sdk/react';

function App() {
  return <ConnectButton />;
}
```

### Import Patterns

The SDK supports modular imports to optimize bundle size:

```tsx
// ✅ Core only (for Node.js, backend, or non-React frameworks)
import { client, transaction, wallet } from 'panna-sdk/core';
const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });
await transaction.sendTransaction({ account, transaction: tx });

// ✅ React only (for React apps)
import { ConnectButton, usePanna, useTokenBalances } from 'panna-sdk/react';

// ✅ Import from both entries
import { ConnectButton } from 'panna-sdk/react';
import { client } from 'panna-sdk/core';
const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });
const MyApp = () => <ConnectButton />;
```

**Recommended usage:**

- Use `panna-sdk/core` for backend code, CLI tools, or non-React frameworks
- Use `panna-sdk/react` in React applications

---

## Examples

### Using a UI Component

The connect button handles authentication automatically. However, builders can build custom login flows as needed, using the provided core functions.

```tsx
import { ConnectButton } from 'panna-sdk/react';

<ConnectButton />;
```

For creating a custom UI, you can use the provided core functions to manage Panna state and interactions.

### Authenticating a User

```ts
import { wallet } from 'panna-sdk/core';

const session = await wallet.connect({
  client: pannaClient,
  ecosystem: {
    id: wallet.EcosystemId.LISK,
    partnerId: 'your-partner-id'
  },
  strategy: wallet.LoginStrategy.EMAIL,
  email: 'user@email.com',
  verificationCode: '123456'
});
```

### Linking an account

```ts
import { wallet } from 'panna-sdk/core';

const result = await wallet.linkAccount({
  client: pannaClient,
  ecosystem: {
    id: wallet.EcosystemId.LISK,
    partnerId: 'your-partner-id'
  },
  strategy: wallet.LoginStrategy.PHONE,
  phoneNumber: '+1234567890',
  verificationCode: '123456'
});
```

### Using Core Functions in Backend

```ts
// Node.js backend example
import { client, transaction } from 'panna-sdk/core';

const walletClient = client.createPannaClient({
  clientId: process.env.CLIENT_ID
});

// Send a transaction
const result = await transaction.sendTransaction({
  client: walletClient,
  account,
  transaction: tx
});
```

---

## Best Practices

- Always validate user input before sending transactions.
- Use context providers to manage Panna state in your React app.
- Handle errors gracefully and provide user feedback.
- Keep your dependencies up to date for security and compatibility.

---

## FAQ

**Q: How do I connect to a Panna testnet or mainnet?**
A: Configure the client with the appropriate network endpoint when initializing.

**Q: Can I use the SDK in a Node.js backend?**
A: Yes! Import from `panna-sdk/core` to use core utilities without React dependencies. UI components are React-specific and should be imported from `panna-sdk/react`.

**Q: How do I add a new UI component?**
A: Add your component to the appropriate directory in `src/react/components` and export it from `src/react/index.ts`.

---

For more details, see the source code and inline documentation in each module.

---

## Support

To request partner details, please contact us at [support@lisk.com](mailto:support@lisk.com).
