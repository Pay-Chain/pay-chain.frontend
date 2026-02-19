'use client';

import * as React from 'react';
import { cn } from '@/core/utils';
import { TokenIcon } from './TokenIcon';
import { ChainIcon } from './ChainIcon';

export interface ChainTokenIconProps extends React.HTMLAttributes<HTMLDivElement> {
  tokenLogoUrl?: string;
  tokenSymbol: string;
  chainLogoUrl?: string;
  chainName: string;
  size?: 'sm' | 'md' | 'lg';
}

const badgeSize = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4.5 h-4.5',
  lg: 'w-5 h-5',
} as const;

const tokenSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

const chainSize = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

const ChainTokenIcon = React.forwardRef<HTMLDivElement, ChainTokenIconProps>(
  ({
    className,
    tokenLogoUrl,
    tokenSymbol,
    chainLogoUrl,
    chainName,
    size = 'md',
    ...props
  }, ref) => {
    return (
      <div ref={ref} className={cn('relative inline-flex shrink-0', className)} {...props}>
        <TokenIcon logoUrl={tokenLogoUrl} symbol={tokenSymbol} size={tokenSize[size]} />
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full border border-white/20 bg-background p-[1px] shadow-glow-sm',
            badgeSize[size]
          )}
        >
          <ChainIcon
            logoUrl={chainLogoUrl}
            name={chainName}
            size={chainSize[size]}
            className="h-full w-full border-0 ring-0"
          />
        </div>
      </div>
    );
  }
);

ChainTokenIcon.displayName = 'ChainTokenIcon';

export { ChainTokenIcon };
