import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EcosystemId, LoginStrategy, prepareLogin } from 'src/core';
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
import { useLogin, usePanna } from '@/hooks';
import { useCountdown } from '@/hooks/use-countdown';
import { getEnvironmentChain } from '../../utils';
import { handleSiweAuth } from '../../utils/auth';
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
  const { error: codeFormError } = form.getFieldState('code');
  const { client, partnerId, chainId } = usePanna();
  const [resendTimer, resetResendTimer] = useCountdown(45);
  const formattedTime =
    resendTimer > 0 ? `0:${String(resendTimer).padStart(2, '0')}` : '';

  useEffect(() => {
    // Display any error passed from previous step
    if (data?.error) {
      form.setError('code', {
        type: 'manual',
        message: data.error as string
      });
    }
  }, []);

  const { connect } = useLogin({
    client,
    setWalletAsActive: true,
    accountAbstraction: {
      chain: getEnvironmentChain(chainId),
      sponsorGas: true // enable sponsored transactions
    }
  });

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      let connectionError: Error | null = null;
      form.clearErrors('code');

      // Connect using smart account with ecosystem wallet
      const wallet = await connect(async () => {
        // Create ecosystem wallet and authenticate with OTP
        const ecoWallet = ecosystemWallet(EcosystemId.LISK, {
          partnerId
        });

        if (data.email) {
          try {
            await ecoWallet.connect({
              client,
              strategy: 'email',
              email: data.email as string,
              verificationCode: values.code
            });
          } catch (error) {
            connectionError =
              error instanceof Error ? error : new Error(String(error));
            throw error;
          }
        } else {
          try {
            await ecoWallet.connect({
              client,
              strategy: 'phone',
              phoneNumber: data.phoneNumber as string,
              verificationCode: values.code
            });
          } catch (error) {
            connectionError =
              error instanceof Error ? error : new Error(String(error));
            throw error;
          }
        }

        return ecoWallet;
      });

      // If ecoWallet.connect() failed, throw the original error
      if (connectionError) {
        throw connectionError;
      }

      if (wallet) {
        const address = wallet.getAccount()?.address;
        if (address) {
          // Automatically perform SIWE authentication in the background
          // Pass chainId for consistency with login form
          await handleSiweAuth(wallet, {
            chainId: getEnvironmentChain().id as number
          });

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
                    <InputOTPGroup
                      className={
                        codeFormError ? '[&>div]:border-destructive border' : ''
                      }
                    >
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup
                      className={
                        codeFormError ? '[&>div]:border-destructive border' : ''
                      }
                    >
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
            <LoaderCircleIcon
              className="animate-spin text-black"
              data-testid="loader-icon"
            />
          )}
          Verify
        </Button>
      </form>
    </Form>
  );
}
