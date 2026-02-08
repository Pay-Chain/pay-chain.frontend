import { headers } from 'next/headers';
import { ReactNode } from 'react';
import LazyWalletProviders from '@/presentation/providers/LazyWalletProviders';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookies = (await headers()).get('cookie');

  return (
    <LazyWalletProviders cookies={cookies}>
      {children}
    </LazyWalletProviders>
  );
}
