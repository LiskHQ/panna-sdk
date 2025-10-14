# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
pnpm lint                          # Lint entire monorepo
pnpm test                          # Run all tests
pnpm --filter panna-sdk test       # Run SDK tests only
pnpm --filter panna-sdk test -- path/to/test.ts  # Run single test file
pnpm format                        # Auto-format code with Prettier
pnpm --filter panna-sdk build      # Build SDK package
pnpm --filter example-app dev      # Run example app in dev mode
```

## Code Style Guidelines

- **TypeScript**: Strict mode enabled, avoid `any` types, use explicit return types for public APIs
- **Imports**: Sorted by @trivago/prettier-plugin, use `@/` alias for internal imports
- **Formatting**: Prettier with 80 char lines, single quotes, semicolons, trailing commas where valid
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces/components, UPPER_SNAKE for constants
- **Exports**: Named exports preferred, single `export` statement per file when possible
- **React**: Functional components only, hooks for state management, no React.FC
- **Error Handling**: Throw errors with descriptive messages, handle async errors properly
- **Comments**: JSDoc for public APIs only, avoid inline comments unless critical

## Architecture Overview

This is a TypeScript monorepo for the Panna SDK, a blockchain wallet SDK built on top of Thirdweb.

### Monorepo Structure

- **`packages/panna-sdk`**: Core SDK package containing both headless logic and React UI components
- **`apps/example-app`**: Next.js 15 example app demonstrating SDK usage
- **Build System**: PNPM workspaces with project references
- **Testing**: Jest with separate configurations for core (node) and React (jsdom) tests

### SDK Architecture (`packages/panna-sdk`)

The SDK is split into two main parts:

#### Core (`src/core/`)

Headless, framework-agnostic logic:

- **Client** (`client/`): `createPannaClient()` wraps Thirdweb client creation
- **Wallet** (`wallet/`): Authentication methods (email, phone, social), account management, linking/unlinking accounts
- **Chain** (`chain/`): Chain definitions (Lisk, Lisk Sepolia) and chain metadata
- **Transaction** (`transaction/`): Transaction preparation, contract calls, sending transactions
- **Onramp** (`onramp/`): Fiat-to-crypto onramp integration, provider management, quote fetching
- **Util** (`util/`): Balance calculations, activity fetching, collectibles, fiat price conversion, address validation

#### React (`src/react/`)

React-specific UI components and hooks:

- **Components** (`components/`):
  - `PannaProvider`: Root provider wrapping Thirdweb's `ThirdwebProvider` and React Query
  - `AccountEventProvider`: Manages wallet connection/disconnection events
  - Auth flows, buy/send forms, activity lists, collectibles, account dialogs
  - UI primitives from Radix UI (buttons, dialogs, forms, tables, etc.)
- **Hooks** (`hooks/`): React hooks for token balances, activities, collectibles, fiat quotes, account management
- **Utils** (`utils/`): React-specific utilities (address formatting, country helpers, query utilities)

### Key Dependencies

- **Thirdweb**: Core blockchain functionality (wallet, client, transactions)
- **Viem**: Ethereum utilities
- **React Query**: Async state management for React hooks
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Styling (with `clsx` and `tailwind-merge`)
- **React Hook Form + Zod**: Form handling and validation

### Build & Bundle

- **Builder**: `tsup` generates both ESM (`.mjs`) and CJS (`.cjs`) outputs
- **CSS**: Tailwind styles built separately via PostCSS
- **Exports**: Package provides three entry points:
  - **Main** (`panna-sdk`): All exports (core + react)
  - **Core** (`panna-sdk/core`): Framework-agnostic core functions only
  - **React** (`panna-sdk/react`): React components and hooks only
  - **Styles** (`panna-sdk/styles.css`): Tailwind styles
- **Environment Variables**: Injected at build time via tsup config (`PANNA_API_URL`, `MOCK_PANNA_API`). Define these in a `.env` file in `packages/panna-sdk/`.

### Import Patterns

The SDK provides modular imports for optimal tree-shaking:

```typescript
// 1. Core only (for backend, Node.js, or non-React frameworks)
import { client, transaction, wallet } from 'panna-sdk/core';
const pannaClient = client.createPannaClient({ clientId: 'your-client-id' });

// 2. React only (for React applications)
import { ConnectButton, usePanna } from 'panna-sdk/react';

// 3. Alternative: Import from main entry (both core and react)
import { core, react } from 'panna-sdk';
const pannaClient = core.client.createPannaClient({ clientId: 'your-client-id' });
const MyApp = () => <react.ConnectButton />;
```

**Recommended usage:**

- Use `panna-sdk/core` for backend code, Node.js scripts, or non-React frameworks
- Use `panna-sdk/react` when building React apps
- Use `panna-sdk` (main entry) for convenience when using both core and react features

### Testing Setup

- **Jest Projects**: Separate configs for core (node) and React (jsdom) tests
- **File Patterns**:
  - Core tests: `src/core/**/*.test.ts`
  - React tests: `src/react/**/*.test.{ts,tsx}`
  - Fixture tests excluded: `*.fixture.test.ts`
- **Module Aliases**: `@/` maps to `src/react/` for React tests, `src/` for core tests
- **Running Single Test**: `pnpm --filter panna-sdk test -- path/to/test.ts`

### Example App (`apps/example-app`)

- **Framework**: Next.js 15 with App Router (React 19)
- **Development**: `pnpm --filter example-app dev` (uses Turbopack)
- **Workspace Dependency**: Consumes `panna-sdk` via `workspace:^` protocol

## Environment Variables

SDK requires configuration via environment variables:

- `PANNA_API_URL`: API endpoint (default: https://api.panna.dev)
- `MOCK_PANNA_API`: Enable API mocking for tests (default: false)

Create `.env` file in `packages/panna-sdk/` for local development.

## Available Agents

### git-branch-reviewer

Use when you need to review code changes before creating a PR. The agent analyzes diffs, identifies issues, and provides categorized feedback.

**Usage**: "Review my branch changes" or "Is my branch ready for PR?"
