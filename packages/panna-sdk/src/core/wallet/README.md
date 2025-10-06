# Wallet Module

The Wallet module provides user authentication and account management for Web3 applications. The SDK supports email, phone, and social login with seamless account linking.

## What You'll Learn

In this guide, you will:

- Set up authentication in under 2 minutes
- Implement email and social login flows
- Manage user accounts and linked profiles
- Build production-ready authentication

## Table of Contents

- [Wallet Module](#wallet-module)
  - [What You'll Learn](#what-youll-learn)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Setup](#setup)
  - [Email Authentication](#email-authentication)
    - [Basic Flow](#basic-flow)
  - [Social Login](#social-login)
    - [Basic Social Login](#basic-social-login)
    - [Handle Auth Callback](#handle-auth-callback)
  - [Phone Authentication](#phone-authentication)
  - [Account Management](#account-management)
    - [Account Operations](#account-operations)
  - [Advanced Features](#advanced-features)
    - [Account Linking](#account-linking)
  - [Next Steps](#next-steps)

## Quick Start

Get authentication working in 2 minutes:

```ts
import {
  EcosystemId,
  createPannaClient,
  createAccount,
  prepareLogin,
  login
} from 'panna-sdk';

// 1. Initialize SDK
const client = createPannaClient({ clientId: 'your-client-id' });
const ecosystem = { id: EcosystemId.LISK, partnerId: 'your-partner-id' };

// 2. Send verification code
await prepareLogin({
  client,
  ecosystem,
  strategy: 'email',
  email: 'user@example.com'
});

// 3. User enters code, then authenticate
const authResult = await login({
  client,
  ecosystem,
  strategy: 'email',
  email: 'user@example.com',
  verificationCode: '123456'
});

// 4. Create account instance
const account = createAccount({ partnerId: 'your-partner-id' });
console.log('Authenticated:', account.address);
```

## Setup

Configure the SDK for your application:

```ts
import { createPannaClient, createAccount } from 'panna-sdk';

// Browser environment
const client = createPannaClient({
  clientId: 'your-client-id' // Get from Panna dashboard
});

// Default ecosystem (Lisk)
const account = createAccount({
  partnerId: 'your-partner-id'
});

// Custom ecosystem
const customAccount = createAccount({
  partnerId: 'your-partner-id',
  ecosystemId: 'ecosystem.custom'
});
```

## Email Authentication

Email authentication uses a two-step verification process: send code, then verify.

### Basic Flow

```ts
import { prepareLogin, login, getEmail } from 'panna-sdk';

const ecosystem = { id: 'ecosystem.lisk', partnerId: 'your-partner-id' };

async function authenticateWithEmail(email: string, code?: string) {
  if (!code) {
    // Step 1: Send verification code
    await prepareLogin({
      client,
      ecosystem,
      strategy: 'email',
      email
    });
    return { codeSent: true };
  }

  // Step 2: Verify code and authenticate
  const result = await login({
    client,
    ecosystem,
    strategy: 'email',
    email,
    verificationCode: code
  });

  return { authenticated: true, result };
}

// Usage
await authenticateWithEmail('user@example.com'); // Sends code
await authenticateWithEmail('user@example.com', '123456'); // Verifies code
```

## Social Login

One-click authentication using popular social providers.

### Basic Social Login

```ts
import { EcosystemId, socialLogin } from 'panna-sdk';

const ecosystem = { id: EcosystemId.LISK, partnerId: 'your-partner-id' };

// Supported providers: 'google', 'apple', 'facebook', 'discord', 'github',
// 'x', 'coinbase', 'farcaster', 'telegram'

async function loginWithProvider(provider: string) {
  await socialLogin({
    client,
    ecosystem,
    strategy: provider,
    mode: 'redirect',
    redirectUrl: `${window.location.origin}/auth/callback`
  });

  // User will be redirected to provider OAuth
  // After success, they return to redirectUrl
}

// Usage
await loginWithProvider('google');
await loginWithProvider('github');
```

### Handle Auth Callback

```ts
// In your callback route/component
function handleAuthCallback() {
  const account = createAccount({ partnerId: 'your-partner-id' });

  if (account.address) {
    console.log('User authenticated:', account.address);
    // Redirect to dashboard or protected area
  }
}
```

## Phone Authentication

Phone authentication follows the same pattern as email authentication but uses SMS verification:

```ts
// Send SMS code
await prepareLogin({
  client,
  ecosystem,
  strategy: 'phone',
  phoneNumber: '+1234567890' // Include country code
});

// Verify code
const result = await login({
  client,
  ecosystem,
  strategy: 'phone',
  phoneNumber: '+1234567890',
  verificationCode: '123456'
});
```

## Account Management

Work with authenticated user accounts and their information.

### Account Operations

```ts
import { createAccount, getEmail, getPhoneNumber } from 'panna-sdk';

const ecosystem = { id: 'ecosystem.lisk', partnerId: 'your-partner-id' };

// Create account instance
const account = createAccount({ partnerId: 'your-partner-id' });

// Get account properties
console.log('Address:', account.address);
console.log('Chain:', account.getChain()?.id);

// Get user information
const email = await getEmail({ client, ecosystem });
const phone = await getPhoneNumber({ client, ecosystem });

console.log('User info:', { email, phone, address: account.address });
```

## Advanced Features

### Account Linking

Link multiple authentication methods to one wallet for flexible login options:

```ts
import { linkAccount, getLinkedAccounts, unlinkAccount } from 'panna-sdk';

const ecosystem = { id: 'ecosystem.lisk', partnerId: 'your-partner-id' };

// Link additional authentication methods
await linkAccount({
  client,
  ecosystem,
  strategy: 'google',
  mode: 'redirect',
  redirectUrl: '/settings'
});

// Link phone to existing account
await linkAccount({
  client,
  ecosystem,
  strategy: 'phone',
  phoneNumber: '+1234567890',
  verificationCode: '123456'
});

// View all linked accounts
const linkedAccounts = await getLinkedAccounts({ client, ecosystem });
linkedAccounts.forEach((account) => {
  console.log(
    `${account.type}: ${account.details?.email || account.details?.phone}`
  );
});

// Unlink an account
const googleAccount = linkedAccounts.find((a) => a.type === 'google');
if (googleAccount) {
  await unlinkAccount({ client, ecosystem, profileToUnlink: googleAccount });
}
```

## Next Steps

- [Client Module](../client/README.md) - SDK initialization and configuration
- [Transaction Module](../transaction/README.md) - Send transactions
- [Chain Configuration](../chain/README.md) - Multi-chain support
- [Fiat Onramp](../onramp/README.md) - Crypto purchases
- [Utils Module](../utils/README.md) - Helpful utilities
