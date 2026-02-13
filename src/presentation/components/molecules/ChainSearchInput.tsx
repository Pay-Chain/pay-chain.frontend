'use client';

import * as React from 'react';
import { cn } from '@/core/utils';
import { useTranslation } from '@/presentation/hooks';
import { Search, X } from 'lucide-react';

export interface ChainSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const ChainSearchInput = React.forwardRef<HTMLInputElement, ChainSearchInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    const { t } = useTranslation();
    return (
      <div className="relative top-0 z-10 px-2 py-2 bg-background/95 backdrop-blur-sm border-b border-white/5">
        <Search 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
          size={16} 
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            'w-full h-10 pl-10 pr-10 rounded-md bg-white/5 border border-white/10',
            'text-sm text-foreground placeholder-muted-foreground',
            'focus:outline-none focus:ring-1 focus:ring-accent-purple/50 focus:border-accent-purple/50 focus:bg-white/10',
            'transition-all duration-200',
            className
          )}
          placeholder={t('common.search_chains')}
          {...props}
        />
        
        {value && (
          <button
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);

ChainSearchInput.displayName = 'ChainSearchInput';

export { ChainSearchInput };
