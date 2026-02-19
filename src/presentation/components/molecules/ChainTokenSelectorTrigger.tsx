'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/core/utils';
import { ChainTokenIcon } from '@/presentation/components/atoms/ChainTokenIcon';

export type ChainTokenSelectorSize = 'sm' | 'default' | 'lg';

export interface ChainTokenSelectorValue {
  tokenSymbol: string;
  chainName: string;
  tokenLogoUrl?: string;
  chainLogoUrl?: string;
}

export interface ChainTokenSelectorTriggerProps {
  value?: ChainTokenSelectorValue;
  placeholder: string;
  relationLabel?: string;
  isOpen: boolean;
  disabled?: boolean;
  size?: ChainTokenSelectorSize;
  onClick: () => void;
  className?: string;
}

const sizeStyles: Record<ChainTokenSelectorSize, string> = {
  sm: 'h-10 px-3 text-sm',
  default: 'h-12 px-4 text-base',
  lg: 'h-14 px-5 text-lg',
};

const iconSize: Record<ChainTokenSelectorSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  default: 'md',
  lg: 'lg',
};

export function ChainTokenSelectorTrigger({
  value,
  placeholder,
  relationLabel = 'on',
  isOpen,
  disabled,
  size = 'default',
  onClick,
  className,
}: ChainTokenSelectorTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex w-full items-center justify-between rounded-full border text-left transition-all duration-300',
        'border-white/10 bg-background/90 backdrop-blur-sm',
        'hover:border-primary/50 hover:bg-white/[0.04] hover:shadow-glow-sm hover:shadow-primary/20',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50',
        isOpen && 'border-primary/50 ring-1 ring-primary/50 shadow-glow-sm shadow-primary/20',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        sizeStyles[size],
        className
      )}
    >
      {value ? (
        <div className="flex min-w-0 items-center gap-3">
          <ChainTokenIcon
            tokenSymbol={value.tokenSymbol}
            tokenLogoUrl={value.tokenLogoUrl}
            chainName={value.chainName}
            chainLogoUrl={value.chainLogoUrl}
            size={iconSize[size]}
          />
          <span className="truncate font-semibold text-foreground">
            {value.tokenSymbol} <span className="text-muted">{relationLabel} {value.chainName}</span>
          </span>
        </div>
      ) : (
        <span className="truncate text-muted">{placeholder}</span>
      )}

      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-muted transition-transform duration-300',
          isOpen && 'rotate-180 text-primary'
        )}
      />
    </button>
  );
}
