'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRegisterMutation } from '@/data/usecase';
import { useAppKitAccount } from '@reown/appkit/react';
import { useSignMessage } from 'wagmi';
import { useTranslation } from '@/presentation/hooks';
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function useRegister() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { mutate: register, isPending } = useRegisterMutation();
  const { address, isConnected } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();
  const registerSchema = z.object({
    name: z.string().min(2, t('auth.validation.name_min')),
    email: z.string().email(t('auth.validation.email_invalid')),
    password: z.string().min(8, t('auth.validation.password_min_register')),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validation.password_mismatch'),
    path: ['confirmPassword'],
  });

  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = form.getValues();
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RegisterFormData | undefined;
        if (key) {
          form.setError(key, { message: issue.message });
        }
      }
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    if (!address) {
      form.setError('root', { message: t('auth.wallet_required_error') });
      return;
    }

    try {
      const message = [
        t('auth.sign_wallet_message_prefix'),
        '',
        `${t('auth.sign_wallet_message_wallet')}: ${address}`,
        `${t('auth.sign_wallet_message_timestamp')}: ${Date.now()}`,
      ].join('\n');
      const signature = await signMessageAsync({ message });

      const values = form.getValues();
      register(
        {
          name: values.name,
          email: values.email,
          password: values.password,
          walletAddress: address,
          walletChainId: 'eip155:1',
          walletSignature: signature,
        },
        {
          onSuccess: (response: any) => {
            if (response?.error) {
              const msg = response.error;
              toast.error(msg);
              form.setError('root', { message: msg });
              return;
            }
            toast.success(t('toasts.auth.register_success'));
            router.push('/dashboard');
          },
          onError: (err) => {
            const message = err.message || t('toasts.auth.register_failed');
            toast.error(message);
            form.setError('root', { message });
          },
        }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('toasts.auth.register_failed');
      toast.error(message);
      form.setError('root', { message });
    }
  };

  return {
    step,
    setStep,
    form,
    isPending,
    address,
    isConnected,
    handleAccountSubmit,
    handleFinalSubmit,
  };
}
