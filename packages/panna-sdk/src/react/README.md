# Panna SDK React Module

Complete toolkit for building Web3 applications with React including pre-built components, hooks, utilities, and type definitions.

## Quick Start

```tsx
import { PannaProvider, ConnectButton } from 'panna-sdk';
import 'panna-sdk/styles.css';

function App() {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId="your-partner-id"
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID}
    >
      <ConnectButton />
    </PannaProvider>
  );
}
```

## Installation

```bash
npm install panna-sdk
# or
yarn add panna-sdk
# or
pnpm add panna-sdk
```

## React Modules

### 1. [Components](./components/README.md)

Pre-built React components for authentication, transactions, and account management.

**Key Components:** PannaProvider, ConnectButton, AccountDialog, BuyForm, UI primitives

```tsx
import { PannaProvider, ConnectButton } from 'panna-sdk';

<PannaProvider clientId="..." partnerId="...">
  <ConnectButton />
</PannaProvider>;
```

[→ View Documentation](./components/README.md)

### 2. [Hooks](./hooks/README.md)

React hooks for wallet state, blockchain data, and user interactions.

**Key Hooks:** useActiveAccount, useTokenBalances, useActivities, useCollectibles, useLogin, useBuyWithFiatQuotes

```tsx
import { useActiveAccount, useTokenBalances } from 'panna-sdk';

const account = useActiveAccount();
const { data: balances } = useTokenBalances({
  address: account?.address || ''
});
```

[→ View Documentation](./hooks/README.md)

### 3. [Utils](./utils/README.md)

Utility functions for address formatting, conversions, and country/currency operations.

**Key Functions:** truncateAddress, getSupportedTokens, detectUserCountry, renderFiatAmount

```tsx
import { truncateAddress, detectUserCountry } from 'panna-sdk';

const formatted = truncateAddress('0xf242275d3a6527d877f2c927a82d9b057609cc71');
const country = detectUserCountry();
```

[→ View Documentation](./utils/README.md)

### 4. [Types](./types/README.md)

TypeScript type definitions for React components and hooks.

**Key Types:** Country, Token, BuyWithFiatQuote, IconProps

```tsx
import type { Country, Token } from 'panna-sdk';

function Component({ country, token }: { country: Country; token: Token }) {
  // Implementation
}
```

[→ View Documentation](./types/README.md)

### 5. [Consts](./consts/README.md)

Constants and configuration for tokens, countries, and currencies.

**Key Constants:** tokenConfig, COUNTRIES, currencyMap

```tsx
import { tokenConfig, currencyMap } from 'panna-sdk';

const liskTokens = tokenConfig[1135];

return (
  <Typography variant="muted">
    {currencyMap[amount.fiatValue.currency]}
  </Typography>
)
```

[→ View Documentation](./consts/README.md)

## Common Use Cases

### Authentication Flow

```tsx
import { PannaProvider, ConnectButton, useActiveAccount } from 'panna-sdk';

function App() {
  const account = useActiveAccount();

  return (
    <PannaProvider clientId="..." partnerId="...">
      {!account ? <ConnectButton /> : <div>Welcome {account.address}</div>}
    </PannaProvider>
  );
}
```

### Display Balances

```tsx
import { useTokenBalances, useTotalFiatBalance } from 'panna-sdk';

function Balances({ address }: { address: string }) {
  const { data: balances } = useTokenBalances({ address });
  const { data: total } = useTotalFiatBalance({ address });

  return (
    <div>
      <h2>Total: ${total?.toFixed(2)}</h2>
      {balances?.map((b) => (
        <div key={b.token.address}>
          {b.tokenBalance.displayValue} {b.token.symbol} ($
          {b.fiatBalance?.amount.toFixed(2)})
        </div>
      ))}
    </div>
  );
}
```

### Buy Crypto

```tsx
import { BuyForm } from 'panna-sdk';

function BuyPage() {
  return (
    <BuyForm
      onSuccess={(result) => console.log('Success:', result)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### Transaction History

```tsx
import { useActivities } from 'panna-sdk';

function ActivityList({ address }: { address: string }) {
  const { data: activities } = useActivities({ address });

  return (
    <div>
      {activities?.map((activity) => (
        <div key={activity.id}>
          {activity.type} - {activity.description}
        </div>
      ))}
    </div>
  );
}
```

## Framework Integration

### Next.js App Router

```tsx
// app/providers.tsx
'use client';

import { PannaProvider } from 'panna-sdk';
import 'panna-sdk/styles.css';
// app/layout.tsx
import { Providers } from './providers';

// app/providers.tsx

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId="..."
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID}
    >
      {children}
    </PannaProvider>
  );
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Vite/CRA

```tsx
import { PannaProvider } from 'panna-sdk';
import 'panna-sdk/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PannaProvider clientId="..." partnerId="..." chainId="...">
    <App />
  </PannaProvider>
);
```

## Styling

Import default styles:

```tsx
import 'panna-sdk/styles.css';
```

Customize with CSS variables, Tailwind classes, or inline styles:

```tsx
<ConnectButton className="bg-blue-600" style={{ borderRadius: '8px' }} />
```

## Environment Variables

```bash
NEXT_PUBLIC_PANNA_CLIENT_ID=your-client-id
NEXT_PUBLIC_PARTNER_ID=your-partner-id
NEXT_PUBLIC_CHAIN_ID=1135  # Optional
```

## TypeScript Support

Fully typed with TypeScript:

```tsx
import type { PannaClient, Country, Token } from 'panna-sdk';
```

## Best Practices

1. **Use PannaProvider at root** - Wrap entire app
2. **Conditional rendering** - Check account before rendering wallet UI
3. **Error handling** - Handle errors from hooks
4. **Type safety** - Use TypeScript types
5. **Optimize queries** - Configure caching and refetching
6. **Use provided constants** - For currency, countries, tokens

## Module Documentation

- **[Components](./components/README.md)** - Pre-built UI components
- **[Hooks](./hooks/README.md)** - Data fetching and state hooks
- **[Utils](./utils/README.md)** - Utility functions
- **[Types](./types/README.md)** - TypeScript types
- **[Consts](./consts/README.md)** - Constants and configuration

## Core Module

React module builds on the Core module. For headless functionality:

- **[Core Module](../core/README.md)** - Framework-agnostic logic

## Resources

- **[Example App](../../../apps/example-app/)** - Full Next.js example
- **[GitHub](https://github.com/lisk/panna-sdk)** - Source code
