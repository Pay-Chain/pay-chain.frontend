'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRegisterMutation } from '@/data/usecase';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { useSignMessage } from 'wagmi';
import type { RegisterRequest } from '@/data/model/request';


const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegister() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { mutate: register, isPending } = useRegisterMutation();
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { signMessageAsync } = useSignMessage();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.trigger(['name', 'email', 'password', 'confirmPassword']).then((isValid) => {
      if (isValid) {
        setStep(2);
      }
    });
  };

  const handleFinalSubmit = async () => {
    if (!address) {
      form.setError('root', { message: 'Please connect your wallet' });
      return;
    }

    try {
      const message = `Sign this message to verify your wallet for Pay-Chain registration.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
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
          onSuccess: () => {
            toast.success('Registration successful! Redirecting...');
            router.push('/dashboard');
          },
          onError: (err) => {
            const message = err.message || 'Registration failed';
            toast.error(message);
            form.setError('root', { message });
          },
        }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
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
    open,
    handleAccountSubmit,
    handleFinalSubmit,
  };
}
