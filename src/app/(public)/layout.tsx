import { ReactNode } from 'react';
import { headers } from 'next/headers';
import LazyWalletProviders from '@/presentation/providers/LazyWalletProviders';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const cookies = (await headers()).get('cookie');

  return (
    <LazyWalletProviders cookies={cookies}>
      {children}
    </LazyWalletProviders>
  );
}
