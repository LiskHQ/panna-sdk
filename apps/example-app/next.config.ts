import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['panna-sdk'],
  experimental: {
    optimizePackageImports: ['panna-sdk']
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/account',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
