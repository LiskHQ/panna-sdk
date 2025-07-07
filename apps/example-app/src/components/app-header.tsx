'use client';

import { LoginButton, useActiveAccount } from 'panna-sdk';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { buttonVariants } from './ui/button';
import { Typography } from './ui/typography';

const navigationData = {
  '/': 'Account',
  '/documentation': 'SDK Documentation',
  '/settings': 'Settings'
};

export function AppHeader() {
  const activeAccount = useActiveAccount();
  const isConnected = !!activeAccount;
  const pathname = usePathname();

  const currentRoute =
    navigationData[pathname as keyof typeof navigationData] ||
    navigationData['/'];
  const pageTitle = currentRoute;

  return (
    <header
      data-slot="app-header"
      className="bg-sidebar text-sidebar-foreground border-sidebar-border flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4"
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-sidebar-foreground/70 -ml-1" />
        <Separator
          orientation="vertical"
          className="bg-sidebar-border mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sidebar-foreground font-medium">
                {pageTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <aside className="flex items-center gap-4">
        {!isConnected && (
          <Typography variant="muted" className="text-sidebar-foreground/70">
            Get started by connecting your wallet
          </Typography>
        )}
        <LoginButton
          connectButton={{
            className: buttonVariants({ variant: 'default' }),
            style: {
              height: '36px',
              minWidth: 'auto',
              fontSize: '14px',
              padding: '8px 16px'
            }
          }}
        />
      </aside>
    </header>
  );
}
