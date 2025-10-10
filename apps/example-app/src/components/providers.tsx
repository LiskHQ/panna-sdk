'use client';

import { chain, PannaProvider } from 'panna-sdk';
import { SidebarProvider } from './ui/sidebar';

export function Providers(props: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      partnerId={process.env.NEXT_PUBLIC_PARTNER_ID}
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID || String(chain.lisk.id)}
    >
      <SidebarProvider>{props.children}</SidebarProvider>
    </PannaProvider>
  );
}
