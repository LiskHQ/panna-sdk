# Utils Module

Utility functions for React applications including address formatting, country/currency operations, token conversions, and query management.

## Quick Start

```tsx
import {
  truncateAddress,
  getSupportedTokens,
  detectUserCountry,
  getCurrencyForCountry
} from 'panna-sdk';

function WalletDisplay({ address }: { address: string }) {
  const country = detectUserCountry();
  const currency = getCurrencyForCountry(country || 'US');
  const tokens = getSupportedTokens('1135');

  return (
    <div>
      <p>Address: {truncateAddress(address)}</p>
      <p>Currency: {currency}</p>
      <p>Tokens: {tokens.length}</p>
    </div>
  );
}
```

## Address Utilities

### truncateAddress

Format Ethereum addresses for display.

```tsx
import { truncateAddress } from 'panna-sdk';

truncateAddress('0x1234567890abcdef1234567890abcdef12345678');
// Returns: "0x1234...5678"
```

## Token and Chain Utilities

### getSupportedTokens

Get supported tokens for a chain.

```tsx
import { getSupportedTokens } from 'panna-sdk';

const tokens = getSupportedTokens('1135'); // Lisk mainnet
// Returns: [{ address, name, symbol, icon }, ...]
```

### getEnvironmentChain

Get chain configuration by ID.

```tsx
import { getEnvironmentChain } from 'panna-sdk';

const chain = getEnvironmentChain('1135');
// Returns: { id, name, rpc, ... }
```

## Country and Currency Utilities

### getCountryByCode

Get country by ISO code.

```tsx
import { getCountryByCode } from 'panna-sdk';

const country = getCountryByCode('US');
// Returns: { code: 'US', name: 'United States', flag: '🇺🇸' }
```

### getCurrencyForCountry

Get currency code for a country.

```tsx
import { getCurrencyForCountry } from 'panna-sdk';

getCurrencyForCountry('US'); // "USD"
getCurrencyForCountry('GB'); // "GBP"
getCurrencyForCountry('FR'); // "EUR"
```

### getCurrencySymbol

Get currency symbol.

```tsx
import { getCurrencySymbol } from 'panna-sdk';

getCurrencySymbol('USD'); // "$"
getCurrencySymbol('EUR'); // "€"
getCurrencySymbol('GBP'); // "£"
```

### getCurrencySymbolForCountry

Get currency symbol for a country.

```tsx
import { getCurrencySymbolForCountry } from 'panna-sdk';

getCurrencySymbolForCountry('US'); // "$"
getCurrencySymbolForCountry('GB'); // "£"
```

### detectUserCountry

Detect user's country from browser locale.

```tsx
import { detectUserCountry } from 'panna-sdk';

const country = detectUserCountry();
// Returns: "US" or null
```

## Conversion Utilities

### renderFiatAmount

Convert crypto to fiat amount.

```tsx
import { useTokenBalances, renderFiatAmount } from 'panna-sdk';

function TokenInput({ address }: { address: string }) {
  const { data: balances } = useTokenBalances({ address });
  const [amount, setAmount] = useState('');

  const tokenInfo = balances?.[0];
  const fiatValue = tokenInfo ? renderFiatAmount(tokenInfo, amount) : '0.00';

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <p>≈ ${fiatValue}</p>
    </div>
  );
}
```

### renderCryptoAmount

Convert fiat to crypto amount.

```tsx
import { useTokenBalances } from 'panna-sdk';
import { renderCryptoAmount } from 'panna-sdk';

function FiatInput({ address }: { address: string }) {
  const { data: balances } = useTokenBalances({ address });
  const [fiatAmount, setFiatAmount] = useState('');

  const tokenInfo = balances?.[0];
  const cryptoValue = tokenInfo
    ? renderCryptoAmount(tokenInfo, fiatAmount)
    : '0.000000';

  return (
    <div>
      <input
        type="number"
        value={fiatAmount}
        onChange={(e) => setFiatAmount(e.target.value)}
      />
      <p>
        ≈ {cryptoValue} {tokenInfo?.token.symbol}
      </p>
    </div>
  );
}
```

## CSS Utilities

### cn

Combine CSS class names with conditional logic.

```tsx
import { cn } from 'panna-sdk';

function Button({ className, disabled }: Props) {
  return (
    <button
      className={cn(
        'rounded bg-blue-500 px-4 py-2',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      Click me
    </button>
  );
}
```

## Common Use Cases

### Display User-Friendly Address

```tsx
import { useActiveAccount, truncateAddress } from 'panna-sdk';

function WalletHeader() {
  const account = useActiveAccount();
  if (!account) return null;

  return (
    <div>
      <span>{truncateAddress(account.address)}</span>
      <button>Copy</button>
    </div>
  );
}
```

### Country-Based Currency Detection

```tsx
import {
  detectUserCountry,
  getCurrencyForCountry,
  getCurrencySymbol
} from 'panna-sdk';
import { useEffect, useState } from 'react';

function LocalizedBuyForm() {
  const [currency, setCurrency] = useState('USD');
  const [symbol, setSymbol] = useState('$');

  useEffect(() => {
    const country = detectUserCountry();
    if (country) {
      const detectedCurrency = getCurrencyForCountry(country);
      setCurrency(detectedCurrency);
      setSymbol(getCurrencySymbol(detectedCurrency));
    }
  }, []);

  return (
    <div>
      <h2>Buy Crypto</h2>
      <input placeholder={`Amount in ${symbol}`} />
      <p>Currency: {currency}</p>
    </div>
  );
}
```

### Token Amount Conversion

```tsx
import { useTokenBalances, useActiveAccount } from 'panna-sdk';
import { renderFiatAmount, renderCryptoAmount } from 'panna-sdk';
import { useState } from 'react';

function SwapCalculator() {
  const account = useActiveAccount();
  const { data: balances } = useTokenBalances({
    address: account?.address || ''
  });
  const [inputMode, setInputMode] = useState<'crypto' | 'fiat'>('crypto');
  const [amount, setAmount] = useState('');

  const tokenInfo = balances?.[0];
  const displayAmount = tokenInfo
    ? inputMode === 'crypto'
      ? `$${renderFiatAmount(tokenInfo, amount)}`
      : `${renderCryptoAmount(tokenInfo, amount)} ${tokenInfo.token.symbol}`
    : '0';

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={inputMode === 'crypto' ? 'Enter crypto' : 'Enter USD'}
      />
      <button
        onClick={() =>
          setInputMode((m) => (m === 'crypto' ? 'fiat' : 'crypto'))
        }
      >
        Switch
      </button>
      <p>≈ {displayAmount}</p>
    </div>
  );
}
```

### Multi-Chain Token Support

```tsx
import { usePanna } from 'panna-sdk';
import { getSupportedTokens, getEnvironmentChain } from 'panna-sdk';

function MultiChainTokenList() {
  const { chainId } = usePanna();
  const chain = getEnvironmentChain(chainId);
  const tokens = getSupportedTokens(chainId);

  return (
    <div>
      <h2>Tokens on {chain.name}</h2>
      <ul>
        {tokens.map((token) => (
          <li key={token.address}>
            <img src={token.icon} alt={token.symbol} />
            <span>
              {token.name} ({token.symbol})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Next Steps

- **[Components](../components/README.md)** - Pre-built React components
- **[Hooks](../hooks/README.md)** - React hooks for data fetching
- **[Types](../types/README.md)** - TypeScript type definitions
- **[Consts](../consts/README.md)** - Constants and configuration
