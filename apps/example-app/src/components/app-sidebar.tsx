import { RocketIcon } from 'lucide-react';
import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';

const data = {
  navMain: [
    {
      title: 'Wallet',
      url: '#',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          isActive: true
        },
        {
          title: 'Connect Wallet',
          url: '#'
        },
        {
          title: 'Account Details',
          url: '#'
        },
        {
          title: 'Balance',
          url: '#'
        }
      ]
    },
    {
      title: 'Transactions',
      url: '#',
      items: [
        {
          title: 'Send',
          url: '#'
        },
        {
          title: 'Receive',
          url: '#'
        },
        {
          title: 'History',
          url: '#'
        },
        {
          title: 'Pending',
          url: '#'
        }
      ]
    },
    {
      title: 'Lisk Network',
      url: '#',
      items: [
        {
          title: 'Network Status',
          url: '#'
        },
        {
          title: 'Chain Explorer',
          url: '#'
        },
        {
          title: 'Validators',
          url: '#'
        },
        {
          title: 'Staking',
          url: '#'
        }
      ]
    },
    {
      title: 'Developer',
      url: '#',
      items: [
        {
          title: 'SDK Documentation',
          url: '#'
        },
        {
          title: 'API Reference',
          url: '#'
        },
        {
          title: 'Examples',
          url: '#'
        },
        {
          title: 'Testing',
          url: '#'
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <RocketIcon className="!size-5" />
                <span className="text-base font-semibold">Lisk Flow Demo</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
