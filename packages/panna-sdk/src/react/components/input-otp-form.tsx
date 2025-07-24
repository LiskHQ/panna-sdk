import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { LoaderCircleIcon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  AuthParams,
  EcosystemId,
  login,
  LoginStrategy,
  prepareLogin
} from 'src/core';
import { AuthStoredTokenWithCookieReturnType } from 'thirdweb/dist/types/wallets/in-app/core/authentication/types';
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
import { usePanna } from '@/hooks';
import { useCountdown } from '@/hooks/use-countdown';
import { useAuth } from './auth-provider';
import { DialogStepperContextValue } from './dialog-stepper';
import { Button } from './ui/button';
import { Typography } from './ui/typography';

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

export const LAST_AUTH_PROVIDER = 'lastAuthProvider';
const WALLET_TOKEN = 'walletToken';
const USER_CONTACT = 'userContact'; // This is used to store the email or phone number
export const USER_ADDRESS = 'userAddress';

type AuthDetailsFull =
  AuthStoredTokenWithCookieReturnType['storedToken']['authDetails'] & {
    email?: string;
    phoneNumber?: string;
    walletAddress: string;
  };

export function InputOTPForm({ data, reset, onClose }: InputOTPFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ''
    }
  });
  const { client, partnerId } = usePanna();
  const { setUserAddress } = useAuth();
  const [resendTimer, resetResendTimer] = useCountdown(45);
  const formattedTime =
    resendTimer > 0 ? `0:${String(resendTimer).padStart(2, '0')}` : '';

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    const res = await login({
      client,
      ecosystem: {
        id: EcosystemId.LISK,
        partnerId
      },
      ...(data.email
        ? { strategy: LoginStrategy.EMAIL, email: data.email }
        : { strategy: LoginStrategy.PHONE, phoneNumber: data.phoneNumber }),
      verificationCode: values.code
    } as AuthParams);

    if (res.storedToken) {
      const isBrowser = typeof window !== 'undefined';
      if (isBrowser) {
        localStorage.setItem(LAST_AUTH_PROVIDER, res.storedToken.authProvider);
        localStorage.setItem(WALLET_TOKEN, res.storedToken.jwtToken);
        const authDetails = res.storedToken.authDetails as AuthDetailsFull;

        if (authDetails.email) {
          localStorage.setItem(USER_CONTACT, authDetails.email);
        } else if (authDetails.phoneNumber) {
          localStorage.setItem(USER_CONTACT, authDetails.phoneNumber);
        }
        localStorage.setItem(USER_ADDRESS, authDetails.walletAddress);
        setUserAddress(authDetails.walletAddress);
      }
    }
    reset();
    onClose();
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
    // @todo: Implement feedback for wrong OTP
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
              <FormItem className="flex w-full flex-col items-center">
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
