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
  LoginStrategy,
  prepareLogin,
  socialLogin
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
import { DialogStepperContextValue } from './dialog-stepper';

type LoginFormProps = {
  next: DialogStepperContextValue['next'];
};

const formSchema = z
  .object({
    email: z
      .string()
      .min(7, { message: 'This field has to be filled.' })
      .email('This is not a valid email.')
      .optional(),
    phoneNumber: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .refine(isValidPhoneNumber, {
        message: 'Please specify a valid phone number'
      })
      .transform((value) => parsePhoneNumberWithError(value).number.toString())
      .optional()
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phoneNumber) {
      ctx.addIssue({
        code: 'custom',
        message: 'a or b is required'
        // input: ctx
      });
    }
  });

export function LoginForm({ next }: LoginFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phoneNumber: ''
    }
  });
  const { client, partnerId } = usePanna();
  const [showEmailSubmit, setShowEmailSubmit] = useState(true);
  const [showPhoneSubmit, setShowPhoneSubmit] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    await prepareLogin({
      client,
      ecosystem: {
        id: EcosystemId.LISK,
        partnerId
      },
      strategy: LoginStrategy.EMAIL,
      email: values.email!
    });
    next();
  }

  const handleGoogleLogin = async () => {
    await socialLogin({
      client,
      ecosystem: {
        id: EcosystemId.LISK,
        partnerId
      },
      strategy: 'google',
      mode: 'popup'
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Button type="button" onClick={handleGoogleLogin}>
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
                  startAdornment={
                    !showEmailSubmit && (
                      <MailIcon className="h-5 w-5" color="#7C3AED" />
                    )
                  }
                  endAdornment={
                    showEmailSubmit && (
                      <Button className="hover:bg-layer-200 bg-transparent">
                        <MoveRightIcon className="text-neutral-400" />
                      </Button>
                    )
                  }
                  onFocus={() => {
                    setShowEmailSubmit(true);
                  }}
                  onBlur={() => {
                    setShowEmailSubmit(false);
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
                  startAdornment={
                    !showPhoneSubmit && (
                      <PhoneIcon className="h-5 w-5" color="#7C3AED" />
                    )
                  }
                  endAdornment={
                    showPhoneSubmit && (
                      <Button className="hover:bg-layer-200 bg-transparent">
                        <MoveRightIcon className="text-neutral-400" />
                      </Button>
                    )
                  }
                  onFocus={() => {
                    setShowPhoneSubmit(true);
                  }}
                  onBlur={() => {
                    setShowPhoneSubmit(false);
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
