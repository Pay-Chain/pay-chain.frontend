'use client';

import * as React from 'react';
import { cn } from '@/core/utils';
import { Coins } from 'lucide-react';

export interface TokenIconProps extends React.HTMLAttributes<HTMLDivElement> {
  logoUrl?: string;
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
}

const TokenIcon = React.forwardRef<HTMLDivElement, TokenIconProps>(
  ({ className, logoUrl, symbol, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeStyles = {
      sm: 'w-6 h-6 text-[10px]',
      md: 'w-8 h-8 text-xs',
      lg: 'w-10 h-10 text-sm',
    };

    const iconSize = {
      sm: 12,
      md: 16,
      lg: 20,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden shrink-0',
          'bg-background border border-white/10 ring-1 ring-white/5',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {logoUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={`${symbol} logo`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-white/5 text-muted-foreground font-bold">
            {symbol ? symbol.charAt(0).toUpperCase() : <Coins size={iconSize[size]} />}
          </div>
        )}
      </div>
    );
  }
);

TokenIcon.displayName = 'TokenIcon';

export { TokenIcon };
