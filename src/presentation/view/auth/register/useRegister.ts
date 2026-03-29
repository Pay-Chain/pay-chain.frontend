'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRegisterMutation } from '@/data/usecase';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useSignMessage } from 'wagmi';
import { useTranslation } from '@/presentation/hooks';

export const RegistrationStep = {
  ACCOUNT: 1,
  BUSINESS: 2,
  WALLET: 3,
} as const;

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isMerchant: boolean;
  businessName: string;
  businessType: string;
};

export function useRegister() {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(RegistrationStep.ACCOUNT);
  const router = useRouter();
  const { mutate: register, isPending } = useRegisterMutation();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { signMessageAsync } = useSignMessage();

  const registerSchema = z.object({
    name: z.string().min(2, t('auth.validation.name_min')),
    email: z.string().email(t('auth.validation.email_invalid')),
    password: z.string().min(8, t('auth.validation.password_min_register')),
    confirmPassword: z.string(),
    isMerchant: z.boolean(),
    businessName: z.string(),
    businessType: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validation.password_mismatch'),
    path: ['confirmPassword'],
  }).refine((data) => {
    if (data.isMerchant && (!data.businessName || data.businessName.length < 3)) {
      return false;
    }
    return true;
  }, {
    message: t('auth.validation.business_name_required'),
    path: ['businessName'],
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isMerchant: false,
      businessName: '',
      businessType: 'INDIVIDUAL',
    },
  });

  const handleAccountSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isValid = await form.trigger(['name', 'email', 'password', 'confirmPassword']);
    if (isValid) {
      setStep(RegistrationStep.BUSINESS);
    }
  };

  const handleMerchantSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isMerchant = form.getValues('isMerchant');
    if (isMerchant) {
      const isValid = await form.trigger(['businessName', 'businessType']);
      if (!isValid) return;
    }
    setStep(RegistrationStep.WALLET);
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
      const signature = await signMessageAsync({ 
        message, 
        account: address as `0x${string}` 
      });

      const values = form.getValues();
      register(
        {
          name: values.name,
          email: values.email,
          password: values.password,
          walletAddress: address,
          walletChainId: chainId ? `eip155:${chainId}` : 'eip155:8453',
          walletSignature: signature,
          isMerchant: values.isMerchant,
          businessName: values.isMerchant ? values.businessName : undefined,
          merchantType: values.isMerchant ? values.businessType : undefined,
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
    handleMerchantSubmit,
    handleFinalSubmit,
    RegistrationStep,
  };
}
