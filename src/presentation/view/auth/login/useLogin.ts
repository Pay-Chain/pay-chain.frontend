'use client';

import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/data/usecase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { LoginRequest } from '@/data/model/request';
import { toast } from 'sonner';
import { useTranslation } from '@/presentation/hooks';

export function useLogin() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: login, isPending } = useLoginMutation();
  const loginSchema = z.object({
    email: z.string().email(t('auth.validation.email_invalid')),
    password: z.string().min(6, t('auth.validation.password_min_login')),
  });

  const form = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginRequest) => {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      for (const issue of issues) {
        const key = issue.path[0] as keyof LoginRequest | undefined;
        if (key) {
          form.setError(key, { message: issue.message });
        }
      }
      return;
    }

    login(data, {
      onSuccess: (response) => {
        if (response.error) {
          toast.error(response.error);
          form.setError('root', { message: response.error });
          return;
        }
        
        toast.success(t('toasts.auth.login_success'));
        router.push('/dashboard');
      },
      onError: (err) => {
        const message = err.message || t('toasts.auth.login_failed');
        toast.error(message);
        form.setError('root', { message });
      },
    });
  };

  return {
    form,
    isPending,
    onSubmit,
  };
}
