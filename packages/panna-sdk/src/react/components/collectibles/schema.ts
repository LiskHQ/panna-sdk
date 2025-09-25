import { isValidAddress } from 'src/core';
import { ImageType } from 'src/core/utils/collectible.types';
import { z } from 'zod';

const TokenInstanceSchema = z.object({
  id: z.string().min(1, 'Token instance ID is required'),
  imageType: z.nativeEnum(ImageType),
  image: z.string().nullable(),
  name: z.string().min(1, 'Token name is required').optional()
});

const TokenSchema = z.object({
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

export const sendCollectibleFormSchema = z.object({
  collectible: TokenInstanceSchema,
  token: TokenSchema,
  recipientAddress: z
    .string()
    .min(1, 'Recipient address is required')
    .refine(isValidAddress, {
      message: 'Please enter a valid address'
    })
});

export type SendCollectibleFormData = z.infer<typeof sendCollectibleFormSchema>;
