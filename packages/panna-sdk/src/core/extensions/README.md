# Extensions Module

The Extensions module provides utilities for interoperability with external wallet providers that implement the EIP-1193 standard (like MetaMask, WalletConnect, Coinbase Wallet, etc.). This enables seamless integration between Panna SDK and the broader Ethereum ecosystem.

## What You'll Learn

In this guide, you will:

- Connect external wallets (MetaMask, WalletConnect, etc.) to your app
- Convert external providers to Panna-compatible wallets
- Export Panna wallets for use with other libraries (ethers.js, web3.js)
- Detect and validate EIP-1193 compatible providers
- Build cross-wallet compatible applications

## Table of Contents

- [Extensions Module](#extensions-module)
  - [What You'll Learn](#what-youll-learn)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Understanding EIP-1193](#understanding-eip-1193)
  - [Converting External Providers to Panna Wallets](#converting-external-providers-to-panna-wallets)
    - [1. MetaMask Integration](#1-metamask-integration)
    - [2. WalletConnect Integration](#2-walletconnect-integration)
    - [3. Generic Provider Integration](#3-generic-provider-integration)
  - [Converting Panna Wallets to EIP-1193 Providers](#converting-panna-wallets-to-eip-1193-providers)
    - [1. Using with ethers.js](#1-using-with-ethersjs)
    - [2. Using with web3.js](#2-using-with-web3js)
    - [3. Using with other EIP-1193 compatible libraries](#3-using-with-other-eip-1193-compatible-libraries)
  - [Provider Detection and Validation](#provider-detection-and-validation)
  - [Complete Integration Examples](#complete-integration-examples)
    - [Multi-Wallet Support](#multi-wallet-support)
    - [Transferring from External Wallets](#transferring-from-external-wallets)
  - [Best Practices](#best-practices)
  - [Next Steps](#next-steps)

## Quick Start

```ts
import { extensions, client, chain, WalletId } from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Convert MetaMask to Panna wallet using WalletId enum
if (extensions.isEIP1193Provider(window.ethereum)) {
  const wallet = extensions.fromEIP1193Provider({
    provider: window.ethereum,
    walletId: WalletId.MetaMask // Use enum for type-safe wallet IDs
  });

  const account = await wallet.connect({
    client: pannaClient,
    chain: chain.lisk
  });

  console.log('Connected:', account.address);
}
```

## Understanding EIP-1193

EIP-1193 is the Ethereum standard for wallet provider APIs. It defines a consistent interface that wallets like MetaMask, Coinbase Wallet, and WalletConnect use to communicate with dApps.

**Key characteristics:**

- Standardized `request()` method for RPC calls
- Event-based architecture for account and chain changes
- Browser-injected or programmatically created providers

The Extensions module bridges EIP-1193 providers with Panna SDK's wallet system.

## Wallet Identifiers (EIP-6963)

The SDK provides a `WalletId` enum with reverse DNS (rDNS) identifiers for popular wallets, following the [EIP-6963 standard](https://eips.ethereum.org/EIPS/eip-6963) for Multi Injected Provider Discovery.

### Available Wallet IDs

The SDK includes identifiers for the most commonly supported wallets:

```ts
import { WalletId, getWalletName, isWalletId } from 'panna-sdk/core';

// Use enum values for type-safe wallet identification
console.log(WalletId.MetaMask); // "io.metamask"
console.log(WalletId.Coinbase); // "com.coinbase.wallet"
console.log(WalletId.Trust); // "com.trustwallet.app"
console.log(WalletId.Rainbow); // "me.rainbow"
console.log(WalletId.Phantom); // "app.phantom"
console.log(WalletId.Adapter); // "adapter" (fallback for other wallets)

// Get human-readable wallet name
console.log(getWalletName(WalletId.MetaMask)); // "MetaMask"
console.log(getWalletName(WalletId.Coinbase)); // "Coinbase Wallet"

// Validate wallet ID strings
if (isWalletId('io.metamask')) {
  console.log('Valid wallet ID');
}
```

**Supported Wallets:**

| Wallet          | Wallet ID             | WalletId Enum       |
| --------------- | --------------------- | ------------------- |
| MetaMask        | `io.metamask`         | `WalletId.MetaMask` |
| Coinbase Wallet | `com.coinbase.wallet` | `WalletId.Coinbase` |
| Trust Wallet    | `com.trustwallet.app` | `WalletId.Trust`    |
| Rainbow         | `me.rainbow`          | `WalletId.Rainbow`  |
| Phantom         | `app.phantom`         | `WalletId.Phantom`  |
| Other Wallets   | `adapter`             | `WalletId.Adapter`  |

### Why Use WalletId Enum?

1. **Type Safety**: Autocomplete and compile-time checking prevent typos
2. **Standardization**: Follows EIP-6963 reverse DNS naming convention
3. **Consistency**: Ensures stable wallet identifiers across your app
4. **Maintainability**: Centralized wallet ID management

### Example: Multi-Wallet Detection

```ts
import { WalletId, getWalletName, fromEIP1193Provider } from 'panna-sdk/core';

function detectWallet() {
  if (!window.ethereum) return null;

  let walletId: WalletId = WalletId.Adapter; // Default fallback

  // Detect specific wallet
  if (window.ethereum.isMetaMask) {
    walletId = WalletId.MetaMask;
  } else if (window.ethereum.isCoinbaseWallet) {
    walletId = WalletId.Coinbase;
  } else if (window.ethereum.isTrust) {
    walletId = WalletId.Trust;
  }

  return {
    walletId,
    walletName: getWalletName(walletId),
    provider: window.ethereum
  };
}

const detected = detectWallet();
if (detected) {
  console.log(`Detected: ${detected.walletName}`);

  const wallet = fromEIP1193Provider({
    provider: detected.provider,
    walletId: detected.walletId
  });
}
```

## Converting External Providers to Panna Wallets

### 1. MetaMask Integration

Connect MetaMask as a Panna wallet to use all SDK features.

```ts
import {
  extensions,
  client,
  chain,
  transaction,
  util,
  WalletId
} from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Check if MetaMask is installed
if (!window.ethereum?.isMetaMask) {
  console.error('MetaMask not detected');
  throw new Error('Please install MetaMask');
}

// Create wallet from MetaMask provider using WalletId enum
const wallet = extensions.fromEIP1193Provider({
  provider: window.ethereum,
  walletId: WalletId.MetaMask
});

// Connect to get account
const account = await wallet.connect({
  client: pannaClient,
  chain: chain.lisk
});

console.log('Connected address:', account.address);

// Now use account with any Panna SDK function
const tx = transaction.prepareTransaction({
  client: pannaClient,
  chain: chain.lisk,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  value: util.toWei('1')
});

const result = await transaction.sendTransaction({
  account,
  transaction: tx
});

console.log('Transaction sent:', result.transactionHash);
```

### 2. WalletConnect Integration

Integrate WalletConnect for mobile wallet support.

```ts
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import { extensions, client, chain } from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Initialize WalletConnect provider
const walletConnectProvider = await EthereumProvider.init({
  projectId: 'your-walletconnect-project-id',
  chains: [chain.lisk.id], // Lisk mainnet
  showQrModal: true,
  metadata: {
    name: 'Your App Name',
    description: 'Your App Description',
    url: 'https://yourapp.com',
    icons: ['https://yourapp.com/icon.png']
  }
});

// Enable session (shows QR code modal)
await walletConnectProvider.enable();

// Convert to Panna wallet
const wallet = extensions.fromEIP1193Provider({
  provider: walletConnectProvider,
  walletId: 'walletconnect'
});

const account = await wallet.connect({
  client: pannaClient,
  chain: chain.lisk
});

console.log('WalletConnect connected:', account.address);
```

### 3. Generic Provider Integration

Connect any EIP-1193 compatible provider.

```ts
import { extensions, client, chain } from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Detect available providers
const detectProvider = () => {
  if (window.ethereum?.isCoinbaseWallet) {
    return { provider: window.ethereum, id: 'com.coinbase.wallet' };
  } else if (window.ethereum?.isMetaMask) {
    return { provider: window.ethereum, id: 'io.metamask' };
  } else if (window.ethereum) {
    return { provider: window.ethereum, id: 'unknown' };
  }
  return null;
};

const detected = detectProvider();
if (detected && extensions.isEIP1193Provider(detected.provider)) {
  const wallet = extensions.fromEIP1193Provider({
    provider: detected.provider,
    walletId: detected.id
  });

  const account = await wallet.connect({
    client: pannaClient,
    chain: chain.lisk
  });

  console.log(`Connected with ${detected.id}:`, account.address);
}
```

## Converting Panna Wallets to EIP-1193 Providers

Export Panna wallets for use with other Ethereum libraries.

### 1. Using with ethers.js

```ts
import { ethers } from 'ethers';
import { extensions, wallet, client, chain } from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Create and connect Panna account
const account = wallet.createAccount({ partnerId: 'your-partner-id' });
await account.connect({
  client: pannaClient,
  strategy: 'email',
  email: 'user@example.com'
});

// Convert to EIP-1193 provider
const eip1193Provider = extensions.toEIP1193Provider({
  wallet: account,
  chain: chain.lisk,
  client: pannaClient
});

// Use with ethers.js
const ethersProvider = new ethers.BrowserProvider(eip1193Provider);
const signer = await ethersProvider.getSigner();

// Now use ethers.js methods
const balance = await ethersProvider.getBalance(account.address);
console.log('Balance (via ethers):', ethers.formatEther(balance));

// Send transaction via ethers
const tx = await signer.sendTransaction({
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  value: ethers.parseEther('0.1')
});

console.log('Transaction hash:', tx.hash);
```

### 2. Using with web3.js

```ts
import { extensions, wallet, client, chain } from 'panna-sdk/core';
import Web3 from 'web3';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Create and connect Panna account
const account = wallet.createAccount({ partnerId: 'your-partner-id' });
await account.connect({
  client: pannaClient,
  strategy: 'google'
});

// Convert to EIP-1193 provider for web3.js
const eip1193Provider = extensions.toEIP1193Provider({
  wallet: account,
  chain: chain.lisk,
  client: pannaClient
});

// Create web3 instance
const web3 = new Web3(eip1193Provider);

// Use web3.js methods
const balance = await web3.eth.getBalance(account.address);
console.log('Balance (via web3):', web3.utils.fromWei(balance, 'ether'));

// Send transaction
const receipt = await web3.eth.sendTransaction({
  from: account.address,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  value: web3.utils.toWei('0.1', 'ether')
});

console.log('Transaction receipt:', receipt);
```

### 3. Using with other EIP-1193 compatible libraries

```ts
import { extensions, wallet, client, chain } from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Create external wallet from provider
const externalWallet = extensions.fromEIP1193Provider({
  provider: window.ethereum,
  walletId: 'io.metamask'
});

const externalAccount = await externalWallet.connect({
  client: pannaClient,
  chain: chain.lisk
});

// Convert back to EIP-1193 provider
const provider = extensions.toEIP1193Provider({
  wallet: externalAccount,
  chain: chain.lisk,
  client: pannaClient
});

// Use the provider with any library expecting EIP-1193
// Example: viem, wagmi, etc.
const chainId = await provider.request({ method: 'eth_chainId' });
const accounts = await provider.request({ method: 'eth_accounts' });
console.log('Chain ID:', chainId);
console.log('Accounts:', accounts);
```

## Provider Detection and Validation

Safely detect and validate EIP-1193 providers before use.

```ts
import { extensions } from 'panna-sdk/core';

// Type-safe provider detection
function detectWalletProvider() {
  // Check for Ethereum provider
  if (typeof window === 'undefined' || !window.ethereum) {
    return { error: 'No wallet detected' };
  }

  // Validate it's EIP-1193 compliant
  if (!extensions.isEIP1193Provider(window.ethereum)) {
    return { error: 'Provider is not EIP-1193 compatible' };
  }

  // Identify specific wallet
  let walletId = 'unknown';
  let walletName = 'Unknown Wallet';

  if (window.ethereum.isMetaMask) {
    walletId = 'io.metamask';
    walletName = 'MetaMask';
  } else if (window.ethereum.isCoinbaseWallet) {
    walletId = 'com.coinbase.wallet';
    walletName = 'Coinbase Wallet';
  } else if (window.ethereum.isRabby) {
    walletId = 'io.rabby';
    walletName = 'Rabby';
  } else if (window.ethereum.isBraveWallet) {
    walletId = 'com.brave.wallet';
    walletName = 'Brave Wallet';
  }

  return {
    provider: window.ethereum,
    walletId,
    walletName,
    error: null
  };
}

// Usage
const detected = detectWalletProvider();

if (detected.error) {
  console.error(detected.error);
} else {
  console.log(`Detected: ${detected.walletName}`);

  const wallet = extensions.fromEIP1193Provider({
    provider: detected.provider,
    walletId: detected.walletId
  });

  // Now safely connect
}
```

## Complete Integration Examples

### Multi-Wallet Support

Build an app supporting both Panna accounts and external wallets.

```ts
import {
  extensions,
  wallet,
  client,
  chain,
  transaction,
  util
} from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Define wallet connection options
type WalletOption =
  | 'panna-email'
  | 'panna-social'
  | 'metamask'
  | 'walletconnect';

async function connectWallet(option: WalletOption) {
  let account;

  switch (option) {
    case 'panna-email': {
      const pannaAccount = wallet.createAccount({
        partnerId: 'your-partner-id'
      });
      await pannaAccount.connect({
        client: pannaClient,
        strategy: wallet.LoginStrategy.EMAIL,
        email: 'user@example.com'
      });
      account = pannaAccount;
      break;
    }

    case 'panna-social': {
      const pannaAccount = wallet.createAccount({
        partnerId: 'your-partner-id'
      });
      await pannaAccount.connect({
        client: pannaClient,
        strategy: wallet.LoginStrategy.GOOGLE
      });
      account = pannaAccount;
      break;
    }

    case 'metamask': {
      if (!window.ethereum?.isMetaMask) {
        throw new Error('MetaMask not installed');
      }
      const externalWallet = extensions.fromEIP1193Provider({
        provider: window.ethereum,
        walletId: 'io.metamask'
      });
      account = await externalWallet.connect({
        client: pannaClient,
        chain: chain.lisk
      });
      break;
    }

    case 'walletconnect': {
      // Initialize WalletConnect (see earlier example)
      const wcProvider = await initWalletConnect();
      const externalWallet = extensions.fromEIP1193Provider({
        provider: wcProvider,
        walletId: 'walletconnect'
      });
      account = await externalWallet.connect({
        client: pannaClient,
        chain: chain.lisk
      });
      break;
    }
  }

  // All accounts work the same way now
  console.log('Connected address:', account.address);
  return account;
}

// Use the connected account for transactions
const myAccount = await connectWallet('metamask');

const tx = transaction.prepareTransaction({
  client: pannaClient,
  chain: chain.lisk,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  value: util.toWei('1')
});

await transaction.sendTransaction({
  account: myAccount,
  transaction: tx
});
```

### Transferring from External Wallets

Simplified transfers from external wallets using the transaction module.

```ts
import { extensions, transaction, util, chain, client } from 'panna-sdk/core';

const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// Check for MetaMask
if (!extensions.isEIP1193Provider(window.ethereum)) {
  throw new Error('No compatible wallet found');
}

// Get user's address from MetaMask
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts'
});
const userAddress = accounts[0];

// Transfer native tokens (ETH)
const result = await transaction.transferBalanceFromExternalWallet({
  provider: window.ethereum,
  from: userAddress,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  amount: util.toWei('1'), // 1 ETH
  client: pannaClient,
  chain: chain.lisk
});

console.log('Transfer complete:', result.transactionHash);

// Transfer ERC-20 tokens
const tokenResult = await transaction.transferBalanceFromExternalWallet({
  provider: window.ethereum,
  from: userAddress,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  amount: BigInt(100_000_000), // 100 tokens (assuming 6 decimals)
  client: pannaClient,
  chain: chain.lisk,
  tokenAddress: '0xTOKEN_CONTRACT_ADDRESS'
});

console.log('Token transfer complete:', tokenResult.transactionHash);
```

## Best Practices

1. **Always Validate Providers**

   ```ts
   if (!extensions.isEIP1193Provider(provider)) {
     throw new Error('Invalid provider');
   }
   ```

2. **Handle User Rejection**

   ```ts
   try {
     const account = await wallet.connect({ client, chain });
   } catch (error) {
     if (error.message.includes('User rejected')) {
       console.log('User cancelled connection');
     } else {
       throw error;
     }
   }
   ```

3. **Listen to Provider Events**

   ```ts
   if (extensions.isEIP1193Provider(window.ethereum)) {
     window.ethereum.on('accountsChanged', (accounts) => {
       console.log('Account changed:', accounts[0]);
     });

     window.ethereum.on('chainChanged', (chainId) => {
       console.log('Chain changed:', chainId);
       // Reload or update UI
     });
   }
   ```

4. **Graceful Degradation**

   ```ts
   const getWalletOptions = () => {
     const options = ['panna-email', 'panna-social'];

     if (window.ethereum?.isMetaMask) {
       options.push('metamask');
     }

     return options;
   };
   ```

5. **Security Considerations**
   - Never store private keys or mnemonics
   - Always validate addresses before transactions
   - Implement transaction confirmation UI
   - Use HTTPS in production
   - Verify chain ID matches expected network

## Next Steps

- Explore [Transaction Module](../transaction/README.md) for sending transactions from external wallets
- Review [Wallet Module](../wallet/README.md) for Panna account management
- Check [Client Module](../client/README.md) for SDK initialization
- Learn about [Chain Module](../chain/README.md) for network configuration
