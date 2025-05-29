import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    ui: 'src/ui/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  external: ['react', 'react-dom', 'thirdweb', /^thirdweb\/.*/],
  outDir: 'dist'
});
