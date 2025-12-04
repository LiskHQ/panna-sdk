# Consts Module

Constants and configuration data including token configurations, country lists, and currency mappings.

## Quick Start

```tsx
import { tokenConfig, COUNTRIES } from 'panna-sdk';

function App() {
  const liskTokens = tokenConfig[1135];
  const countries = COUNTRIES;

  return <div>App content...</div>;
}
```

## Token Configuration

### tokenConfig

Main token configuration for all chains.

```tsx
import { tokenConfig } from 'panna-sdk';

// Lisk mainnet tokens
const liskTokens = tokenConfig[1135];

// Lisk Sepolia tokens
const liskSepoliaTokens = tokenConfig[4202];
```

### liskTokenConfig

Tokens for Lisk mainnet (chain ID: 1135).

**Includes:** LSK, ETH, USDT, USDC.e

```tsx
import { liskTokenConfig } from 'panna-sdk';

const tokens = liskTokenConfig[1135];
```

### liskSepoliaTokenConfig

Tokens for Lisk Sepolia testnet (chain ID: 4202).

**Includes:** LSK, ETH, USDT, USDC.e (testnet versions)

```tsx
import { liskSepoliaTokenConfig } from 'panna-sdk';

const tokens = liskSepoliaTokenConfig[4202];
```

## Country Constants

### COUNTRIES

Array of all countries from ISO 3166-1 alpha-2 standard.

```tsx
import { COUNTRIES } from 'panna-sdk';

function CountryPicker() {
  return (
    <select>
      {COUNTRIES.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.name}
        </option>
      ))}
    </select>
  );
}
```

## Usage Examples

### Token Configuration

```tsx
import { usePanna, tokenConfig, TokenItem } from 'panna-sdk';

function TokenBalanceList() {
  const { chainId } = usePanna();
  const tokens = tokenConfig[Number(chainId)];

  return (
    <div>
      <h3>Your Balances</h3>
      {tokens?.map((token) => (
        <TokenItem key={token.address} token={token} />
      ))}
    </div>
  );
}
```

### Country Selection

```tsx
import { type Country, COUNTRIES } from 'panna-sdk';
import { useState } from 'react';

function CountrySelector() {
  const [selected, setSelected] = useState<Country | null>(null);

  return (
    <div>
      <h3>Select Your Country</h3>
      {COUNTRIES.map((country) => (
        <button
          key={country.code}
          onClick={() => setSelected(country)}
          className={selected?.code === country.code ? 'selected' : ''}
        >
          {country.flag} {country.name}
        </button>
      ))}
    </div>
  );
}
```

### Currency Symbol Display

For currency symbol display, use `getCurrencySymbol()` from the utils module:

```tsx
import { getCurrencySymbol, getCurrencyForCountry } from 'panna-sdk';

type Props = {
  countryCode: string;
  amount: number;
};

function LocalizedPrice({ countryCode, amount }: Props) {
  const currency = getCurrencyForCountry(countryCode);
  const symbol = getCurrencySymbol(currency);

  return (
    <div>
      <span>{symbol}</span>
      <span>{amount.toFixed(2)}</span>
      <span>{currency}</span>
    </div>
  );
}
```

See **[Utils](../utils/README.md)** for more information about currency utilities.

## Custom Token Configuration

### Adding Custom Tokens

```tsx
import { tokenConfig } from 'panna-sdk';
import type { SupportedTokens } from 'thirdweb/react';

const customTokenConfig: SupportedTokens = {
  ...tokenConfig,
  1135: [
    ...tokenConfig[1135],
    {
      address: '0xYourCustomTokenAddress',
      name: 'My Custom Token',
      symbol: 'MCT',
      icon: 'https://example.com/icon.png'
    }
  ]
};
```

### Multi-Chain Setup

```tsx
import { liskTokenConfig, liskSepoliaTokenConfig, usePanna } from 'panna-sdk';

const isProduction = process.env.NODE_ENV === 'production';

const activeTokenConfig = isProduction
  ? liskTokenConfig
  : liskSepoliaTokenConfig;
const { chainId } = usePanna();

function TokenList() {
  const tokens = activeTokenConfig[chainId];

  return (
    <div>
      <h3>{isProduction ? 'Mainnet' : 'Testnet'} Tokens</h3>
      {tokens.map((token) => (
        <div key={token.address}>{token.symbol}</div>
      ))}
    </div>
  );
}
```

## Next Steps

- **[Components](../components/README.md)** - Components using these constants
- **[Hooks](../hooks/README.md)** - Hooks leveraging configurations
- **[Utils](../utils/README.md)** - Utilities working with constants
- **[Types](../types/README.md)** - TypeScript types for constants
