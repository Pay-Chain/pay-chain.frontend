'use client';

import * as React from 'react';
import { cn } from '@/core/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
  label?: string;
  inputSize?: 'default' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, inputSize = 'default', ...props }, ref) => {
    const sizeStyles = {
      default: 'h-11 px-5 py-3 text-sm',
      lg: 'h-14 px-6 py-4 text-base',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-muted mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-full border border-white/10 bg-background',
            'text-foreground placeholder-muted',
            'transition-all duration-300',
            'focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple/50 focus:shadow-glow-sm',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            sizeStyles[inputSize],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
