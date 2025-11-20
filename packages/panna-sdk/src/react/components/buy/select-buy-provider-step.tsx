import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { DEFAULT_CHAIN, DEFAULT_COUNTRY_CODE } from '../../../core';
import { getOnrampProviders } from '../../../core/onramp';
import { useOnrampQuotes, useCreateOnrampSession, usePanna } from '../../hooks';
import type { QuoteData } from '../../types/onramp-quote.types';
import {
  getCurrencyForCountry,
  getCurrencySymbolForCountry,
  getEnvironmentChain
} from '../../utils';
import { DialogHeader, DialogTitle } from '../ui/dialog';
import { useDialogStepper } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';
import type { BuyFormData } from './schema';

type SelectBuyProviderStepProps = {
  form: UseFormReturn<BuyFormData>;
};

const FIAT_AMOUNT_FIXED_DIGITS = 2;
const CRYPTO_AMOUNT_FIXED_DIGITS = 6;

export function SelectBuyProviderStep({ form }: SelectBuyProviderStepProps) {
  const { next } = useDialogStepper();
  const { chainId } = usePanna();

  const { token, country, fiatAmount } = form.watch();
  const {
    mutateAsync: createSession,
    isPending: isCreatingSession,
    error: createSessionError
  } = useCreateOnrampSession();

  const currentChain = getEnvironmentChain(chainId);
  const networkName = currentChain?.name ?? DEFAULT_CHAIN?.name ?? 'lisk';
  const onrampNetwork = networkName.toLowerCase();
  const currencyCode = getCurrencyForCountry(
    country?.code ?? DEFAULT_COUNTRY_CODE
  );
  const currencySymbol = getCurrencySymbolForCountry(
    country?.code ?? DEFAULT_COUNTRY_CODE
  );

  // Get available providers for the country
  const availableProviders = useMemo(() => {
    if (!country?.code) return [];
    try {
      return getOnrampProviders(country.code);
    } catch {
      return [];
    }
  }, [country?.code]);

  // Fetch quote from onramp (currently only 1 provider: onramp.money)
  const {
    data: quote,
    isLoading,
    error: quoteError
  } = useOnrampQuotes({
    tokenSymbol: token?.symbol || '',
    network: onrampNetwork,
    fiatAmount: fiatAmount || 0,
    fiatCurrency: currencyCode
  });

  const handleProviderSelect = async (
    providerId: string,
    providerName: string,
    providerDescription: string | undefined,
    providerLogoUrl: string | undefined,
    quoteData: QuoteData
  ) => {
    // Prevent multiple simultaneous session creation attempts
    if (isCreatingSession) return;

    // Token should always be defined after the previous step, but keep a guard to
    // prevent runtime errors if the form state resets or the user navigates mid-flow.
    if (!token?.symbol || typeof fiatAmount !== 'number' || fiatAmount <= 0) {
      console.warn(
        'Cannot create onramp session without a valid token symbol and fiat amount.'
      );
      return;
    }

    try {
      const session = await createSession({
        tokenSymbol: token.symbol,
        network: onrampNetwork,
        fiatAmount,
        fiatCurrency: currencyCode,
        quoteData
      });

      form.setValue('provider', {
        providerId,
        providerName,
        providerDescription,
        providerLogoUrl,
        redirectUrl: session.redirect_url,
        quote: quoteData
      });

      next();
    } catch (error) {
      console.error('Failed to create onramp session:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Select payment provider</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        {isLoading || isCreatingSession ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Loader2Icon size={48} className="animate-spin" />
            <Typography variant="muted">
              {isCreatingSession ? 'Creating session...' : 'Loading quotes...'}
            </Typography>
          </div>
        ) : quoteError ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="muted">
              Failed to load quotes. Please try again.
            </Typography>
          </div>
        ) : availableProviders.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="muted">
              No providers available for this country
            </Typography>
          </div>
        ) : !quote ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="muted">No quote available</Typography>
          </div>
        ) : (
          <>
            {createSessionError && (
              <div className="border-destructive/50 bg-destructive/10 flex items-center justify-center rounded-md border px-4 py-3">
                <Typography variant="muted">
                  Failed to create onramp session. Please try again.
                </Typography>
              </div>
            )}
            {availableProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                className={`bg-accent/20 hover:bg-accent/30 flex items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors ${form.watch('provider')?.providerId === provider.id ? 'ring-primary ring-2' : ''}`}
                onClick={() =>
                  handleProviderSelect(
                    provider.id,
                    provider.displayName,
                    provider.description,
                    provider.logoUrl,
                    quote
                  )
                }
                disabled={isCreatingSession}
              >
                <div className="flex items-center gap-3">
                  {provider.logoUrl && (
                    <img
                      src={provider.logoUrl}
                      alt={provider.displayName}
                      className="size-8 rounded-full"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Typography variant="small">
                        {provider.displayName}
                      </Typography>
                    </div>
                    {provider.description && (
                      <Typography variant="muted">
                        {provider.description}
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="small">
                    {currencySymbol}
                    {quote.total_fiat_amount.toFixed(FIAT_AMOUNT_FIXED_DIGITS)}
                  </Typography>
                  {token?.symbol && (
                    <Typography variant="muted" className="text-xs">
                      {quote.crypto_quantity.toFixed(
                        CRYPTO_AMOUNT_FIXED_DIGITS
                      )}{' '}
                      {token.symbol}
                    </Typography>
                  )}
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
