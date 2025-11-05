import { z } from 'zod';

// Country schema - supports only 2-letter (ISO 3166-1 alpha-2) codes as required by core functions
export const countrySchema = z.object({
  code: z
    .string()
    .length(2, 'Country code must be exactly 2 characters')
    .regex(/^[A-Z]{2}$/, 'Country code must be 2 uppercase letters'),
  name: z.string().min(1, 'Country name is required'),
  flag: z.string().min(1, 'Country flag is required')
});

// Token schema
export const tokenSchema = z.object({
  address: z.string().min(1, 'Token address is required'),
  symbol: z.string().min(1, 'Token symbol is required'),
  name: z.string().min(1, 'Token name is required'),
  icon: z.string().optional()
});

const quoteDataSchema = z.object({
  rate: z.number(),
  crypto_quantity: z.number(),
  onramp_fee: z.number(),
  client_fee: z.number().nullable().optional(),
  gateway_fee: z.number().nullable().optional(),
  gas_fee: z.number(),
  total_fiat_amount: z.number(),
  quote_timestamp: z.string(),
  quote_validity_mins: z.number()
});

export const selectedProviderSchema = z.object({
  providerId: z.string().min(1, 'Provider ID is required'),
  providerName: z.string().min(1, 'Provider name is required'),
  providerDescription: z.string().optional(),
  providerLogoUrl: z.string().optional(),
  sessionUrl: z.string().url('Session URL must be valid'),
  quote: quoteDataSchema
});

// Main buy form schema - using optional fields for step-by-step validation
export const buyFormSchema = z.object({
  country: countrySchema.optional(),
  token: tokenSchema.optional(),
  fiatAmount: z.number().gt(0, 'Amount must be greater than 0').optional(),
  cryptoAmount: z.number().optional(),
  provider: selectedProviderSchema.optional()
});

export type BuyFormData = z.infer<typeof buyFormSchema>;
