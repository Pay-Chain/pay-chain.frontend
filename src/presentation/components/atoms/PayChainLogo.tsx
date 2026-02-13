'use client';

import Image from 'next/image';
import { cn } from '@/core/utils';

interface PayChainLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function PayChainLogo({
  className,
  width = 120,
  height = 120,
  priority = false,
}: PayChainLogoProps) {
  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <Image
        src="/logo.png"
        alt="Pay-Chain Logo"
        width={width}
        height={height}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}

