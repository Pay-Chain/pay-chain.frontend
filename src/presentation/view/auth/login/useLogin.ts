'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/data/usecase';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { mutate: login, isPending } = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    login(
      { email, password },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: (err) => {
          setError(err.message || 'Failed to login');
        },
      }
    );
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isPending,
    handleSubmit,
  };
}
