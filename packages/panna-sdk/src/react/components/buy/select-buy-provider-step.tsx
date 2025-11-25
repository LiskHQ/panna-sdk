import { Loader2Icon } from 'lucide-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { PROVIDERS } from 'src/core/onramp/constants';
import { DEFAULT_CHAIN, DEFAULT_COUNTRY_CODE } from '../../../core';
import { getOnrampProviders } from '../../../core/onramp';
import { useOnrampQuotes, usePanna } from '../../hooks';
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

  const providerFromQuote = useMemo(() => {
    if (!quote) {
      return null;
    }

    const providerId = quote.provider_id ?? PROVIDERS.onrampmoney.id;
    const matchedProvider = availableProviders.find(
      (provider) => provider.id === providerId
    );

    return matchedProvider ?? null;
  }, [availableProviders, quote]);

  const providersToDisplay = providerFromQuote
    ? [providerFromQuote]
    : availableProviders;

  const providerQuoteMap = useMemo(() => {
    if (!quote) {
      return new Map<string, QuoteData>();
    }

    const providerId =
      providerFromQuote?.id ??
      (providersToDisplay.length === 1 ? providersToDisplay[0]?.id : undefined);

    if (!providerId) {
      return new Map<string, QuoteData>();
    }

    return new Map<string, QuoteData>([[providerId, quote]]);
  }, [providerFromQuote?.id, providersToDisplay, quote]);

  const providersWithQuotes = useMemo(() => {
    return providersToDisplay
      .map((provider) => {
        const providerQuote = providerQuoteMap.get(provider.id);

        if (!providerQuote) {
          return null;
        }

        return { provider, quote: providerQuote };
      })
      .filter(
        (
          entry
        ): entry is {
          provider: (typeof providersToDisplay)[number];
          quote: QuoteData;
        } => entry !== null
      );
  }, [providerQuoteMap, providersToDisplay]);

  const handleProviderSelect = (
    providerId: string,
    providerName: string,
    providerDescription: string | undefined,
    providerLogoUrl: string | undefined,
    quoteData: QuoteData
  ) => {
    if (!quoteData) {
      return;
    }

    form.setValue('provider', {
      providerId,
      providerName,
      providerDescription,
      providerLogoUrl,
      quote: quoteData
    });

    next();
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="items-center gap-0">
        <DialogTitle>Select payment provider</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Loader2Icon size={48} className="animate-spin" />
            <Typography variant="muted">Loading quotes...</Typography>
          </div>
        ) : quoteError ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="muted">
              Failed to load quotes. Please try again.
            </Typography>
          </div>
        ) : providersToDisplay.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="muted">
              No providers available for this country
            </Typography>
          </div>
        ) : providersWithQuotes.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Typography variant="muted">No quote available</Typography>
          </div>
        ) : (
          <>
            {providersWithQuotes.map(({ provider, quote: providerQuote }) => (
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
                    providerQuote
                  )
                }
                disabled={isLoading}
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
                    {providerQuote.total_fiat_amount.toFixed(
                      FIAT_AMOUNT_FIXED_DIGITS
                    )}
                  </Typography>
                  {token?.symbol && (
                    <Typography variant="muted" className="text-xs">
                      {providerQuote.crypto_quantity.toFixed(
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
