import {
  ArrowLeftIcon,
  SendIcon,
  SettingsIcon,
  TagIcon,
  XIcon
} from 'lucide-react';
import { useRef, useState } from 'react';
import { DEFAULT_CURRENCY } from 'src/core';
import { truncateAddress } from '@/utils/address';
import { useTotalFiatBalance } from '../../hooks';
import { ActivityList } from '../activity/activity-list';
import { TokensList } from '../balance/tokens-list';
import { BuyForm } from '../buy/buy-form';
import { CollectiblesList } from '../collectibles/collectibles-list';
import { SendCollectibleForm } from '../collectibles/send-collectible-form';
import { SendForm } from '../send/send-form';
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
import type { DialogStepperContextValue } from '../ui/dialog-stepper';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AccountScreensProvider } from './account-screens-provider';
import { AccountSettingsView } from './account-settings-view';
import {
  AccountView,
  AccountViewEnum,
  useAccountView
} from './account-view-provider';

type AccountDialogProps = {
  address: string;
};

export function AccountDialog({ address }: AccountDialogProps) {
  const { activeView, setActiveView } = useAccountView();
  const buyStepperRef = useRef<DialogStepperContextValue | null>(null);
  const [sendStepperContext, setSendStepperContext] =
    useState<DialogStepperContextValue | null>(null);

  const { data: balanceUsd = 0, isLoading: isLoadingUsdBalance } =
    useTotalFiatBalance({
      address,
      currency: DEFAULT_CURRENCY
    });

  const renderHeader = (view: AccountView) => {
    switch (view) {
      case AccountViewEnum.Main:
        return (
          <DialogHeader className="mb-2 items-center gap-4">
            <div className="flex w-full items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveView(AccountViewEnum.Settings)}
              >
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
      case AccountViewEnum.Settings:
        return (
          <DialogHeader className="items-center gap-0">
            <div className="flex w-full items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveView(AccountViewEnum.Main)}
              >
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
      case AccountViewEnum.Buy:
        return (
          <DialogHeader className="items-center gap-0">
            <div className="flex w-full items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (buyStepperRef.current?.canGoBack) {
                    buyStepperRef.current.prev();
                  } else {
                    setActiveView(AccountViewEnum.Main);
                  }
                }}
              >
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
      case AccountViewEnum.Send:
        return (
          <DialogHeader className="items-center gap-0">
            <div className="flex w-full items-center justify-between gap-2">
              {sendStepperContext?.stepData?.hideBackButton ? (
                <div />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (sendStepperContext?.canGoBack) {
                      sendStepperContext.prev();
                    } else {
                      setActiveView(AccountViewEnum.Main);
                    }
                  }}
                >
                  <ArrowLeftIcon
                    size={20}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  />
                </button>
              )}
              <DialogClose>
                <XIcon
                  size={20}
                  className="text-muted-foreground hover:text-primary transition-colors"
                />
              </DialogClose>
            </div>
            {/* No dialog title for Send flow; each step renders its own title */}
          </DialogHeader>
        );
      case AccountViewEnum.CollectibleDetails:
        return (
          <SendCollectibleForm
            onClose={() => setActiveView(AccountViewEnum.Main)}
          />
        );
    }
  };

  const renderContent = (view: AccountView) => {
    switch (view) {
      case AccountViewEnum.Main:
        return (
          <div className="flex flex-col items-center gap-8">
            <div className="flex w-full items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setActiveView(AccountViewEnum.Send)}
              >
                <SendIcon />
                Send
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setActiveView(AccountViewEnum.Buy)}
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
      case AccountViewEnum.Settings:
        return <AccountSettingsView />;
      case AccountViewEnum.Buy:
        return (
          <BuyForm
            onClose={() => setActiveView(AccountViewEnum.Main)}
            stepperRef={buyStepperRef}
          />
        );
      case AccountViewEnum.Send:
        return (
          <SendForm
            onStepperChange={setSendStepperContext}
            onClose={() => setActiveView(AccountViewEnum.Main)}
          />
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{truncateAddress(address)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogDescription className="sr-only">
          Select account views and manage your account settings.
        </DialogDescription>
        <AccountScreensProvider>
          {renderHeader(activeView)}
          {renderContent(activeView)}
        </AccountScreensProvider>
      </DialogContent>
    </Dialog>
  );
}
