'use client';

import * as React from 'react';
import { cn } from '@/core/utils';
import { ChainIcon } from '@/presentation/components/atoms/ChainIcon';

export interface ChainTokenFilterChipProps {
  label: string;
  logoUrl?: string;
  selected?: boolean;
  onClick: () => void;
}

export function ChainTokenFilterChip({ label, logoUrl, selected, onClick }: ChainTokenFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-14 min-w-14 items-center justify-center rounded-xl border p-2 transition-all duration-200',
        'border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.07]',
        selected && 'border-primary/60 bg-primary/15 shadow-glow-sm shadow-primary/20'
      )}
      title={label}
      aria-label={label}
    >
      <ChainIcon logoUrl={logoUrl} name={label} size="md" className="h-9 w-9 border-white/15" />
    </button>
  );
}
