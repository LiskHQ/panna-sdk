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

### useOnrampQuotes

Fetch real-time onramp quotes for fiat-to-crypto purchases. Returns exchange rates, fees, and estimated crypto quantity.

```tsx
import { useOnrampQuotes } from 'panna-sdk/react';

const {
  data: quote,
  isLoading,
  error,
  refetch
} = useOnrampQuotes({
  tokenSymbol: 'USDC',
  network: 'lisk',
  fiatAmount: 100,
  fiatCurrency: 'USD'
});

// Quote data structure:
// {
//   rate: number;              // Exchange rate
//   crypto_quantity: number;   // Amount of crypto user will receive
//   onramp_fee: number;        // Fee charged by provider
//   gas_fee: number;           // Estimated gas fee
//   total_fiat_amount: number; // Total amount user pays
//   quote_timestamp: string;   // When quote was generated
//   quote_validity_mins: number; // How long quote is valid
// }
```

**Parameters:**

| Parameter      | Type     | Required | Description                                 |
| -------------- | -------- | -------- | ------------------------------------------- |
| `tokenSymbol`  | `string` | Yes      | Cryptocurrency symbol (e.g., 'USDC', 'ETH') |
| `network`      | `string` | Yes      | Network name (e.g., 'lisk', 'ethereum')     |
| `fiatAmount`   | `number` | Yes      | Fiat amount to spend (must be positive)     |
| `fiatCurrency` | `string` | Yes      | Fiat currency code (e.g., 'USD', 'EUR')     |

**Query Behavior:**

- Stale time: 15 minutes
- Auto-retry: Up to 3 times (except for auth errors)
- Requires valid authentication token

### useCreateOnrampSession

Create an onramp payment session. Returns session data with redirect URL for the payment provider.

```tsx
import { useCreateOnrampSession } from 'panna-sdk/react';

const {
  mutateAsync: createSession,
  isPending,
  error
} = useCreateOnrampSession();

async function handleBuy() {
  const session = await createSession({
    tokenSymbol: 'USDC',
    network: 'lisk',
    fiatAmount: 100,
    fiatCurrency: 'USD',
    quoteData: quote, // Optional: Include quote for consistency
    redirectUrl: '/callback' // Optional: Custom redirect after payment
  });

  // Session data structure:
  // {
  //   session_id: string;   // Unique session identifier
  //   redirect_url: string; // Payment provider URL
  //   expires_at: string;   // Session expiration timestamp
  // }

  window.location.href = session.redirect_url;
}
```

**Parameters:**

| Parameter      | Type        | Required | Description                             |
| -------------- | ----------- | -------- | --------------------------------------- |
| `tokenSymbol`  | `string`    | Yes      | Cryptocurrency symbol to purchase       |
| `network`      | `string`    | Yes      | Blockchain network name                 |
| `fiatAmount`   | `number`    | Yes      | Fiat amount to spend (must be positive) |
| `fiatCurrency` | `string`    | Yes      | Fiat currency code                      |
| `quoteData`    | `QuoteData` | No       | Quote data from useOnrampQuotes         |
| `redirectUrl`  | `string`    | No       | Custom redirect URL after payment       |

### useOnrampSessionStatus

Poll the status of an onramp session. Automatically polls every 5 seconds for non-terminal states (`completed`, `failed`, `cancelled`, `expired`).

```tsx
import { useOnrampSessionStatus } from 'panna-sdk/react';

function OnrampStatus({ sessionId }: { sessionId: string }) {
  const { data, isLoading, error, refetch } = useOnrampSessionStatus({
    sessionId
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Handle different statuses
  switch (data?.status) {
    case 'created':
      return <div>Waiting for payment...</div>;
    case 'pending':
      return <div>Processing payment...</div>;
    case 'completed':
      return (
        <div>
          Success! Transaction: {data.transaction_hash}
          Amount received: {data.actual_crypto_amount}
        </div>
      );
    case 'failed':
      return <div>Failed: {data.error_message}</div>;
    case 'cancelled':
      return <div>Payment cancelled</div>;
    case 'expired':
      return <div>Session expired</div>;
  }
}
```

**Session Status Values:**

| Status      | Description                             | Terminal |
| ----------- | --------------------------------------- | -------- |
| `created`   | Session created, awaiting payment       | No       |
| `pending`   | Payment received, processing on-chain   | No       |
| `completed` | Transaction confirmed, includes tx hash | Yes      |
| `failed`    | Payment failed, includes error message  | Yes      |
| `cancelled` | User cancelled the payment              | Yes      |
| `expired`   | Session expired before payment          | Yes      |

**Query Behavior:**

- Polling interval: 5 seconds (non-terminal states only)
- Auto-stops polling on terminal states
- Requires valid session ID

### useFiatToCrypto

