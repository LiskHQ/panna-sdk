import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'tsup';

// Load .env file from the same directory as this config file
config({ path: resolve(__dirname, '.env') });

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    react: 'src/react/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  splitting: true,
  outDir: 'dist',
  external: ['react', 'react-dom'],
  noExternal: ['i18n-iso-countries', 'iso-3166-1-alpha-2'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs'
    };
  },
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.json': 'json'
    };
  },
  define: {
    'process.env.PANNA_API_URL': JSON.stringify(
      process.env.PANNA_API_URL || 'https://panna-app.lisk.com/v1'
    ),
    'process.env.MOCK_PANNA_API': JSON.stringify(
      process.env.MOCK_PANNA_API || 'false'
    )
  }
});
