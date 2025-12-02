'use client';

import { chain } from 'panna-sdk/core';
import { PannaProvider } from 'panna-sdk/react';
import { SidebarProvider } from './ui/sidebar';

export function Providers(props: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      partnerId={process.env.NEXT_PUBLIC_PARTNER_ID}
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID || String(chain.lisk.id)}
      enableDevMode={process.env.NEXT_PUBLIC_ENABLE_DEV_MODE === 'true'}
      pannaApiUrl={process.env.NEXT_PUBLIC_PANNA_API_URL}
    >
      <SidebarProvider>{props.children}</SidebarProvider>
    </PannaProvider>
  );
}
