'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePaymentMutation, useWalletsQuery } from '@/data/usecase';
import { useWalletStore } from '@/presentation/hooks/useWalletStore';
import { CreatePaymentRequest } from '@/data/model/request';

const paymentSchema = z.object({
  sourceChainId: z.string().min(1, 'Source Chain is required'),
  destChainId: z.string().min(1, 'Destination Chain is required'),
  sourceTokenAddress: z.string().min(1, 'Source Token is required'),
  destTokenAddress: z.string().min(1, 'Destination Token is required'),
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Amount must be a positive number'),
  receiverAddress: z.string().min(1, 'Receiver Address is required'),
  decimals: z.number().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function useNewPayment() {
  const router = useRouter();
  const { data: walletsData } = useWalletsQuery();
  const primaryWallet = walletsData?.wallets.find(w => w.isPrimary);
  const { mutate: createPayment, isPending, error: paymentError } = useCreatePaymentMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      sourceChainId: '',
      destChainId: '',
      sourceTokenAddress: '',
      destTokenAddress: '',
      decimals: 18,
    },
  });

  const { setValue, watch, trigger } = form; // Destructure useForm methods
  
  // Watch values for selectors
  const sourceChainId = watch('sourceChainId');
  const destChainId = watch('destChainId');
  const sourceTokenAddress = watch('sourceTokenAddress');

  const handleSourceChainSelect = (chain: any) => {
    setValue('sourceChainId', chain?.id?.toString() || '');
    // Reset token when chain changes
    setValue('sourceTokenAddress', ''); 
    trigger('sourceChainId');
  };

  const handleDestChainSelect = (chain: any) => {
    setValue('destChainId', chain?.id?.toString() || '');
    trigger('destChainId');
  };

  const handleTokenSelect = (token: any) => {
    setValue('sourceTokenAddress', token?.contractAddress || (token?.isNative ? '0x0000000000000000000000000000000000000000' : ''));
    if (token?.decimals) {
      setValue('decimals', token.decimals);
    }
    trigger('sourceTokenAddress');
  };

  const onSubmit = (data: z.infer<typeof paymentSchema>) => {
    setError(null);
    
    if (!primaryWallet) {
      setError('Please connect a wallet first');
      return;
    }

    // Ensure decimals is present, default to 18 if not
    const requestData: CreatePaymentRequest = {
      ...data,
      decimals: data.decimals || 18,
    };

    createPayment(requestData, {
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
    // Export handlers and watched values
    handleSourceChainSelect,
    handleDestChainSelect,
    handleTokenSelect,
    sourceChainId,
    destChainId,
    sourceTokenAddress,
    setValue, // Export setValue for other uses (like setting max amount)
  };
}
