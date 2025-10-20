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
  - [External Wallet Login](#external-wallet-login)
    - [Connect with MetaMask](#connect-with-metamask)
    - [Supported Wallets](#supported-wallets)
  - [Phone Authentication](#phone-authentication)
  - [Account Management](#account-management)
    - [Account Operations](#account-operations)
  - [Advanced Features](#advanced-features)
    - [Account Linking](#account-linking)
  - [Next Steps](#next-steps)

## Quick Start

Get authentication working in 2 minutes:

```ts
import { client, wallet } from 'panna-sdk';

// 1. Initialize SDK
const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });
const ecosystem = { id: wallet.EcosystemId.LISK, partnerId: 'your-partner-id' };

// 2. Send verification code
await wallet.prepareLogin({
  client: pannaClient,
  ecosystem,
  strategy: wallet.LoginStrategy.EMAIL,
  email: 'user@example.com'
});

// 3. User enters code, then connect
const account = await wallet.connect({
  client: pannaClient,
  ecosystem,
  strategy: wallet.LoginStrategy.EMAIL,
  email: 'user@example.com',
  verificationCode: '123456'
});

console.log('Authenticated:', account.address);
```

## Setup

Configure the SDK for your application:

```ts
import { client, wallet } from 'panna-sdk';

// Browser environment
const pannaClient = client.createPannaClient({
  clientId: 'your-client-id' // Get from Panna dashboard
});

// Default ecosystem (Lisk)
const account = wallet.createAccount({
  partnerId: 'your-partner-id'
});

// Custom ecosystem
const customAccount = wallet.createAccount({
  partnerId: 'your-partner-id',
  ecosystemId: 'ecosystem.custom'
});
```

## Email Authentication

Email authentication uses a two-step verification process: send code, then verify.

### Basic Flow

```ts
import { wallet } from 'panna-sdk';

const ecosystem = { id: 'ecosystem.lisk', partnerId: 'your-partner-id' };

async function authenticateWithEmail(email: string, code?: string) {
  if (!code) {
    // Step 1: Send verification code
    await wallet.prepareLogin({
      client,
      ecosystem,
      strategy: wallet.LoginStrategy.EMAIL,
      email
    });
    return { codeSent: true };
  }

  // Step 2: Verify code and connect
  const account = await wallet.connect({
    client,
    ecosystem,
    strategy: wallet.LoginStrategy.EMAIL,
    email,
    verificationCode: code
  });

  return { authenticated: true, account };
}

// Usage
await authenticateWithEmail('user@example.com'); // Sends code
await authenticateWithEmail('user@example.com', '123456'); // Connects with code
```

## Social Login

One-click authentication using popular social providers.

### Basic Social Login

```ts
import { wallet } from 'panna-sdk';

const ecosystem = { id: wallet.EcosystemId.LISK, partnerId: 'your-partner-id' };

// Supported providers: 'google', 'apple', 'facebook', 'discord', 'github',
// 'x', 'coinbase', 'farcaster', 'telegram'

async function loginWithProvider(provider: string) {
  const account = await wallet.connect({
    client,
    ecosystem,
    strategy: provider,
    mode: 'redirect',
    redirectUrl: `${window.location.origin}/auth/callback`
  });

  // User will be redirected to provider OAuth
  // After success, they return to redirectUrl
  return account;
}

// Usage
await loginWithProvider('google');
await loginWithProvider('github');
```

### Handle Auth Callback

```ts
import { wallet } from 'panna-sdk';

// In your callback route/component
// The account was already created during connect(), you can now access it
function handleAuthCallback() {
  // After redirect, create account instance to access user data
  const account = wallet.createAccount({ partnerId: 'your-partner-id' });

  if (account.address) {
    console.log('User authenticated:', account.address);
    // Redirect to dashboard or protected area
  }
}
```

## External Wallet Login

Allow users to authenticate using their existing Web3 wallets like MetaMask, Coinbase Wallet, or WalletConnect. This method uses Sign-In With Ethereum (SIWE) to securely connect external wallets to your ecosystem.

**Important:** The external wallet must be installed and available in the user's browser. The SDK automatically checks for wallet availability and throws an error if the wallet is not found.

### Connect with MetaMask

```ts
import { wallet, chain } from 'panna-sdk';

async function connectWithMetaMask() {
  try {
    // Connect with MetaMask
    // The SDK will:
    // 1. Check if MetaMask is installed
    // 2. Create ecosystem wallet
    // 3. Create wallet instance
    // 4. Prompt user to sign in via MetaMask popup
    const account = await wallet.connect({
      client: pannaClient,
      ecosystem: { id: wallet.EcosystemId.LISK, partnerId: 'your-partner-id' },
      strategy: wallet.LoginStrategy.WALLET,
      walletId: 'io.metamask',
      chain: chain.liskSepolia // Chain required for SIWE
    });

    console.log('Connected with MetaMask:', account.address);
    return account;
  } catch (error) {
    if (error.message.includes('not installed')) {
      console.error('MetaMask is not installed. Please install it first.');
      // Redirect user to install MetaMask
      window.open('https://metamask.io/download/', '_blank');
    } else {
      console.error('Failed to connect:', error);
    }
  }
}

// Usage
await connectWithMetaMask();
```

### Supported Wallets

The SDK supports any Web3 wallet through WalletConnect or browser extensions. Each wallet is automatically checked for availability before connection.

```ts
import { wallet, chain } from 'panna-sdk';

// Helper function to connect with error handling
async function connectWallet(walletId: string, walletName: string) {
  try {
    const account = await wallet.connect({
      client: pannaClient,
      ecosystem: { id: wallet.EcosystemId.LISK, partnerId: 'your-partner-id' },
      strategy: wallet.LoginStrategy.WALLET,
      walletId,
      chain: chain.liskSepolia
    });
    console.log(`Connected with ${walletName}:`, account.address);
    return account;
  } catch (error) {
    if (error.message.includes('not installed')) {
      console.error(`${walletName} is not installed.`);
    }
    throw error;
  }
}

// MetaMask
await connectWallet('io.metamask', 'MetaMask');

// Coinbase Wallet
await connectWallet('com.coinbase.wallet', 'Coinbase Wallet');

// WalletConnect (supports 300+ wallets, doesn't require browser extension)
await connectWallet('walletConnect', 'WalletConnect');

// Trust Wallet
await connectWallet('com.trustwallet.app', 'Trust Wallet');
```

**Common Wallet IDs:**

| Wallet          | Wallet ID             | Requires Extension |
| --------------- | --------------------- | ------------------ |
| MetaMask        | `io.metamask`         | Yes                |
| Coinbase Wallet | `com.coinbase.wallet` | Yes                |
| WalletConnect   | `walletConnect`       | No                 |
| Trust Wallet    | `com.trustwallet.app` | Yes                |
| Rainbow         | `me.rainbow`          | Yes                |
| Phantom         | `app.phantom`         | Yes                |

**Note:** WalletConnect doesn't require a browser extension and can connect to mobile wallets via QR code.

## Phone Authentication

Phone authentication follows the same pattern as email authentication but uses SMS verification:

```ts
import { wallet } from 'panna-sdk';

// Send SMS code
await wallet.prepareLogin({
  client,
  ecosystem,
  strategy: wallet.LoginStrategy.PHONE,
  phoneNumber: '+1234567890' // Include country code
});

// Verify code and connect
const account = await wallet.connect({
  client,
  ecosystem,
  strategy: wallet.LoginStrategy.PHONE,
  phoneNumber: '+1234567890',
  verificationCode: '123456'
});
```

## Account Management

Work with authenticated user accounts and their information.

### Account Operations

```ts
import { wallet } from 'panna-sdk';

const ecosystem = { id: 'ecosystem.lisk', partnerId: 'your-partner-id' };

// Create account instance
const account = wallet.createAccount({ partnerId: 'your-partner-id' });

// Get account properties
console.log('Address:', account.address);
console.log('Chain:', account.getChain()?.id);

// Get user information
const email = await wallet.getEmail({ client, ecosystem });
const phone = await wallet.getPhoneNumber({ client, ecosystem });

console.log('User info:', { email, phone, address: account.address });
```

## Advanced Features

### Account Linking

Link multiple authentication methods to one wallet for flexible login options:

```ts
import { wallet } from 'panna-sdk';

const ecosystem = { id: 'ecosystem.lisk', partnerId: 'your-partner-id' };

// Link additional authentication methods
// Note: For linking, continue to use linkAccount function
await wallet.linkAccount({
  client,
  ecosystem,
  strategy: 'google',
  mode: 'redirect',
  redirectUrl: '/settings'
});

// Link phone to existing account
await wallet.linkAccount({
  client,
  ecosystem,
  strategy: wallet.LoginStrategy.PHONE,
  phoneNumber: '+1234567890',
  verificationCode: '123456'
});

// View all linked accounts
const linkedAccounts = await wallet.getLinkedAccounts({ client, ecosystem });
linkedAccounts.forEach((account) => {
  console.log(
    `${account.type}: ${account.details?.email || account.details?.phone}`
  );
});

// Unlink an account
const googleAccount = linkedAccounts.find((a) => a.type === 'google');
if (googleAccount) {
  await wallet.unlinkAccount({
    client,
    ecosystem,
    profileToUnlink: googleAccount
  });
}
```

## Next Steps

- [Client Module](../client/README.md) - SDK initialization and configuration
- [Transaction Module](../transaction/README.md) - Send transactions
- [Chain Configuration](../chain/README.md) - Multi-chain support
- [Fiat Onramp](../onramp/README.md) - Crypto purchases
- [Util Module](../util/README.md) - Helpful utilities
