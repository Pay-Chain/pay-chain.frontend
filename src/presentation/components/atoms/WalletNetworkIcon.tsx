'use client';

import { Wallet } from 'lucide-react';
import { cn } from '@/core/utils';

export type WalletNetwork = 'evm' | 'svm';

interface WalletNetworkIconProps {
  network: WalletNetwork;
  className?: string;
}

export function WalletNetworkIcon({ network, className }: WalletNetworkIconProps) {
  const isEvm = network === 'evm';

  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl ring-1',
        isEvm
          ? 'bg-[#627EEA]/20 text-[#8FA4FF] ring-[#627EEA]/40'
          : 'bg-[#14F195]/15 text-[#14F195] ring-[#14F195]/35',
        className
      )}
    >
      {isEvm ? <Wallet className="h-5 w-5" /> : <span className="text-lg font-bold">◎</span>}
    </div>
  );
}

