import { isValidAddress, TokenERC } from 'src/core';
import { ImageType } from 'src/core/util/collectible.types';
import { z } from 'zod';

export const MIN_ERC1155_VALUE = 1;
const WALLET_ADDRESS_LENGTH = 42;

const tokenInstanceSchema = z.object({
  id: z.string().min(1, 'Token instance ID is required'),
  imageType: z.nativeEnum(ImageType),
  image: z.string().nullable(),
  name: z.string().min(1, 'Token name is required').optional(),
  value: z
    .string()
    .min(MIN_ERC1155_VALUE, 'Token instance value is required')
    .nullable()
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
      .length(WALLET_ADDRESS_LENGTH, 'Recipient address is required')
      .refine(isValidAddress, {
        message: 'Please enter a valid address'
      }),
    amount: z
      .string()
      .min(MIN_ERC1155_VALUE, 'Quantity is required')
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= MIN_ERC1155_VALUE,
        {
          message: `Quantity must be a number greater than ${MIN_ERC1155_VALUE - 1}`
        }
      )
  })
  .superRefine((data, ctx) => {
    const amountNum = Number(data.amount);
    if (data.token.type === TokenERC.ERC1155) {
      const MAX_VALUE_OWNED = Number(data.collectible.value);
      if (amountNum > MAX_VALUE_OWNED) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Quantity must not be greater than ${MAX_VALUE_OWNED} (max available)`,
          path: ['amount']
        });
      }
    }
  });

export type SendCollectibleFormData = z.infer<typeof sendCollectibleFormSchema>;
