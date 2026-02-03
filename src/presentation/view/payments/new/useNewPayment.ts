'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreatePaymentRequest } from '@/data/model/request';
import { useWalletStore } from '@/presentation/hooks';

export function useNewPayment() {
  const router = useRouter();
  const { primaryWallet } = useWalletStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreatePaymentRequest>({
    sourceChainId: '',
    destChainId: '',
    sourceTokenAddress: '',
    destTokenAddress: '',
    amount: '',
    receiverAddress: '',
    decimals: 18,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual payment creation logic using usecase
      // const response = await createPaymentMutation.mutateAsync(formData);
      
      // Simulate success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    primaryWallet,
  };
}
