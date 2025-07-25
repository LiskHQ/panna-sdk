import {
  ArrowLeftIcon,
  SendIcon,
  SettingsIcon,
  TagIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';
import { lisk } from '../../../core';
import {
  useActiveAccount,
  useAccountBalance,
  usePanna,
  useFiatBalance
} from '../../hooks';
import { ActivityList } from '../activity/activity-list';
import { TokensList } from '../balance/tokens-list';
import { CollectiblesList } from '../collectibles/collectibles-list';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AccountSettingsView } from './account-settings-view';

type AccountView = 'main' | 'settings';

export function AccountDialog() {
  const [activeView, setActiveView] = useState<AccountView>('main');

  const activeAccount = useActiveAccount();
  const { client } = usePanna();

  const { data: accountBalance, isLoading: isLoadingBalance } =
    useAccountBalance({
      address: activeAccount?.address || '',
      client: client!,
      chain: lisk
    });

  const { fiatBalance: balanceUsd, isLoading: isLoadingUsdBalance } =
    useFiatBalance({
      balance: accountBalance?.displayValue,
      chain: lisk,
      currency: 'USD'
    });

  if (!activeAccount) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Account</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader className="items-center">
            <div className="flex w-full items-center justify-end gap-2">
              <DialogClose>
                <XIcon
                  size={20}
                  className="text-muted-foreground hover:text-primary transition-colors"
                />
              </DialogClose>
            </div>
            <DialogTitle>No Account Connected</DialogTitle>
            <DialogDescription>
              Connect your wallet to view account information
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const renderHeader = (view: AccountView) => {
    switch (view) {
      case 'main':
        return (
          <DialogHeader className="items-center">
            <div className="flex w-full items-center justify-between gap-2">
              <button type="button" onClick={() => setActiveView('settings')}>
                <SettingsIcon
                  size={20}
                  className="text-muted-foreground hover:text-primary transition-colors"
                />
              </button>
              <DialogClose>
                <XIcon
                  size={20}
                  className="text-muted-foreground hover:text-primary transition-colors"
                />
              </DialogClose>
            </div>
            <DialogTitle className="text-5xl">
              {isLoadingBalance || isLoadingUsdBalance
                ? '...'
                : `$${balanceUsd.toFixed(2)}`}
            </DialogTitle>
            <DialogDescription>Total value</DialogDescription>
          </DialogHeader>
        );
      case 'settings':
        return (
          <DialogHeader className="items-center">
            <div className="flex w-full items-center justify-between gap-2">
              <button type="button" onClick={() => setActiveView('main')}>
                <ArrowLeftIcon
                  size={20}
                  className="text-muted-foreground hover:text-primary transition-colors"
                />
              </button>
              <DialogClose>
                <XIcon
                  size={20}
                  className="text-muted-foreground hover:text-primary transition-colors"
                />
              </DialogClose>
            </div>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
        );
    }
  };

  const renderContent = (view: AccountView) => {
    switch (view) {
      case 'main':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex w-full items-center gap-2">
              <Button type="button" variant="outline" className="flex-1">
                <SendIcon />
                Send
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                <TagIcon />
                Buy
              </Button>
            </div>
            <Separator orientation="horizontal" />
            <Tabs defaultValue="balance" className="w-full items-center">
              <TabsList>
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="balance">
                <TokensList className="py-4" />
              </TabsContent>
              <TabsContent value="collectibles">
                <CollectiblesList className="py-4" />
              </TabsContent>
              <TabsContent value="activity">
                <ActivityList className="py-4" />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'settings':
        return <AccountSettingsView />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        {renderHeader(activeView)}
        {renderContent(activeView)}
      </DialogContent>
    </Dialog>
  );
}
