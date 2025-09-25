import { ArrowLeftIcon, XIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { DialogStepper } from '../ui/dialog-stepper';
import { useCollectiblesInfo } from './collectibles-provider';
import { SelectCollectibleStep } from './select-collectible-step';

type SendCollectibleFormProps = {
  onClose: () => void;
};

export function SendCollectibleForm({ onClose }: SendCollectibleFormProps) {
  const { activeCollectible, activeToken } = useCollectiblesInfo();

  if (!activeCollectible || !activeToken) {
    return null;
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="flex flex-col gap-6">
        <DialogDescription className="sr-only">
          Send {activeToken.name}
        </DialogDescription>
        <DialogHeader className="items-center gap-0">
          <DialogTitle className="sr-only">Send {activeToken.name}</DialogTitle>
          <div className="flex w-full items-center justify-between gap-2">
            <button type="button">
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
        </DialogHeader>
        <form>
          <DialogStepper>
            <SelectCollectibleStep
              collectible={activeCollectible}
              token={activeToken}
            />
            <div />
          </DialogStepper>
        </form>
      </DialogContent>
    </Dialog>
  );
}
