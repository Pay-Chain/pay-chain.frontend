'use client';

import * as React from 'react';
import { Input, Label } from '@/presentation/components/atoms';

export interface AmountTokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  tokenSymbol?: string;
  maxAmount?: string;
  canUseMax?: boolean;
  onMaxClick?: () => void;
  error?: string;
}

export function AmountTokenInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  tokenSymbol,
  maxAmount,
  canUseMax,
  onMaxClick,
  error,
}: AmountTokenInputProps) {
  return (
    <div className="space-y-1.5">
      <Label className="flex justify-between items-center text-sm font-medium text-foreground/80 ml-1 mb-1.5">
        {label}
        {canUseMax && maxAmount && (
          <span className="text-xs text-muted-foreground">
            Max: {maxAmount} {tokenSymbol}
          </span>
        )}
      </Label>

      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-24"
          error={error}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {tokenSymbol && (
            <span className="text-xs font-medium text-muted-foreground select-none">
              {tokenSymbol}
            </span>
          )}
          {canUseMax && (
            <button
              type="button"
              onClick={onMaxClick}
              className="text-xs font-bold text-accent-purple hover:text-accent-purple/80 transition-colors bg-accent-purple/10 hover:bg-accent-purple/20 px-2 py-1 rounded"
            >
              MAX
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

