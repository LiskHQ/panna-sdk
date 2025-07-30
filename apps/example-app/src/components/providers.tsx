'use client';

import { PannaProvider } from 'panna-sdk';
import { SidebarProvider } from './ui/sidebar';

export function Providers(props: { children: React.ReactNode }) {
  return (
    <PannaProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      partnerId={process.env.NEXT_PUBLIC_PARTNER_ID}
      walletEventConfig={{
        enableTracking: true,
        ecosystemId: 'ecosystem.lisk'
      }}
    >
      <SidebarProvider>{props.children}</SidebarProvider>
    </PannaProvider>
  );
}
