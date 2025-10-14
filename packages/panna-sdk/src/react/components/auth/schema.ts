import {
  isValidPhoneNumber,
  parsePhoneNumberWithError
} from 'libphonenumber-js';
import { z } from 'zod';

const notBlank = (val?: string) => !!val && val.trim() !== '';

export const formSchema = z
  .object({
    email: z
      .string()
      .min(7, { message: 'Email should be filled.' })
      .email('This is not a valid email.')
      .optional()
      .or(z.literal('')),
    phoneNumber: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .refine(isValidPhoneNumber, {
        message: 'Please specify a valid phone number'
      })
      .transform((value) => parsePhoneNumberWithError(value).number.toString())
      .optional()
      .or(z.literal(''))
  })
  .refine(
    (data) => {
      const emailFilled = notBlank(data.email);
      const phoneFilled = notBlank(data.phoneNumber);
      // Only ONE of the fields must be filled
      return (emailFilled && !phoneFilled) || (!emailFilled && phoneFilled);
    },
    {
      message: 'You must provide either an email OR a phone number—never both.',
      path: ['email', 'phoneNumber']
    }
  );
