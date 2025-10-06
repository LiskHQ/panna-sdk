# Panna Monorepo

This is a TypeScript monorepo for developing a Panna SDK.

## 📦 Packages

### [`panna-sdk`](./packages/panna-sdk)

> Wallet, transaction, chain and contract logic, including optional React components and hooks.

- Written in TypeScript
- Built with `tsup` (ESM + CJS)
- Contains both core logic (headless) and React UI/Hooks

---

## 🌐 Apps

### [`example-app`](./apps/example-app)

> Example Next.js 14 app demonstrating how to use the `panna-sdk`.

- React 19+ App Router
- Tailwind CSS
- Consumes `panna-sdk` directly

---

## 📚 Documentation

### Core Module Documentation

Comprehensive guides for all SDK modules are available in the core package:

**[📖 View Core Module Docs](./packages/panna-sdk/src/core/README.md)**

The documentation includes:

- **[Client](./packages/panna-sdk/src/core/client/README.md)** - SDK initialization and configuration
- **[Wallet](./packages/panna-sdk/src/core/wallet/README.md)** - User authentication and account management
- **[Transaction](./packages/panna-sdk/src/core/transaction/README.md)** - Blockchain transaction handling
- **[Chain](./packages/panna-sdk/src/core/chain/README.md)** - Network configuration
- **[Onramp](./packages/panna-sdk/src/core/onramp/README.md)** - Fiat-to-crypto gateway
- **[Utils](./packages/panna-sdk/src/core/utils/README.md)** - Helper functions and utilities

Each module includes detailed usage examples, API references, and integration guides.

---

## 🧰 Tooling

- **Monorepo:** PNPM Workspaces
- **Build:** `tsup` (for SDK bundling)
- **Testing:** `jest`, `ts-jest`
- **Linting:** `eslint`, `prettier`
- **TypeScript:** Strict mode with project references

---

## 🛠 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build SDK

```bash
pnpm --filter panna-sdk build
```

### 3. Run Example App

```bash
pnpm --filter example-app dev
```

## 🧪 Test SDK

```bash
pnpm --filter panna-sdk test
```

## 📁 Project Structure

```bash
your-monorepo/
├── apps/
│   └── example-app/        # Next.js app using the SDK
├── packages/
│   └── panna-sdk/           # Core logic + React wrappers built on thirdweb
├── pnpm-workspace.yaml     # Workspace definitions
├── tsconfig.json           # Base TS config
├── jest.config.js          # Jest config for SDK testing
├── .eslintrc.js            # Linting rules
└── .prettierrc             # Prettier formatting

```

---

## 💬 Support & Community

Need help or want to connect with the community?

**[Join our Discord](https://lisk.chat/)** - Get support, share feedback, and collaborate with other developers.

For questions, issues, or contributions, feel free to reach out through our Discord community!
