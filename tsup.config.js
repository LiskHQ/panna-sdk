import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true
});
// This configuration file is for building a TypeScript project using tsup.
// It specifies the entry point, output formats (ESM and CJS), enables type definitions,
// generates source maps, cleans the output directory before building, and uses the default settings for other options.
// The 'entry' field indicates the main file of the project, which is 'src/index.ts'.
// The 'format' field specifies that both ESM (ECMAScript Modules) and CJS (CommonJS) formats will be generated.
// The 'dts' option enables the generation of TypeScript declaration files.
// The 'sourcemap' option allows for the generation of source maps, which can help with debugging.
// The 'clean' option ensures that the output directory is cleaned before each build, removing any old files.
// This setup is useful for libraries or applications that need to be distributed in multiple formats
// and want to provide type definitions for TypeScript users.
// To use this configuration, ensure you have tsup installed in your project.
// You can run the build process using the command: npx tsup
// or add a script in your package.json like:
// "build": "tsup"
// This will execute the build process as defined in this configuration file.
// Make sure to adjust the 'entry' path if your main file is located elsewhere.
// For more advanced configurations, you can refer to the tsup documentation:
// https://tsup.egoist.dev
// This file is typically placed at the root of your project directory.
// It is a common practice to use TypeScript for building libraries or applications
// to take advantage of type checking and modern JavaScript features.
