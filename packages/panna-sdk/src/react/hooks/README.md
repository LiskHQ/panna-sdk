# Hooks Module

React hooks for managing wallet state, fetching blockchain data, and handling user interactions. Built on React Query and Thirdweb.

## Quick Start

```tsx
import { useActiveAccount, useTokenBalances } from 'panna-sdk';

function WalletDashboard() {
  const account = useActiveAccount();
  const { data: balances, isLoading } = useTokenBalances({
    address: account?.address || ''
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {balances?.map((b) => (
            <li key={b.token.address}>
              {b.tokenBalance.displayValue} {b.token.symbol}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Account Management

### useActiveAccount

Returns the currently connected account.

```tsx
import { useActiveAccount } from 'panna-sdk';

const account = useActiveAccount();
// Returns: { address: string; chainId: number; ... } | undefined
```

### useLogin / useLogout

Authenticate or disconnect users.

```tsx
import { useLogin, useLogout } from 'panna-sdk';

const { connect, isConnecting, error } = useLogin();
const { disconnect } = useLogout();
```

## Balance Hooks

### useTokenBalances

Fetch token balances with fiat conversion.

```tsx
import { useTokenBalances } from 'panna-sdk';

const {
  data: balances,
  isLoading,
  error,
  refetch
} = useTokenBalances({
  address: '0x...'
});

// Returns: TokenBalance[]
// { token: { address, symbol, name, decimals, icon }, balance, displayValue, fiatValue }
```

### useTotalFiatBalance

Calculate total fiat value.

```tsx
import { useTotalFiatBalance } from 'panna-sdk';

const { data: total } = useTotalFiatBalance({ address: '0x...' });
// Returns: number (total USD value)
```

## Activity Hooks

### useActivities

Fetch transaction history.

```tsx
import { useActivities } from 'panna-sdk';

const { data: activities } = useActivities({ address: '0x...' });
// Returns: Activity[]
// { id, type, description, timestamp, amount, token, hash }
```

### useCollectibles

Fetch NFTs/collectibles.

```tsx
import { useCollectibles } from 'panna-sdk';

const { data: collectibles } = useCollectibles({ address: '0x...' });
// Returns: Collectible[]
// { contractAddress, tokenId, name, image, collection }
```

## Fiat Integration

### useBuyWithFiatQuotes

Fetch onramp quotes.

```tsx
import { useBuyWithFiatQuotes } from 'panna-sdk';

const { data: quotes } = useBuyWithFiatQuotes({
  fromCurrencySymbol: 'USD',
  toChainId: '1135',
  toTokenAddress: '0x...',
  fromAmount: '100'
});
```

## Utility Hooks

### usePanna

Access Panna client and configuration.

```tsx
import { usePanna } from 'panna-sdk';

const { client, partnerId, chainId } = usePanna();
```

### useSupportedTokens

Get supported tokens for current chain.

```tsx
import { useSupportedTokens } from 'panna-sdk';

const { data: tokens } = useSupportedTokens();
```

## Query Configuration

Default settings:

```ts
DEFAULT_STALE_TIME = 30000; // 30 seconds
DEFAULT_REFETCH_INTERVAL = 60000; // 1 minute
DEFAULT_RETRY_DELAY = 1000; // 1 second
DEFAULT_MAX_RETRIES = 3;
```

Custom options:

```tsx
const { data } = useTokenBalances(
  { address: '0x...' },
  {
    staleTime: 60000,
    refetchInterval: 120000,
    retry: 5,
    enabled: true,
    onSuccess: (data) => console.log(data),
    onError: (error) => console.error(error)
  }
);
```

## Common Patterns

### Conditional Queries

```tsx
const account = useActiveAccount();
const { data } = useTokenBalances(
  { address: account?.address || '' },
  { enabled: !!account?.address }
);
```

### Manual Refetch

```tsx
const { data, refetch, isFetching } = useTokenBalances({ address: '0x...' });

<button onClick={() => refetch()} disabled={isFetching}>
  {isFetching ? 'Refreshing...' : 'Refresh'}
</button>;
```

### Error Handling

```tsx
const { data, error, isError, refetch } = useTokenBalances({ address: '0x...' });

if (isError) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={() => refetch()}>Try Again</button>
    </div>
  );
}
```

## Complete Example

```tsx
import {
  useActiveAccount,
  useTokenBalances,
  useActivities,
  useLogout
} from 'panna-sdk';

function Dashboard() {
  const account = useActiveAccount();
  const { data: balances, isLoading: loadingBalances } = useTokenBalances({
    address: account?.address || ''
  });
  const { data: activities, isLoading: loadingActivities } = useActivities({
    address: account?.address || ''
  });
  const { disconnect } = useLogout();

  if (!account) return <div>Please connect wallet</div>;

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <button onClick={() => disconnect()}>Logout</button>
      </header>

      <section>
        <h2>Balances</h2>
        {loadingBalances ? (
          <p>Loading...</p>
        ) : (
          balances?.map((b) => (
            <div key={b.token.address}>
              {b.tokenBalance.displayValue} {b.token.symbol} ($
              {b.fiatValue?.toFixed(2)})
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Recent Activity</h2>
        {loadingActivities ? (
          <p>Loading...</p>
        ) : (
          activities?.slice(0, 5).map((a) => (
            <div key={a.id}>
              {a.type} - {a.description}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
```

## Next Steps

- **[Components](../components/README.md)** - Pre-built React components
- **[Utils](../utils/README.md)** - Utility functions
- **[Types](../types/README.md)** - TypeScript types
- **[Consts](../consts/README.md)** - Constants and configuration
