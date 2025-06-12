'use client';

import { FlowProvider } from 'flow-sdk';
import { SidebarProvider } from './ui/sidebar';

export function Providers(props: { children: React.ReactNode }) {
  return (
    <FlowProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
      <SidebarProvider>{props.children}</SidebarProvider>
    </FlowProvider>
  );
}
