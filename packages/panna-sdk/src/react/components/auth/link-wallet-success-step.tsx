import { KeyIcon, PlusIcon, XIcon } from 'lucide-react';
import { useDialog } from '@/hooks';
import { Button } from '../ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';

export function LinkWalletSuccessStep() {
  const { reset, goToStep } = useDialogStepper();
  const { onClose } = useDialog();
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <DialogContent showCloseButton={false}>
      <DialogDescription className="sr-only">
        Secure your account
      </DialogDescription>
      <div className="flex flex-col items-center gap-6">
        <DialogHeader className="w-full gap-0">
          <DialogTitle className="justify flex self-end">
            <DialogClose>
              <XIcon
                size={20}
                className="text-muted-foreground hover:text-primary right-4 transition-colors"
                onClick={handleClose}
              />
            </DialogClose>
          </DialogTitle>
          <Typography variant="h4" className="text-center">
            Secure your account
          </Typography>
        </DialogHeader>
        <KeyIcon className="h-20 w-20" />
        <Typography variant="muted" className="text-center">
          Link another account for added protection. This helps make sure you
          can always get back into your account.
        </Typography>
        <div className="flex w-full flex-col gap-2">
          <Button
            variant="outline"
            type="button"
            className="flex w-full justify-center gap-2"
            onClick={() => goToStep(0)}
          >
            <PlusIcon />
            <Typography className="mt-0!">Link another account</Typography>
          </Button>
          <Button
            variant="ghost"
            type="button"
            className="w-full"
            onClick={handleClose}
          >
            Continue
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
