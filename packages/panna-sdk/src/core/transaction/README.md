# Transaction Module

The Transaction module handles blockchain transactions on Lisk networks, from simple transfers to smart contract interactions. The module provides comprehensive transaction preparation, execution, and error handling capabilities.

## What You'll Learn

In this guide, you will:

- Send native ETH tokens between addresses
- Transfer ERC-20 tokens using contract calls
- Interact with smart contracts and call their methods
- Transfer tokens from external wallets (MetaMask, WalletConnect, etc.)
- Manage gas fees effectively (both legacy and EIP-1559)
- Implement common transaction patterns for production apps
- Use the complete transaction lifecycle from preparation to confirmation

## Table of Contents

- [Transaction Module](#transaction-module)
  - [What You'll Learn](#what-youll-learn)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Essential Transaction Types](#essential-transaction-types)
    - [1. Native ETH Transfers](#1-native-eth-transfers)
    - [2. ERC-20 Token Transfers](#2-erc-20-token-transfers)
    - [3. Smart Contract Interactions](#3-smart-contract-interactions)
    - [4. Transfers from External Wallets](#4-transfers-from-external-wallets)
  - [Gas Management](#gas-management)
    - [Modern Gas Pricing (EIP-1559) - Recommended](#modern-gas-pricing-eip-1559---recommended)
    - [Legacy Gas Pricing](#legacy-gas-pricing)
  - [Next Steps](#next-steps)

## Quick Start

```ts
import { client, wallet, transaction, util, chain } from 'panna-sdk';

// Setup
const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });
const account = wallet.createAccount({ partnerId: 'your-partner-id' });

// Send 1 ETH
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

console.log('Transaction hash:', result.transactionHash);
```

## Essential Transaction Types

### 1. Native ETH Transfers

The most basic transaction type: sending LSK between addresses.

```ts
import { transaction, util, chain } from 'panna-sdk';

// Send 10 ETH to another address
const tx = transaction.prepareTransaction({
  client,
  chain: chain.lisk,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  value: util.toWei('10') // Converts to wei automatically
});

const result = await transaction.sendTransaction({ account, transaction: tx });
console.log('Transaction sent:', result.transactionHash);
```

**Key Concept**: Use `util.toWei()` to convert human-readable amounts to blockchain units.

### 2. ERC-20 Token Transfers

Transfer tokens by calling the smart contract `transfer` method.

```ts
import { transaction, util, chain } from 'panna-sdk';

// Transfer 100 tokens
const tx = transaction.prepareContractCall({
  client,
  chain: chain.lisk,
  address: '0x...', // Token contract address
  method: 'function transfer(address to, uint256 amount)',
  params: [recipientAddress, util.toWei('100')] // 100 ERC-20 tokens with 18 decimals
});

await transaction.sendTransaction({ account, transaction: tx });
```

**With Type Safety Using ABI:**

```ts
import { transaction, util, chain } from 'panna-sdk';

const erc20Abi = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable'
  }
] as const;

const tx = transaction.prepareContractCall({
  client,
  chain: chain.lisk,
  address: tokenContractAddress,
  abi: erc20Abi,
  method: 'transfer', // Full autocomplete available
  params: [recipientAddress, util.toWei('100')] // 100 ERC-20 tokens with 18 decimals
});
```

### 3. Smart Contract Interactions

Execute any smart contract method with parameters.

```ts
import { transaction, util, chain } from 'panna-sdk';

// Set a value in a contract
const tx = transaction.prepareContractCall({
  client,
  chain: chain.lisk,
  address: contractAddress,
  method: 'function setValue(uint256 newValue)',
  params: [BigInt(42)]
});

// NFT minting with payment
const mintTx = transaction.prepareContractCall({
  client,
  chain: chain.lisk,
  address: nftContract,
  method: 'function mint(address to, uint256 tokenId)',
  params: [userAddress, BigInt(1)],
  value: util.toWei('0.1') // Send 0.1 ETH with the call
});
```

**Pro Tip**: Use `transaction.getContract()` for multiple calls to the same contract:

```ts
import { transaction, chain } from 'panna-sdk';

const contract = transaction.getContract({
  client,
  chain: chain.lisk,
  address: contractAddress,
  abi: contractAbi
});

// Now use contract instance for multiple calls
const tx1 = transaction.prepareContractCall({
  client,
  chain: chain.lisk,
  address: contract.address,
  abi: contract.abi,
  method: 'setValue',
  params: [42]
});
const tx2 = transaction.prepareContractCall({
  client,
  chain: chain.lisk,
  address: contract.address,
  abi: contract.abi,
  method: 'setName',
  params: ['Alice']
});
```

### 4. Transfers from External Wallets

Transfer tokens directly from external wallets like MetaMask, WalletConnect, or Coinbase Wallet.

```ts
import { transaction, util, chain, extensions } from 'panna-sdk';

// Check if MetaMask is available
if (!extensions.isEIP1193Provider(window.ethereum)) {
  throw new Error('No compatible wallet found');
}

// Get user's address from the wallet
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts'
});
const userAddress = accounts[0];

// Transfer native tokens (ETH)
const result = await transaction.transferBalanceFromExternalWallet({
  provider: window.ethereum,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  amount: util.toWei('1'), // 1 ETH
  client: pannaClient,
  chain: chain.lisk
});

console.log('Transfer complete:', result.transactionHash);
```

**Transfer ERC-20 Tokens:**

```ts
import { transaction, util, chain } from 'panna-sdk';

// Transfer ERC-20 tokens from MetaMask
const tokenResult = await transaction.transferBalanceFromExternalWallet({
  provider: window.ethereum,
  to: '0x742d35Cc6635C0532925a3b8D42f3C2544a3F97e',
  amount: BigInt(100_000_000), // 100 tokens (assuming 6 decimals)
  client: pannaClient,
  chain: chain.lisk,
  tokenAddress: '0xTOKEN_CONTRACT_ADDRESS'
});

console.log('Token transfer complete:', tokenResult.transactionHash);
```

**With Error Handling:**

```ts
import { transaction, util, chain, extensions } from 'panna-sdk';

try {
  // Validate provider first
  if (!extensions.isEIP1193Provider(window.ethereum)) {
    throw new Error('Please install MetaMask or a compatible wallet');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  const result = await transaction.transferBalanceFromExternalWallet({
    provider: window.ethereum,
    to: recipientAddress,
    amount: util.toWei('0.5'),
    client: pannaClient,
    chain: chain.lisk
  });

  console.log('Success! Transaction hash:', result.transactionHash);
} catch (error) {
  if (error.message.includes('User rejected')) {
    console.error('User cancelled the transaction');
  } else if (error.message.includes('insufficient funds')) {
    console.error('Not enough balance to complete transfer');
  } else {
    console.error('Transfer failed:', error.message);
  }
}
```

**Key Benefits:**

- Single function for both native and ERC-20 transfers
- Automatic provider conversion and connection
- Built-in validation and error handling
- Works with any EIP-1193 compatible wallet

**Important Notes:**

- For native token transfers, omit `tokenAddress` or set it to the native token constant (`NATIVE_TOKEN_ADDRESS`)
- For ERC-20 transfers, provide the token contract address
- The `amount` parameter uses the token's smallest unit (wei for native or token's smallest unit for ERC20)
- User must approve the transaction in their wallet

## Gas Management

Gas fees determine transaction speed and cost. The SDK supports both modern (EIP-1559) and legacy gas pricing.

### Modern Gas Pricing (EIP-1559) - Recommended

```ts
import { transaction, util, chain } from 'panna-sdk';

// Set maximum fees you're willing to pay
const tx = transaction.prepareTransaction({
  client,
  chain: chain.lisk,
  to: recipientAddress,
  value: util.toWei('1'),
  maxFeePerGas: BigInt(30_000_000_000), // 30 gwei maximum
  maxPriorityFeePerGas: BigInt(2_000_000_000) // 2 gwei tip for miners
});
```

### Legacy Gas Pricing

```ts
import { transaction, util, chain } from 'panna-sdk';

// Simple gas price (older method)
const tx = transaction.prepareTransaction({
  client,
  chain: chain.lisk,
  to: recipientAddress,
  value: util.toWei('1'),
  gasPrice: BigInt(20_000_000_000) // 20 gwei
});
```

## Next Steps

- [Client Module](../client/README.md) - SDK initialization and configuration
- [Wallet Module](../wallet/README.md) - User account management and authentication
- [Chain Module](../chain/README.md) - Configuring networks and RPC endpoints
- [Onramp Module](../onramp/README.md) - Integrating fiat-to-crypto purchases
- [Util Module](../util/README.md) - Balance queries and token conversions
- [Extensions Module](../extensions/README.md) - Integrating external wallets (MetaMask, WalletConnect, etc.)
