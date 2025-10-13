'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError
} from 'libphonenumber-js';
import { MailIcon, MoveRightIcon, PhoneIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EcosystemId,
  EmailPrepareParams,
  LoginStrategy,
  PhonePrepareParams,
  prepareLogin
} from 'src/core';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePanna } from '@/hooks/use-panna';
import { GoogleIcon } from '../icons/google';
import { DialogStepperContextValue } from '../ui/dialog-stepper';

type LoginFormProps = {
  next: DialogStepperContextValue['next'];
  goToStep: DialogStepperContextValue['goToStep'];
};

const notBlank = (val?: string) => !!val && val.trim() !== '';
// Move schema to new file
// Add country code flag selector to phone input
const formSchema = z
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

const GOOGLE_LOGIN_STEP = 2;

export function LoginForm({ next, goToStep }: LoginFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phoneNumber: ''
    }
  });
  const { client, partnerId } = usePanna();
  const [focusState, setFocusState] = useState({
    email: false,
    phone: false
  });

  const handleFormSubmit = async (field: keyof z.infer<typeof formSchema>) => {
    const isFieldValid = await form.trigger(field);
    if (isFieldValid) {
      form.handleSubmit(onSubmit)();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loginConfig = values.email
      ? {
          strategy: LoginStrategy.EMAIL,
          email: values.email,
          data: { email: values.email }
        }
      : {
          strategy: LoginStrategy.PHONE,
          phoneNumber: values.phoneNumber!,
          data: { phoneNumber: values.phoneNumber! }
        };
    try {
      await prepareLogin({
        client,
        ecosystem: {
          id: EcosystemId.LISK,
          partnerId
        },
        strategy: loginConfig.strategy,
        ...(loginConfig.email && { email: loginConfig.email }),
        ...(loginConfig.phoneNumber && { phoneNumber: loginConfig.phoneNumber })
      } as EmailPrepareParams | PhonePrepareParams);
      // Passing error as null to clear any previous error state
      next({
        ...loginConfig.data,
        error: null
      });
    } catch (error) {
      console.error('Login preparation failed:', error);
      next({
        ...loginConfig.data,
        error: (error as Error).message
      });
    }
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <Button
          type="button"
          className="flex gap-3"
          onClick={() => goToStep(GOOGLE_LOGIN_STEP)}
          data-testid="google-login-button"
        >
          <GoogleIcon />
          Continue with Google
        </Button>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Email address"
                  className="focus-within:[&_button]:bg-primary"
                  startAdornment={
                    !focusState.email && (
                      <MailIcon className="h-5 w-5" color="#FAFAFA" />
                    )
                  }
                  endAdornment={
                    <Button
                      className="hover:bg-primary/90! bg-transparent"
                      onClick={() => handleFormSubmit('email')}
                      type="button"
                      data-testid="email-submit-button"
                    >
                      <MoveRightIcon className="text-neutral-400" />
                    </Button>
                  }
                  onFocus={() => {
                    setFocusState((prev) => ({ ...prev, email: true }));
                  }}
                  onBlur={() => {
                    setFocusState((prev) => ({ ...prev, email: false }));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Phone number"
                  className="focus-within:[&_button]:bg-primary"
                  startAdornment={
                    !focusState.phone && (
                      <PhoneIcon className="h-5 w-5" color="#FAFAFA" />
                    )
                  }
                  endAdornment={
                    <Button
                      className="hover:bg-primary/90! bg-transparent"
                      onClick={() => handleFormSubmit('phoneNumber')}
                      type="button"
                      data-testid="phone-submit-button"
                    >
                      <MoveRightIcon className="text-neutral-400" />
                    </Button>
                  }
                  onFocus={() => {
                    setFocusState((prev) => ({ ...prev, phone: true }));
                  }}
                  onBlur={() => {
                    setFocusState((prev) => ({ ...prev, phone: false }));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
