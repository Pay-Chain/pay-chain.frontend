'use client';

import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/data/usecase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LoginRequest } from '@/data/model/request';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function useLogin() {
  const router = useRouter();
  const { mutate: login, isPending } = useLoginMutation();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginRequest) => {
    login(data, {
      onSuccess: () => {
        toast.success('Login successful! Redirecting...');
        // console.log('Login successful');
        router.push('/dashboard');
      },
      onError: (err) => {
        const message = err.message || 'Failed to login';
        toast.error(message);
        // console.error(message);
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
