import { ChevronLeftIcon, CircleXIcon, XIcon } from 'lucide-react';
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
import { AccountDialogFooter } from './auth-flow';

export function SocialLoginErrorDialog() {
  const { goToStep, prev, reset, stepData } = useDialogStepper();
  const { onClose } = useDialog();
  const errorMessage = (stepData?.error as string) || 'Login window closed';

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <DialogContent showCloseButton={false}>
      <DialogDescription className="sr-only">
        Pending social login dialog
      </DialogDescription>
      <div className="flex flex-col gap-6 text-center">
        <DialogHeader>
          <DialogTitle className="flex justify-between text-center">
            <ChevronLeftIcon
              className="text-muted-foreground hover:text-primary left-4"
              data-testid="back-icon"
              onClick={() => goToStep(0)}
            />
            <DialogClose>
              <XIcon
                size={20}
                className="text-muted-foreground hover:text-primary right-4 transition-colors"
                data-testid="close-icon"
                onClick={handleClose}
              />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <Typography variant="h4" as="p">
          Sign in
        </Typography>
        <div className="flex flex-col items-center gap-3">
          <CircleXIcon size={80} className="h-20 w-20 stroke-[#FF6366]" />
          <Typography variant="muted">{errorMessage}</Typography>
        </div>
        <Button className="w-full" onClick={() => prev()}>
          Try again
        </Button>
        <AccountDialogFooter />
      </div>
    </DialogContent>
  );
}
