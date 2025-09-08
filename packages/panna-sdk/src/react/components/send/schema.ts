import { z } from 'zod';

// Token schema
export const tokenSchema = z.object({
  address: z.string().min(1, 'Token address is required'),
  symbol: z.string().min(1, 'Token symbol is required'),
  name: z.string().min(1, 'Token name is required'),
  icon: z.string().optional()
});

export const sendFormSchema = z.object({
  token: tokenSchema,
  recipientAddress: z.string().min(1, 'Recipient address is required'),
  amount: z.number().gt(0, 'Amount must be greater than 0')
});

export type SendFormData = z.infer<typeof sendFormSchema>;
