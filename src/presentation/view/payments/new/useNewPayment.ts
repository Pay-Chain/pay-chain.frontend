'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePaymentMutation } from '@/data/usecase';
import { useWalletStore } from '@/presentation/hooks';
import type { CreatePaymentRequest } from '@/data/model/request';

const paymentSchema = z.object({
  sourceChainId: z.string().min(1, 'Source Chain is required'),
  destChainId: z.string().min(1, 'Destination Chain is required'),
  sourceTokenAddress: z.string().min(1, 'Source Token is required'),
  destTokenAddress: z.string().min(1, 'Destination Token is required'),
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Amount must be a positive number'),
  receiverAddress: z.string().min(1, 'Receiver Address is required'),
  decimals: z.number(),
});

export function useNewPayment() {
  const router = useRouter();
  const { primaryWallet } = useWalletStore();
  const { mutate: createPayment, isPending } = useCreatePaymentMutation();
  
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreatePaymentRequest>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      sourceChainId: '',
      destChainId: '',
      sourceTokenAddress: '',
      destTokenAddress: '',
      amount: '',
      receiverAddress: '',
      decimals: 18,
    },
  });

  const onSubmit = (data: CreatePaymentRequest) => {
    setError(null);
    
    if (!primaryWallet) {
      setError('Please connect a wallet first');
      return;
    }

    createPayment(data, {
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: (err) => {
        setError(err.message || 'Failed to create payment');
      },
    });
  };

  return {
    form,
    loading: isPending,
    error,
    handleSubmit: form.handleSubmit(onSubmit),
    primaryWallet,
  };
}
