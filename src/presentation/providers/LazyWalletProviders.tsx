'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { WalletConnectModalHost } from '@/presentation/components/organisms';
import { UnifiedWalletProvider } from '@/presentation/providers/UnifiedWalletProvider';

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
        <UnifiedWalletProvider>
          {children}
          <WalletConnectModalHost />
        </UnifiedWalletProvider>
      </SolanaProvider>
    </Web3Provider>
  );
}
