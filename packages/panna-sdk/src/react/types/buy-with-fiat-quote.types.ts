import type { OnrampPrepareResult } from '../../core/onramp/types';

export type BuyWithFiatQuote = {
  providerId: string;
  providerName: string;
  providerDescription?: string;
  providerLogoUrl?: string;
  price: string;
  error?: string;
  prepareResult?: OnrampPrepareResult;
};
