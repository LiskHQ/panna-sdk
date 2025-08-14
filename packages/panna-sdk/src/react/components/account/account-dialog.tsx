import {
  ArrowLeftIcon,
  SendIcon,
  SettingsIcon,
  TagIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';
import { truncateAddress } from '@/utils/address';
import { useTotalFiatBalance } from '../../hooks';
import { ActivityList } from '../activity/activity-list';
import { TokensList } from '../balance/tokens-list';
import { BuyFlow } from '../buy/buy-flow';
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

type AccountView = 'main' | 'settings' | 'buy';

type AccountDialogProps = {
  address: string;
};

export function AccountDialog({ address }: AccountDialogProps) {
  const [activeView, setActiveView] = useState<AccountView>('main');

  const { data: balanceUsd = 0, isLoading: isLoadingUsdBalance } =
    useTotalFiatBalance({
      address,
      currency: 'USD'
    });

  const renderHeader = (view: AccountView) => {
    switch (view) {
      case 'main':
        return (
          <DialogHeader className="items-center gap-0">
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
            <div className="flex flex-col items-center gap-2">
              <DialogTitle className="text-4xl">
                {isLoadingUsdBalance ? '...' : `$${balanceUsd.toFixed(2)}`}
              </DialogTitle>
              <DialogDescription>Total value</DialogDescription>
            </div>
          </DialogHeader>
        );
      case 'settings':
        return (
          <DialogHeader className="items-center gap-0">
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
      case 'buy':
        return (
          <DialogHeader className="items-center gap-0">
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
            {/* No dialog title for Buy flow; each step renders its own title */}
          </DialogHeader>
        );
    }
  };

  const renderContent = (view: AccountView) => {
    switch (view) {
      case 'main':
        return (
          <div className="flex flex-col items-center gap-8">
            <div className="flex w-full items-center gap-4">
              <Button type="button" variant="outline" className="flex-1">
                <SendIcon />
                Send
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setActiveView('buy')}
              >
                <TagIcon />
                Buy
              </Button>
            </div>
            <Separator orientation="horizontal" />
            <Tabs defaultValue="balance" className="w-full items-center gap-6">
              <TabsList>
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent
                value="balance"
                className="max-h-80 w-full overflow-y-auto"
              >
                <TokensList />
              </TabsContent>
              <TabsContent
                value="collectibles"
                className="max-h-[400px] w-full overflow-y-auto"
              >
                <CollectiblesList />
              </TabsContent>
              <TabsContent
                value="activity"
                className="max-h-80 w-full overflow-y-auto"
              >
                <ActivityList />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'settings':
        return <AccountSettingsView />;
      case 'buy':
        return <BuyFlow onClose={() => setActiveView('main')} />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{truncateAddress(address)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        {renderHeader(activeView)}
        {renderContent(activeView)}
      </DialogContent>
    </Dialog>
  );
}
