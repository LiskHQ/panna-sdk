# Types Module

TypeScript type definitions for React components and hooks in the Panna SDK.

## Quick Start

```tsx
import type { Country, Token, BuyWithFiatQuote } from 'panna-sdk';

function MyComponent({
  country,
  token,
  quote
}: {
  country: Country;
  token: Token;
  quote: BuyWithFiatQuote;
}) {
  return (
    <div>
      <p>
        {country.flag} {country.name}
      </p>
      <p>
        {token.symbol} - {token.name}
      </p>
      <p>Provider: {quote.providerName}</p>
    </div>
  );
}
```

## Core Types

### Country

Represents a country with ISO code, name, and flag emoji.

```ts
type Country = {
  code: string; // ISO 3166-1 alpha-2 (e.g., "US", "GB")
  name: string; // Full name (e.g., "United States")
  flag: string; // Flag emoji (e.g., "🇺🇸")
};
```

**Example:**

```tsx
const usa: Country = {
  code: 'US',
  name: 'United States',
  flag: '🇺🇸'
};
```

### Token

Represents a cryptocurrency token.

```ts
type Token = {
  symbol: string; // Token symbol (e.g., "LSK", "ETH")
  name: string; // Full name (e.g., "Lisk", "Ethereum")
  icon?: string; // Optional icon URL or data URI
};
```

**Example:**

```tsx
const lisk: Token = {
  symbol: 'LSK',
  name: 'Lisk',
  icon: 'https://portal-assets.lisk.com/logo/lisk-profile-w.svg'
};
```

### BuyWithFiatQuote

Represents a fiat-to-crypto purchase quote.

```ts
type BuyWithFiatQuote = {
  providerId: string;
  providerName: string;
  providerDescription?: string;
  providerLogoUrl?: string;
  price: string;
  error?: string;
  prepareResult?: OnrampPrepareResult;
};
```

**Example:**

```tsx
const quote: BuyWithFiatQuote = {
  providerId: 'moonpay',
  providerName: 'MoonPay',
  providerDescription: 'Buy crypto with credit card',
  price: '100.5'
};
```

### IconProps

Props type for icon components.

```ts
type IconProps = React.ComponentProps<'svg'> & {
  size?: number; // Icon size in pixels
  color?: string; // Icon color (CSS color value)
};
```

**Example:**

```tsx
function WalletIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: IconProps) {
  return (
    <svg width={size} height={size} fill="none" stroke={color} {...props}>
      {/* SVG paths */}
    </svg>
  );
}
```

## Usage Examples

### Typed Country Selector

```tsx
import { type Country, COUNTRIES_SORTED } from 'panna-sdk';
import { useState } from 'react';

function CountrySelector({
  onSelect
}: {
  onSelect: (country: Country) => void;
}) {
  const [selected, setSelected] = useState<Country | null>(null);

  const handleSelect = (country: Country) => {
    setSelected(country);
    onSelect(country);
  };

  return (
    <div>
      {COUNTRIES_SORTED.map((country) => (
        <button
          key={country.code}
          onClick={() => handleSelect(country)}
          className={selected?.code === country.code ? 'selected' : ''}
        >
          {country.flag} {country.name}
        </button>
      ))}
    </div>
  );
}
```

### Typed Token Display

```tsx
import type { Token } from 'panna-sdk';

function TokenItem({ token }: { token: Token }) {
  return (
    <div className="token-item">
      {token.icon && <img src={token.icon} alt={token.symbol} width={32} />}
      <div>
        <div>{token.symbol}</div>
        <div>{token.name}</div>
      </div>
    </div>
  );
}
```

### Typed Quote Comparison

```tsx
import { type BuyWithFiatQuote, useBuyWithFiatQuotes } from 'panna-sdk';

function QuoteComparison() {
  const { data: quotes } = useBuyWithFiatQuotes({
    fromCurrencySymbol: 'USD',
    toChainId: '1135',
    toTokenAddress: '0x...',
    fromAmount: '100'
  });

  const validQuotes = quotes?.filter(
    (q): q is BuyWithFiatQuote & { error: undefined } => !q.error
  );

  return (
    <div>
      {validQuotes?.map((quote) => (
        <QuoteCard key={quote.providerId} quote={quote} />
      ))}
    </div>
  );
}
```

### Custom Icon Component

```tsx
import type { IconProps } from 'panna-sdk';

function SendIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke={color}
      {...props}
    >
      <line x1="2" y1="10" x2="18" y2="10" />
      <polyline points="12 4 18 10 12 16" />
    </svg>
  );
}
```

## Type Guards

### Country Validation

```tsx
import type { Country } from 'panna-sdk';

function isValidCountry(value: unknown): value is Country {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'name' in value &&
    'flag' in value &&
    typeof value.code === 'string' &&
    typeof value.name === 'string' &&
    typeof value.flag === 'string'
  );
}
```

### Token Validation

```tsx
import type { Token } from 'panna-sdk';

function isValidToken(value: unknown): value is Token {
  return (
    typeof value === 'object' &&
    value !== null &&
    'symbol' in value &&
    'name' in value &&
    typeof value.symbol === 'string' &&
    typeof value.name === 'string'
  );
}
```

## Generic Patterns

### Component Props

```tsx
import type { Country, Token } from 'panna-sdk';

interface SwapFormProps {
  fromCountry: Country;
  fromToken: Token;
  toToken: Token;
  onSwap: (fromAmount: string, toAmount: string) => void;
}

function SwapForm({ fromCountry, fromToken, toToken, onSwap }: SwapFormProps) {
  // Component implementation
}
```

### Hook Return Types

```tsx
import type { Country, Token, BuyWithFiatQuote } from 'panna-sdk';

interface UseBuyFlowReturn {
  selectedCountry: Country | null;
  selectedToken: Token | null;
  quotes: BuyWithFiatQuote[];
  isLoadingQuotes: boolean;
  selectCountry: (country: Country) => void;
  selectToken: (token: Token) => void;
}

function useBuyFlow(): UseBuyFlowReturn {
  // Hook implementation
}
```

## Next Steps

- **[Components](../components/README.md)** - Components using these types
- **[Hooks](../hooks/README.md)** - Hooks with proper typing
- **[Utils](../utils/README.md)** - Utilities working with these types
- **[Consts](../consts/README.md)** - Constants and configuration
