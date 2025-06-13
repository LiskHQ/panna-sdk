import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { Providers } from '../components/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Lisk Flow Example App',
  description: 'Simple example app showcasing the Lisk Flow SDK'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col">
              <AppHeader />
              <main className="flex-1 overflow-auto">{children}</main>
            </SidebarInset>
          </div>
        </Providers>
      </body>
    </html>
  );
}
