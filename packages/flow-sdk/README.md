# Flow SDK Documentation

The Lisk Flow SDK is a comprehensive toolkit for interacting with the Lisk blockchain, providing both core blockchain utilities and a set of user interface (UI) components for seamless integration into web applications. This documentation covers the SDK's concepts, core modules, and usage examples to help you get started quickly and effectively.

---

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Core Functionality](#core-functionality)
  - [Chain management](#chain-management)
  - [Client management](#client-management)
  - [Wallet management](#wallet-management)
- [UI Components](#ui-components)
  - [Purpose](#purpose)
  - [Structure](#structure)
  - [Usage](#usage)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [FAQ](#faq)

---

## Overview

The Lisk Flow SDK is designed to simplify development on the Lisk blockchain by providing:

- A robust client for interacting with the blockchain (querying, sending transactions, etc.)
- Authentication and user management utilities
- A set of reusable React UI components for building blockchain-enabled interfaces

---

## Core Concepts

### Lisk Blockchain

Lisk is a fast, decentralized, and developer-friendly blockchain designed for consumer applications, games, and digital assets. The SDK abstracts many of the complexities of interacting with Lisk, making it easier to build secure and scalable dApps.

### Chain management

The SDK provides a client abstraction that manages communication with the Lisk blockchain, including storing and retrieving chain information.

### Client management

The client is the primary interface for interacting with the Lisk blockchain. It handles RPC calls and manages connections.

### Wallet management

Carrying out transactions and interacting on Flow involves signing and accessing user information. Authentication is essential for signing transactions and verifying user identity. The SDK includes utilities for creating authenticated sessions, managing cryptographic keys, wallet information and linking/unlinking profiles.

---

## Core Functionality

The core functionality of the Flow SDK is organized into several modules, each serving a specific purpose in interacting with the Lisk blockchain.

### Chain management

Chain management utilities enable handling the chain configurations for interacting with the blockchain.
It allows you to:

- Describe the chain configuration
- Get the chain information

#### Key Functions

- `describeChain`: Defines a chain with the given options.
- `getRpcUrlForChain`: Retrieves the RPC information for a given chain.
- `getChainInfo`: Retrieves the chain data for a given data.

### Client management

Client management utilities help with creating and managing client information. A client is necessary for most SDK operations, as it manages the connection to the Lisk network.

#### Key Functions

- `createFlowClient`: Creates a Flow client using the provided ID or secret key.

### Wallet management

Wallet management utilities provide tools for user authentication, allowing users to securely access and manage their accounts.

#### Key Functions

- `login`: Authenticates a user with the various authentication methods.
- `createAccount`: Creates a new Lisk ecosystem account.
- `getEmail`: Retrieves a user's email address.
- `getPhoneNumber`: Retrieves a user's phone number.
- `linkAccount`: Connects a new profile to the current user.
- `unlinkAccount`: Disconnects an existing profile from the current user.

---

## UI Components

The SDK includes a set of React components and utilities for building user interfaces that interact with the Lisk blockchain.

### Purpose

The `src/ui` directory contains all UI-related code, including:

- React components for Flow interactions (e.g., login, transaction, pay embed, etc)
- React hooks for blockchain operations
- Flow-specific hooks and context providers

### Structure

UI components are organized for reusability and maintainability:

- `/components`: Reusable UI elements (login button, transaction button, pay embed, etc)
- `/hooks`: Custom React hooks for Flow interactions
- `/context`: React context providers for Flow state

### Usage

To use a UI component, import it from the SDK and include it in your React application. For example:

```tsx
import { LoginButton, createAccount, EcosystemId } from 'flow-sdk';

function App() {
  const wallets = [
    createAccount(EcosystemId.LISK, process.env.NEXT_PUBLIC_PARTNER_ID || '')
  ];

  return <LoginButton wallets={wallets} />;
}
```

---

## Examples

### Authenticating a User

```ts
import { authenticate } from 'flow-sdk';

const session = await authenticate({
  strategy: 'email',
  email: 'user@email.com',
  verificationCode: '123456'
});
```

### Linking an account

```ts
import { linkAccount } from 'flow-sdk';

const result = await linkAccount({
  strategy: 'phone',
  phoneNumber: '+1234567890',
  verificationCode: '123456'
});
```

### Using a UI Component

```tsx
import { LoginButton } from 'flow-sdk';

<LoginButton label="Sign in with Flow" />;
```

---

## Best Practices

- Always validate user input before sending transactions.
- Use context providers to manage Flow state in your React app.
- Handle errors gracefully and provide user feedback.
- Keep your dependencies up to date for security and compatibility.

---

## FAQ

**Q: How do I connect to a Flow testnet or mainnet?**
A: Configure the client with the appropriate network endpoint when initializing.

**Q: Can I use the SDK in a Node.js backend?**
A: Yes, core utilities are platform-agnostic, but UI components are React-specific.

**Q: How do I add a new UI component?**
A: Add your component to the appropriate directory in `src/ui/components` and export it from `src/ui/index.ts`.

---

For more details, see the source code and inline documentation in each module.
