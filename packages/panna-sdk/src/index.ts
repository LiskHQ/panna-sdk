// Main entry point - exports core and react as top-level namespaces
// For granular imports, use:
//   - import { ... } from 'panna-sdk/core' (direct core exports)
//   - import { ... } from 'panna-sdk/react' (direct react exports)

// Export core as a single namespace containing all core modules
export * as core from './core';

// Export react as a single namespace containing all react modules
export * as react from './react';

// React Query integration
export { QueryClient } from '@tanstack/react-query';
