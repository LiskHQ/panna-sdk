import { ExternalLinkIcon, Loader2Icon, RefreshCwIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  OnrampMoneySessionStatusEnum,
  type SessionStatusResult
} from 'src/core';
import {
  useCreateOnrampSession,
  useOnrampSessionStatus,
  usePanna
} from '@/hooks';
import { getErrorMessage } from '@/utils/get-error-message';
import { DEFAULT_CHAIN, DEFAULT_COUNTRY_CODE } from '../../../core';
import type { QuoteData } from '../../types/onramp-quote.types';
import { getCurrencyForCountry, getEnvironmentChain } from '../../utils';
import { Button } from '../ui/button';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type ProcessingBuyStepProps = {
  onClose: () => void;
  form: UseFormReturn<BuyFormData>;
};

type OnrampSessionInfo = {
  id: string;
  redirectUrl: string;
};

type ProviderFormValue = NonNullable<BuyFormData['provider']>;

const TERMINAL_STATUSES = new Set<OnrampMoneySessionStatusEnum>([
  OnrampMoneySessionStatusEnum.Completed,
  OnrampMoneySessionStatusEnum.Failed,
  OnrampMoneySessionStatusEnum.Cancelled,
  OnrampMoneySessionStatusEnum.Expired
]);

export function ProcessingBuyStep({ onClose, form }: ProcessingBuyStepProps) {
  const { chainId } = usePanna();
  const { next, prev, reset } = useDialogStepper<{
    status: OnrampMoneySessionStatusEnum;
    session?: SessionStatusResult;
  }>();
  const creationAttemptedRef = useRef(false);
  const navigatedRef = useRef(false);
  const [sessionInfo, setSessionInfo] = useState<OnrampSessionInfo | null>(
    null
  );
  const [hasOpenedWidget, setHasOpenedWidget] = useState(false);
  const [creationError, setCreationError] = useState<Error | null>(null);

  const provider = form.watch('provider');
  const token = form.watch('token');
  const fiatAmount = form.watch('fiatAmount');
  const country = form.watch('country');
  const countryCode = country?.code;

  const quote = provider?.quote as QuoteData | undefined;

  const currentChain = getEnvironmentChain(chainId);
  const networkName = currentChain?.name ?? DEFAULT_CHAIN?.name ?? 'lisk';
  const onrampNetwork = networkName.toLowerCase();
  const currencyCode = getCurrencyForCountry(
    countryCode ?? DEFAULT_COUNTRY_CODE
  );

  const hasRequiredFormValues =
    !!provider &&
    !!token?.symbol &&
    typeof fiatAmount === 'number' &&
    fiatAmount > 0 &&
    !!quote &&
    !!countryCode;

  const { mutateAsync: createSession, isPending: isCreatingSession } =
    useCreateOnrampSession();

  const sessionStatusQuery = useOnrampSessionStatus(
    { sessionId: sessionInfo?.id ?? '' },
    {
      enabled: !!sessionInfo?.id,
      retry: true
    }
  );

  const isPollingStatus =
    sessionStatusQuery.isLoading || sessionStatusQuery.isFetching;

  const statusLabel = useMemo(() => {
    if (!sessionInfo) {
      return 'Creating payment session...';
    }

    if (sessionStatusQuery.data?.status) {
      const status = sessionStatusQuery.data.status;
      switch (status) {
        case OnrampMoneySessionStatusEnum.Created:
          return 'Waiting for payment provider...';
        case OnrampMoneySessionStatusEnum.Pending:
          return 'Payment in progress...';
        case OnrampMoneySessionStatusEnum.Completed:
          return 'Payment completed';
        case OnrampMoneySessionStatusEnum.Failed:
          return 'Payment failed';
        case OnrampMoneySessionStatusEnum.Cancelled:
          return 'Payment cancelled';
        case OnrampMoneySessionStatusEnum.Expired:
          return 'Session expired';
        default:
          return 'Processing...';
      }
    }

    if (isPollingStatus) {
      return 'Checking payment status...';
    }

    return 'Processing...';
  }, [isPollingStatus, sessionInfo, sessionStatusQuery.data?.status]);

  const handleCreateSession = useCallback(async () => {
    if (
      !provider ||
      !token?.symbol ||
      typeof fiatAmount !== 'number' ||
      fiatAmount <= 0 ||
      !quote
    ) {
      setCreationError(
        new Error('Missing required information to create a payment session.')
      );
      return;
    }

    try {
      setCreationError(null);
      const session = await createSession({
        tokenSymbol: token.symbol,
        network: onrampNetwork,
        fiatAmount,
        fiatCurrency: currencyCode,
        quoteData: quote,
        redirectUrl: provider.redirectUrl
      });

      const updatedProvider: ProviderFormValue = {
        ...provider,
        redirectUrl: session.redirect_url
      };

      setSessionInfo({
        id: session.session_id,
        redirectUrl: session.redirect_url
      });
      form.setValue('provider', updatedProvider, {
        shouldDirty: false,
        shouldTouch: false
      });
    } catch (error) {
      const fallbackMessage =
        getErrorMessage(error) || 'Failed to create onramp session.';
      const normalizedError =
        error instanceof Error ? error : new Error(fallbackMessage);

      setCreationError(normalizedError);

      throw normalizedError;
    }
  }, [
    createSession,
    currencyCode,
    fiatAmount,
    onrampNetwork,
    provider,
    quote,
    token?.symbol,
    form
  ]);

  useEffect(() => {
    if (!hasRequiredFormValues) {
      return;
    }

    if (creationAttemptedRef.current || sessionInfo || isCreatingSession) {
      return;
    }

    creationAttemptedRef.current = true;
    handleCreateSession().catch((error) => {
      console.error('Failed to create onramp session:', getErrorMessage(error));
    });
  }, [
    handleCreateSession,
    hasRequiredFormValues,
    isCreatingSession,
    sessionInfo
  ]);

  useEffect(() => {
    if (!sessionStatusQuery.data || navigatedRef.current) {
      return;
    }

    if (TERMINAL_STATUSES.has(sessionStatusQuery.data.status)) {
      navigatedRef.current = true;
      next({
        status: sessionStatusQuery.data.status,
        session: sessionStatusQuery.data
      });
    }
  }, [next, sessionStatusQuery.data]);

  useEffect(() => {
    if (!sessionInfo?.redirectUrl || hasOpenedWidget) {
      return;
    }

    window.open(sessionInfo.redirectUrl, '_blank', 'noopener,noreferrer');
    setHasOpenedWidget(true);
  }, [hasOpenedWidget, sessionInfo?.redirectUrl]);

  const handleRetryRedirect = () => {
    if (sessionInfo?.redirectUrl) {
      window.open(sessionInfo.redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRetryCreation = () => {
    setCreationError(null);
    handleCreateSession().catch((error) => {
      console.error('Failed to create onramp session:', getErrorMessage(error));
    });
  };

  const handleRetryStatus = () => {
    void sessionStatusQuery.refetch();
  };

  const renderContent = () => {
    if (!hasRequiredFormValues) {
      return (
        <>
          <div className="space-y-2 text-center">
            <Typography variant="muted">
              Missing purchase information. Please go back and select a payment
              provider again.
            </Typography>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => {
                prev();
              }}
            >
              Go back
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
      );
    }

    if (creationError) {
      return (
        <>
          <div className="space-y-3 text-center">
            <Typography variant="muted">
              {creationError.message ||
                'We could not start your payment session. Please try again.'}
            </Typography>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Button className="w-full" onClick={handleRetryCreation}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                prev();
              }}
            >
              Back to providers
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        <Loader2Icon size={48} className="animate-spin" />
        <div className="space-y-2 text-center">
          <Typography variant="muted">{statusLabel}</Typography>
          {sessionInfo?.redirectUrl ? (
            <Typography variant="muted">
              If the payment widget didn&apos;t open, use the button below.
            </Typography>
          ) : (
            <Typography variant="muted">
              This may take a few moments. Please keep this window open.
            </Typography>
          )}
          {sessionStatusQuery.error && (
            <Typography variant="muted" className="text-destructive">
              Unable to fetch the latest status. Please retry below.
            </Typography>
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          {sessionInfo?.redirectUrl && (
            <Button className="w-full" onClick={handleRetryRedirect}>
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Open {provider?.providerName}
            </Button>
          )}

          {sessionStatusQuery.error && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleRetryStatus}
              disabled={isPollingStatus}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Retry status check
            </Button>
          )}

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
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Complete your purchase</DialogTitle>
      </DialogHeader>
      {renderContent()}
    </div>
  );
}
