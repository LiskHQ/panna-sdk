import { ExternalLinkIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type ProcessingBuyStepProps = {
  onClose: () => void;
  form: UseFormReturn<BuyFormData>;
};

export function ProcessingBuyStep({ onClose, form }: ProcessingBuyStepProps) {
  const { reset } = useDialogStepper();
  const formData = form.getValues();
  const [redirected, setRedirected] = useState(false);

  const selectedProvider = formData.provider;
  const purchaseUrl = selectedProvider?.sessionUrl;

  useEffect(() => {
    if (purchaseUrl && !redirected) {
      // Open the purchase URL in a new window
      window.open(purchaseUrl, '_blank', 'noopener,noreferrer');
      setRedirected(true);
    }
  }, [purchaseUrl, redirected]);

  const handleRetryRedirect = () => {
    if (purchaseUrl) {
      window.open(purchaseUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Complete your purchase</DialogTitle>
      </DialogHeader>

      {purchaseUrl ? (
        <>
          <Loader2Icon size={48} className="animate-spin" />
          <div className="space-y-2 text-center">
            <Typography variant="muted">
              You've been redirected to {selectedProvider?.providerName} to
              complete your purchase.
            </Typography>
            <Typography variant="muted">
              If the window didn't open, click the button below.
            </Typography>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Button className="w-full" onClick={handleRetryRedirect}>
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Open {selectedProvider?.providerName}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Close
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 text-center">
            <Typography variant="muted">
              Unable to redirect to payment provider.
            </Typography>
            <Typography variant="muted">
              Please try selecting a provider again.
            </Typography>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Go back
          </Button>
        </>
      )}
    </div>
  );
}
