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
