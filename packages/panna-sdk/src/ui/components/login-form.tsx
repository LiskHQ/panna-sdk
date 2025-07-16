'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError
} from 'libphonenumber-js';
import { MoveRightIcon, PhoneIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
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

const formSchema = z
  .object({
    email: z
      .string()
      .min(7, { message: 'This field has to be filled.' })
      .email('This is not a valid email.')
      .optional(),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .refine(isValidPhoneNumber, {
        message: 'Please specify a valid phone number'
      })
      .transform((value) => parsePhoneNumberWithError(value).number.toString())
      .optional()
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: 'custom',
        message: 'a or b is required'
        // input: ctx
      });
    }
  });

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Button type="button">Continue with Google</Button>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email address"
                  endAdornment={
                    <MoveRightIcon
                      className="bg-transparent text-neutral-400"
                      onClick={() => alert('Clicked')}
                    />
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Phone number"
                  startAdornment={
                    <PhoneIcon className="h-5 w-5" color="#7C3AED" />
                  }
                  {...field}
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
