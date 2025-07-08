# Panna SDK Documentation

Panna SDK is a developer-first toolkit for building seamless, user-friendly decentralized applications. It combines essential Web3 infrastructure with pre-built UI components to help developers create apps that feel like Web2. With features like social login wallets (email, Google, phone number), gasless transactions, and fiat onramps, Panna eliminates the typical friction of blockchain onboarding—making Web3 invisible to users while giving developers full control.

---

## Table of Contents

- [Panna SDK Documentation](#panna-sdk-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
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

   ```ts
   import { createPannaClient } from 'panna-sdk';
   ```

3. **Initialize the client**:

   ```ts
   const client = createPannaClient({
     partnerId: process.env.PARTNER_ID || ''
   });
   ```

4. **Integrate UI components**:

   ```tsx
   import { PannaProvider, LoginButton } from 'panna-sdk';

   function App() {
     return (
       <PannaProvider clientId={process.env.CLIENT_ID}>
         <LoginButton label="Sign in with Panna" />
       </PannaProvider>
     );
   }
   ```

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
import { LoginButton } from 'panna-sdk';

function App() {
  return <LoginButton />;
}
```

---

## Examples

### Using a UI Component

The login button uses the sign in strategy chosen by the builder to handle authentication automatically. However, builders can build custom login pannas as needed, using the provided core functions.

```tsx
import { LoginButton } from 'panna-sdk';

<LoginButton label="Sign in with Panna" />;
```

For creating a custom UI, you can use the provided core functions to manage Panna state and interactions.

### Authenticating a User

```ts
import { login } from 'panna-sdk';

const session = await login({
  strategy: 'email',
  email: 'user@email.com',
  verificationCode: '123456'
});
```

### Linking an account

```ts
import { linkAccount } from 'panna-sdk';

const result = await linkAccount({
  strategy: 'phone',
  phoneNumber: '+1234567890',
  verificationCode: '123456'
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
A: Yes, core utilities are platform-agnostic, but UI components are React-specific.

**Q: How do I add a new UI component?**
A: Add your component to the appropriate directory in `src/ui/components` and export it from `src/ui/index.ts`.

---

For more details, see the source code and inline documentation in each module.

---

## Support

To request partner details, please contact us at [support@lisk.com](mailto:support@lisk.com).
