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
import type { SmartWalletOptions, Wallet } from 'thirdweb/wallets';
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
import { useLogin } from '@/hooks';
import { usePanna } from '@/hooks/use-panna';
import { generateSiwePayload, siweLogin } from '../../../core/auth';
import { buildSiweMessage, getEnvironmentChain } from '../../utils';
import { GoogleIcon } from '../icons/google';
import { DialogStepperContextValue } from '../ui/dialog-stepper';

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
  const { client, partnerId, chainId } = usePanna();
  const [showEmailSubmit, setShowEmailSubmit] = useState(true);
  const [showPhoneSubmit, setShowPhoneSubmit] = useState(false);

  const { connect } = useLogin({
    client,
    setWalletAsActive: true,
    accountAbstraction: {
      chain: getEnvironmentChain(chainId),
      sponsorGas: true
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

  const handleSiweAuth = async (wallet: Wallet) => {
    try {
      const account = wallet.getAccount();
      const isSmartAccount = !!(
        wallet.getConfig() as unknown as { smartAccount: SmartWalletOptions }
      ).smartAccount;

      console.log({
        account,
        wallet,
        walletConfig: wallet.getConfig(),
        isSmartAccount
      });

      if (!account) {
        console.warn('No account found for SIWE authentication');
        return false;
      }

      const payload = await generateSiwePayload({
        address: account.address
      });

      const siweMessage = buildSiweMessage(payload);

      console.log('SIWE Auth - Message being signed:', siweMessage);

      // Try to get ERC-191 compliant ECDSA signature for SIWE
      let signature;
      try {
        console.log('SIWE Auth - Signing message with payload:', {
          message: siweMessage,
          chainId: getEnvironmentChain().id as number
        });
        signature = await account.signMessage({
          message: siweMessage,
          chainId: getEnvironmentChain().id as number
        });
      } catch (error) {
        console.log('SIWE Auth - Signature failed:', error);
        throw error;
      }

      const signedPayload = {
        payload,
        signature
      };

      const isSuccess = await siweLogin({
        payload: signedPayload.payload,
        signature: signedPayload.signature,
        account,
        isSafeWallet: isSmartAccount
      });

      if (isSuccess) {
        console.log('SIWE authentication successful');
      } else {
        console.warn('SIWE authentication failed');
      }

      return isSuccess;
    } catch (error) {
      console.error('SIWE authentication error:', error);

      // Check if it's a 401 unauthorized error from thirdweb
      if (error instanceof Error && error.message.includes('401')) {
        console.warn(
          'Wallet not yet authenticated with thirdweb service - SIWE authentication skipped'
        );
        // Don't treat this as a fatal error, just log it
        return false;
      }

      return false;
    }
  };

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

          // Automatically perform SIWE authentication in the background
          await handleSiweAuth(wallet);

          onClose?.();
        }
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
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
                      type="button"
                      data-testid="email-submit-button"
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
                      type="button"
                      data-testid="phone-submit-button"
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
