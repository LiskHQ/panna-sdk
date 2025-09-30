import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { LoaderCircleIcon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EcosystemId, LoginStrategy, prepareLogin } from 'src/core';
import type { SmartWalletOptions, Wallet } from 'thirdweb/wallets';
import { ecosystemWallet } from 'thirdweb/wallets';
import z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { LAST_AUTH_PROVIDER, USER_CONTACT } from '@/consts';
import { useLogin, usePanna } from '@/hooks';
import { useCountdown } from '@/hooks/use-countdown';
import { generateSiwePayload, siweLogin } from '../../../core/auth';
import { buildSiweMessage, getEnvironmentChain } from '../../utils';
import { Button } from '../ui/button';
import { DialogStepperContextValue } from '../ui/dialog-stepper';
import { Typography } from '../ui/typography';

type InputOTPFormProps = {
  data: DialogStepperContextValue['stepData'];
  reset: DialogStepperContextValue['reset'];
  onClose: () => void;
};

const formSchema = z.object({
  code: z
    .string()
    .min(6, 'Code must be at least 6 characters.')
    .max(6, 'Code must be at most 6 characters.')
});

type FormValues = z.infer<typeof formSchema>;

export function InputOTPForm({ data, reset, onClose }: InputOTPFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ''
    }
  });
  const { client, partnerId, chainId } = usePanna();
  const [resendTimer, resetResendTimer] = useCountdown(45);
  const formattedTime =
    resendTimer > 0 ? `0:${String(resendTimer).padStart(2, '0')}` : '';

  const { connect } = useLogin({
    client,
    setWalletAsActive: true,
    accountAbstraction: {
      chain: getEnvironmentChain(chainId),
      sponsorGas: true // enable sponsored transactions
    }
  });

  // Helper function to perform SIWE authentication after wallet connection
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

      console.log('SIWE Auth - Message being signed (OTP form):', siweMessage);

      // Try to get standard ECDSA signature for SIWE
      let signature;
      try {
        signature = await account.signMessage({
          message: siweMessage
        });
      } catch (error) {
        console.log('SIWE Auth - Signature failed (OTP form):', error);
        throw error;
      }

      console.log('SIWE Auth - Generated signature (OTP form):', signature);
      console.log('SIWE Auth - Signature length (OTP form):', signature.length);

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

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      form.clearErrors('code');

      // Connect using smart account with ecosystem wallet
      const wallet = await connect(async () => {
        // Create ecosystem wallet and authenticate with OTP
        const ecoWallet = ecosystemWallet(EcosystemId.LISK, {
          partnerId
        });

        if (data.email) {
          await ecoWallet.connect({
            client,
            strategy: 'email',
            email: data.email as string,
            verificationCode: values.code
          });
        } else {
          await ecoWallet.connect({
            client,
            strategy: 'phone',
            phoneNumber: data.phoneNumber as string,
            verificationCode: values.code
          });
        }

        return ecoWallet;
      });

      if (wallet) {
        const address = wallet.getAccount()?.address;
        if (address) {
          const isBrowser = typeof window !== 'undefined';
          if (isBrowser) {
            const authProvider = data.email ? 'Email' : 'Phone';
            const contact = data.email
              ? (data.email as string)
              : (data.phoneNumber as string);

            localStorage.setItem(LAST_AUTH_PROVIDER, authProvider);
            // Note: USER_ADDRESS is automatically managed by thirdweb
            if (contact) {
              localStorage.setItem(USER_CONTACT, contact);
            }
          }

          // Automatically perform SIWE authentication in the background
          await handleSiweAuth(wallet);

          reset();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      form.setError('code', {
        type: 'manual',
        message: 'Invalid verification code.'
      });
    }
  };

  const { code } = form.watch();
  const isInputIncomplete = code.length < 6;

  const handleResend = async () => {
    await prepareLogin({
      client,
      ecosystem: {
        id: EcosystemId.LISK,
        partnerId
      },
      ...(data.email
        ? {
            strategy: LoginStrategy.EMAIL,
            email: data.email as string
          }
        : {
            strategy: LoginStrategy.PHONE,
            phoneNumber: data.phoneNumber as string
          })
    });
    resetResendTimer();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-1 flex-col items-center gap-6"
      >
        <div className="text-center">
          <Typography className="text-neutral-400">
            Enter the verification code sent to
          </Typography>
          <Typography className="text-foreground mt-0!">
            {(data?.email ?? data?.phoneNumber) as string}
          </Typography>
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="text-primary flex w-full flex-col items-center">
                <FormControl>
                  <InputOTP
                    autoFocus
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    {...field}
                    data-testid="login-code-input"
                    data-type="text"
                    inputMode="text"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-center">
            <Typography variant="small" className="text-neutral-400">
              Didn't receive the code?{' '}
            </Typography>
            {formattedTime ? (
              <Typography variant="small" className="text-foreground text-sm">
                Resend in {formattedTime}
              </Typography>
            ) : (
              <Button
                variant="link"
                size="sm"
                className="h-3.5 p-0"
                type="button"
                onClick={handleResend}
              >
                Resend
              </Button>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isInputIncomplete}>
          {form.formState.isSubmitting && (
            <LoaderCircleIcon className="animate-spin text-black" />
          )}
          Verify
        </Button>
      </form>
    </Form>
  );
}
