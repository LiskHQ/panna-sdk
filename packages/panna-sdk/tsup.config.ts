import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'tsup';

// Load .env file from the same directory as this config file
config({ path: resolve(__dirname, '.env') });

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  splitting: true,
  outDir: 'dist',
  external: ['react', 'react-dom'],
  define: {
    'process.env.PANNA_API_URL': JSON.stringify(
      process.env.PANNA_API_URL || 'https://api.panna.dev'
    ),
    'process.env.MOCK_PANNA_API': JSON.stringify(
      process.env.MOCK_PANNA_API || 'false'
    )
  }
});
