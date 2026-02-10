'use client';

import * as React from 'react';
import { cn } from '@/core/utils';
import { TokenIcon } from '@/presentation/components/atoms/TokenIcon';
import { Check } from 'lucide-react';

export interface TokenItemData {
  id: string;
  symbol: string;
  name: string;
  logoUrl?: string;
  balance?: string;
  address?: string;
  [key: string]: any;
}

export interface TokenListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  token: TokenItemData;
  isSelected?: boolean;
  onSelect: (token: TokenItemData) => void;
}

const TokenListItem = React.forwardRef<HTMLDivElement, TokenListItemProps>(
  ({ className, token, isSelected, onSelect, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={() => onSelect(token)}
        className={cn(
          'group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200',
          'hover:bg-white/5 active:scale-[0.98]',
          isSelected ? 'bg-white/10 shadow-inner border border-white/5' : 'border border-transparent',
          className
        )}
        role="option"
        aria-selected={isSelected}
        {...props}
      >
        <div className="flex items-center gap-3">
          <TokenIcon 
            logoUrl={token.logoUrl} 
            symbol={token.symbol} 
            size="md" 
            className={cn("transition-transform group-hover:scale-105", isSelected && "shadow-glow-sm")}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {token.symbol}
            </span>
            <span className="text-xs text-muted-foreground">
              {token.name}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {token.balance && (
            <span className="text-sm font-mono text-foreground/80">
              {token.balance}
            </span>
          )}
          
          {isSelected && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple animate-fade-in-scale">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
    );
  }
);

TokenListItem.displayName = 'TokenListItem';

export { TokenListItem };
