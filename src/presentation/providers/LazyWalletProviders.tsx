'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const Web3Provider = dynamic(
  () => import('@/presentation/providers/Web3Provider'),
  { ssr: false }
);
const SolanaProvider = dynamic(
  () => import('@/presentation/providers/SolanaProvider'),
  { ssr: false }
);

export default function LazyWalletProviders({ 
  children, 
  cookies 
}: { 
  children: ReactNode;
  cookies: string | null;
}) {
  return (
    <Web3Provider cookies={cookies}>
      <SolanaProvider>
        {children}
      </SolanaProvider>
    </Web3Provider>
  );
}
