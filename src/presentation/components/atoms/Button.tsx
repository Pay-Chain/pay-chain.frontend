'use client';

import * as React from 'react';
import { cn } from '@/core/utils';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'ghost' 
  | 'outline' 
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', loading, glow, children, disabled, ...props }, ref) => {
    const baseStyles = 
      'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold ' +
      'transition-all duration-300 ease-out cursor-pointer overflow-hidden ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
      'disabled:pointer-events-none disabled:opacity-50 ' +
      'active:scale-[0.97]';
    
    const variants: Record<ButtonVariant, string> = {
      // Primary - Premium purple-blue gradient with shimmer
      primary: 
        'bg-gradient-to-r from-[#9945FF] via-[#7B3FE4] to-[#14F195] bg-[length:200%_100%] ' +
        'text-white shadow-[0_4px_20px_rgba(153,69,255,0.4)] ' +
        'hover:bg-[position:100%_0] hover:shadow-[0_6px_30px_rgba(153,69,255,0.5)] hover:scale-[1.02] ' +
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent ' +
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 ' +
        'focus-visible:ring-[#9945FF]',
      
      // Secondary - Premium glass morphism
      secondary: 
        'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md ' +
        'border border-white/20 text-foreground ' +
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.2)] ' +
        'hover:from-white/15 hover:to-white/10 hover:border-white/30 hover:scale-[1.02] ' +
        'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_30px_rgba(0,0,0,0.3)] ' +
        'focus-visible:ring-white/50',
      
      // Success - Vibrant cyan-green gradient
      success: 
        'bg-gradient-to-r from-[#14F195] via-[#00D9BB] to-[#00C2FF] bg-[length:200%_100%] ' +
        'text-[#0D0D0D] font-bold shadow-[0_4px_20px_rgba(20,241,149,0.4)] ' +
        'hover:bg-[position:100%_0] hover:shadow-[0_6px_30px_rgba(20,241,149,0.5)] hover:scale-[1.02] ' +
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent ' +
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 ' +
        'focus-visible:ring-[#14F195]',
      
      // Warning - Premium warm gradient
      warning: 
        'bg-gradient-to-r from-[#FFB347] via-[#FF9500] to-[#FF6B6B] bg-[length:200%_100%] ' +
        'text-[#0D0D0D] font-bold shadow-[0_4px_20px_rgba(255,149,0,0.4)] ' +
        'hover:bg-[position:100%_0] hover:shadow-[0_6px_30px_rgba(255,149,0,0.5)] hover:scale-[1.02] ' +
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent ' +
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 ' +
        'focus-visible:ring-[#FF9500]',
      
      // Danger - Premium red-pink gradient
      danger: 
        'bg-gradient-to-r from-[#FF416C] via-[#FF4B2B] to-[#FF416C] bg-[length:200%_100%] ' +
        'text-white font-bold shadow-[0_4px_20px_rgba(255,65,108,0.4)] ' +
        'hover:bg-[position:100%_0] hover:shadow-[0_6px_30px_rgba(255,65,108,0.5)] hover:scale-[1.02] ' +
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent ' +
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 ' +
        'focus-visible:ring-[#FF416C]',
      
      // Ghost - Subtle with elegant hover
      ghost: 
        'bg-transparent text-foreground ' +
        'hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 ' +
        'focus-visible:ring-white/50',
      
      // Outline - Gradient border effect
      outline: 
        'bg-transparent border border-white/30 text-foreground ' +
        'hover:bg-white/5 hover:border-[#9945FF]/50 hover:text-[#9945FF] ' +
        'focus-visible:ring-[#9945FF]',
      
      // Link - Premium text link
      link: 
        'text-[#9945FF] underline-offset-4 bg-transparent p-0 h-auto ' +
        'hover:underline hover:text-[#14F195] ' +
        'focus-visible:ring-[#9945FF]',
    };

    const sizes: Record<ButtonSize, string> = {
      default: 'h-11 px-6 py-3 text-sm',
      sm: 'h-9 px-4 py-2 text-xs',
      lg: 'h-14 px-8 py-4 text-base',
      icon: 'h-10 w-10 p-0',
    };

    const glowStyles = glow 
      ? variant === 'success' 
        ? 'shadow-[0_0_40px_rgba(20,241,149,0.4)]' 
        : variant === 'primary' 
          ? 'shadow-[0_0_40px_rgba(153,69,255,0.4)]' 
          : variant === 'danger'
            ? 'shadow-[0_0_40px_rgba(255,65,108,0.4)]'
            : variant === 'warning'
              ? 'shadow-[0_0_40px_rgba(255,149,0,0.4)]'
              : ''
      : '';

    return (
      <button
        className={cn(
          baseStyles, 
          variants[variant], 
          variant !== 'link' ? sizes[size] : '', 
          glowStyles, 
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
