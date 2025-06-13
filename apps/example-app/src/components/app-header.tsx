'use client';

import { LoginButton } from 'flow-sdk';
import { useActiveAccount } from 'flow-sdk';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { buttonVariants } from './ui/button';
import { Typography } from './ui/typography';

const navigationData = {
  '/': {
    title: 'Dashboard',
    section: 'Account'
  },
  '/documentation': {
    title: 'SDK Documentation',
    section: 'Resources'
  },
  '/settings': {
    title: 'Settings',
    section: 'Resources'
  }
};

export function AppHeader() {
  const activeAccount = useActiveAccount();
  const isConnected = !!activeAccount;
  const pathname = usePathname();

  const currentRoute =
    navigationData[pathname as keyof typeof navigationData] ||
    navigationData['/'];
  const pageTitle = currentRoute.title;
  const sectionTitle = currentRoute.section;

  return (
    <header className="border-border bg-card/50 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground -ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-muted-foreground">
                {sectionTitle}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {pageTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <aside className="flex items-center gap-4">
        {!isConnected && (
          <Typography variant="muted">
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
