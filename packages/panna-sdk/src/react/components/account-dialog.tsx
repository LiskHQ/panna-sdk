import { SendIcon, TagIcon } from 'lucide-react';
import { Address } from 'thirdweb';
import { USER_ADDRESS } from '@/consts';
import { truncateAddress } from '@/utils/address';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AccountDialog() {
  const lsUserAddress = localStorage.getItem(USER_ADDRESS) as Address;
  const balanceUsd = 32;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{truncateAddress(lsUserAddress)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center">
          <DialogTitle className="text-5xl">${balanceUsd}</DialogTitle>
          <DialogDescription>Total value</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full items-center gap-2">
            <Button type="button" className="flex-1">
              <SendIcon />
              Send
            </Button>
            <Button type="button" className="flex-1">
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
            <TabsContent value="balance">Balance</TabsContent>
            <TabsContent value="collectibles">Collectibles</TabsContent>
            <TabsContent value="activity">Activity</TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
