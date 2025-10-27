import { isValidAddress } from 'src/core';
import { ImageType } from 'src/core/util/collectible.types';
import { z } from 'zod';

const tokenInstanceSchema = z.object({
  id: z.string().min(1, 'Token instance ID is required'),
  imageType: z.nativeEnum(ImageType),
  image: z.string().nullable(),
  name: z.string().min(1, 'Token name is required').optional(),
  value: z.string().min(1, 'Token instance value is required').nullable()
});

const tokenSchema = z.object({
  name: z.string().min(1, 'Token name is required'),
  symbol: z.string().min(1, 'Token symbol is required'),
  type: z.string().min(1, 'Token type is required'),
  address: z
    .string()
    .min(1, 'Token address is required')
    .refine(isValidAddress, {
      message: 'Please enter a valid address'
    }),
  icon: z.string().nullable()
});

export const sendCollectibleFormSchema = z
  .object({
    collectible: tokenInstanceSchema,
    token: tokenSchema,
    recipientAddress: z
      .string()
      .min(1, 'Recipient address is required')
      .refine(isValidAddress, {
        message: 'Please enter a valid address'
      }),
    amount: z
      .string()
      .min(1, 'Quantity is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Quantity must be a number greater than 0'
      })
  })
  .superRefine((data, ctx) => {
    const amountNum = Number(data.amount);
    if (
      (data.collectible?.value &&
        amountNum > Number(data.collectible?.value)) ||
      (!data.collectible?.value && amountNum > 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Quantity must not be greater than max available',
        path: ['amount']
      });
    }
  });

export type SendCollectibleFormData = z.infer<typeof sendCollectibleFormSchema>;
