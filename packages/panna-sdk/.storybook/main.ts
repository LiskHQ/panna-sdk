import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  viteFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': resolve(__dirname, '../src/react'),
        src: resolve(__dirname, '../src')
      }
    };

    // Define process.env for browser environment
    config.define = {
      ...config.define,
      'process.env.PANNA_API_URL': JSON.stringify(
        process.env.PANNA_API_URL || 'https://panna-app.lisk.com/v1'
      ),
      'process.env.MOCK_PANNA_API': JSON.stringify(
        process.env.MOCK_PANNA_API || 'false'
      )
    };

    return config;
  }
};
export default config;
