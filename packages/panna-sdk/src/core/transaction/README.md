# Transaction Module

The Transaction module handles blockchain transactions on Lisk networks, from simple transfers to smart contract interactions. The module provides comprehensive transaction preparation, execution, and error handling capabilities.

## What You'll Learn

In this guide, you will:

- Send native ETH tokens between addresses
- Transfer ERC-20 tokens using contract calls
- Interact with smart contracts and call their methods
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

- Explore [Client Module](../client/README.md) for SDK initialization and configuration
- Explore [Chain Module](../chain/README.md) for configuring networks and RPC endpoints
- Review [Util Module](../util/README.md) for balance queries and token conversions
- Learn about [Wallet Module](../wallet/README.md) for user account management and authentication
- Check [Onramp Module](../onramp/README.md) for integrating fiat-to-crypto purchases
