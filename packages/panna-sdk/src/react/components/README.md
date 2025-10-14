# Components Module

Pre-built React components for building Web3 applications with authentication, account management, transactions, and UI interactions.

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

## Core Components

### PannaProvider

Root provider component that wraps your application.

```tsx
import { PannaProvider } from 'panna-sdk';

function App() {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId="your-partner-id"
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID} // Optional: defaults to Lisk mainnet
      autoConnectTimeout={15000} // Optional
    >
      <YourApp />
    </PannaProvider>
  );
}
```

**Props:** `clientId`, `partnerId`, `chainId` (optional), `queryClient` (optional), `autoConnectTimeout` (optional)

### ConnectButton

Pre-built authentication button.

```tsx
import { ConnectButton } from 'panna-sdk';

function Header() {
  return <ConnectButton />;
}
```

### AccountDialog

Account management dialog with balances and actions.

```tsx
import { AccountDialog } from 'panna-sdk';
import { useState } from 'react';

function AccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Account</button>
      <AccountDialog address={'0x1234567890abcdef1234567890abcdef12345678'} />
    </>
  );
}
```

### BuyForm

Multi-step fiat-to-crypto purchase form.

```tsx
import { BuyForm } from 'panna-sdk';

function BuyCrypto() {
  return (
    <BuyForm
      onSuccess={(result) => console.log('Success:', result)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### AccountEventProvider

Manages wallet connection/disconnection events.

```tsx
import { AccountEventProvider, useAccountEventContext } from 'panna-sdk';

function WalletListener() {
  const { sendAccountEvent } = useAccountEventContext();
  return (
    <button onClick={() => sendAccountEvent('accountUpdate')}>
      Update account event
    </button>
  );
}

function App() {
  return (
    <AccountEventProvider>
      <WalletListener />
    </AccountEventProvider>
  );
}
```

## Component Categories

### Authentication (`components/auth/`)

- **ConnectButton** - Pre-built connect button
- **AuthFlow** - Authentication modal
- **LoginForm** - Email/phone login
- **LoginButton** - Social login buttons
- **InputOtpForm** - OTP verification

### Transaction (`components/buy/`, `components/send/`)

- **BuyForm** - Fiat-to-crypto purchase
- **SendForm** - Token transfer form
- **SendCollectibleForm** - Collectible transfer form

### Account Management (`components/account/`)

- **AccountDialog** - Account management modal
- Account profile and fiat balance displays
- Token balance, activity and collectibles views

### UI Components (`components/ui/`)

Radix UI primitives: Button, Dialog, Form, Input, Select, Table, and more.

## Common Use Cases

### Complete Authentication Flow

```tsx
import { PannaProvider, ConnectButton, useActiveAccount } from 'panna-sdk';
import 'panna-sdk/styles.css';

function AuthenticatedApp() {
  const account = useActiveAccount();

  if (!account) {
    return (
      <div>
        <h1>Welcome</h1>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {account.address}</h1>
    </div>
  );
}

export default function App() {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_PANNA_CLIENT_ID}
      partnerId="your-partner-id"
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID}
    >
      <AuthenticatedApp />
    </PannaProvider>
  );
}
```

### Account Balance Display

```tsx
import { useTokenBalances, useActiveAccount } from 'panna-sdk';

function AccountBalances() {
  const account = useActiveAccount();
  const { data: balances, isLoading } = useTokenBalances({
    address: account?.address || ''
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Your Balances</h3>
      {balances?.map((balance) => (
        <div key={balance.token.address}>
          {balance.displayValue} {balance.token.symbol}
          {balance.fiatValue && ` ($${balance.fiatValue.toFixed(2)})`}
        </div>
      ))}
    </div>
  );
}
```

### Custom Wallet UI

```tsx
import {
  useActiveAccount,
  useLogout,
  useTokenBalances,
  useTotalFiatBalance
} from 'panna-sdk';

function CustomWallet() {
  const account = useActiveAccount();
  const { disconnect } = useLogout();
  const { data: balances } = useTokenBalances({
    address: account?.address || ''
  });
  const { data: totalBalance } = useTotalFiatBalance({
    address: account?.address || ''
  });

  if (!account) return null;

  return (
    <div className="wallet">
      <div className="wallet-header">
        <span>{account.address.slice(0, 6)}...</span>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
      <div className="total-balance">
        <h2>${totalBalance?.toFixed(2)}</h2>
        <p>Total Balance</p>
      </div>
      <div className="token-list">
        {balances?.map((balance) => (
          <div key={balance.token.address}>
            <img src={balance.token.icon} alt={balance.token.symbol} />
            <div>
              <div>
                {balance.tokenBalance.displayValue} {balance.token.symbol}
              </div>
              <div>${balance.fiatBalance?.amount.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Dashboard with Account Dialog

```tsx
import {
  AccountDialog,
  useActiveAccount,
  useTokenBalances,
  useActivities
} from 'panna-sdk';
import { useState } from 'react';

function Dashboard() {
  const account = useActiveAccount();
  const { data: balances } = useTokenBalances({
    address: account?.address || ''
  });
  const { data: activities } = useActivities({
    address: account?.address || ''
  });
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <button onClick={() => setShowDialog(true)}>Settings</button>
      </header>
      <section>
        <h2>Balances</h2>
        {balances?.map((b) => (
          <div key={b.token.address}>
            {b.tokenBalance.displayValue} {b.token.symbol}
          </div>
        ))}
      </section>
      <section>
        <h2>Recent Activity</h2>
        {activities?.slice(0, 5).map((activity) => (
          <div key={activity.id}>{activity.description}</div>
        ))}
      </section>
      <AccountDialog address={account?.address} />
    </div>
  );
}
```

## Styling

Import default styles:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'panna-sdk/styles.css';

@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-background: var(--background);
  --color-text: var(--text);
}

:root {
  --primary: #3b82f6;
  --secondary: #6b7280;
  --accent: #10b981;
  --background: #ffffff;
  --text: #111827;
}
```

In future versions, you can customize with:

1. **Theme prop** on components like `ConnectButton` (e.g., `theme="dark"`).

```tsx
import { ConnectButton } from 'panna-sdk';

function StyledConnect() {
  return <ConnectButton theme="dark" />;
}
```

## Next Steps

- **[Hooks](../hooks/README.md)** - React hooks for data fetching
- **[Utils](../utils/README.md)** - Utility functions
- **[Types](../types/README.md)** - TypeScript types
- **[Consts](../consts/README.md)** - Constants and configuration
