'use client';

import { Wallet } from 'lucide-react';
import { Typography } from '@/components/ui/typography';

export function NotConnectedView() {
  return (
    <section className="mx-auto w-full max-w-2xl flex-1 p-4 md:p-6">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-full bg-blue-900/30 p-6">
          <Wallet className="size-12 text-blue-600" />
        </div>

        <Typography variant="h2" className="mb-2 text-white">
          Welcome to Panna SDK
        </Typography>

        <Typography variant="lead" className="mb-8 max-w-lg text-gray-400">
          Connect your wallet to get started with the Panna SDK demo.
          Experience seamless blockchain interactions with minimal
          configuration.
        </Typography>

        <div className="space-y-4 text-left text-sm text-gray-400">
          <p>✨ Simple wallet connection</p>
          <p>⚡ Real-time balance updates</p>
          <p>🔧 Minimal SDK configuration</p>
        </div>
      </div>
    </section>
  );
}
