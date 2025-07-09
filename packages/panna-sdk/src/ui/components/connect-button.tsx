import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Typography } from './ui/typography';

// import { Form, FormControl } from "./ui/form";

export function ConnectButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Connectify</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-24">
          <DialogFooter className="">
            <Typography>Powered by Panna</Typography>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
