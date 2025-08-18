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

// Provider schema
export const providerSchema = z.object({
  id: z.string().min(1, 'Provider ID is required'),
  name: z.string().min(1, 'Provider name is required'),
  description: z.string().min(1, 'Provider description is required'),
  price: z.string().min(1, 'Provider price is required'),
  best: z.boolean().optional(),
  icon: z.string().optional()
});

// Main buy form schema - using optional fields for step-by-step validation
export const buyFormSchema = z.object({
  country: countrySchema.optional(),
  token: tokenSchema.optional(),
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(1000000, 'Amount is too large')
    .optional(),
  provider: providerSchema.optional()
});

// Complete form schema for final validation
export const completeBuyFormSchema = z.object({
  country: countrySchema,
  token: tokenSchema,
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(1000000, 'Amount is too large'),
  provider: providerSchema
});

export type BuyFormData = z.infer<typeof buyFormSchema>;
export type CompleteBuyFormData = z.infer<typeof completeBuyFormSchema>;
