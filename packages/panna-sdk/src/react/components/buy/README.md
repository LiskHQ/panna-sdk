# Buy/Onramp Components

Pre-built React components for implementing fiat-to-crypto purchases. These components provide a complete multi-step wizard for users to buy cryptocurrency using fiat currency.

## Table of Contents

- [Buy/Onramp Components](#buyonramp-components)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Components](#components)
    - [BuyForm](#buyform)
    - [SelectBuyRegionStep](#selectbuyregionstep)
    - [SelectBuyTokenStep](#selectbuytokenstep)
    - [SpecifyBuyAmountStep](#specifybuynamountstep)
    - [SelectBuyProviderStep](#selectbuyproviderstep)
    - [ProcessingBuyStep](#processingbuystep)
    - [StatusStep](#statusstep)
  - [Form Schema](#form-schema)
  - [Usage Examples](#usage-examples)
    - [Basic Usage](#basic-usage)
    - [With Dialog](#with-dialog)
    - [Accessing Stepper Context](#accessing-stepper-context)
  - [Error Handling](#error-handling)
  - [Customization](#customization)

## Overview

The buy flow consists of six sequential steps:

1. **Region Selection**: User selects their country (affects available providers)
2. **Token Selection**: User chooses which cryptocurrency to purchase
3. **Amount Specification**: User enters the fiat amount to spend
4. **Provider Selection**: User selects a payment provider and views quotes
5. **Processing**: Session is created and user completes payment
6. **Status**: Final confirmation or error display

## Components

### BuyForm

The main container component that orchestrates the entire buy flow.

```tsx
import { BuyForm, type DialogStepperContextValue } from 'panna-sdk/react';
import { useRef } from 'react';

function BuyDialog({ onClose }: { onClose: () => void }) {
  const stepperRef = useRef<DialogStepperContextValue | null>(null);

  return <BuyForm onClose={onClose} stepperRef={stepperRef} />;
}
```

**Props:**

| Prop         | Type                                   | Required | Description                       |
| ------------ | -------------------------------------- | -------- | --------------------------------- |
| `onClose`    | `() => void`                           | Yes      | Callback when dialog should close |
| `stepperRef` | `RefObject<DialogStepperContextValue>` | Yes      | Ref to access stepper context     |

### SelectBuyRegionStep

Country/region selection with automatic detection.

**Features:**

- Auto-detects user's country on mount
- Searchable country list
- Displays country flags
- Validates ISO 3166-1 alpha-2 codes

**Form Data Updated:**

```ts
{
  country: {
    code: string; // 2-letter ISO code (e.g., 'US')
    name: string; // Country name (e.g., 'United States')
    flag: string; // Flag emoji
  }
}
```

### SelectBuyTokenStep

Token selection with search functionality.

**Features:**

- Displays supported tokens for current chain
- Shows token icons and symbols
- Searchable token list
- Uses `useSupportedTokens` hook internally

**Form Data Updated:**

```ts
{
  token: {
    address: string;  // Token contract address
    symbol: string;   // Token symbol (e.g., 'USDC')
    name: string;     // Token name (e.g., 'USD Coin')
    icon?: string;    // Token icon URL
  }
}
```

### SpecifyBuyAmountStep

Fiat amount input with real-time crypto conversion.

**Features:**

- Currency input based on selected country
- Real-time conversion to crypto amount
- Uses `useFiatToCrypto` hook for conversion
- Validates amount is positive

**Form Data Updated:**

```ts
{
  fiatAmount: number; // Fiat amount entered
  cryptoAmount: number; // Calculated crypto amount
}
```

### SelectBuyProviderStep

Payment provider selection with quote display.

**Features:**

- Shows available providers for user's country
- Displays real-time quotes with fees
- Uses `useOnrampQuotes` hook
- Shows provider logos and descriptions

**Form Data Updated:**

```ts
{
  provider: {
    providerId: string;
    providerName: string;
    providerDescription?: string;
    providerLogoUrl?: string;
    redirectUrl?: string;
    quote: QuoteData;
  }
}
```

### ProcessingBuyStep

Session creation and payment processing.

**Features:**

- Creates onramp session via `useCreateOnrampSession`
- Polls session status via `useOnrampSessionStatus`
- Automatically advances on completion
- Handles payment window/redirect

**Behavior:**

1. Creates session on mount
2. Opens payment provider URL
3. Polls status every 5 seconds
4. Advances to StatusStep on terminal status

### StatusStep

Final status display showing success, error, or expiration.

**Features:**

- Shows success with transaction hash
- Displays error messages for failures
- Handles expired sessions
- Provides retry/close options

**Status Types:**

| Status      | Display                               |
| ----------- | ------------------------------------- |
| `completed` | Success message with transaction link |
| `failed`    | Error message with retry option       |
| `cancelled` | Cancellation notice                   |
| `expired`   | Expiration notice with restart option |

## Form Schema

The buy form uses Zod for validation:

```ts
import { z } from 'zod';

// Country schema
const countrySchema = z.object({
  code: z
    .string()
    .length(2)
    .regex(/^[A-Z]{2}$/),
  name: z.string().min(1),
  flag: z.string().min(1)
});

// Token schema
const tokenSchema = z.object({
  address: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().optional()
});

// Quote data schema
const quoteDataSchema = z.object({
  rate: z.number(),
  crypto_quantity: z.number(),
  onramp_fee: z.number(),
  gas_fee: z.number(),
  total_fiat_amount: z.number(),
  quote_timestamp: z.string(),
  quote_validity_mins: z.number()
});

// Provider schema
const selectedProviderSchema = z.object({
  providerId: z.string().min(1),
  providerName: z.string().min(1),
  providerDescription: z.string().optional(),
  providerLogoUrl: z.string().optional(),
  redirectUrl: z.string().url().optional(),
  quote: quoteDataSchema
});

// Complete form schema
const buyFormSchema = z.object({
  country: countrySchema.optional(),
  token: tokenSchema.optional(),
  fiatAmount: z.number().gt(0).optional(),
  cryptoAmount: z.number().optional(),
  provider: selectedProviderSchema.optional()
});

type BuyFormData = z.infer<typeof buyFormSchema>;
```

## Usage Examples

### Basic Usage

```tsx
import { BuyForm } from 'panna-sdk/react';
import { useRef } from 'react';

function BuyPage() {
  const stepperRef = useRef(null);

  return (
    <div className="buy-container">
      <h1>Buy Crypto</h1>
      <BuyForm onClose={() => console.log('Closed')} stepperRef={stepperRef} />
    </div>
  );
}
```

### With Dialog

```tsx
import { BuyForm, Dialog, DialogContent, DialogTrigger } from 'panna-sdk/react';
import { useRef, useState } from 'react';

function BuyDialog() {
  const [open, setOpen] = useState(false);
  const stepperRef = useRef(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>Buy Crypto</button>
      </DialogTrigger>
      <DialogContent>
        <BuyForm onClose={() => setOpen(false)} stepperRef={stepperRef} />
      </DialogContent>
    </Dialog>
  );
}
```

### Accessing Stepper Context

```tsx
import { BuyForm, type DialogStepperContextValue } from 'panna-sdk/react';
import { useRef, useEffect } from 'react';

function BuyWithStepperAccess() {
  const stepperRef = useRef<DialogStepperContextValue | null>(null);

  useEffect(() => {
    // Access stepper methods after mount
    if (stepperRef.current) {
      console.log('Current step:', stepperRef.current.currentStep);
    }
  }, []);

  function goToNextStep() {
    stepperRef.current?.next();
  }

  function goToPreviousStep() {
    stepperRef.current?.prev();
  }

  function goToStep(index: number) {
    stepperRef.current?.goToStep(index);
  }

  return (
    <div>
      <BuyForm onClose={() => {}} stepperRef={stepperRef} />
      <div className="external-controls">
        <button onClick={goToPreviousStep}>Back</button>
        <button onClick={goToNextStep}>Next</button>
      </div>
    </div>
  );
}
```

### Error Handling

The buy components handle various error scenarios:

#### Quote Errors

```tsx
// Handled internally by SelectBuyProviderStep
// - Authentication errors: Prompts user to sign in
// - Network errors: Shows retry button
// - Invalid parameters: Validation feedback
```

#### Session Errors

```tsx
// Handled internally by ProcessingBuyStep
// - Missing auth token: Error message displayed
// - Missing wallet: Error message displayed
// - API errors: Shown in StatusStep
```

#### Status Errors

```tsx
// StatusStep displays appropriate UI for each status:
// - 'failed': Shows error_message from response
// - 'cancelled': Shows cancellation notice
// - 'expired': Shows expiration with retry option
```

#### Custom Error Handling

```tsx
import { BuyForm } from 'panna-sdk/react';
import { useRef, useState } from 'react';

function BuyWithCustomErrors() {
  const stepperRef = useRef(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <BuyForm
        onClose={() => {
          // Handle close - could be success or user cancellation
        }}
        stepperRef={stepperRef}
      />
    </div>
  );
}
```

## Customization

### Styling

The components use Tailwind CSS classes. Override styles using:

```tsx
// 1. CSS overrides
<div className="buy-form-wrapper">
  <style>{`
    .buy-form-wrapper .panna-input { ... }
    .buy-form-wrapper .panna-button { ... }
  `}</style>
  <BuyForm ... />
</div>

// 2. Tailwind overrides
// In globals.css, customize the theme
```

### Building Custom Steps

If you need custom behavior, you can build your own flow using the hooks:

```tsx
import {
  useOnrampQuotes,
  useCreateOnrampSession,
  useOnrampSessionStatus,
  useSupportedTokens
} from 'panna-sdk/react';

function CustomBuyFlow() {
  // Use hooks to build custom UI
  const { data: tokens } = useSupportedTokens();
  const { data: quote } = useOnrampQuotes({ ... });
  const { mutateAsync: createSession } = useCreateOnrampSession();
  const { data: status } = useOnrampSessionStatus({ ... });

  // Build your own step-by-step UI
  return (
    <div>
      {/* Custom implementation */}
    </div>
  );
}
```

## Next Steps

- **[Hooks](../../hooks/README.md)** - Onramp React hooks documentation
- **[Core Onramp](../../../core/onramp/README.md)** - Core onramp functions
- **[Components](../README.md)** - All React components
