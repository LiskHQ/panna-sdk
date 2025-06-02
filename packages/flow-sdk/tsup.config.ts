import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/ui/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  outDir: 'dist',
  external: ['react', 'react-dom', 'thirdweb', /^thirdweb\/.*/]
});
