# Panna SDK Development Guide

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
- **Formatting**: Prettier with 80 char lines, single quotes, semicolons, no trailing commas
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces/components, UPPER_SNAKE for constants
- **Exports**: Named exports preferred, single `export` statement per file when possible
- **React**: Functional components only, hooks for state management, no React.FC
- **Error Handling**: Throw errors with descriptive messages, handle async errors properly
- **Comments**: JSDoc for public APIs only, avoid inline comments unless critical
