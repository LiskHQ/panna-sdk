import { z } from 'zod';

// Country schema
export const countrySchema = z.object({
  code: z.string().min(2, 'Country code is required'),
  name: z.string().min(1, 'Country name is required'),
  flag: z.string().min(1, 'Country flag is required')
});

// Token schema
export const tokenSchema = z.object({
  symbol: z.string().min(1, 'Token symbol is required'),
  name: z.string().min(1, 'Token name is required'),
  icon: z.string().optional()
});

// Buy with fiat quote schema
export const buyWithFiatQuoteSchema = z.object({
  providerId: z.string().min(1, 'Provider ID is required'),
  providerName: z.string().min(1, 'Provider name is required'),
  providerDescription: z.string().optional(),
  providerLogoUrl: z.string().optional(),
  price: z.string().min(1, 'Quote price is required'),
  error: z.string().optional(),
  prepareResult: z
    .object({
      id: z.string(),
      link: z.string(),
      currency: z.string(),
      currencyAmount: z.string(),
      destinationAmount: z.string(),
      timestamp: z.number().optional(),
      expiration: z.number().optional(),
      intent: z.any().optional()
    })
    .optional()
});

// Main buy form schema - using optional fields for step-by-step validation
export const buyFormSchema = z.object({
  country: countrySchema.optional(),
  token: tokenSchema.optional(),
  fiatAmount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(1000000, 'Amount is too large')
    .optional(),
  cryptoAmount: z.number().optional(),
  provider: buyWithFiatQuoteSchema.optional()
});

export type BuyFormData = z.infer<typeof buyFormSchema>;
