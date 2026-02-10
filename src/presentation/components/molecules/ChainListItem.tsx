'use client';

import * as React from 'react';
import { cn } from '@/core/utils';
import { ChainIcon } from '@/presentation/components/atoms/ChainIcon';
import { ChainLabel } from '@/presentation/components/atoms/ChainLabel';
import { Check } from 'lucide-react';

// Define a minimal interface for Chain based on what we need.
// This allows the component to be flexible.
export interface ChainItemData {
  id: string; // The UUID
  networkId: string; // The blockchain ID (e.g. "1")
  name: string;
  logoUrl?: string;
  [key: string]: any;
}

export interface ChainListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  chain: ChainItemData;
  isSelected?: boolean;
  onSelect: (chain: ChainItemData) => void;
}

const ChainListItem = React.forwardRef<HTMLDivElement, ChainListItemProps>(
  ({ className, chain, isSelected, onSelect, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={() => onSelect(chain)}
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
          <ChainIcon 
            logoUrl={chain.logoUrl} 
            name={chain.name} 
            size="md" 
            className={cn("transition-transform group-hover:scale-105", isSelected && "shadow-glow-sm")}
          />
          <ChainLabel 
            name={chain.name} 
            chainId={chain.id} 
            networkId={chain.networkId} 
          />
        </div>
        
        {isSelected && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple animate-fade-in-scale">
            <Check size={14} strokeWidth={3} />
          </div>
        )}
      </div>
    );
  }
);

ChainListItem.displayName = 'ChainListItem';

export { ChainListItem };
