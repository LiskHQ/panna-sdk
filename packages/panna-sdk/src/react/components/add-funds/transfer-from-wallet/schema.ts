import { isValidAddress } from 'src/core';
import { z } from 'zod';

// Token schema (reused from send schema)
export const tokenSchema = z.object({
  address: z.string().min(1, 'Token address is required'),
  decimals: z.number().min(1, 'Token decimals is required'),
  symbol: z.string().min(1, 'Token symbol is required'),
  name: z.string().min(1, 'Token name is required'),
  icon: z.string().optional()
});

// Token balance schema
const tokenBalanceSchema = z.object({
  value: z.bigint().min(0n, 'Token balance must be non-negative'),
  displayValue: z.string().min(1, 'Token display value is required')
});

// Fiat balance schema
const fiatBalanceSchema = z.object({
  amount: z.number().min(0, 'Fiat balance must be non-negative'),
  currency: z.string().min(1, 'Fiat currency is required')
});

export const transferFormSchema = z
  .object({
    fromAddress: z
      .string()
      .min(1, 'Source address is required')
      .refine(isValidAddress, {
        message: 'Please enter a valid source address'
      }),
    toAddress: z
      .string()
      .min(1, 'Destination address is required')
      .refine(isValidAddress, {
        message: 'Please enter a valid destination address'
      }),
    tokenInfo: z
      .object({
        token: tokenSchema,
        tokenBalance: tokenBalanceSchema,
        fiatBalance: fiatBalanceSchema
      })
      .refine((val) => val.token.name !== '', {
        message: 'Token is required'
      }),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be a number greater than 0'
      }),
    fiatAmount: z.string().optional(),
    cryptoAmount: z.string().optional(),
    primaryAmountInput: z.union([z.literal('fiat'), z.literal('crypto')])
  })
  .superRefine((data, ctx) => {
    const amountNum = Number(data.amount);
    // Validate that the amount doesn't exceed available balance
    if (
      (data.tokenInfo.token.name &&
        Number(data.cryptoAmount!) >
          Number(data.tokenInfo.tokenBalance.value) /
            10 ** data.tokenInfo.token.decimals) ||
      Number(data.fiatAmount!) > data.tokenInfo.fiatBalance.amount ||
      isNaN(amountNum)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Insufficient balance',
        path: ['amount']
      });
    }
  });

export type TransferFormData = z.infer<typeof transferFormSchema>;
