'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError
} from 'libphonenumber-js';
import { MailIcon, MoveRightIcon, PhoneIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EcosystemId, LoginStrategy, prepareLogin } from 'src/core';
import { liskSepolia } from 'src/core/chains';
import { useConnect } from 'thirdweb/react';
import { ecosystemWallet } from 'thirdweb/wallets';
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
import { LAST_AUTH_PROVIDER } from '@/consts';
import { usePanna } from '@/hooks/use-panna';
import { GoogleIcon } from '../icons/google';
import { DialogStepperContextValue } from '../ui/dialog-stepper';

// Removed useAuth - thirdweb handles wallet state automatically

type LoginFormProps = {
  next: DialogStepperContextValue['next'];
  onClose?: () => void;
};

const notBlank = (val?: string) => !!val && val.trim() !== '';

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

export function LoginForm({ next, onClose }: LoginFormProps) {
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

  // Configure useConnect with account abstraction for smart accounts
  const { connect } = useConnect({
    client,
    accountAbstraction: {
      chain: liskSepolia, // the chain where smart accounts will be deployed
      sponsorGas: true // enable sponsored transactions
    }
  });

  const handleFormSubmit = async (field: keyof z.infer<typeof formSchema>) => {
    const isFieldValid = await form.trigger(field);
    if (isFieldValid) {
      form.handleSubmit(onSubmit)();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.email) {
      await prepareLogin({
        client,
        ecosystem: {
          id: EcosystemId.LISK,
          partnerId
        },
        strategy: LoginStrategy.EMAIL,
        email: values.email
      });
      next({
        email: values.email
      });
    } else if (values.phoneNumber) {
      await prepareLogin({
        client,
        ecosystem: {
          id: EcosystemId.LISK,
          partnerId
        },
        strategy: LoginStrategy.PHONE,
        phoneNumber: values.phoneNumber
      });
      next({
        phoneNumber: values.phoneNumber
      });
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const wallet = await connect(async () => {
        // Create ecosystem wallet for Google auth
        const ecoWallet = ecosystemWallet(EcosystemId.LISK, {
          partnerId
        });

        await ecoWallet.connect({
          client,
          strategy: 'google'
        });

        return ecoWallet;
      });

      if (wallet) {
        const address = wallet.getAccount()?.address;
        if (address) {
          const isBrowser = typeof window !== 'undefined';
          if (isBrowser) {
            localStorage.setItem(LAST_AUTH_PROVIDER, 'Google');
            // Note: USER_ADDRESS is automatically managed by thirdweb
          }
          onClose?.();
        }
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Button
          type="button"
          className="flex gap-3"
          onClick={handleGoogleLogin}
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
                    !showEmailSubmit && (
                      <MailIcon className="h-5 w-5" color="#FAFAFA" />
                    )
                  }
                  endAdornment={
                    <Button
                      className="hover:bg-primary/90! bg-transparent"
                      onClick={() => handleFormSubmit('email')}
                    >
                      <MoveRightIcon className="text-neutral-400" />
                    </Button>
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
                  className="focus-within:[&_button]:bg-primary"
                  startAdornment={
                    !showPhoneSubmit && (
                      <PhoneIcon className="h-5 w-5" color="#FAFAFA" />
                    )
                  }
                  endAdornment={
                    <Button
                      className="hover:bg-primary/90! bg-transparent"
                      onClick={() => handleFormSubmit('phoneNumber')}
                    >
                      <MoveRightIcon className="text-neutral-400" />
                    </Button>
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
