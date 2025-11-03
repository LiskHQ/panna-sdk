import { isValidAddress, TokenERC } from 'src/core';
import { ImageType } from 'src/core/util/collectible.types';
import { z } from 'zod';

const MIN_VALUE = 1;

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
      .length(42, 'Recipient address is required')
      .refine(isValidAddress, {
        message: 'Please enter a valid address'
      }),
    amount: z
      .string()
      .min(1, 'Quantity is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) >= MIN_VALUE, {
        message: `Quantity must be a number greater than ${MIN_VALUE - 1}`
      })
  })
  .superRefine((data, ctx) => {
    const amountNum = Number(data.amount);
    if (data.token.type === TokenERC.ERC1155 && data.collectible?.value) {
      if (amountNum > Number(data.collectible.value)) {
        const MAX_VALUE_OWNED = data.collectible.value;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Quantity must not be greater than ${MAX_VALUE_OWNED} (max available)`,
          path: ['amount']
        });
      }
    } else {
      // ERC-721 tokens are unique so their amount can only be one
      if (amountNum > MIN_VALUE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Quantity must not be greater than ${MIN_VALUE} (max available)`,
          path: ['amount']
        });
      }
    }
  });

export type SendCollectibleFormData = z.infer<typeof sendCollectibleFormSchema>;
