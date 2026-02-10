'use client';

import * as React from 'react';
import { cn } from '@/core/utils';

export interface ChainLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  chainId?: string | number;
  networkId?: string;
}

const ChainLabel = React.forwardRef<HTMLDivElement, ChainLabelProps>(
  ({ className, name, chainId, networkId, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-start leading-none gap-0.5', className)}
        {...props}
      >
        <span className="font-semibold text-foreground text-sm truncate max-w-[160px]">
          {name}
        </span>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          {/* Prioritize showing networkId if available (e.g. "1", "5eykt..."), otherwise chainId */}
          <span className="font-mono bg-white/5 px-1 rounded-sm">
            ID: {
              (networkId || chainId || 'N/A').toString().length > 8 ?
                (networkId || chainId || 'N/A').toString().substring(0, 8) + '...' :
                (networkId || chainId || 'N/A')
            }
          </span>
        </div>
      </div>
    );
  }
);

ChainLabel.displayName = 'ChainLabel';

export { ChainLabel };