Convert fiat amounts to crypto amounts in real-time using current token prices.

```tsx
import { useFiatToCrypto } from 'panna-sdk/react';

const { data, isLoading } = useFiatToCrypto({
  tokenAddress: '0x...',
  fiatAmount: 100,
  currency: 'USD'
});

// Returns: { cryptoAmount: number; currency: string }
```

### useBuyWithFiatQuotes (Legacy)

Fetch onramp quotes using the older interface.

```tsx
import { useBuyWithFiatQuotes } from 'panna-sdk/react';

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

## Complete Onramp Flow Example

```tsx
import {
  useOnrampQuotes,
  useCreateOnrampSession,
  useOnrampSessionStatus,
  useSupportedTokens,
  useActiveAccount,
  OnrampMoneySessionStatusEnum
} from 'panna-sdk/react';
import { useState, useEffect } from 'react';

type BuyStep = 'select' | 'confirm' | 'processing' | 'complete';

function CompleteBuyFlow() {
  const account = useActiveAccount();
  const [step, setStep] = useState<BuyStep>('select');
  const [amount, setAmount] = useState(100);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch quote when amount changes
  const {
    data: quote,
    isLoading: quoteLoading,
    error: quoteError
  } = useOnrampQuotes({
    tokenSymbol: 'USDC',
    network: 'lisk',
    fiatAmount: amount,
    fiatCurrency: 'USD'
  });

  // Session creation mutation
  const {
    mutateAsync: createSession,
    isPending: creating,
    error: sessionError
  } = useCreateOnrampSession();

  // Poll session status
  const { data: status } = useOnrampSessionStatus(
    { sessionId: sessionId || '' },
    { enabled: !!sessionId }
  );

  // Watch for status changes
  useEffect(() => {
    if (status?.status === 'completed') {
      setStep('complete');
    }
  }, [status?.status]);

  async function handleConfirm() {
    if (!quote) return;

    try {
      const session = await createSession({
        tokenSymbol: 'USDC',
        network: 'lisk',
        fiatAmount: amount,
        fiatCurrency: 'USD',
        quoteData: quote
      });

      setSessionId(session.session_id);
      setStep('processing');

      // Open payment in new window (or redirect)
      window.open(session.redirect_url, '_blank');
    } catch (err) {
      // Error is captured in sessionError
      console.error('Session creation failed:', err);
    }
  }

  if (!account) {
    return <div>Please connect your wallet first</div>;
  }

  return (
    <div>
      {step === 'select' && (
        <div>
          <h2>Buy USDC</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={10}
          />
          {quoteLoading && <p>Fetching quote...</p>}
          {quoteError && <p>Error: {quoteError.message}</p>}
          {quote && (
            <div>
              <p>You'll receive: ~{quote.crypto_quantity.toFixed(2)} USDC</p>
              <p>Rate: 1 USDC = ${quote.rate.toFixed(4)}</p>
              <p>Fee: ${quote.onramp_fee.toFixed(2)}</p>
            </div>
          )}
          <button
            onClick={() => setStep('confirm')}
            disabled={!quote || quoteLoading}
          >
            Continue
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div>
          <h2>Confirm Purchase</h2>
          <p>Amount: ${amount} USD</p>
          <p>Receive: ~{quote?.crypto_quantity.toFixed(2)} USDC</p>
          <p>Total (with fees): ${quote?.total_fiat_amount.toFixed(2)}</p>
          <button onClick={handleConfirm} disabled={creating}>
            {creating ? 'Creating session...' : 'Confirm & Pay'}
          </button>
          <button onClick={() => setStep('select')}>Back</button>
          {sessionError && (
            <>
              <p>Error: {sessionError.message}</p>
              <button onClick={() => handleConfirm()}>Retry</button>
            </>
          )}
        </div>
      )}

      {step === 'processing' && (
        <div>
          <h2>Processing Payment</h2>
          <p>Status: {status?.status || 'Waiting...'}</p>
          {status?.status === 'pending' && (
            <p>Payment received, processing on-chain...</p>
          )}
          {status?.status === 'failed' && (
            <p>
              Payment failed:{' '}
              {(status as OnrampMoneySessionStatusEnum.Failed).error_message}
            </p>
          )}
        </div>
      )}

      {step === 'complete' && (
        <div>
          <h2>Purchase Complete!</h2>
          <p>Transaction: {status?.transaction_hash}</p>
          <p>Amount received: {status?.actual_crypto_amount} USDC</p>
          <button onClick={() => setStep('select')}>Buy More</button>
        </div>
      )}
    </div>
  );
}
```

## Next Steps

- **[Components](../components/README.md)** - Pre-built React components
- **[Utils](../utils/README.md)** - Utility functions
- **[Types](../types/README.md)** - TypeScript types
- **[Consts](../consts/README.md)** - Constants and configuration
