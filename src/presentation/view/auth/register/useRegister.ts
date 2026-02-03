'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/data/usecase';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { useSignMessage } from 'wagmi';

export function useRegister() {
  const [step, setStep] = useState(1); // 1: Account, 2: Wallet
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const { mutate: register, isPending } = useRegisterMutation();
  const router = useRouter();

  // AppKit hooks
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { signMessageAsync } = useSignMessage();

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setError('');
    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    try {
      const message = `Sign this message to verify your wallet for Pay-Chain registration.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await signMessageAsync({ message });

      register(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          walletAddress: address,
          walletChainId: 'eip155:1',
          walletSignature: signature,
        },
        {
          onSuccess: () => {
            router.push('/dashboard');
          },
          onError: (err) => {
            setError(err.message || 'Registration failed');
          },
        }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    error,
    isPending,
    address,
    isConnected,
    open,
    handleAccountSubmit,
    handleFinalSubmit,
  };
}
